"use client";

import * as React from "react";
import {
  Plus,
  ListTodo,
  Calendar,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { createTask, toggleTaskComplete, updateTask, deleteTask } from "@/lib/actions/tasks";
import { useFilterStore } from "@/lib/store/useFilterStore";
import { useToastStore } from "@/lib/store/useToastStore";

interface TaskItem {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | string | null;
  priority: string;
  completed: boolean;
}

export function TaskList({ initialTasks }: { initialTasks: TaskItem[] }) {
  const [tasks, setTasks] = React.useState<TaskItem[]>(initialTasks);
  const [prevInitial, setPrevInitial] = React.useState<TaskItem[]>(initialTasks);

  // Zustand Filter Store & Toast Store
  const {
    taskFilter,
    setTaskFilter,
    taskPriority,
    setTaskPriority,
    taskSortBy,
    setTaskSortBy,
    taskSearch,
    setTaskSearch,
    resetTaskFilters,
  } = useFilterStore();
  const { addToast } = useToastStore();

  // Create/Edit Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<TaskItem | null>(null);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [priority, setPriority] = React.useState("MEDIUM");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (prevInitial !== initialTasks) {
    setPrevInitial(initialTasks);
    setTasks(initialTasks);
  }

  // Filter & Sort Logic
  const filteredTasks = tasks
    .filter((t) => {
      if (taskFilter === "PENDING" && t.completed) return false;
      if (taskFilter === "COMPLETED" && !t.completed) return false;
      if (taskPriority !== "ALL" && t.priority !== taskPriority) return false;
      if (taskSearch.trim()) {
        const q = taskSearch.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (taskSortBy === "priority") {
        const priorityRank: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        const diff = (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
        if (diff !== 0) return diff;
      }
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const handleToggleComplete = async (id: string) => {
    const previousTasks = tasks;
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    const res = await toggleTaskComplete(id);
    if (!res.success && res.error) {
      setTasks(previousTasks);
      addToast("Failed to update task — changes reverted", "error");
    } else {
      const target = tasks.find((t) => t.id === id);
      const isNowCompleted = !target?.completed;
      addToast(isNowCompleted ? "Task marked completed" : "Task marked active", "info");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    const res = await deleteTask(id);
    if (!res.success) {
      setTasks(previousTasks);
      addToast("Unable to delete task", "error");
    } else {
      addToast("Task deleted", "info");
    }
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("MEDIUM");
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: TaskItem) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    if (task.dueDate) {
      const d = new Date(task.dueDate);
      setDueDate(d.toISOString().slice(0, 16));
    } else {
      setDueDate("");
    }
    setPriority(task.priority);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError("Task title is required.");
      return;
    }

    setIsSubmitting(true);

    if (editingTask) {
      const res = await updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null,
        priority,
      });
      setIsSubmitting(false);

      if (res.error) {
        setFormError(res.error);
        addToast(res.error, "error");
      } else if (res.task) {
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? (res.task as TaskItem) : t))
        );
        setIsModalOpen(false);
        addToast("Task updated successfully", "success");
      }
    } else {
      const res = await createTask({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || undefined,
        priority,
      });
      setIsSubmitting(false);

      if (res.error) {
        setFormError(res.error);
        addToast(res.error, "error");
      } else if (res.task) {
        setTasks((prev) => [res.task as TaskItem, ...prev]);
        setIsModalOpen(false);
        addToast("Task added successfully", "success");
      }
    }
  };

  const isFiltered =
    taskFilter !== "ALL" ||
    taskPriority !== "ALL" ||
    taskSearch.trim() !== "";

  return (
    <div className="space-y-6">
      {/* Top Search & Actions Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search checklist tasks or notes..."
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              aria-label="Search tasks"
              className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500 text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {/* Filters and Sort Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border border-zinc-200 dark:border-zinc-800 p-2 bg-white dark:bg-zinc-900/60">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Tabs: ALL, Active (PENDING), Completed */}
            <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-50 dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => setTaskFilter("ALL")}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  taskFilter === "ALL"
                    ? "bg-purple-700 dark:bg-purple-600 text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setTaskFilter("PENDING")}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  taskFilter === "PENDING"
                    ? "bg-purple-700 dark:bg-purple-600 text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setTaskFilter("COMPLETED")}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  taskFilter === "COMPLETED"
                    ? "bg-purple-700 dark:bg-purple-600 text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                Completed
              </button>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1 text-xs border border-zinc-300 dark:border-zinc-800 px-2 py-1 bg-white dark:bg-zinc-900">
              <Filter className="w-3 h-3 text-zinc-400" />
              <select
                value={taskPriority}
                aria-label="Filter tasks by priority"
                onChange={(e) => setTaskPriority(e.target.value as "ALL" | "HIGH" | "MEDIUM" | "LOW")}
                className="bg-transparent text-zinc-900 dark:text-zinc-100 text-[11px] focus:outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1 text-xs border border-zinc-300 dark:border-zinc-800 px-2 py-1 bg-white dark:bg-zinc-900">
              <ArrowUpDown className="w-3 h-3 text-zinc-400" />
              <select
                value={taskSortBy}
                aria-label="Sort tasks"
                onChange={(e) => setTaskSortBy(e.target.value as "dueDate" | "priority")}
                className="bg-transparent text-zinc-900 dark:text-zinc-100 text-[11px] focus:outline-none"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={resetTaskFilters}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-700 dark:text-purple-400 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="p-8 border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 text-center">
          <ListTodo className="w-8 h-8 mx-auto text-zinc-400 mb-2" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
            NO TASKS FOUND
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You currently have no tasks matching this filter view.
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={resetTaskFilters}
              className="mt-3 text-xs font-mono text-purple-700 dark:text-purple-400 underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => {
            const formattedDate = task.dueDate
              ? new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : null;

            return (
              <div
                key={task.id}
                className={`p-4 border bg-white dark:bg-zinc-900/60 transition-colors flex items-center justify-between gap-4 ${
                  task.completed
                    ? "border-zinc-200 dark:border-zinc-800 opacity-60"
                    : "border-zinc-300 dark:border-zinc-700/80 hover:border-purple-300 dark:hover:border-purple-800"
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(task.id)}
                    className="mt-0.5 text-zinc-400 hover:text-purple-700 dark:hover:text-purple-400 transition-colors cursor-pointer shrink-0 focus:outline-none"
                    aria-label={task.completed ? `Mark ${task.title} as active` : `Mark ${task.title} as completed`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <h3
                      className={`text-sm font-bold truncate ${
                        task.completed
                          ? "line-through text-zinc-400 dark:text-zinc-500"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {formattedDate && (
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>
                  )}

                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${
                      task.priority === "HIGH"
                        ? "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                        : task.priority === "MEDIUM"
                        ? "border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {task.priority}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(task)}
                      title="Edit Task"
                      aria-label={`Edit ${task.title}`}
                      className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      title="Delete Task"
                      aria-label={`Delete ${task.title}`}
                      className="p-1 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 shadow-xl">
            <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
              {editingTask ? "Edit Task" : "Add New Task"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Enter title, optional notes, due date, and priority level.
            </p>

            {formError && (
              <div className="mb-4 p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 text-red-700 dark:text-red-300 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="task-title" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Task Title *
                </label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="e.g. Review Chapter 4 B-Tree Indices"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
                />
              </div>

              <div>
                <label htmlFor="task-desc" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  id="task-desc"
                  rows={2}
                  placeholder="Optional notes or sub-tasks..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="task-due" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                    Due Date
                  </label>
                  <input
                    id="task-due"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label htmlFor="task-priority" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                    Priority
                  </label>
                  <select
                    id="task-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500 text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : editingTask ? (
                    "Update Task"
                  ) : (
                    "Save Task"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
