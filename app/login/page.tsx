"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, ArrowRight } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    const res = await loginAction({ email, password });
    setIsSubmitting(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Editorial Brand Header */}
        <div className="text-center">
          <Link href="/login" className="font-serif text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            SCHOLR
          </Link>
          <p className="mt-2 text-xs font-mono uppercase tracking-widest text-purple-700 dark:text-purple-400 font-bold">
            ACADEMIC WORKSPACE LOG IN
          </p>
        </div>

        {/* Card Form Container */}
        <div className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-none">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 text-red-700 dark:text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="alex@scholr.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-purple-600 dark:focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-purple-600 dark:focus:ring-purple-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-500 text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {isSubmitting ? "Authenticating..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/signup"
                className="font-bold text-purple-700 dark:text-purple-400 hover:underline inline-flex items-center gap-0.5"
              >
                Sign up
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>

        {/* Quick Demo Hint */}
        <div className="p-3 border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/30 text-center text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
          Demo Student: <span className="font-bold text-zinc-700 dark:text-zinc-300">alex@scholr.edu</span> / <span className="font-bold text-zinc-700 dark:text-zinc-300">password123</span>
        </div>
      </div>
    </div>
  );
}
