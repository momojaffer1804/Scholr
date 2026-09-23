import * as React from "react";

interface StatItem {
  label: string;
  value: number | string;
  subtitle?: string;
}

const defaultStats: StatItem[] = [
  { label: "Active Courses", value: 3, subtitle: "Current Term" },
  { label: "Pending Assignments", value: 7, subtitle: "Action Required" },
  { label: "Completed Assignments", value: 14, subtitle: "This Semester" },
];

interface DashboardStatsProps {
  stats?: StatItem[];
}

export function DashboardStats({ stats = defaultStats }: DashboardStatsProps) {
  return (
    <section aria-label="Academic Summary Statistics" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 transition-colors"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
            {stat.label}
          </span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              {stat.value}
            </span>
            {stat.subtitle && (
              <span className="text-[10px] font-mono tracking-wider text-purple-700 dark:text-purple-400 uppercase font-semibold">
                {stat.subtitle}
              </span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
