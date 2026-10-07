"use client";

import * as React from "react";
import { Shield, User, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { updateUserRole } from "@/lib/actions/admin";
import { useToastStore } from "@/lib/store/useToastStore";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date | string;
  _count: {
    courses: number;
    assignments: number;
    tasks: number;
  };
}

interface UserManagementViewProps {
  initialUsers: UserItem[];
  currentUserId: string;
}

export function UserManagementView({ initialUsers, currentUserId }: UserManagementViewProps) {
  const [users, setUsers] = React.useState<UserItem[]>(initialUsers);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);
  const { addToast } = useToastStore();

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "STUDENT" : "ADMIN";
    setLoadingId(userId);

    // Optimistic update
    const previousUsers = [...users];
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    try {
      const res = await updateUserRole(userId, newRole);
      if (!res.success) {
        setUsers(previousUsers);
        addToast(res.error || "Failed to update user role", "error");
      } else {
        addToast(`Role updated to ${newRole}`, "success");
      }
    } catch {
      setUsers(previousUsers);
      addToast("Failed to update user role", "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="USER MANAGEMENT"
        title="Accounts & Privileges"
      />

      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/80 font-mono text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-wider">
              <th className="p-3.5">User</th>
              <th className="p-3.5">Email</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Registered</th>
              <th className="p-3.5 text-center">Resources</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              const isLoading = loadingId === u.id;

              return (
                <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-mono font-bold shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        {u.name}
                        {isSelf && (
                          <span className="ml-2 text-[9px] font-mono px-1 py-0.2 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 uppercase">
                            YOU
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-zinc-600 dark:text-zinc-400">{u.email}</td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${
                        u.role === "ADMIN"
                          ? "border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-400"
                      }`}
                    >
                      {u.role === "ADMIN" ? (
                        <Shield className="w-3 h-3 text-purple-700 dark:text-purple-400" />
                      ) : (
                        <User className="w-3 h-3 text-zinc-500" />
                      )}
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-zinc-500 dark:text-zinc-400">
                    {new Date(u.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3.5 text-center font-mono text-zinc-500 dark:text-zinc-400">
                    <span title="Courses / Assignments / Tasks">
                      {u._count.courses}C / {u._count.assignments}A / {u._count.tasks}T
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      disabled={isLoading || isSelf}
                      onClick={() => handleRoleToggle(u.id, u.role)}
                      className={`px-2.5 py-1 text-[11px] font-mono font-bold border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        u.role === "ADMIN"
                          ? "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          : "border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300"
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin inline" />
                      ) : u.role === "ADMIN" ? (
                        "Demote to Student"
                      ) : (
                        "Promote to Admin"
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
