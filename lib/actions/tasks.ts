"use server";

import { prisma } from "@/lib/db";
import { getOrCreateDefaultUser } from "@/lib/get-user";
import { revalidatePath } from "next/cache";

export async function getTasks(options?: {
  filter?: "ALL" | "PENDING" | "COMPLETED";
  search?: string;
  priority?: string;
}) {
  const user = await getOrCreateDefaultUser();

  const whereClause: {
    userId: string;
    completed?: boolean;
    priority?: string;
    OR?: Array<{
      title?: { contains: string };
      description?: { contains: string };
    }>;
  } = {
    userId: user.id,
  };

  if (options?.filter === "PENDING") {
    whereClause.completed = false;
  } else if (options?.filter === "COMPLETED") {
    whereClause.completed = true;
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

  return await prisma.task.findMany({
    where: whereClause,
    orderBy: [{ completed: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
  });
}

export async function createTask(data: {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
}) {
  const user = await getOrCreateDefaultUser();

  // Basic Validation
  if (!data.title || data.title.trim() === "") {
    return { error: "Task title is required." };
  }

  let parsedDueDate: Date | null = null;
  if (data.dueDate && data.dueDate.trim() !== "") {
    parsedDueDate = new Date(data.dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return { error: "Invalid due date format." };
    }
  }

  const task = await prisma.task.create({
    data: {
      title: data.title.trim(),
      description: data.description ? data.description.trim() : null,
      dueDate: parsedDueDate,
      priority: (data.priority || "MEDIUM").toUpperCase(),
      completed: false,
      userId: user.id,
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { success: true, task };
}

export async function toggleTaskComplete(id: string) {
  const user = await getOrCreateDefaultUser();

  const existing = await prisma.task.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return { error: "Task not found." };
  }

  const updated = await prisma.task.update({
    where: { id },
    data: { completed: !existing.completed },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { success: true, task: updated };
}

export async function updateTask(
  id: string,
  data: {
    title?: string;
    description?: string;
    dueDate?: string | null;
    priority?: string;
    completed?: boolean;
  }
) {
  const user = await getOrCreateDefaultUser();

  const existing = await prisma.task.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return { error: "Task not found." };
  }

  if (data.title !== undefined && data.title.trim() === "") {
    return { error: "Task title cannot be empty." };
  }

  let parsedDueDate: Date | null | undefined = undefined;
  if (data.dueDate !== undefined) {
    if (data.dueDate === null || data.dueDate.trim() === "") {
      parsedDueDate = null;
    } else {
      parsedDueDate = new Date(data.dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return { error: "Invalid due date format." };
      }
    }
  }

  const updated = await prisma.task.update({
    where: { id },
    data: {
      ...(data.title ? { title: data.title.trim() } : {}),
      ...(data.description !== undefined
        ? { description: data.description ? data.description.trim() : null }
        : {}),
      ...(parsedDueDate !== undefined ? { dueDate: parsedDueDate } : {}),
      ...(data.priority ? { priority: data.priority.toUpperCase() } : {}),
      ...(data.completed !== undefined ? { completed: data.completed } : {}),
    },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { success: true, task: updated };
}

export async function deleteTask(id: string) {
  const user = await getOrCreateDefaultUser();

  const existing = await prisma.task.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return { error: "Task not found." };
  }

  await prisma.task.delete({
    where: { id },
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { success: true };
}
