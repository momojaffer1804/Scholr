"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 max-w-xl mx-auto my-12 space-y-4">
      <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
        <AlertCircle className="w-6 h-6 shrink-0" />
        <h2 className="font-serif text-xl font-bold">Admin Access Error</h2>
      </div>
      <p className="text-xs text-zinc-700 dark:text-zinc-300 font-mono">
        {error.message || "An error occurred while rendering the admin interface."}
      </p>
      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-xs font-mono font-bold uppercase cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1 uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
