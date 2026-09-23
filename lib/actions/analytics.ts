"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/authorization";
import { isOverdue } from "@/lib/utils/date";

export interface AnalyticsSummary {
  totalCourses: number;
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  overdueAssignments: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  assignmentCompletionRate: number;
  taskCompletionRate: number;
  courseProgressList: Array<{
    id: string;
    code: string;
    name: string;
    instructor: string;
    calculatedProgress: number;
    totalAssignments: number;
    completedAssignments: number;
  }>;
}

export async function getAcademicAnalytics(): Promise<AnalyticsSummary> {
  const user = await requireUser();

  const courses = await prisma.course.findMany({
    where: { userId: user.id },
    include: {
      assignments: true,
    },
  });

  const assignments = await prisma.assignment.findMany({
    where: { userId: user.id },
  });

  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
  });

  const totalCourses = courses.length;
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter((a) => a.status === "COMPLETED").length;
  
  let overdueAssignments = 0;
  let pendingAssignments = 0;

  assignments.forEach((a) => {
    if (a.status === "COMPLETED") return;
    if (isOverdue(a.dueDate, false)) {
      overdueAssignments++;
    } else {
      pendingAssignments++;
    }
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const assignmentCompletionRate =
    totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  const taskCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate course-level progress based on associated assignment completions or manual progress
  const courseProgressList = courses.map((c) => {
    const courseAssignments = c.assignments;
    const courseTotalAssg = courseAssignments.length;
    const courseCompletedAssg = courseAssignments.filter((a) => a.status === "COMPLETED").length;

    let calcProgress = c.progress;
    if (courseTotalAssg > 0) {
      calcProgress = Math.round((courseCompletedAssg / courseTotalAssg) * 100);
    }

    return {
      id: c.id,
      code: c.code,
      name: c.name,
      instructor: c.instructor,
      calculatedProgress: calcProgress,
      totalAssignments: courseTotalAssg,
      completedAssignments: courseCompletedAssg,
    };
  });

  return {
    totalCourses,
    totalAssignments,
    completedAssignments,
    pendingAssignments,
    overdueAssignments,
    totalTasks,
    completedTasks,
    pendingTasks,
    assignmentCompletionRate,
    taskCompletionRate,
    courseProgressList,
  };
}
