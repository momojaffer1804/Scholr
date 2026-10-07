"use server";

import { prisma } from "@/lib/db";
import { getOrCreateDefaultUser } from "@/lib/get-user";
import { isSameDay, isOverdue } from "@/lib/utils/date";

export interface NotificationItem {
  id: string;
  type: "OVERDUE" | "DUE_SOON" | "COMPLETED";
  title: string;
  message: string;
  timestamp: Date | string;
  targetUrl: string;
  entityType: "ASSIGNMENT" | "TASK";
  read: boolean;
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const user = await getOrCreateDefaultUser();

  const [assignments, tasks] = await Promise.all([
    prisma.assignment.findMany({
      where: { userId: user.id },
      include: {
        course: { select: { code: true, name: true } },
      },
      orderBy: { dueDate: "asc" },
    }),
    prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  const notifications: NotificationItem[] = [];
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Process Assignments
  assignments.forEach((a) => {
    const isComp = a.status === "COMPLETED";
    const overdue = isOverdue(a.dueDate, isComp);
    const dueToday = isSameDay(a.dueDate, now);
    const dueTomorrow = isSameDay(a.dueDate, tomorrow);

    if (overdue) {
      notifications.push({
        id: `notif-assg-overdue-${a.id}`,
        type: "OVERDUE",
        title: `Overdue Assignment: ${a.title}`,
        message: `${a.course.code} assignment was due on ${new Date(a.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`,
        timestamp: a.dueDate,
        targetUrl: "/assignments",
        entityType: "ASSIGNMENT",
        read: false,
      });
    } else if (!isComp && (dueToday || dueTomorrow)) {
      notifications.push({
        id: `notif-assg-soon-${a.id}`,
        type: "DUE_SOON",
        title: `Upcoming Deadline: ${a.title}`,
        message: `${a.course.code} assignment is due ${dueToday ? "today" : "tomorrow"}`,
        timestamp: a.dueDate,
        targetUrl: "/assignments",
        entityType: "ASSIGNMENT",
        read: false,
      });
    } else if (isComp) {
      notifications.push({
        id: `notif-assg-comp-${a.id}`,
        type: "COMPLETED",
        title: `Assignment Completed: ${a.title}`,
        message: `Submitted for ${a.course.code}`,
        timestamp: a.updatedAt,
        targetUrl: "/assignments",
        entityType: "ASSIGNMENT",
        read: true,
      });
    }
  });

  // Process Tasks
  tasks.forEach((t) => {
    if (!t.dueDate) return;
    const overdue = isOverdue(t.dueDate, t.completed);
    const dueToday = isSameDay(t.dueDate, now);
    const dueTomorrow = isSameDay(t.dueDate, tomorrow);

    if (overdue) {
      notifications.push({
        id: `notif-task-overdue-${t.id}`,
        type: "OVERDUE",
        title: `Overdue Task: ${t.title}`,
        message: `Task passed deadline on ${new Date(t.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`,
        timestamp: t.dueDate,
        targetUrl: "/tasks",
        entityType: "TASK",
        read: false,
      });
    } else if (!t.completed && (dueToday || dueTomorrow)) {
      notifications.push({
        id: `notif-task-soon-${t.id}`,
        type: "DUE_SOON",
        title: `Task Due ${dueToday ? "Today" : "Tomorrow"}: ${t.title}`,
        message: `Action required by end of ${dueToday ? "today" : "tomorrow"}`,
        timestamp: t.dueDate,
        targetUrl: "/tasks",
        entityType: "TASK",
        read: false,
      });
    } else if (t.completed) {
      notifications.push({
        id: `notif-task-comp-${t.id}`,
        type: "COMPLETED",
        title: `Task Marked Done: ${t.title}`,
        message: `Completed task`,
        timestamp: t.updatedAt,
        targetUrl: "/tasks",
        entityType: "TASK",
        read: true,
      });
    }
  });

  // Sort by priority (Overdue first, then Due Soon, then Completed)
  notifications.sort((a, b) => {
    const priority = { OVERDUE: 0, DUE_SOON: 1, COMPLETED: 2 };
    return priority[a.type] - priority[b.type];
  });

  return notifications;
}
