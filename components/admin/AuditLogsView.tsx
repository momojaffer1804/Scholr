"use client";

import * as React from "react";
import { Filter, FileText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getAuditLogs } from "@/lib/actions/audit";

interface AuditLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: string | null;
  createdAt: Date | string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface AuditLogsViewProps {
  initialLogs: AuditLogItem[];
}

export function AuditLogsView({ initialLogs }: AuditLogsViewProps) {
  const [logs, setLogs] = React.useState<AuditLogItem[]>(initialLogs);
  const [actionFilter, setActionFilter] = React.useState<string>("ALL");
  const [entityFilter, setEntityFilter] = React.useState<string>("ALL");
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const handleFilterChange = async (action: string, entity: string) => {
    setActionFilter(action);
    setEntityFilter(entity);
    setIsPending(true);

    try {
      const fetchedLogs = await getAuditLogs(action, entity);
      setLogs(fetchedLogs);
    } catch {
      // Keep existing logs on error
    } finally {
      setIsPending(false);
    }
  };

  const actionOptions = [
    "ALL",
    "USER_CREATED",
    "ROLE_CHANGED",
    "COURSE_CREATED",
    "COURSE_UPDATED",
    "COURSE_DELETED",
    "ASSIGNMENT_CREATED",
    "ASSIGNMENT_UPDATED",
    "ASSIGNMENT_DELETED",
    "ASSIGNMENT_COMPLETED",
    "TASK_CREATED",
    "TASK_UPDATED",
    "TASK_DELETED",
    "TASK_COMPLETED",
  ];

  const entityOptions = ["ALL", "USER", "COURSE", "ASSIGNMENT", "TASK"];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="AUDIT TRAIL"
        title="System Audit Logs"
      />

      {/* Filter Controls */}
      <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100">
          <Filter className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
          Filter Audit Logs:
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label htmlFor="action-filter" className="sr-only">Action Filter</label>
            <select
              id="action-filter"
              value={actionFilter}
              onChange={(e) => handleFilterChange(e.target.value, entityFilter)}
              className="px-2.5 py-1.5 text-xs font-mono border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 cursor-pointer focus:outline-none focus:border-purple-600"
            >
              <option value="ALL">All Actions</option>
              {actionOptions.filter((a) => a !== "ALL").map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="entity-filter" className="sr-only">Entity Filter</label>
            <select
              id="entity-filter"
              value={entityFilter}
              onChange={(e) => handleFilterChange(actionFilter, e.target.value)}
              className="px-2.5 py-1.5 text-xs font-mono border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 cursor-pointer focus:outline-none focus:border-purple-600"
            >
              <option value="ALL">All Entity Types</option>
              {entityOptions.filter((e) => e !== "ALL").map((ent) => (
                <option key={ent} value={ent}>
                  {ent}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      {isPending ? (
        <div className="p-8 text-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 font-mono text-xs text-zinc-500">
          Loading audit entries...
        </div>
      ) : logs.length === 0 ? (
        <div className="p-10 border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 text-center space-y-2">
          <FileText className="w-8 h-8 text-zinc-400 mx-auto" />
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            No audit log entries matching criteria.
          </p>
          <p className="text-xs text-zinc-500">
            Try adjusting your action or entity type filters above.
          </p>
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/80 font-mono text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Actor (User)</th>
                <th className="p-3.5">Entity</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Metadata Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {logs.map((log) => {
                let formattedMeta = "";
                if (log.metadata) {
                  try {
                    const parsed = JSON.parse(log.metadata);
                    formattedMeta = Object.entries(parsed)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" | ");
                  } catch {
                    formattedMeta = log.metadata;
                  }
                }

                return (
                  <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3.5 font-mono">
                      <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">
                      <div>{log.user.name}</div>
                      <div className="text-[11px] font-mono text-zinc-500 font-normal">{log.user.email}</div>
                    </td>
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-zinc-800 dark:text-zinc-200">{log.entityType}</div>
                      {log.entityId && (
                        <div className="text-[10px] text-zinc-400 truncate max-w-[120px]" title={log.entityId}>
                          ID: {log.entityId}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="p-3.5 font-mono text-zinc-600 dark:text-zinc-400 text-[11px]">
                      {formattedMeta || <span className="text-zinc-400 italic">None</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
