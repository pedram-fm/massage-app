import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TODO_FILE = path.join(process.cwd(), 'TODO.md');

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: string | null;
  estimate: string | null;
  files: string[];
  details: string | null;
  lineNumber: number;
  category: string;
}

function parseTasks(content: string): Task[] {
  const lines = content.split('\n');
  const tasks: Task[] = [];
  let currentTask: Partial<Task> | null = null;
  let currentCategory = 'Other';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // شناسایی دسته‌بندی
    const categoryMatch = line.match(/^##\s+(.+?)(?:\s+\((.+?)\))?$/);
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim();
      continue;
    }

    // شناسایی تسک
    const taskMatch = line.match(/^- \[([ x])\] \*\*(.+?)\*\*:\s*(.+)$/);
    if (taskMatch) {
      if (currentTask) {
        tasks.push(currentTask as Task);
      }
      currentTask = {
        lineNumber: i + 1,
        completed: taskMatch[1] === 'x',
        id: taskMatch[2],
        title: taskMatch[3].trim(),
        priority: null,
        estimate: null,
        files: [],
        details: null,
        category: currentCategory
      };
      continue;
    }

    // خواندن جزئیات تسک
    if (currentTask) {
      const priorityMatch = line.match(/Priority:\s*(P\d)/);
      if (priorityMatch) currentTask.priority = priorityMatch[1];

      const estimateMatch = line.match(/Estimate:\s*(.+)/);
      if (estimateMatch) currentTask.estimate = estimateMatch[1].trim();

      const filesMatch = line.match(/Files:\s*(.+)/);
      if (filesMatch) {
        currentTask.files = filesMatch[1]
          .split(',')
          .map(f => f.trim().replace(/`/g, ''));
      }

      const detailsMatch = line.match(/Details:\s*(.+)/);
      if (detailsMatch) currentTask.details = detailsMatch[1].trim();
    }
  }

  if (currentTask) {
    tasks.push(currentTask as Task);
  }

  return tasks.filter(t => t.id && t.title);
}

function getStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';

  const byPriority: Record<string, { total: number; completed: number }> = {
    P0: { total: 0, completed: 0 },
    P1: { total: 0, completed: 0 },
    P2: { total: 0, completed: 0 },
    P3: { total: 0, completed: 0 }
  };

  const byCategory: Record<string, { total: number; completed: number }> = {};

  tasks.forEach(task => {
    if (task.priority && byPriority[task.priority]) {
      byPriority[task.priority].total++;
      if (task.completed) {
        byPriority[task.priority].completed++;
      }
    }

    if (!byCategory[task.category]) {
      byCategory[task.category] = { total: 0, completed: 0 };
    }
    byCategory[task.category].total++;
    if (task.completed) {
      byCategory[task.category].completed++;
    }
  });

  return {
    total,
    completed,
    pending,
    percentage,
    byPriority,
    byCategory
  };
}

export async function GET(request: NextRequest) {
  try {
    const content = fs.readFileSync(TODO_FILE, 'utf-8');
    const tasks = parseTasks(content);
    const stats = getStats(tasks);

    const { searchParams } = new URL(request.url);
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let filteredTasks = tasks;

    if (priority) {
      filteredTasks = filteredTasks.filter(t => t.priority === priority);
    }

    if (status === 'completed') {
      filteredTasks = filteredTasks.filter(t => t.completed);
    } else if (status === 'pending') {
      filteredTasks = filteredTasks.filter(t => !t.completed);
    }

    if (category) {
      filteredTasks = filteredTasks.filter(t => t.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        t =>
          t.id.toLowerCase().includes(searchLower) ||
          t.title.toLowerCase().includes(searchLower) ||
          (t.details && t.details.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json({
      tasks: filteredTasks,
      stats,
      allTasks: tasks
    });
  } catch (error) {
    console.error('Error reading TODO file:', error);
    return NextResponse.json(
      { error: 'Failed to read TODO file' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { taskId, completed } = await request.json();

    if (!taskId || typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const content = fs.readFileSync(TODO_FILE, 'utf-8');
    const checkChar = completed ? 'x' : ' ';
    const regex = new RegExp(`^- \\[[ x]\\] \\*\\*${taskId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*\\*:`, 'm');
    
    if (!regex.test(content)) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const newContent = content.replace(regex, `- [${checkChar}] **${taskId}**:`);
    fs.writeFileSync(TODO_FILE, newContent, 'utf-8');

    const tasks = parseTasks(newContent);
    const stats = getStats(tasks);

    return NextResponse.json({
      success: true,
      stats,
      tasks
    });
  } catch (error) {
    console.error('Error updating TODO file:', error);
    return NextResponse.json(
      { error: 'Failed to update TODO file' },
      { status: 500 }
    );
  }
}
