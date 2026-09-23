"use client";

import * as React from "react";
import Link from "next/link";
import { BarChart2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AnalyticsSummary } from "@/lib/actions/analytics";

interface AcademicAnalyticsViewProps {
  data: AnalyticsSummary;
}

export function AcademicAnalyticsView({ data }: AcademicAnalyticsViewProps) {
  const hasData = data.totalCourses > 0 || data.totalAssignments > 0 || data.totalTasks > 0;

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="METRICS & INSIGHTS"
        title="Academic Analytics"
        description="Performance indicators, coursework completion rates, and module progress calculated from active records."
      />

      {!hasData ? (
        <div className="p-10 border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 text-center space-y-3">
          <BarChart2 className="w-10 h-10 mx-auto text-zinc-400" />
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
            No Academic Data Available
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
            Analytics metrics will automatically calculate as soon as you add courses, assignments, or tasks.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/courses"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-purple-700 dark:bg-purple-600 text-white"
            >
              Add Course
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Key Metric Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                Coursework Completion
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {data.assignmentCompletionRate}%
                </span>
                <span className="text-xs font-mono text-purple-700 dark:text-purple-400 font-bold">
                  {data.completedAssignments}/{data.totalAssignments} ASSG
                </span>
              </div>
            </div>

            <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                Active Courses
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {data.totalCourses}
                </span>
                <span className="text-xs font-mono text-zinc-500">MODULES</span>
              </div>
            </div>

            <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                Overdue Deadlines
              </span>
              <div className="flex items-baseline justify-between">
                <span
                  className={`font-serif text-3xl font-bold ${
                    data.overdueAssignments > 0 ? "text-red-600 dark:text-red-400" : "text-zinc-900 dark:text-zinc-50"
                  }`}
                >
                  {data.overdueAssignments}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase text-red-700 dark:text-red-400">
                  {data.overdueAssignments > 0 ? "ACTION REQ." : "ON TRACK"}
                </span>
              </div>
            </div>

            <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                Task Completion
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {data.taskCompletionRate}%
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  {data.completedTasks}/{data.totalTasks} TASKS
                </span>
              </div>
            </div>
          </div>

          {/* Simple Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1: Assignment Breakdown */}
            <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                  ASSIGNMENT STATUS BREAKDOWN
                </h3>
                <span className="text-xs font-mono text-zinc-500">TOTAL: {data.totalAssignments}</span>
              </div>

              {data.totalAssignments === 0 ? (
                <p className="text-xs text-zinc-500 py-6 text-center font-mono">No assignment records to display.</p>
              ) : (
                <div className="space-y-4 pt-2">
                  {/* Multi-segment Progress Bar */}
                  <div className="w-full h-4 bg-zinc-100 dark:bg-zinc-800 flex overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    {data.completedAssignments > 0 && (
                      <div
                        style={{ width: `${(data.completedAssignments / data.totalAssignments) * 100}%` }}
                        className="bg-emerald-600 dark:bg-emerald-500 h-full"
                        title={`Completed: ${data.completedAssignments}`}
                      />
                    )}
                    {data.pendingAssignments > 0 && (
                      <div
                        style={{ width: `${(data.pendingAssignments / data.totalAssignments) * 100}%` }}
                        className="bg-purple-700 dark:bg-purple-500 h-full"
                        title={`Pending: ${data.pendingAssignments}`}
                      />
                    )}
                    {data.overdueAssignments > 0 && (
                      <div
                        style={{ width: `${(data.overdueAssignments / data.totalAssignments) * 100}%` }}
                        className="bg-red-600 dark:bg-red-500 h-full"
                        title={`Overdue: ${data.overdueAssignments}`}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                    <div className="p-3 border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20">
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 dark:text-emerald-300 block">
                        Completed
                      </span>
                      <span className="font-serif text-xl font-bold text-emerald-900 dark:text-emerald-200">
                        {data.completedAssignments}
                      </span>
                    </div>

                    <div className="p-3 border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20">
                      <span className="text-[10px] font-mono font-bold uppercase text-purple-800 dark:text-purple-300 block">
                        Pending
                      </span>
                      <span className="font-serif text-xl font-bold text-purple-900 dark:text-purple-200">
                        {data.pendingAssignments}
                      </span>
                    </div>

                    <div className="p-3 border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20">
                      <span className="text-[10px] font-mono font-bold uppercase text-red-800 dark:text-red-300 block">
                        Overdue
                      </span>
                      <span className="font-serif text-xl font-bold text-red-900 dark:text-red-200">
                        {data.overdueAssignments}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chart 2: Course Progress Comparison Bar Chart */}
            <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-4">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                  COURSE PROGRESS COMPARISON
                </h3>
                <Link href="/courses" className="text-xs font-mono text-purple-700 dark:text-purple-400 hover:underline">
                  Manage Courses →
                </Link>
              </div>

              {data.courseProgressList.length === 0 ? (
                <p className="text-xs text-zinc-500 py-6 text-center font-mono">No courses enrolled.</p>
              ) : (
                <div className="space-y-4 pt-1">
                  {data.courseProgressList.map((course) => (
                    <div key={course.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                          {course.code} — <span className="font-sans font-normal text-zinc-600 dark:text-zinc-400">{course.name}</span>
                        </span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                          {course.calculatedProgress}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700">
                        <div
                          style={{ width: `${course.calculatedProgress}%` }}
                          className="h-full bg-purple-700 dark:bg-purple-500 transition-all duration-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
