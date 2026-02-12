"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Home,
  RefreshCw,
  FileText,
  ArrowRight,
  CheckCheck,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

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

interface Stats {
  total: number;
  completed: number;
  pending: number;
  percentage: string;
  byPriority: Record<string, { total: number; completed: number }>;
  byCategory: Record<string, { total: number; completed: number }>;
}

export default function TodosPage() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Filters
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Computed: Active & Done tasks
  const activeTasks = allTasks.filter((t) => !t.completed);
  const doneTasks = allTasks.filter((t) => t.completed);

  const fetchTasks = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (priorityFilter) params.set("priority", priorityFilter);
    if (categoryFilter) params.set("category", categoryFilter);
    if (searchQuery) params.set("search", searchQuery);

    const response = await fetch(`/api/todos?${params.toString()}`);
    const data = await response.json();
    setAllTasks(data.tasks);
    setStats(data.stats);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [priorityFilter, categoryFilter]);

  const handleSearch = () => {
    fetchTasks();
  };

  const moveTask = async (taskId: string, toCompleted: boolean) => {
    setUpdating(taskId);
    try {
      const response = await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, completed: toCompleted }),
      });
      const data = await response.json();
      if (data.success) {
        setAllTasks(data.tasks);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
    setUpdating(null);
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "P0":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300";
      case "P1":
        return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300";
      case "P2":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300";
      case "P3":
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getPriorityBadge = (priority: string | null) => {
    if (!priority) return null;
    const labels: Record<string, string> = {
      P0: "فوری",
      P1: "بالا",
      P2: "متوسط",
      P3: "پایین",
    };
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getPriorityColor(
          priority
        )}`}
      >
        {labels[priority] || priority}
      </span>
    );
  };

  if (loading && !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--surface)]">
        <div className="flex items-center gap-3 text-[color:var(--brand)]">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="text-lg">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--brand)]">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="mb-2 inline-flex items-center gap-2 text-sm text-[color:var(--muted-text)] transition hover:text-[color:var(--brand)]"
            >
              <Home className="h-4 w-4" />
              بازگشت به خانه
            </Link>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              📋 TODO Board
            </h1>
            <p className="mt-1 text-sm text-[color:var(--muted-text)]">
              مدیریت تسک‌ها به سبک Jira
            </p>
          </div>
          <button
            onClick={fetchTasks}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-4 py-2 text-sm transition hover:bg-[color:var(--surface-muted)] disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            بروزرسانی
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[color:var(--muted-text)]">کل تسک‌ها</p>
                  <p className="mt-2 text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[color:var(--muted-text)]">فعال</p>
                  <p className="mt-2 text-3xl font-bold text-blue-600">{activeTasks.length}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <Circle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[color:var(--muted-text)]">انجام شده</p>
                  <p className="mt-2 text-3xl font-bold text-green-600">{doneTasks.length}</p>
                </div>
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[color:var(--muted-text)]">پیشرفت</p>
                  <p className="mt-2 text-3xl font-bold text-purple-600">
                    {stats.percentage}%
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Priority Filters */}
        {stats && (
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(stats.byPriority).map(([priority, data]) => {
              const percentage =
                data.total > 0 ? ((data.completed / data.total) * 100).toFixed(0) : "0";
              const labels: Record<string, string> = {
                P0: "فوری",
                P1: "بالا",
                P2: "متوسط",
                P3: "پایین",
              };
              return (
                <button
                  key={priority}
                  onClick={() => setPriorityFilter(priorityFilter === priority ? "" : priority)}
                  className={`rounded-xl border p-3 text-right transition ${
                    priorityFilter === priority
                      ? "border-[color:var(--brand)] bg-[color:var(--brand)] text-[color:var(--brand-foreground)]"
                      : "border-[color:var(--surface-muted)] bg-[color:var(--card)] hover:border-[color:var(--brand)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{labels[priority]}</span>
                    <span className="text-xs opacity-75">{percentage}%</span>
                  </div>
                  <p className="mt-1 text-lg font-bold">
                    {data.completed}/{data.total}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-6 rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-[color:var(--brand)]">
            <Filter className="h-4 w-4" />
            فیلترها
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="relative">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-text)]" />
              <input
                type="text"
                placeholder="جستجو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-10 w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] pr-10 text-sm focus:border-[color:var(--brand)] focus:outline-none"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-3 text-sm focus:border-[color:var(--brand)] focus:outline-none"
            >
              <option value="">همه دسته‌ها</option>
              {stats &&
                Object.keys(stats.byCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>

            <button
              onClick={handleSearch}
              className="h-10 rounded-xl bg-[color:var(--brand)] px-4 text-sm font-medium text-[color:var(--brand-foreground)] transition hover:opacity-90"
            >
              اعمال
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Active Column */}
          <div className="flex flex-col">
            <div className="mb-3 flex items-center justify-between rounded-t-2xl border border-b-0 border-[color:var(--surface-muted)] bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:from-blue-950 dark:to-blue-900">
              <div className="flex items-center gap-2">
                <Circle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  Active
                </h2>
              </div>
              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                {activeTasks.length}
              </span>
            </div>
            <div className="min-h-[600px] space-y-3 rounded-b-2xl border border-t-0 border-[color:var(--surface-muted)] bg-[color:var(--surface)]/50 p-4">
              <AnimatePresence mode="popLayout">
                {activeTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: 100 }}
                    className="group relative cursor-pointer rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-4 shadow-sm transition hover:border-blue-400 hover:shadow-md"
                  >
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                            {task.id}
                          </span>
                          {getPriorityBadge(task.priority)}
                          {task.estimate && (
                            <span className="inline-flex items-center gap-1 text-xs text-[color:var(--muted-text)]">
                              <Clock className="h-3 w-3" />
                              {task.estimate}
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-medium text-[color:var(--brand)]">
                          {task.title}
                        </p>

                        {task.details && (
                          <p className="mt-2 text-xs text-[color:var(--muted-text)]">
                            {task.details}
                          </p>
                        )}

                        {task.files.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {task.files.slice(0, 2).map((file, i) => (
                              <span
                                key={i}
                                className="rounded bg-[color:var(--surface-muted)] px-2 py-0.5 font-mono text-xs text-[color:var(--muted-text)]"
                              >
                                {file}
                              </span>
                            ))}
                            {task.files.length > 2 && (
                              <span className="text-xs text-[color:var(--muted-text)]">
                                +{task.files.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => moveTask(task.id, true)}
                        disabled={updating === task.id}
                        className="flex-shrink-0 self-start rounded-lg bg-green-100 p-2 text-green-600 opacity-0 transition hover:bg-green-200 group-hover:opacity-100 disabled:opacity-50 dark:bg-green-900 dark:text-green-400"
                        title="انتقال به Done"
                      >
                        {updating === task.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCheck className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {activeTasks.length === 0 && !loading && (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[color:var(--surface-muted)] text-center">
                  <Circle className="h-12 w-12 text-[color:var(--muted-text)] opacity-50" />
                  <p className="mt-4 text-sm text-[color:var(--muted-text)]">
                    هیچ تسک فعالی وجود ندارد
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="flex flex-col">
            <div className="mb-3 flex items-center justify-between rounded-t-2xl border border-b-0 border-[color:var(--surface-muted)] bg-gradient-to-r from-green-50 to-green-100 p-4 dark:from-green-950 dark:to-green-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h2 className="text-lg font-bold text-green-900 dark:text-green-100">
                  Done
                </h2>
              </div>
              <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                {doneTasks.length}
              </span>
            </div>
            <div className="min-h-[600px] space-y-3 rounded-b-2xl border border-t-0 border-[color:var(--surface-muted)] bg-[color:var(--surface)]/50 p-4">
              <AnimatePresence mode="popLayout">
                {doneTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -100 }}
                    className="group relative cursor-pointer rounded-xl border border-green-200 bg-green-50/50 p-4 opacity-70 shadow-sm transition hover:border-green-400 hover:opacity-100 hover:shadow-md dark:border-green-800 dark:bg-green-950/20"
                  >
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-green-700 line-through dark:text-green-400">
                            {task.id}
                          </span>
                          {getPriorityBadge(task.priority)}
                          {task.estimate && (
                            <span className="inline-flex items-center gap-1 text-xs text-[color:var(--muted-text)]">
                              <Clock className="h-3 w-3" />
                              {task.estimate}
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-medium text-green-800 line-through dark:text-green-300">
                          {task.title}
                        </p>

                        {task.details && (
                          <p className="mt-2 text-xs text-[color:var(--muted-text)] line-through">
                            {task.details}
                          </p>
                        )}

                        {task.files.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {task.files.slice(0, 2).map((file, i) => (
                              <span
                                key={i}
                                className="rounded bg-green-100 px-2 py-0.5 font-mono text-xs text-green-700 dark:bg-green-900 dark:text-green-400"
                              >
                                {file}
                              </span>
                            ))}
                            {task.files.length > 2 && (
                              <span className="text-xs text-[color:var(--muted-text)]">
                                +{task.files.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => moveTask(task.id, false)}
                        disabled={updating === task.id}
                        className="flex-shrink-0 self-start rounded-lg bg-blue-100 p-2 text-blue-600 opacity-0 transition hover:bg-blue-200 group-hover:opacity-100 disabled:opacity-50 dark:bg-blue-900 dark:text-blue-400"
                        title="بازگشت به Active"
                      >
                        {updating === task.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {doneTasks.length === 0 && !loading && (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-200 text-center dark:border-green-800">
                  <CheckCircle2 className="h-12 w-12 text-green-300 opacity-50 dark:text-green-700" />
                  <p className="mt-4 text-sm text-[color:var(--muted-text)]">
                    هنوز هیچ تسکی تکمیل نشده
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
