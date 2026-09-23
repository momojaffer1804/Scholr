"use client";

import * as React from "react";
import { LogOut, User as UserIcon, Shield } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export function UserMenu({ user }: UserMenuProps) {
  if (!user) {
    return null;
  }

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300">
            {isAdmin ? <Shield className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" /> : <UserIcon className="w-3.5 h-3.5 text-zinc-500" />}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {user.name}
            </p>
            <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
              {user.email}
            </p>
          </div>
        </div>

        <span
          className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
            isAdmin
              ? "border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300"
              : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400"
          }`}
        >
          {user.role}
        </span>
      </div>

      <form action={logoutAction}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900 transition-colors cursor-pointer"
        >
          <LogOut className="w-3 h-3" />
          Log Out
        </button>
      </form>
    </div>
  );
}
