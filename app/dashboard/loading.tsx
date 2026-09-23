import * as React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 space-y-2">
        <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-9 w-3/4 max-w-md bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 h-28 space-y-3">
            <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-8 w-12 bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800 pb-2" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800 pb-2" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
