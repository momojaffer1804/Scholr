"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AssignmentsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Assignments error caught:", error);
  }, [error]);

  return (
    <div className="p-8 border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/30 max-w-xl mx-auto my-12 text-center space-y-4">
      <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto" />
      <div>
        <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Unable to Load Assignments
        </h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
          An error occurred while loading your assignment tasks. Please try again.
        </p>
      </div>

      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500 text-white transition-colors cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Try Again
      </button>
    </div>
  );
}
