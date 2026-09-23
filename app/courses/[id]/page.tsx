import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { getCourseById } from "@/lib/actions/courses";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
      </div>

      {/* Header Info Card */}
      <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-purple-700 dark:text-purple-400 uppercase block mb-1">
              {course.code}
            </span>
            <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {course.name}
            </h1>
          </div>

          <div className="sm:text-right">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase block">
              Credits
            </span>
            <span className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {course.credits}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
          <div>
            <span className="text-zinc-500 dark:text-zinc-400 uppercase font-mono block">Instructor</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{course.instructor}</span>
          </div>

          <div>
            <span className="text-zinc-500 dark:text-zinc-400 uppercase font-mono block">Current Progress</span>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700/60">
                <div
                  className="h-full bg-purple-700 dark:bg-purple-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{course.progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Assignments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            COURSE ASSIGNMENTS ({course.assignments.length})
          </h2>
          <Link
            href="/assignments"
            className="text-xs font-mono text-purple-700 dark:text-purple-400 hover:underline"
          >
            Manage Assignments →
          </Link>
        </div>

        {course.assignments.length === 0 ? (
          <div className="p-6 border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 text-center">
            <BookOpen className="w-6 h-6 mx-auto text-zinc-400 mb-2" />
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              No assignments linked to this course.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {course.assignments.map((assignment) => {
              const isCompleted = assignment.status === "COMPLETED";
              const formattedDate = new Date(assignment.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={assignment.id}
                  className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-purple-700 dark:text-purple-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <h3
                        className={`text-sm font-bold ${
                          isCompleted
                            ? "line-through text-zinc-400 dark:text-zinc-500"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {assignment.title}
                      </h3>
                      {assignment.description && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {assignment.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0">
                    <span className="font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${
                        assignment.priority === "HIGH"
                          ? "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {assignment.priority}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
