"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle color theme"
        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold tracking-wider uppercase border border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-white/50 dark:bg-zinc-900/50 cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Sun className="w-3.5 h-3.5" />
          Theme
        </span>
        <span className="text-[10px] font-mono opacity-60">MODE</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold tracking-wider uppercase border border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-600 dark:focus:ring-purple-400"
    >
      <span className="flex items-center gap-2">
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-purple-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-purple-700" />
        )}
        <span>{isDark ? "Dark Mode" : "Light Mode"}</span>
      </span>
      <span className="text-[10px] font-mono text-purple-700 dark:text-purple-400">
        [{isDark ? "DARK" : "LIGHT"}]
      </span>
    </button>
  );
}
