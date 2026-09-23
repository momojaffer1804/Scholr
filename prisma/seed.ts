import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedDatabase() {
  const existingUser = await prisma.user.findFirst();
  if (existingUser) {
    return existingUser;
  }

  console.log("Seeding database with initial Scholr user and data...");

  const hashedPassword = await bcrypt.hash("password123", 10);
  const hashedAdminPassword = await bcrypt.hash("adminpassword123", 10);

  // Student User
  const user = await prisma.user.create({
    data: {
      name: "Alex Student",
      email: "alex@scholr.edu",
      password: hashedPassword,
      role: "STUDENT",
    },
  });

  // Admin User
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@scholr.edu",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });

  // Create Courses for Alex
  const dbms = await prisma.course.create({
    data: {
      code: "DBMS",
      name: "Database Management Systems",
      instructor: "Dr. Sharma",
      credits: 4.0,
      progress: 78,
      userId: user.id,
    },
  });

  const ml = await prisma.course.create({
    data: {
      code: "AI401",
      name: "Machine Learning",
      instructor: "Dr. Sharma",
      credits: 4.0,
      progress: 64,
      userId: user.id,
    },
  });

  const cn = await prisma.course.create({
    data: {
      code: "CS302",
      name: "Computer Networks",
      instructor: "Prof. Verma",
      credits: 3.5,
      progress: 52,
      userId: user.id,
    },
  });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Create Assignments
  await prisma.assignment.createMany({
    data: [
      {
        title: "Relational Algebra & SQL Query Optimization",
        description: "Write queries for the library database schema and optimize join operations.",
        courseId: dbms.id,
        userId: user.id,
        dueDate: today,
        priority: "HIGH",
        status: "PENDING",
      },
      {
        title: "Supervised Learning Model Notebook",
        description: "Implement decision trees and random forest classifiers on dataset.",
        courseId: ml.id,
        userId: user.id,
        dueDate: tomorrow,
        priority: "HIGH",
        status: "PENDING",
      },
      {
        title: "Socket Programming Lab Report",
        description: "Submit C/Python client-server TCP socket implementation notes.",
        courseId: cn.id,
        userId: user.id,
        dueDate: nextWeek,
        priority: "MEDIUM",
        status: "PENDING",
      },
      {
        title: "Normal Forms Worksheet",
        description: "Decompose 1NF tables to 3NF and BCNF.",
        courseId: dbms.id,
        userId: user.id,
        dueDate: new Date(now.getTime() - 86400000 * 2),
        priority: "MEDIUM",
        status: "COMPLETED",
      },
    ],
  });

  // Create Tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Review Chapter 4 B-Tree Indices",
        description: "Re-read indexing section before Thursday quiz.",
        dueDate: today,
        priority: "HIGH",
        completed: false,
        userId: user.id,
      },
      {
        title: "Prepare slides for ML group presentation",
        description: "Outline model performance cross-validation results.",
        dueDate: tomorrow,
        priority: "MEDIUM",
        completed: false,
        userId: user.id,
      },
      {
        title: "Setup Wireshark packet capture environment",
        description: "Configure local network interfaces for lab 3.",
        dueDate: nextWeek,
        priority: "LOW",
        completed: true,
        userId: user.id,
      },
    ],
  });

  console.log("Seeding completed successfully with authentication users.");
  return user;
}

if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
