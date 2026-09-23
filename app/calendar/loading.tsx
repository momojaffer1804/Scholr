import * as React from "react";

export default function CalendarLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 space-y-2">
        <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-8 w-56 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="h-14 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40" />

      <div className="h-96 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40" />
    </div>
  );
}
