import { getAdminUsers } from "@/lib/actions/admin";
import { getCurrentAuthenticatedUser } from "@/lib/authorization";
import { UserManagementView } from "@/components/admin/UserManagementView";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  const currentUser = await getCurrentAuthenticatedUser();

  return (
    <UserManagementView
      initialUsers={users}
      currentUserId={currentUser?.id || ""}
    />
  );
}
