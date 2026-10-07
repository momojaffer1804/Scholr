import { requireAdmin } from "@/lib/authorization";
import { PageHeader } from "@/components/PageHeader";
import { Mail, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EmailEventsPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="EMAIL & NOTIFICATIONS"
        title="Email Delivery Events"
      />

      <div className="p-10 border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 text-center max-w-xl mx-auto space-y-3">
        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
          Email Infrastructure Placeholder
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          Transactional email events, delivery webhooks, and outbound log monitoring will be integrated in a subsequent phase.
        </p>
        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] font-mono font-bold uppercase text-purple-700 dark:text-purple-400">
          <Clock className="w-3.5 h-3.5" />
          Scheduled for Phase 8
        </div>
      </div>
    </div>
  );
}
