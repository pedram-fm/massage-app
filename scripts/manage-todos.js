#!/usr/bin/env node

/**
 * TODO Management Script
 * اسکریپت مدیریت تسک‌های پروژه
 * 
 * استفاده:
 *   node scripts/manage-todos.js stats          # نمایش آمار
 *   node scripts/manage-todos.js list           # لیست تسک‌های باز
 *   node scripts/manage-todos.js completed      # لیست تسک‌های انجام شده
 *   node scripts/manage-todos.js priority P0    # تسک‌های با اولویت P0
 *   node scripts/manage-todos.js search "auth"  # جستجو در تسک‌ها
 */

const fs = require('fs');
const path = require('path');

const TODO_FILE = path.join(__dirname, '..', 'massage-app-frontend', 'TODO.md');

// خواندن فایل TODO
function readTodoFile() {
  try {
    return fs.readFileSync(TODO_FILE, 'utf-8');
  } catch (error) {
    console.error('❌ خطا در خواندن فایل TODO.md');
    process.exit(1);
  }
}

// Parse کردن تسک‌ها
function parseTasks(content) {
  const lines = content.split('\n');
  const tasks = [];
  let currentTask = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // شناسایی تسک
    const taskMatch = line.match(/^- \[([ x])\] \*\*(.+?)\*\*:(.+)$/);
    if (taskMatch) {
      if (currentTask) {
        tasks.push(currentTask);
      }
      currentTask = {
        lineNumber: i + 1,
        completed: taskMatch[1] === 'x',
        id: taskMatch[2],
        title: taskMatch[3].trim(),
        priority: null,
        estimate: null,
        files: [],
        details: null
      };
      continue;
    }

    // خواندن جزئیات تسک
    if (currentTask) {
      const priorityMatch = line.match(/Priority: (P\d)/);
      if (priorityMatch) currentTask.priority = priorityMatch[1];

      const estimateMatch = line.match(/Estimate: (.+)/);
      if (estimateMatch) currentTask.estimate = estimateMatch[1];

      const filesMatch = line.match(/Files: (.+)/);
      if (filesMatch) currentTask.files = filesMatch[1].split(',').map(f => f.trim());

      const detailsMatch = line.match(/Details: (.+)/);
      if (detailsMatch) currentTask.details = detailsMatch[1];
    }
  }

  if (currentTask) {
    tasks.push(currentTask);
  }

  return tasks;
}

// نمایش آمار
function showStats() {
  const content = readTodoFile();
  const tasks = parseTasks(content);

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

  const byPriority = {
    P0: { total: 0, completed: 0 },
    P1: { total: 0, completed: 0 },
    P2: { total: 0, completed: 0 },
    P3: { total: 0, completed: 0 }
  };

  tasks.forEach(task => {
    if (task.priority && byPriority[task.priority]) {
      byPriority[task.priority].total++;
      if (task.completed) {
        byPriority[task.priority].completed++;
      }
    }
  });

  console.log('\n📊 آمار کلی پروژه\n');
  console.log('━'.repeat(50));
  console.log(`  کل تسک‌ها:        ${total}`);
  console.log(`  ✅ انجام شده:     ${completed}`);
  console.log(`  ⏳ در انتظار:     ${pending}`);
  console.log(`  📈 پیشرفت:        ${percentage}%`);
  console.log('━'.repeat(50));
  
  console.log('\n🎯 آمار بر اساس اولویت:\n');
  Object.entries(byPriority).forEach(([priority, stats]) => {
    const percent = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(0) : 0;
    console.log(`  ${priority}: ${stats.completed}/${stats.total} (${percent}%)`);
  });
  console.log();
}

// لیست تسک‌های باز
function listPendingTasks() {
  const content = readTodoFile();
  const tasks = parseTasks(content);
  const pending = tasks.filter(t => !t.completed);

  console.log(`\n⏳ تسک‌های باز (${pending.length} مورد):\n`);
  
  const grouped = groupByPriority(pending);
  
  ['P0', 'P1', 'P2', 'P3'].forEach(priority => {
    if (grouped[priority] && grouped[priority].length > 0) {
      console.log(`\n🔴 ${priority}:`);
      grouped[priority].forEach(task => {
        console.log(`  • [${task.id}] ${task.title}`);
        if (task.estimate) console.log(`    ⏱️  ${task.estimate}`);
      });
    }
  });
  console.log();
}

// لیست تسک‌های انجام شده
function listCompletedTasks() {
  const content = readTodoFile();
  const tasks = parseTasks(content);
  const completed = tasks.filter(t => t.completed);

  console.log(`\n✅ تسک‌های انجام شده (${completed.length} مورد):\n`);
  completed.forEach(task => {
    console.log(`  • [${task.id}] ${task.title}`);
  });
  console.log();
}

// تسک‌ها بر اساس اولویت
function listByPriority(priority) {
  const content = readTodoFile();
  const tasks = parseTasks(content);
  const filtered = tasks.filter(t => t.priority === priority);

  console.log(`\n🎯 تسک‌های ${priority} (${filtered.length} مورد):\n`);
  filtered.forEach(task => {
    const status = task.completed ? '✅' : '⏳';
    console.log(`  ${status} [${task.id}] ${task.title}`);
    if (task.estimate) console.log(`     ⏱️  ${task.estimate}`);
    if (task.files.length > 0) console.log(`     📁 ${task.files.join(', ')}`);
  });
  console.log();
}

// جستجو در تسک‌ها
function searchTasks(query) {
  const content = readTodoFile();
  const tasks = parseTasks(content);
  const results = tasks.filter(task => 
    task.id.toLowerCase().includes(query.toLowerCase()) ||
    task.title.toLowerCase().includes(query.toLowerCase()) ||
    (task.details && task.details.toLowerCase().includes(query.toLowerCase()))
  );

  console.log(`\n🔍 نتایج جستجو برای "${query}" (${results.length} مورد):\n`);
  results.forEach(task => {
    const status = task.completed ? '✅' : '⏳';
    console.log(`  ${status} [${task.id}] ${task.title}`);
    console.log(`     Line: ${task.lineNumber} | Priority: ${task.priority || 'N/A'}`);
  });
  console.log();
}

// گروه‌بندی بر اساس اولویت
function groupByPriority(tasks) {
  return tasks.reduce((acc, task) => {
    const priority = task.priority || 'Other';
    if (!acc[priority]) acc[priority] = [];
    acc[priority].push(task);
    return acc;
  }, {});
}

// مارک کردن تسک به عنوان انجام شده
function markAsComplete(taskId) {
  const content = readTodoFile();
  const regex = new RegExp(`^- \\[ \\] \\*\\*${taskId}\\*\\*:`, 'm');
  
  if (!regex.test(content)) {
    console.error(`❌ تسک ${taskId} یافت نشد یا قبلاً انجام شده است.`);
    process.exit(1);
  }

  const newContent = content.replace(regex, `- [x] **${taskId}**:`);
  fs.writeFileSync(TODO_FILE, newContent, 'utf-8');
  console.log(`✅ تسک ${taskId} به عنوان انجام شده مارک شد.`);
}

// مارک کردن تسک به عنوان باز
function markAsIncomplete(taskId) {
  const content = readTodoFile();
  const regex = new RegExp(`^- \\[x\\] \\*\\*${taskId}\\*\\*:`, 'm');
  
  if (!regex.test(content)) {
    console.error(`❌ تسک ${taskId} یافت نشد یا قبلاً باز است.`);
    process.exit(1);
  }

  const newContent = content.replace(regex, `- [ ] **${taskId}**:`);
  fs.writeFileSync(TODO_FILE, newContent, 'utf-8');
  console.log(`⏳ تسک ${taskId} به عنوان باز مارک شد.`);
}

// راهنما
function showHelp() {
  console.log(`
📋 TODO Management Script - اسکریپت مدیریت تسک‌ها

استفاده:
  node scripts/manage-todos.js <command> [args]

دستورات:
  stats                  نمایش آمار کلی پروژه
  list                   لیست تسک‌های باز
  completed              لیست تسک‌های انجام شده
  priority <P0-P3>       لیست تسک‌های با اولویت خاص
  search <query>         جستجو در تسک‌ها
  done <TASK-ID>         مارک کردن تسک به عنوان انجام شده
  reopen <TASK-ID>       مارک کردن تسک به عنوان باز
  help                   نمایش این راهنما

مثال‌ها:
  node scripts/manage-todos.js stats
  node scripts/manage-todos.js priority P0
  node scripts/manage-todos.js search "authentication"
  node scripts/manage-todos.js done SEC-001
  node scripts/manage-todos.js reopen SEC-001
`);
}

// Main
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    showHelp();
    return;
  }

  switch (command) {
    case 'stats':
      showStats();
      break;
    case 'list':
      listPendingTasks();
      break;
    case 'completed':
      listCompletedTasks();
      break;
    case 'priority':
      if (!args[1]) {
        console.error('❌ لطفاً اولویت را مشخص کنید (P0, P1, P2, P3)');
        process.exit(1);
      }
      listByPriority(args[1]);
      break;
    case 'search':
      if (!args[1]) {
        console.error('❌ لطفاً کلمه جستجو را وارد کنید');
        process.exit(1);
      }
      searchTasks(args[1]);
      break;
    case 'done':
      if (!args[1]) {
        console.error('❌ لطفاً ID تسک را وارد کنید');
        process.exit(1);
      }
      markAsComplete(args[1]);
      break;
    case 'reopen':
      if (!args[1]) {
        console.error('❌ لطفاً ID تسک را وارد کنید');
        process.exit(1);
      }
      markAsIncomplete(args[1]);
      break;
    default:
      console.error(`❌ دستور نامعتبر: ${command}`);
      showHelp();
      process.exit(1);
  }
}

main();
