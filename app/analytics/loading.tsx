import * as React from "react";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 space-y-2">
        <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-8 w-56 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 h-24" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 h-64" />
        <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 h-64" />
      </div>
    </div>
  );
}
