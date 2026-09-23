"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/authorization";
import { isOverdue } from "@/lib/utils/date";

export interface CalendarEventItem {
  id: string;
  title: string;
  type: "ASSIGNMENT" | "TASK";
  dueDate: Date;
  priority: string;
  status: string; // PENDING, COMPLETED, OVERDUE
  courseCode?: string;
  courseName?: string;
  description?: string | null;
  originalId: string;
}

export async function getCalendarEvents() {
  const user = await requireUser();

  const assignments = await prisma.assignment.findMany({
    where: { userId: user.id },
    include: {
      course: { select: { code: true, name: true } },
    },
    orderBy: { dueDate: "asc" },
  });

  const tasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      dueDate: { not: null },
    },
    orderBy: { dueDate: "asc" },
  });

  const events: CalendarEventItem[] = [];

  // Map Assignments
  assignments.forEach((a) => {
    const isCompleted = a.status === "COMPLETED";
    const overdue = isOverdue(a.dueDate, isCompleted);
    const statusLabel = isCompleted ? "COMPLETED" : overdue ? "OVERDUE" : "PENDING";

    events.push({
      id: `assignment-${a.id}`,
      originalId: a.id,
      title: a.title,
      type: "ASSIGNMENT",
      dueDate: a.dueDate,
      priority: a.priority,
      status: statusLabel,
      courseCode: a.course.code,
      courseName: a.course.name,
      description: a.description,
    });
  });

  // Map Tasks
  tasks.forEach((t) => {
    if (!t.dueDate) return;
    const overdue = isOverdue(t.dueDate, t.completed);
    const statusLabel = t.completed ? "COMPLETED" : overdue ? "OVERDUE" : "PENDING";

    events.push({
      id: `task-${t.id}`,
      originalId: t.id,
      title: t.title,
      type: "TASK",
      dueDate: t.dueDate,
      priority: t.priority,
      status: statusLabel,
      description: t.description,
    });
  });

  return events;
}
