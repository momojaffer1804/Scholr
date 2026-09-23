"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function loginAction(data: { email?: string; password?: string }) {
  const email = data.email?.trim().toLowerCase();
  const password = data.password;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Invalid email or password." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return { success: true };
}

export async function signupAction(data: {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}) {
  const name = data.name?.trim();
  const email = data.email?.trim().toLowerCase();
  const password = data.password;
  const confirmPassword = data.confirmPassword;

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  if (confirmPassword && password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "STUDENT",
    },
  });

  await createSession({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  });

  return { success: true };
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
