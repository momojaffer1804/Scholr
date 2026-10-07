import { getAuditLogs } from "@/lib/actions/audit";
import { AuditLogsView } from "@/components/admin/AuditLogsView";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const initialLogs = await getAuditLogs();

  return <AuditLogsView initialLogs={initialLogs} />;
}
