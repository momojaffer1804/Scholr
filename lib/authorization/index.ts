import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function getCurrentAuthenticatedUser() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return dbUser;
}

export async function requireUser() {
  const user = await getCurrentAuthenticatedUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden: Administrator privileges required.");
  }
  return user;
}

export function isAdminUser(role?: string) {
  return role === "ADMIN";
}

export function assertOwnership(resourceUserId: string, currentUserId: string) {
  if (resourceUserId !== currentUserId) {
    throw new Error("Unauthorized: Access to this user resource is denied.");
  }
}
