import * as React from "react";
import { PageHeader } from "@/components/PageHeader";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="PREFERENCES"
        title="Settings"
        description="Configure workspace appearance and application preferences."
      />

      <div className="max-w-xl space-y-6">
        <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            APPEARANCE & THEME
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Toggle between light and dark editorial interface modes.
          </p>
          <div className="max-w-xs">
            <ThemeToggle />
          </div>
        </div>

        <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 opacity-60">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-2">
            PROFILE & NOTIFICATIONS
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            [DISABLED IN CURRENT PHASE]
          </p>
        </div>
      </div>
    </div>
  );
}
