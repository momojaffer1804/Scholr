"use server";

import { prisma } from "@/lib/db";
import { getOrCreateDefaultUser } from "@/lib/get-user";
import { revalidatePath } from "next/cache";

export async function getAssignments(options?: {
  status?: string;
  courseId?: string;
  priority?: string;
  search?: string;
  sortBy?: "dueDate" | "priority";
}) {
  const user = await getOrCreateDefaultUser();

  const whereClause: {
    userId: string;
    status?: string;
    courseId?: string;
    priority?: string;
    OR?: Array<{
      title?: { contains: string };
      description?: { contains: string };
    }>;
  } = {
    userId: user.id,
  };

  if (options?.status && options.status !== "ALL") {
    whereClause.status = options.status;
  }

  if (options?.courseId && options.courseId !== "ALL") {
    whereClause.courseId = options.courseId;
  }

  if (options?.priority && options.priority !== "ALL") {
    whereClause.priority = options.priority;
  }

  if (options?.search && options.search.trim() !== "") {
    const q = options.search.trim();
    whereClause.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }

  let orderBy: Record<string, "asc" | "desc"> | Array<Record<string, "asc" | "desc">> = {
    dueDate: "asc",
  };

  if (options?.sortBy === "priority") {
    orderBy = [{ priority: "desc" }, { dueDate: "asc" }];
  }

  return await prisma.assignment.findMany({
    where: whereClause,
    include: {
      course: {
        select: { id: true, code: true, name: true },
      },
    },
    orderBy,
  });
}

export async function createAssignment(data: {
  title: string;
  description?: string;
  courseId: string;
  dueDate: string;
  priority: string;
}) {
  const user = await getOrCreateDefaultUser();

  // Basic Validation
  if (!data.title || data.title.trim() === "") {
    return { error: "Assignment title is required." };
  }
  if (!data.courseId || data.courseId.trim() === "") {
    return { error: "Course selection is required." };
  }
  if (!data.dueDate || data.dueDate.trim() === "") {
    return { error: "Due date is required." };
  }

  const parsedDueDate = new Date(data.dueDate);
  if (isNaN(parsedDueDate.getTime())) {
    return { error: "Invalid due date format." };
  }

  // Verify course belongs to user
  const course = await prisma.course.findFirst({
    where: { id: data.courseId, userId: user.id },
  });

  if (!course) {
    return { error: "Selected course does not exist." };
  }

  const assignment = await prisma.assignment.create({
    data: {
      title: data.title.trim(),
      description: data.description ? data.description.trim() : null,
      courseId: data.courseId,
      userId: user.id,
      dueDate: parsedDueDate,
      priority: (data.priority || "MEDIUM").toUpperCase(),
      status: "PENDING",
    },
    include: {
      course: {
        select: { id: true, code: true, name: true },
      },
    },
  });

  revalidatePath("/assignments");
  revalidatePath(`/courses/${data.courseId}`);
  revalidatePath("/dashboard");
  return { success: true, assignment };
}

export async function toggleAssignmentStatus(id: string) {
  const user = await getOrCreateDefaultUser();

  const existing = await prisma.assignment.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return { error: "Assignment not found." };
  }

  const newStatus = existing.status === "COMPLETED" ? "PENDING" : "COMPLETED";

  const updated = await prisma.assignment.update({
    where: { id },
    data: { status: newStatus },
    include: {
      course: {
        select: { id: true, code: true, name: true },
      },
    },
  });

  revalidatePath("/assignments");
  revalidatePath(`/courses/${existing.courseId}`);
  revalidatePath("/dashboard");
  return { success: true, assignment: updated };
}

export async function updateAssignment(
  id: string,
  data: {
    title?: string;
    description?: string;
    courseId?: string;
    dueDate?: string;
    priority?: string;
    status?: string;
  }
) {
  const user = await getOrCreateDefaultUser();

  const existing = await prisma.assignment.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return { error: "Assignment not found." };
  }

  if (data.title !== undefined && data.title.trim() === "") {
    return { error: "Assignment title cannot be empty." };
  }

  let parsedDueDate: Date | undefined;
  if (data.dueDate) {
    parsedDueDate = new Date(data.dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return { error: "Invalid due date format." };
    }
  }

  const updated = await prisma.assignment.update({
    where: { id },
    data: {
      ...(data.title ? { title: data.title.trim() } : {}),
      ...(data.description !== undefined
        ? { description: data.description ? data.description.trim() : null }
        : {}),
      ...(data.courseId ? { courseId: data.courseId } : {}),
      ...(parsedDueDate ? { dueDate: parsedDueDate } : {}),
      ...(data.priority ? { priority: data.priority.toUpperCase() } : {}),
      ...(data.status ? { status: data.status.toUpperCase() } : {}),
    },
    include: {
      course: {
        select: { id: true, code: true, name: true },
      },
    },
  });

  revalidatePath("/assignments");
  revalidatePath(`/courses/${existing.courseId}`);
  if (data.courseId && data.courseId !== existing.courseId) {
    revalidatePath(`/courses/${data.courseId}`);
  }
  revalidatePath("/dashboard");
  return { success: true, assignment: updated };
}

export async function deleteAssignment(id: string) {
  const user = await getOrCreateDefaultUser();

  const existing = await prisma.assignment.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return { error: "Assignment not found." };
  }

  await prisma.assignment.delete({
    where: { id },
  });

  revalidatePath("/assignments");
  revalidatePath(`/courses/${existing.courseId}`);
  revalidatePath("/dashboard");
  return { success: true };
}
