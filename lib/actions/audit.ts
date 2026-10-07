"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/authorization";

export interface LogAuditEventParams {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | string | null;
}

export async function logAuditEvent({
  userId,
  action,
  entityType,
  entityId = null,
  metadata = null,
}: LogAuditEventParams) {
  try {
    const metaString =
      typeof metadata === "object" && metadata !== null
        ? JSON.stringify(metadata)
        : metadata;

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId: entityId ?? null,
        metadata: metaString ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to log audit event:", error);
    // Silent fail for non-blocking audit recording
  }
}

export async function getAuditLogs(filterAction?: string, filterEntityType?: string) {
  await requireAdmin();

  const whereClause: {
    action?: string;
    entityType?: string;
  } = {};

  if (filterAction && filterAction.trim() !== "" && filterAction !== "ALL") {
    whereClause.action = filterAction.trim();
  }

  if (filterEntityType && filterEntityType.trim() !== "" && filterEntityType !== "ALL") {
    whereClause.entityType = filterEntityType.trim();
  }

  const logs = await prisma.auditLog.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return logs;
}
