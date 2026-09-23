import * as React from "react";

export interface Course {
  id: string;
  code: string;
  name: string;
  progress: number;
}

const defaultCourses: Course[] = [
  {
    id: "dbms",
    code: "DBMS",
    name: "Database Management Systems",
    progress: 78,
  },
  {
    id: "ml",
    code: "ML",
    name: "Machine Learning",
    progress: 64,
  },
  {
    id: "cn",
    code: "CN",
    name: "Computer Networks",
    progress: 52,
  },
];

interface CourseProgressProps {
  courses?: Course[];
}

export function CourseProgress({ courses = defaultCourses }: CourseProgressProps) {
  return (
    <section aria-label="Current Courses Progress" className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
          CURRENT COURSES
        </h2>
        <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
          {courses.length} MODULES
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold tracking-widest font-mono text-purple-700 dark:text-purple-400 uppercase block mb-1">
                  {course.code}
                </span>
                <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {course.name}
                </h3>
              </div>
              <span className="font-mono text-base font-bold text-zinc-900 dark:text-zinc-50 ml-4">
                {course.progress}%
              </span>
            </div>

            {/* Simple progress bar */}
            <div
              className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-zinc-200 dark:border-zinc-700/60"
              role="progressbar"
              aria-valuenow={course.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${course.name} progress: ${course.progress}%`}
            >
              <div
                className="h-full bg-purple-700 dark:bg-purple-500 transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
