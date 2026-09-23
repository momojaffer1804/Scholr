"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, BarChart2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DashboardStats } from "@/components/DashboardStats";
import { CourseProgress } from "@/components/CourseProgress";
import { UpcomingDeadlines, UpcomingItem } from "@/components/UpcomingDeadlines";
import { toggleTaskComplete } from "@/lib/actions/tasks";
import { useToastStore } from "@/lib/store/useToastStore";

interface TaskItem {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | string | null;
  priority: string;
  completed: boolean;
}

interface AssignmentItem {
  id: string;
  title: string;
  dueDate: Date | string;
  priority: string;
  status: string;
  course: {
    code: string;
    name: string;
  };
}

interface CourseItem {
  id: string;
  code: string;
  name: string;
  progress: number;
}

interface DashboardViewProps {
  stats: {
    activeCourses: number;
    pendingAssignments: number;
    completedAssignments: number;
  };
  courses: CourseItem[];
  todayTasks: TaskItem[];
  assignmentsDueSoon: AssignmentItem[];
  upcomingAssignments: AssignmentItem[];
}

export function DashboardView({
  stats,
  courses,
  todayTasks: initialTasks,
  assignmentsDueSoon: initialAssignmentsDue,
  upcomingAssignments,
}: DashboardViewProps) {
  const [tasks, setTasks] = React.useState<TaskItem[]>(initialTasks);
  const [prevTasks, setPrevTasks] = React.useState<TaskItem[]>(initialTasks);
  const [assignmentsDue, setAssignmentsDue] = React.useState<AssignmentItem[]>(initialAssignmentsDue);
  const [prevAssignments, setPrevAssignments] = React.useState<AssignmentItem[]>(initialAssignmentsDue);

  const { addToast } = useToastStore();

  if (prevTasks !== initialTasks) {
    setPrevTasks(initialTasks);
    setTasks(initialTasks);
  }

  if (prevAssignments !== initialAssignmentsDue) {
    setPrevAssignments(initialAssignmentsDue);
    setAssignmentsDue(initialAssignmentsDue);
  }

  const handleToggleTask = async (id: string) => {
    const previous = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    const res = await toggleTaskComplete(id);
    if (!res.success && res.error) {
      setTasks(previous);
      addToast("Failed to update task", "error");
    } else {
      addToast("Task updated", "info");
    }
  };

  const statList = [
    { label: "Active Courses", value: stats.activeCourses, subtitle: "ENROLLED" },
    { label: "Pending Assignments", value: stats.pendingAssignments, subtitle: "ACTION REQ." },
    { label: "Completed Assignments", value: stats.completedAssignments, subtitle: "SUBMITTED" },
  ];

  // Map items for UpcomingDeadlines component
  const upcomingDeadlineItems: UpcomingItem[] = [
    ...assignmentsDue.map((a) => ({
      id: `assg-${a.id}`,
      title: a.title,
      type: "ASSIGNMENT" as const,
      dueDate: a.dueDate,
      priority: a.priority,
      status: a.status,
      courseCode: a.course.code,
    })),
    ...upcomingAssignments.map((a) => ({
      id: `upcoming-${a.id}`,
      title: a.title,
      type: "ASSIGNMENT" as const,
      dueDate: a.dueDate,
      priority: a.priority,
      status: a.status,
      courseCode: a.course.code,
    })),
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <PageHeader
        eyebrow="GOOD EVENING"
        title="Your academic life, in one place."
      />

      {/* Academic Overview Bar & Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
            ACADEMIC OVERVIEW
          </h2>
          <Link
            href="/analytics"
            className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1 uppercase"
          >
            View analytics
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <DashboardStats stats={statList} />
      </div>

      {/* Main Focus: TODAY & UPCOMING DEADLINES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TODAY SECTION */}
        <section aria-label="Today Focus" className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-700 dark:bg-purple-500 inline-block" />
              TODAY&apos;S FOCUS
            </h2>
            <Link
              href="/tasks"
              className="text-xs font-mono text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              View all tasks
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="p-5 border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                All daily tasks completed.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id)}
                      aria-label={`Mark ${task.title} as completed`}
                      className="mt-0.5 text-zinc-400 hover:text-purple-700 dark:hover:text-purple-400 cursor-pointer shrink-0 focus:outline-none"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div>
                      <h3
                        className={`text-xs font-bold ${
                          task.completed ? "line-through text-zinc-400" : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border shrink-0 ${
                      task.priority === "HIGH"
                        ? "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* UPCOMING DEADLINES SECTION */}
        <UpcomingDeadlines items={upcomingDeadlineItems} limit={4} />
      </div>

      {/* CURRENT COURSES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            ACADEMIC PROGRESS SUMMARY
          </h2>
          <Link
            href="/courses"
            className="text-xs font-mono text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            View all courses
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <CourseProgress courses={courses} />
      </div>
    </div>
  );
}
