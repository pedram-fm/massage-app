"use client";

import { useEffect, useState, useMemo, memo } from "react";
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
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  AlertCircle,
  ListTodo,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  rectIntersection,
  DragOverEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskStatus = "todo" | "inprogress" | "done";

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

interface Stats {
  total: number;
  completed: number;
  pending: number;
  percentage: string;
  byPriority: Record<string, { total: number; completed: number }>;
  byCategory: Record<string, { total: number; completed: number }>;
  byStatus: Record<TaskStatus, number>;
}

// Task Card Component with drag and drop
const TaskCard = memo(function TaskCard({
  task,
  onDelete,
  onEdit,
  isDragging,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  isDragging?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    opacity: isSortableDragging ? 0.3 : 1,
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

  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        touchAction: 'none',
      }}
      {...attributes}
      {...listeners}
      className={`group relative cursor-grab rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-4 shadow-sm transition-colors hover:border-[color:var(--brand)] hover:shadow-md active:cursor-grabbing ${
        task.status === "done" ? "opacity-70" : ""
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-[color:var(--brand)]">
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

        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="rounded p-1 text-[color:var(--muted-text)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--brand)]"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="rounded p-1 text-[color:var(--muted-text)] hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p
        className={`text-sm font-medium text-[color:var(--brand)] ${
          task.status === "done" ? "line-through" : ""
        }`}
      >
        {task.title}
      </p>

      {task.details && (
        <p className="mt-2 text-xs text-[color:var(--muted-text)]">{task.details}</p>
      )}

      {totalSubtasks > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs text-[color:var(--muted-text)]">
              <span className="flex items-center gap-1">
                <ListTodo className="h-3 w-3" />
                زیرتسک‌ها
              </span>
              <span>
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[color:var(--surface-muted)]">
              <div
                className="h-full rounded-full bg-[color:var(--brand)] transition-all"
                style={{
                  width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
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
  );
});

// Task Modal for creating/editing
function TaskModal({
  isOpen,
  onClose,
  task,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  onSave: (task: Partial<Task>) => void;
}) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    status: "todo",
    priority: "P2",
    estimate: "",
    details: "",
    files: [],
    category: "",
    subtasks: [],
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        title: "",
        status: "todo",
        priority: "P2",
        estimate: "",
        details: "",
        files: [],
        category: "",
        subtasks: [],
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl font-bold text-[color:var(--brand)]">
          {task ? "ویرایش تسک" : "ایجاد تسک جدید"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[color:var(--brand)]">
              عنوان تسک *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none"
              placeholder="عنوان تسک را وارد کنید"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-[color:var(--brand)]">
                وضعیت
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as TaskStatus })
                }
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none"
              >
                <option value="todo">برای انجام</option>
                <option value="inprogress">در حال انجام</option>
                <option value="done">انجام شده</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[color:var(--brand)]">
                اولویت
              </label>
              <select
                value={formData.priority || ""}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none"
              >
                <option value="">هیچکدام</option>
                <option value="P0">P0 - فوری</option>
                <option value="P1">P1 - بالا</option>
                <option value="P2">P2 - متوسط</option>
                <option value="P3">P3 - پایین</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[color:var(--brand)]">
                تخمین زمان
              </label>
              <input
                type="text"
                value={formData.estimate || ""}
                onChange={(e) => setFormData({ ...formData, estimate: e.target.value })}
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none"
                placeholder="مثال: 2h, 1d"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[color:var(--brand)]">
              دسته‌بندی
            </label>
            <input
              type="text"
              value={formData.category || ""}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none"
              placeholder="مثال: Frontend, Backend, UI/UX"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[color:var(--brand)]">
              جزئیات
            </label>
            <textarea
              value={formData.details || ""}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-sm focus:border-[color:var(--brand)] focus:outline-none"
              placeholder="توضیحات کامل تسک"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[color:var(--surface-muted)] px-4 py-2 text-sm font-medium transition hover:bg-[color:var(--surface-muted)]"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[color:var(--brand)] px-4 py-2 text-sm font-medium text-[color:var(--brand-foreground)] transition hover:opacity-90"
            >
              {task ? "ذخیره تغییرات" : "ایجاد تسک"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Column Component
function KanbanColumn({
  title,
  status,
  tasks,
  icon,
  color,
  onDelete,
  onEdit,
  isOver,
}: {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  icon: React.ReactNode;
  color: string;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  isOver?: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col">
      <div
        className={`mb-3 flex items-center justify-between rounded-t-2xl border border-b-0 border-[color:var(--surface-muted)] p-4 ${color}`}
      >
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold dark:bg-black/40">
          {tasks.length}
        </span>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`min-h-[600px] space-y-3 rounded-b-2xl border border-t-0 border-[color:var(--surface-muted)] bg-[color:var(--surface)]/50 p-4 transition-colors ${
            isOver ? 'ring-2 ring-[color:var(--brand)] ring-offset-2 bg-[color:var(--brand)]/5' : ''
          }`}
          style={{ willChange: isOver ? 'background-color, box-shadow' : 'auto' }}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} onEdit={onEdit} />
          ))}

          {tasks.length === 0 && (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[color:var(--surface-muted)] text-center">
              {icon}
              <p className="mt-4 text-sm text-[color:var(--muted-text)]">
                هیچ تسکی در این ستون نیست
              </p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function TodosPage() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  // Filters
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15,
      },
    })
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id as string | null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const taskId = active.id as string;
    const task = allTasks.find((t) => t.id === taskId);
    if (!task) return;

    // Determine new status
    let newStatus: TaskStatus = task.status;
    
    // Check if dropped directly on a column (droppable zone)
    if (over.id === 'todo' || over.id === 'inprogress' || over.id === 'done') {
      newStatus = over.id as TaskStatus;
    } else {
      // If dropped on another task, inherit its status
      const overTask = allTasks.find((t) => t.id === over.id);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (newStatus !== task.status) {
      await updateTaskStatus(taskId, newStatus);
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      const response = await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status }),
      });
      const data = await response.json();
      if (data.success) {
        setAllTasks(data.tasks);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این تسک را حذف کنید؟")) return;

    try {
      const response = await fetch("/api/todos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });
      const data = await response.json();
      if (data.success) {
        setAllTasks(data.tasks);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      const response = await fetch("/api/todos", {
        method: editingTask ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTask ? { ...taskData, id: editingTask.id } : taskData),
      });
      const data = await response.json();
      if (data.success) {
        setAllTasks(data.tasks);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to save task:", error);
    }
    setEditingTask(undefined);
  };

  const todoTasks = useMemo(() => allTasks.filter((t) => t.status === "todo"), [allTasks]);
  const inProgressTasks = useMemo(() => allTasks.filter((t) => t.status === "inprogress"), [allTasks]);
  const doneTasks = useMemo(() => allTasks.filter((t) => t.status === "done"), [allTasks]);

  const activeTask = activeId ? allTasks.find((t) => t.id === activeId) : undefined;

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
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-bold text-[color:var(--brand)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              📋 تابلو کانبان
            </h1>
            <p className="mt-1 text-sm text-[color:var(--muted-text)]">
              مدیریت تسک‌ها و پروژه‌ها
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingTask(undefined);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-medium text-[color:var(--brand-foreground)] transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              تسک جدید
            </button>
            <button
              onClick={fetchTasks}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-4 py-2 text-sm transition hover:bg-[color:var(--surface-muted)] disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              بروزرسانی
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[color:var(--muted-text)]">کل تسک‌ها</p>
                  <p className="mt-2 text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[color:var(--muted-text)]">برای انجام</p>
                  <p className="mt-2 text-3xl font-bold text-gray-600">
                    {stats.byStatus.todo || 0}
                  </p>
                </div>
                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <Circle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[color:var(--muted-text)]">در حال انجام</p>
                  <p className="mt-2 text-3xl font-bold text-blue-600">
                    {stats.byStatus.inprogress || 0}
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[color:var(--muted-text)]">انجام شده</p>
                  <p className="mt-2 text-3xl font-bold text-green-600">
                    {stats.byStatus.done || 0}
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-green-600 transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>
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
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-text)]" />
              <input
                type="text"
                placeholder="جستجو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-10 w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] pl-10 text-sm focus:border-[color:var(--brand)] focus:outline-none"
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
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid gap-4 lg:grid-cols-3" dir="ltr">
            <KanbanColumn
              title="انجام شده"
              status="done"
              tasks={doneTasks}
              icon={<CheckCircle2 className="h-5 w-5 text-green-700 dark:text-green-300" />}
              color="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              isOver={overId === 'done'}
            />

            <KanbanColumn
              title="در حال انجام"
              status="inprogress"
              tasks={inProgressTasks}
              icon={<AlertCircle className="h-5 w-5 text-blue-700 dark:text-blue-300" />}
              color="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              isOver={overId === 'inprogress'}
            />

            <KanbanColumn
              title="برای انجام"
              status="todo"
              tasks={todoTasks}
              icon={<Circle className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
              color="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              isOver={overId === 'todo'}
            />
          </div>

          <DragOverlay dropAnimation={null}>
            {activeTask ? (
              <div className="cursor-grabbing opacity-80">
                <TaskCard
                  task={activeTask}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  isDragging
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <TaskModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingTask(undefined);
            }}
            task={editingTask}
            onSave={handleSaveTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
