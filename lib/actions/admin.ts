"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/authorization";
import { logAuditEvent } from "@/lib/actions/audit";
import { revalidatePath } from "next/cache";

export async function getAdminStats() {
  const admin = await requireAdmin();

  const [totalUsers, totalCourses, totalAssignments, totalTasks, recentAuditLogs] =
    await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.assignment.count(),
      prisma.task.count(),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
    ]);

  return {
    admin,
    stats: {
      totalUsers,
      totalCourses,
      totalAssignments,
      totalTasks,
    },
    recentAuditLogs,
  };
}

export async function getAdminUsers() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          courses: true,
          assignments: true,
          tasks: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
}

export async function updateUserRole(userId: string, newRole: "STUDENT" | "ADMIN") {
  const adminUser = await requireAdmin();

  if (!userId) {
    return { success: false, error: "User ID is required." };
  }

  if (newRole !== "STUDENT" && newRole !== "ADMIN") {
    return { success: false, error: "Invalid role specified." };
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });

  if (!targetUser) {
    return { success: false, error: "Target user not found." };
  }

  const previousRole = targetUser.role;

  if (previousRole === newRole) {
    return { success: true };
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  // Log audit event for role change
  await logAuditEvent({
    userId: adminUser.id,
    action: "ROLE_CHANGED",
    entityType: "USER",
    entityId: userId,
    metadata: {
      targetEmail: targetUser.email,
      previousRole,
      newRole,
    },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin/audit-logs");
  revalidatePath("/admin");

  return { success: true, user: updatedUser };
}
