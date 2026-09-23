import * as React from "react";

export default function CoursesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 space-y-2">
        <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="h-9 w-full max-w-md bg-zinc-200 dark:bg-zinc-800" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 h-44 space-y-3">
            <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
