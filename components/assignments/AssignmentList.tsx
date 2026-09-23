"use client";

import * as React from "react";
import {
  Plus,
  CheckSquare,
  Calendar,
  Filter,
  ArrowUpDown,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  Search,
  RotateCcw,
  Loader2,
} from "lucide-react";
import {
  createAssignment,
  toggleAssignmentStatus,
  updateAssignment,
  deleteAssignment,
} from "@/lib/actions/assignments";
import { useFilterStore } from "@/lib/store/useFilterStore";
import { useToastStore } from "@/lib/store/useToastStore";

interface CourseOption {
  id: string;
  code: string;
  name: string;
}

interface AssignmentItem {
  id: string;
  title: string;
  description?: string | null;
  courseId: string;
  dueDate: Date | string;
  priority: string;
  status: string;
  course: {
    id: string;
    code: string;
    name: string;
  };
}

export function AssignmentList({
  initialAssignments,
  courses,
}: {
  initialAssignments: AssignmentItem[];
  courses: CourseOption[];
}) {
  const [assignments, setAssignments] = React.useState<AssignmentItem[]>(initialAssignments);
  const [prevInitial, setPrevInitial] = React.useState<AssignmentItem[]>(initialAssignments);

  // Zustand Filter Store & Toast Store
  const {
    assignmentStatus,
    setAssignmentStatus,
    assignmentPriority,
    setAssignmentPriority,
    assignmentCourseId,
    setAssignmentCourseId,
    assignmentSortBy,
    setAssignmentSortBy,
    assignmentSearch,
    setAssignmentSearch,
    resetAssignmentFilters,
  } = useFilterStore();
  const { addToast } = useToastStore();

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [courseId, setCourseId] = React.useState(courses[0]?.id || "");
  const [dueDate, setDueDate] = React.useState("");
  const [priority, setPriority] = React.useState("MEDIUM");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Edit Modal State
  const [editingAssignment, setEditingAssignment] = React.useState<AssignmentItem | null>(null);

  if (prevInitial !== initialAssignments) {
    setPrevInitial(initialAssignments);
    setAssignments(initialAssignments);
  }

  // Filter & Sort Logic
  const filteredAssignments = assignments
    .filter((item) => {
      if (assignmentStatus !== "ALL" && item.status !== assignmentStatus) return false;
      if (assignmentCourseId !== "ALL" && item.courseId !== assignmentCourseId) return false;
      if (assignmentPriority !== "ALL" && item.priority !== assignmentPriority) return false;
      if (assignmentSearch.trim()) {
        const q = assignmentSearch.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          item.course.code.toLowerCase().includes(q) ||
          item.course.name.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (assignmentSortBy === "priority") {
        const priorityRank: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        const diff = (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
        if (diff !== 0) return diff;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError("Assignment title is required.");
      return;
    }
    if (!courseId) {
      setFormError("Please select a course.");
      return;
    }
    if (!dueDate) {
      setFormError("Due date is required.");
      return;
    }

    setIsSubmitting(true);
    const res = await createAssignment({
      title: title.trim(),
      description: description.trim(),
      courseId,
      dueDate,
      priority,
    });
    setIsSubmitting(false);

    if (res.error) {
      setFormError(res.error);
      addToast(res.error, "error");
    } else if (res.assignment) {
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("MEDIUM");
      setIsCreateOpen(false);
      setAssignments((prev) => [res.assignment as AssignmentItem, ...prev]);
      addToast("Assignment added successfully", "success");
    }
  };

  const handleToggleStatus = async (id: string) => {
    const previousAssignments = assignments;
    // Optimistic Update
    setAssignments((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "COMPLETED" ? "PENDING" : "COMPLETED",
            }
          : item
      )
    );

    const res = await toggleAssignmentStatus(id);
    if (!res.success && res.error) {
      setAssignments(previousAssignments);
      addToast("Failed to update status — changes reverted", "error");
    } else {
      const target = assignments.find((a) => a.id === id);
      const isNowCompleted = target?.status === "PENDING";
      addToast(isNowCompleted ? "Assignment completed" : "Assignment marked pending", "info");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    const previousAssignments = assignments;
    setAssignments((prev) => prev.filter((a) => a.id !== id));

    const res = await deleteAssignment(id);
    if (!res.success) {
      setAssignments(previousAssignments);
      addToast("Unable to delete assignment", "error");
    } else {
      addToast("Assignment deleted", "info");
    }
  };

  const handleOpenEdit = (assignment: AssignmentItem) => {
    setEditingAssignment(assignment);
    setTitle(assignment.title);
    setDescription(assignment.description || "");
    setCourseId(assignment.courseId);
    const d = new Date(assignment.dueDate);
    const isoString = d.toISOString().slice(0, 16);
    setDueDate(isoString);
    setPriority(assignment.priority);
    setFormError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;
    setFormError(null);

    if (!title.trim()) {
      setFormError("Assignment title is required.");
      return;
    }

    setIsSubmitting(true);
    const res = await updateAssignment(editingAssignment.id, {
      title: title.trim(),
      description: description.trim(),
      courseId,
      dueDate,
      priority,
    });
    setIsSubmitting(false);

    if (res.error) {
      setFormError(res.error);
      addToast(res.error, "error");
    } else if (res.assignment) {
      setAssignments((prev) =>
        prev.map((a) => (a.id === editingAssignment.id ? (res.assignment as AssignmentItem) : a))
      );
      setEditingAssignment(null);
      setTitle("");
      setDescription("");
      addToast("Assignment updated successfully", "success");
    }
  };

  const isFiltered =
    assignmentStatus !== "ALL" ||
    assignmentPriority !== "ALL" ||
    assignmentCourseId !== "ALL" ||
    assignmentSearch.trim() !== "";

  return (
    <div className="space-y-6">
      {/* Search and Main Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search assignments by title, description or course..."
              value={assignmentSearch}
              onChange={(e) => setAssignmentSearch(e.target.value)}
              aria-label="Search assignments"
              className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setTitle("");
              setDescription("");
              setDueDate("");
              setPriority("MEDIUM");
              setFormError(null);
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500 text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
          >
            <Plus className="w-4 h-4" />
            Add Assignment
          </button>
        </div>

        {/* Compact Filters & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 border border-zinc-200 dark:border-zinc-800 p-2 bg-white dark:bg-zinc-900/60">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-50 dark:bg-zinc-900">
              {(["ALL", "PENDING", "COMPLETED"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setAssignmentStatus(tab)}
                  className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    assignmentStatus === tab
                      ? "bg-purple-700 dark:bg-purple-600 text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Priority Select */}
            <div className="flex items-center gap-1 text-xs border border-zinc-300 dark:border-zinc-800 px-2 py-1 bg-white dark:bg-zinc-900">
              <Filter className="w-3 h-3 text-zinc-400" />
              <select
                value={assignmentPriority}
                aria-label="Filter assignments by priority"
                onChange={(e) => setAssignmentPriority(e.target.value as "ALL" | "HIGH" | "MEDIUM" | "LOW")}
                className="bg-transparent text-zinc-900 dark:text-zinc-100 text-[11px] focus:outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>

            {/* Course Select */}
            <div className="flex items-center gap-1 text-xs border border-zinc-300 dark:border-zinc-800 px-2 py-1 bg-white dark:bg-zinc-900">
              <select
                value={assignmentCourseId}
                aria-label="Filter assignments by course"
                onChange={(e) => setAssignmentCourseId(e.target.value)}
                className="bg-transparent text-zinc-900 dark:text-zinc-100 text-[11px] focus:outline-none"
              >
                <option value="ALL">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id} className="dark:bg-zinc-900">
                    {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1 text-xs border border-zinc-300 dark:border-zinc-800 px-2 py-1 bg-white dark:bg-zinc-900">
              <ArrowUpDown className="w-3 h-3 text-zinc-400" />
              <select
                value={assignmentSortBy}
                aria-label="Sort assignments"
                onChange={(e) => setAssignmentSortBy(e.target.value as "dueDate" | "priority")}
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
              onClick={resetAssignmentFilters}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-700 dark:text-purple-400 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Assignment Items List */}
      {filteredAssignments.length === 0 ? (
        <div className="p-8 border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 text-center">
          <CheckSquare className="w-8 h-8 mx-auto text-zinc-400 mb-2" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
            NO ASSIGNMENTS FOUND
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No assignments match the selected filter parameters.
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={resetAssignmentFilters}
              className="mt-3 text-xs font-mono text-purple-700 dark:text-purple-400 underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAssignments.map((assignment) => {
            const isCompleted = assignment.status === "COMPLETED";
            const formattedDate = new Date(assignment.dueDate).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={assignment.id}
                className={`p-4 border bg-white dark:bg-zinc-900/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? "border-zinc-200 dark:border-zinc-800 opacity-75"
                    : "border-zinc-300 dark:border-zinc-700/80 hover:border-purple-300 dark:hover:border-purple-800"
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(assignment.id)}
                    className="mt-0.5 text-zinc-400 hover:text-purple-700 dark:hover:text-purple-400 transition-colors cursor-pointer shrink-0 focus:outline-none"
                    aria-label={isCompleted ? `Mark ${assignment.title} as pending` : `Mark ${assignment.title} as completed`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-purple-700 dark:text-purple-400 uppercase">
                        {assignment.course.code}
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {assignment.course.name}
                      </span>
                    </div>

                    <h3
                      className={`text-base font-bold ${
                        isCompleted
                          ? "line-through text-zinc-400 dark:text-zinc-500"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {assignment.title}
                    </h3>

                    {assignment.description && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
                        {assignment.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>

                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${
                        assignment.priority === "HIGH"
                          ? "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                          : assignment.priority === "MEDIUM"
                          ? "border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300"
                          : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {assignment.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(assignment)}
                      title="Edit Assignment"
                      aria-label={`Edit ${assignment.title}`}
                      className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(assignment.id)}
                      title="Delete Assignment"
                      aria-label={`Delete ${assignment.title}`}
                      className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
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

      {/* Add / Edit Assignment Modal */}
      {(isCreateOpen || editingAssignment) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 shadow-xl">
            <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
              {editingAssignment ? "Edit Assignment" : "Add New Assignment"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Enter task details, select course module, due date, and priority.
            </p>

            {formError && (
              <div className="mb-4 p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 text-red-700 dark:text-red-300 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={editingAssignment ? handleSaveEdit : handleCreate} className="space-y-4">
              <div>
                <label htmlFor="assignment-title" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Title *
                </label>
                <input
                  id="assignment-title"
                  type="text"
                  placeholder="e.g. Relational Algebra Worksheet"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
                />
              </div>

              <div>
                <label htmlFor="assignment-course" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Course *
                </label>
                <select
                  id="assignment-course"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
                >
                  <option value="" disabled>Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="assignment-desc" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  id="assignment-desc"
                  rows={2}
                  placeholder="Optional details or submission requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="assignment-due" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                    Due Date & Time *
                  </label>
                  <input
                    id="assignment-due"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label htmlFor="assignment-priority" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                    Priority
                  </label>
                  <select
                    id="assignment-priority"
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
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingAssignment(null);
                  }}
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
                  ) : editingAssignment ? (
                    "Update Assignment"
                  ) : (
                    "Save Assignment"
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
