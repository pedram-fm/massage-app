import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TODO_FILE = path.join(process.cwd(), 'TODO.md');

type TaskStatus = 'todo' | 'inprogress' | 'done';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: string | null;
  estimate: string | null;
  files: string[];
  details: string | null;
  lineNumber: number;
  category: string;
  subtasks?: Subtask[];
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
      
      const completed = taskMatch[1] === 'x';
      // Determine status from completion or from status marker in the task
      let status: TaskStatus = completed ? 'done' : 'todo';
      
      currentTask = {
        lineNumber: i + 1,
        status,
        id: taskMatch[2],
        title: taskMatch[3].trim(),
        priority: null,
        estimate: null,
        files: [],
        details: null,
        category: currentCategory,
        subtasks: []
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

      const statusMatch = line.match(/Status:\s*(todo|inprogress|done)/i);
      if (statusMatch) {
        currentTask.status = statusMatch[1].toLowerCase() as TaskStatus;
      }
    }
  }

  if (currentTask) {
    tasks.push(currentTask as Task);
  }

  return tasks.filter(t => t.id && t.title);
}

function getStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'done').length;
  const pending = total - completed;
  const percentage = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';

  const byPriority: Record<string, { total: number; completed: number }> = {
    P0: { total: 0, completed: 0 },
    P1: { total: 0, completed: 0 },
    P2: { total: 0, completed: 0 },
    P3: { total: 0, completed: 0 }
  };

  const byCategory: Record<string, { total: number; completed: number }> = {};
  
  const byStatus: Record<TaskStatus, number> = {
    todo: 0,
    inprogress: 0,
    done: 0
  };

  tasks.forEach(task => {
    if (task.priority && byPriority[task.priority]) {
      byPriority[task.priority].total++;
      if (task.status === 'done') {
        byPriority[task.priority].completed++;
      }
    }

    if (!byCategory[task.category]) {
      byCategory[task.category] = { total: 0, completed: 0 };
    }
    byCategory[task.category].total++;
    if (task.status === 'done') {
      byCategory[task.category].completed++;
    }
    
    byStatus[task.status]++;
  });

  return {
    total,
    completed,
    pending,
    percentage,
    byPriority,
    byCategory,
    byStatus
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

    if (status) {
      filteredTasks = filteredTasks.filter(t => t.status === status);
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
    const { taskId, status } = await request.json();

    if (!taskId || !status) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const content = fs.readFileSync(TODO_FILE, 'utf-8');
    const lines = content.split('\n');
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
      const taskMatch = lines[i].match(/^- \[([ x])\] \*\*(.+?)\*\*:/);
      if (taskMatch && taskMatch[2] === taskId) {
        const checkChar = (status === 'done') ? 'x' : ' ';
        lines[i] = lines[i].replace(/^- \[([ x])\]/, `- [${checkChar}]`);
        
        // Add or update status line
        let j = i + 1;
        let statusLineFound = false;
        while (j < lines.length && lines[j].match(/^\s+[-*]|^\s{2,}/)) {
          if (lines[j].match(/Status:/i)) {
            lines[j] = `  - Status: ${status}`;
            statusLineFound = true;
            break;
          }
          j++;
        }
        
        if (!statusLineFound && j < lines.length) {
          // Insert status line after priority/estimate/files if they exist
          lines.splice(j, 0, `  - Status: ${status}`);
        }
        
        updated = true;
        break;
      }
    }

    if (!updated) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const newContent = lines.join('\n');
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

export async function POST(request: NextRequest) {
  try {
    const taskData = await request.json();
    
    if (!taskData.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const content = fs.readFileSync(TODO_FILE, 'utf-8');
    const lines = content.split('\n');
    
    // Generate a unique task ID
    const taskId = `TASK-${Date.now()}`;
    const checkChar = taskData.status === 'done' ? 'x' : ' ';
    
    // Find the end of file to append new task
    let newTaskLines = [
      '',
      `- [${checkChar}] **${taskId}**: ${taskData.title}`,
    ];
    
    if (taskData.priority) {
      newTaskLines.push(`  - Priority: ${taskData.priority}`);
    }
    if (taskData.estimate) {
      newTaskLines.push(`  - Estimate: ${taskData.estimate}`);
    }
    if (taskData.details) {
      newTaskLines.push(`  - Details: ${taskData.details}`);
    }
    if (taskData.status) {
      newTaskLines.push(`  - Status: ${taskData.status}`);
    }
    if (taskData.category) {
      newTaskLines.push(`  - Category: ${taskData.category}`);
    }
    
    const newContent = content + '\n' + newTaskLines.join('\n');
    fs.writeFileSync(TODO_FILE, newContent, 'utf-8');

    const tasks = parseTasks(newContent);
    const stats = getStats(tasks);

    return NextResponse.json({
      success: true,
      stats,
      tasks
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const taskData = await request.json();
    
    if (!taskData.id || !taskData.title) {
      return NextResponse.json(
        { error: 'ID and title are required' },
        { status: 400 }
      );
    }

    const content = fs.readFileSync(TODO_FILE, 'utf-8');
    const lines = content.split('\n');
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
      const taskMatch = lines[i].match(/^- \[([ x])\] \*\*(.+?)\*\*:/);
      if (taskMatch && taskMatch[2] === taskData.id) {
        const checkChar = (taskData.status === 'done') ? 'x' : ' ';
        lines[i] = `- [${checkChar}] **${taskData.id}**: ${taskData.title}`;
        
        // Remove old task details
        let j = i + 1;
        while (j < lines.length && lines[j].match(/^\s+[-*]|^\s{2,}/)) {
          lines.splice(j, 1);
        }
        
        // Add updated task details
        const detailLines = [];
        if (taskData.priority) {
          detailLines.push(`  - Priority: ${taskData.priority}`);
        }
        if (taskData.estimate) {
          detailLines.push(`  - Estimate: ${taskData.estimate}`);
        }
        if (taskData.details) {
          detailLines.push(`  - Details: ${taskData.details}`);
        }
        if (taskData.status) {
          detailLines.push(`  - Status: ${taskData.status}`);
        }
        if (taskData.category) {
          detailLines.push(`  - Category: ${taskData.category}`);
        }
        
        lines.splice(i + 1, 0, ...detailLines);
        updated = true;
        break;
      }
    }

    if (!updated) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const newContent = lines.join('\n');
    fs.writeFileSync(TODO_FILE, newContent, 'utf-8');

    const tasks = parseTasks(newContent);
    const stats = getStats(tasks);

    return NextResponse.json({
      success: true,
      stats,
      tasks
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { taskId } = await request.json();
    
    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const content = fs.readFileSync(TODO_FILE, 'utf-8');
    const lines = content.split('\n');
    let deleted = false;

    for (let i = 0; i < lines.length; i++) {
      const taskMatch = lines[i].match(/^- \[([ x])\] \*\*(.+?)\*\*:/);
      if (taskMatch && taskMatch[2] === taskId) {
        lines.splice(i, 1);
        
        // Remove task details
        while (i < lines.length && lines[i].match(/^\s+[-*]|^\s{2,}/)) {
          lines.splice(i, 1);
        }
        
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const newContent = lines.join('\n');
    fs.writeFileSync(TODO_FILE, newContent, 'utf-8');

    const tasks = parseTasks(newContent);
    const stats = getStats(tasks);

    return NextResponse.json({
      success: true,
      stats,
      tasks
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
