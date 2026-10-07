"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, CheckCheck, Clock, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { NotificationItem, getNotifications } from "@/lib/actions/notifications";

export function NotificationMenu() {
  const [open, setOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [readIds, setReadIds] = React.useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = localStorage.getItem("scholr_read_notifications");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const fetchNotifs = React.useCallback(async () => {
    setLoading(true);
    try {
      const items = await getNotifications();
      setNotifications(items);
    } catch {
      // Ignore fetch error
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    let active = true;
    React.startTransition(() => {
      getNotifications().then((items) => {
        if (active) {
          setNotifications(items);
        }
      }).catch(() => {});
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleOpen = () => {
    if (!open) {
      fetchNotifs();
    }
    setOpen(!open);
  };

  const markAsRead = (id: string) => {
    const updated = new Set(readIds);
    updated.add(id);
    setReadIds(updated);
    try {
      localStorage.setItem("scholr_read_notifications", JSON.stringify(Array.from(updated)));
    } catch {
      // Ignore storage error
    }
  };

  const markAllAsRead = () => {
    const updated = new Set(readIds);
    notifications.forEach((n) => updated.add(n.id));
    setReadIds(updated);
    try {
      localStorage.setItem("scholr_read_notifications", JSON.stringify(Array.from(updated)));
    } catch {
      // Ignore storage error
    }
  };

  const unreadCount = notifications.filter((n) => !n.read && !readIds.has(n.id)).length;

  return (
    <div className="relative inline-block text-left">
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={open}
        className="relative p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-600 shrink-0"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 text-[9px] font-mono font-bold text-white bg-purple-700 dark:bg-purple-600 border border-white dark:border-zinc-900 shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-0 text-xs">
            {/* Header */}
            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/80">
              <div className="flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  NOTIFICATIONS ({unreadCount})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[10px] font-mono font-bold uppercase text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Read all
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close notifications panel"
                  className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading && notifications.length === 0 ? (
                <div className="p-6 text-center font-mono text-xs text-zinc-500">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center font-mono text-xs text-zinc-500">
                  No academic notifications right now.
                </div>
              ) : (
                notifications.map((n) => {
                  const isRead = n.read || readIds.has(n.id);

                  return (
                    <div
                      key={n.id}
                      className={`p-3.5 flex items-start gap-3 transition-colors ${
                        isRead
                          ? "bg-white dark:bg-zinc-900/40 opacity-75"
                          : "bg-purple-50/40 dark:bg-purple-950/20"
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {n.type === "OVERDUE" ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        ) : n.type === "DUE_SOON" ? (
                          <Clock className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={n.targetUrl}
                            onClick={() => {
                              markAsRead(n.id);
                              setOpen(false);
                            }}
                            className="font-bold text-zinc-900 dark:text-zinc-100 hover:underline hover:text-purple-700 dark:hover:text-purple-400 leading-tight"
                          >
                            {n.title}
                          </Link>
                          {!isRead && (
                            <button
                              type="button"
                              onClick={() => markAsRead(n.id)}
                              title="Mark as read"
                              className="text-[10px] font-mono text-zinc-400 hover:text-purple-700 dark:hover:text-purple-400 cursor-pointer shrink-0"
                            >
                              Dismiss
                            </button>
                          )}
                        </div>

                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
