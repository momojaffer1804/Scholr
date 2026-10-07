"use client";

import * as React from "react";
import Link from "next/link";
import { Users, BookOpen, CheckSquare, ListTodo, ShieldCheck, ArrowRight, History } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

interface AdminDashboardViewProps {
  stats: {
    totalUsers: number;
    totalCourses: number;
    totalAssignments: number;
    totalTasks: number;
  };
  recentAuditLogs: Array<{
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    createdAt: Date | string;
    user: {
      name: string;
      email: string;
      role: string;
    };
  }>;
}

export function AdminDashboardView({ stats, recentAuditLogs }: AdminDashboardViewProps) {
  const statCards = [
    { label: "Total Registered Users", value: stats.totalUsers, icon: Users, href: "/admin/users" },
    { label: "Total Active Courses", value: stats.totalCourses, icon: BookOpen, href: "/courses" },
    { label: "Total Assignments", value: stats.totalAssignments, icon: CheckSquare, href: "/assignments" },
    { label: "Total User Tasks", value: stats.totalTasks, icon: ListTodo, href: "/tasks" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="SYSTEM ADMINISTRATION"
        title="Scholr Control Center"
      />

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{card.label}</span>
                <Icon className="w-4 h-4 text-purple-700 dark:text-purple-400" />
              </div>
              <div className="font-mono text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/users"
          className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-purple-300 dark:hover:border-purple-800 transition-colors group flex items-center justify-between"
        >
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-700 dark:text-purple-400" />
              User Management
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Manage accounts, view user roles, and elevate privileges.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors shrink-0 ml-4" />
        </Link>

        <Link
          href="/admin/audit-logs"
          className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-purple-300 dark:hover:border-purple-800 transition-colors group flex items-center justify-between"
        >
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-700 dark:text-purple-400" />
              System Audit Logs
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Track entity creations, modifications, role switches, and deletions.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors shrink-0 ml-4" />
        </Link>
      </div>

      {/* Recent Audit Activity Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
            RECENT AUDIT ACTIVITY
          </h2>
          <Link
            href="/admin/audit-logs"
            className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1 uppercase"
          >
            View all logs
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentAuditLogs.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40">
            <p className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400">
              No audit logs recorded yet.
            </p>
          </div>
        ) : (
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 divide-y divide-zinc-200 dark:divide-zinc-800">
            {recentAuditLogs.map((log) => (
              <div key={log.id} className="p-3.5 flex items-center justify-between text-xs gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 shrink-0">
                    {log.action}
                  </span>
                  <div className="truncate">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{log.user.name}</span>
                    <span className="text-zinc-500 dark:text-zinc-400 ml-1">({log.user.email})</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 shrink-0">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
