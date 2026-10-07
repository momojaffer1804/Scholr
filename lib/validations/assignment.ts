import { z } from "zod";

export const assignmentSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string().optional(),
  courseId: z.string().min(1, "Please select an associated course"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    message: "Priority must be LOW, MEDIUM, or HIGH",
  }),
});

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;

export const courseSchema = z.object({
  code: z.string().min(2, "Course code is required (e.g., CS301)"),
  name: z.string().min(3, "Course name is required"),
  instructor: z.string().min(2, "Instructor name is required"),
  credits: z.coerce.number().min(0.5, "Credits must be at least 0.5").max(10, "Credits cannot exceed 10"),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
