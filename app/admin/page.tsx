import { getAdminStats } from "@/lib/actions/admin";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { stats, recentAuditLogs } = await getAdminStats();

  return <AdminDashboardView stats={stats} recentAuditLogs={recentAuditLogs} />;
}
