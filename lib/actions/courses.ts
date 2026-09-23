"use server";

import { prisma } from "@/lib/db";
import { getOrCreateDefaultUser } from "@/lib/get-user";
import { revalidatePath } from "next/cache";

export async function getCourses(searchQuery?: string) {
  const user = await getOrCreateDefaultUser();

  const whereClause: {
    userId: string;
    OR?: Array<{
      code?: { contains: string };
      name?: { contains: string };
      instructor?: { contains: string };
    }>;
  } = {
    userId: user.id,
  };

  if (searchQuery && searchQuery.trim() !== "") {
    const q = searchQuery.trim();
    whereClause.OR = [
      { code: { contains: q } },
      { name: { contains: q } },
      { instructor: { contains: q } },
    ];
  }

  return await prisma.course.findMany({
    where: whereClause,
    include: {
      _count: {
        select: { assignments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourseById(id: string) {
  const user = await getOrCreateDefaultUser();

  const course = await prisma.course.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: {
      assignments: {
        orderBy: { dueDate: "asc" },
      },
    },
  });

  return course;
}

export async function createCourse(data: {
  code: string;
  name: string;
  instructor: string;
  credits: number;
  progress?: number;
}) {
  const user = await getOrCreateDefaultUser();

  // Validation
  if (!data.code || data.code.trim() === "") {
    return { error: "Course code is required." };
  }
  if (!data.name || data.name.trim() === "") {
    return { error: "Course name is required." };
  }
  if (!data.instructor || data.instructor.trim() === "") {
    return { error: "Instructor name is required." };
  }
  if (isNaN(data.credits) || data.credits <= 0) {
    return { error: "Valid credits number is required." };
  }

  const course = await prisma.course.create({
    data: {
      code: data.code.trim().toUpperCase(),
      name: data.name.trim(),
      instructor: data.instructor.trim(),
      credits: Number(data.credits),
      progress: Math.min(100, Math.max(0, Number(data.progress || 0))),
      userId: user.id,
    },
  });

  revalidatePath("/courses");
  revalidatePath("/dashboard");
  return { success: true, course };
}

export async function updateCourse(
  id: string,
  data: {
    code?: string;
    name?: string;
    instructor?: string;
    credits?: number;
    progress?: number;
  }
) {
  const user = await getOrCreateDefaultUser();

  const existing = await prisma.course.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return { error: "Course not found." };
  }

  const updated = await prisma.course.update({
    where: { id },
    data: {
      ...(data.code ? { code: data.code.trim().toUpperCase() } : {}),
      ...(data.name ? { name: data.name.trim() } : {}),
      ...(data.instructor ? { instructor: data.instructor.trim() } : {}),
      ...(data.credits !== undefined ? { credits: Number(data.credits) } : {}),
      ...(data.progress !== undefined
        ? { progress: Math.min(100, Math.max(0, Number(data.progress))) }
        : {}),
    },
  });

  revalidatePath("/courses");
  revalidatePath(`/courses/${id}`);
  revalidatePath("/dashboard");
  return { success: true, course: updated };
}

export async function deleteCourse(id: string) {
  const user = await getOrCreateDefaultUser();

  const existing = await prisma.course.findFirst({
    where: { id, userId: user.id },
  });

  if (!existing) {
    return { error: "Course not found." };
  }

  await prisma.course.delete({
    where: { id },
  });

  revalidatePath("/courses");
  revalidatePath("/dashboard");
  return { success: true };
}
