"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  ListTodo,
  Calendar,
  BarChart2,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Assignments", href: "/assignments", icon: CheckSquare },
  { name: "Tasks", href: "/tasks", icon: ListTodo },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
];

interface AppSidebarProps {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // If on login/signup page, don't show full sidebar layout
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const isActive = (path: string) => {
    if (path === "/dashboard" && (pathname === "/" || pathname === "/dashboard")) {
      return true;
    }
    if (path !== "/dashboard" && pathname.startsWith(path)) {
      return true;
    }
    return pathname === path;
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  if (isAuthPage) {
    return null;
  }

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#fcfbf9] dark:bg-[#121214] border-b border-zinc-200 dark:border-zinc-800">
        <Link
          href="/dashboard"
          onClick={closeMobile}
          className="font-serif text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          SCHOLR
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          className="p-2 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Persistent Left Sidebar */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#fcfbf9] dark:bg-[#121214] border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between transition-transform duration-200 ease-in-out
          md:translate-x-0 md:static md:z-auto md:min-h-screen shrink-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6 flex flex-col h-full justify-between overflow-y-auto">
          <div>
            {/* Branding / Header */}
            <div className="mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800 flex items-baseline justify-between">
              <Link
                href="/dashboard"
                onClick={closeMobile}
                className="font-serif text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 hover:opacity-90 transition-opacity"
              >
                SCHOLR
              </Link>
              <span className="text-[10px] uppercase font-mono tracking-widest text-purple-700 dark:text-purple-400 font-bold px-1.5 py-0.5 border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/40">
                WORKSPACE
              </span>
            </div>

            {/* Primary Navigation */}
            <nav className="space-y-1.5" aria-label="Main Navigation">
              {navItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobile}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors border
                      ${
                        active
                          ? "bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-800/80 border-l-4 border-l-purple-700 dark:border-l-purple-500"
                          : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-800"
                      }
                    `}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        active ? "text-purple-700 dark:text-purple-400" : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Secondary Footer / User Menu & Settings & Theme Toggle */}
          <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            {user && <UserMenu user={user} />}

            <nav aria-label="Settings Navigation">
              {(() => {
                const active = isActive("/settings");
                return (
                  <Link
                    href="/settings"
                    onClick={closeMobile}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors border
                      ${
                        active
                          ? "bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-800/80 border-l-4 border-l-purple-700 dark:border-l-purple-500"
                          : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-800"
                      }
                    `}
                  >
                    <Settings
                      className={`w-4 h-4 ${
                        active ? "text-purple-700 dark:text-purple-400" : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    />
                    <span>Settings</span>
                  </Link>
                );
              })()}
            </nav>

            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
