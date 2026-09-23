"use client";

import * as React from "react";
import { useToastStore } from "@/lib/store/useToastStore";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-3.5 border shadow-lg flex items-start justify-between gap-3 text-xs font-medium transition-all ${
            toast.type === "error"
              ? "bg-red-50 dark:bg-red-950/90 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200"
              : toast.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : "bg-purple-50 dark:bg-purple-950/90 border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-200"
          }`}
          role="alert"
        >
          <div className="flex items-start gap-2.5">
            {toast.type === "error" && <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            {toast.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
            {toast.type === "info" && <Info className="w-4 h-4 shrink-0 mt-0.5" />}
            <span className="leading-snug">{toast.message}</span>
          </div>

          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="p-0.5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
