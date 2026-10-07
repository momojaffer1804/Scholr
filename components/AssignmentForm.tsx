"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentSchema, type AssignmentFormValues } from "@/lib/validations/assignment";
import { createAssignment } from "@/lib/actions/assignments";
import { useToastStore } from "@/lib/store/useToastStore";
import { useState } from "react";

interface AssignmentFormProps {
  courses: Array<{ id: string; name: string; code: string }>;
  onSuccess?: () => void;
}

export function AssignmentForm({ courses, onSuccess }: AssignmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      courseId: courses[0]?.id || "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "MEDIUM",
    },
  });

  const onSubmit = async (data: AssignmentFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createAssignment({
        title: data.title,
        description: data.description,
        courseId: data.courseId,
        dueDate: data.dueDate,
        priority: data.priority,
      });
      if (result?.error) {
        addToast(result.error, "error");
      } else {
        addToast("Assignment created successfully!", "success");
        reset();
        onSuccess?.();
      }
    } catch (err) {
      addToast("Failed to submit assignment form.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border border-zinc-900 bg-white dark:bg-zinc-900 dark:border-zinc-100">
      <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 pb-2">
        New Assignment (Zod & React Hook Form Validated)
      </h3>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-700 dark:text-zinc-300">
          Assignment Title
        </label>
        <input
          {...register("title")}
          type="text"
          placeholder="e.g. Database Design Lab Submission"
          className="w-full px-3 py-2 border border-zinc-400 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-700 dark:text-zinc-300">
            Course
          </label>
          <select
            {...register("courseId")}
            className="w-full px-3 py-2 border border-zinc-400 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 text-sm"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} — {course.name}
              </option>
            ))}
          </select>
          {errors.courseId && <p className="text-xs text-red-600 mt-1">{errors.courseId.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-700 dark:text-zinc-300">
            Priority
          </label>
          <select
            {...register("priority")}
            className="w-full px-3 py-2 border border-zinc-400 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 text-sm"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
          {errors.priority && <p className="text-xs text-red-600 mt-1">{errors.priority.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-700 dark:text-zinc-300">
          Due Date
        </label>
        <input
          {...register("dueDate")}
          type="date"
          className="w-full px-3 py-2 border border-zinc-400 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 text-sm"
        />
        {errors.dueDate && <p className="text-xs text-red-600 mt-1">{errors.dueDate.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-zinc-700 dark:text-zinc-300">
          Description (Optional)
        </label>
        <textarea
          {...register("description")}
          rows={2}
          placeholder="Additional assignment details..."
          className="w-full px-3 py-2 border border-zinc-400 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm tracking-wide transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Mutating Server State..." : "Create Assignment"}
      </button>
    </form>
  );
}
