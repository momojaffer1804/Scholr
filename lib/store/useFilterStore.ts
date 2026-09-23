import { create } from "zustand";

interface FilterState {
  // Course Search State
  courseSearch: string;
  setCourseSearch: (query: string) => void;

  // Assignment Filter State
  assignmentStatus: "ALL" | "PENDING" | "COMPLETED";
  assignmentPriority: "ALL" | "HIGH" | "MEDIUM" | "LOW";
  assignmentCourseId: string;
  assignmentSortBy: "dueDate" | "priority";
  assignmentSearch: string;

  setAssignmentStatus: (status: "ALL" | "PENDING" | "COMPLETED") => void;
  setAssignmentPriority: (priority: "ALL" | "HIGH" | "MEDIUM" | "LOW") => void;
  setAssignmentCourseId: (courseId: string) => void;
  setAssignmentSortBy: (sortBy: "dueDate" | "priority") => void;
  setAssignmentSearch: (query: string) => void;

  // Task Filter State
  taskFilter: "ALL" | "PENDING" | "COMPLETED";
  taskPriority: "ALL" | "HIGH" | "MEDIUM" | "LOW";
  taskSortBy: "dueDate" | "priority";
  taskSearch: string;

  setTaskFilter: (filter: "ALL" | "PENDING" | "COMPLETED") => void;
  setTaskPriority: (priority: "ALL" | "HIGH" | "MEDIUM" | "LOW") => void;
  setTaskSortBy: (sortBy: "dueDate" | "priority") => void;
  setTaskSearch: (query: string) => void;

  // Reset Actions
  resetAssignmentFilters: () => void;
  resetTaskFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  // Course Search
  courseSearch: "",
  setCourseSearch: (query) => set({ courseSearch: query }),

  // Assignment Filters
  assignmentStatus: "ALL",
  assignmentPriority: "ALL",
  assignmentCourseId: "ALL",
  assignmentSortBy: "dueDate",
  assignmentSearch: "",

  setAssignmentStatus: (status) => set({ assignmentStatus: status }),
  setAssignmentPriority: (priority) => set({ assignmentPriority: priority }),
  setAssignmentCourseId: (courseId) => set({ assignmentCourseId: courseId }),
  setAssignmentSortBy: (sortBy) => set({ assignmentSortBy: sortBy }),
  setAssignmentSearch: (query) => set({ assignmentSearch: query }),

  // Task Filters
  taskFilter: "ALL",
  taskPriority: "ALL",
  taskSortBy: "dueDate",
  taskSearch: "",

  setTaskFilter: (filter) => set({ taskFilter: filter }),
  setTaskPriority: (priority) => set({ taskPriority: priority }),
  setTaskSortBy: (sortBy) => set({ taskSortBy: sortBy }),
  setTaskSearch: (query) => set({ taskSearch: query }),

  // Reset
  resetAssignmentFilters: () =>
    set({
      assignmentStatus: "ALL",
      assignmentPriority: "ALL",
      assignmentCourseId: "ALL",
      assignmentSortBy: "dueDate",
      assignmentSearch: "",
    }),
  resetTaskFilters: () =>
    set({
      taskFilter: "ALL",
      taskPriority: "ALL",
      taskSortBy: "dueDate",
      taskSearch: "",
    }),
}));
