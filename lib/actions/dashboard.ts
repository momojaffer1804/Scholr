"use server";

import { prisma } from "@/lib/db";
import { getOrCreateDefaultUser } from "@/lib/get-user";

export async function getDashboardData() {
  const user = await getOrCreateDefaultUser();

  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const threeDaysFromNow = new Date(endOfToday);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  // Active Courses
  const courses = await prisma.course.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // Today's & Overdue Tasks
  const todayTasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      completed: false,
      OR: [
        { dueDate: null },
        { dueDate: { lte: endOfToday } },
      ],
    },
    take: 5,
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
  });

  // Assignments Due Soon (Pending, due within 3 days or overdue)
  const assignmentsDueSoon = await prisma.assignment.findMany({
    where: {
      userId: user.id,
      status: "PENDING",
      dueDate: { lte: threeDaysFromNow },
    },
    include: {
      course: {
        select: { code: true, name: true },
      },
    },
    take: 4,
    orderBy: { dueDate: "asc" },
  });

  // Counts for Stats
  const activeCoursesCount = courses.length;
  const pendingAssignmentsCount = await prisma.assignment.count({
    where: { userId: user.id, status: "PENDING" },
  });
  const completedAssignmentsCount = await prisma.assignment.count({
    where: { userId: user.id, status: "COMPLETED" },
  });

  // Upcoming Assignments (next up)
  const upcomingAssignments = await prisma.assignment.findMany({
    where: {
      userId: user.id,
      status: "PENDING",
      dueDate: { gt: endOfToday },
    },
    include: {
      course: {
        select: { code: true, name: true },
      },
    },
    take: 3,
    orderBy: { dueDate: "asc" },
  });

  return {
    user,
    courses,
    todayTasks,
    assignmentsDueSoon,
    upcomingAssignments,
    stats: {
      activeCourses: activeCoursesCount,
      pendingAssignments: pendingAssignmentsCount,
      completedAssignments: completedAssignmentsCount,
    },
  };
}
