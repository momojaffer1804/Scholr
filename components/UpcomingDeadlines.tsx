import * as React from "react";
import Link from "next/link";
import { Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatDateHuman } from "@/lib/utils/date";

export interface UpcomingItem {
  id: string;
  title: string;
  type: "ASSIGNMENT" | "TASK";
  dueDate: Date | string;
  priority: string;
  status: string; // PENDING, COMPLETED, OVERDUE
  courseCode?: string;
}

interface UpcomingDeadlinesProps {
  items: UpcomingItem[];
  limit?: number;
}

export function UpcomingDeadlines({ items, limit = 4 }: UpcomingDeadlinesProps) {
  const displayItems = items.slice(0, limit);

  return (
    <section aria-label="Upcoming Deadlines" className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-700 dark:bg-purple-500 inline-block" />
          UPCOMING DEADLINES
        </h2>
        <Link
          href="/calendar"
          className="text-xs font-mono text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1"
        >
          View Calendar →
        </Link>
      </div>

      {displayItems.length === 0 ? (
        <div className="p-6 border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            No upcoming deadlines scheduled.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {displayItems.map((item) => {
            const isCompleted = item.status === "COMPLETED";
            const isOverdue = item.status === "OVERDUE";

            return (
              <div
                key={item.id}
                className="p-3.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : isOverdue ? (
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                    )}
                  </div>

                  <div>
                    {item.courseCode && (
                      <span className="text-[9px] font-mono font-bold uppercase text-purple-700 dark:text-purple-400 block mb-0.5">
                        {item.courseCode}
                      </span>
                    )}
                    <h3
                      className={`text-xs font-bold ${
                        isCompleted ? "line-through text-zinc-400" : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDateHuman(item.dueDate)}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
                      isOverdue
                        ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300"
                        : item.priority === "HIGH"
                        ? "border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {isOverdue ? "OVERDUE" : item.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
