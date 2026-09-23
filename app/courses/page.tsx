import * as React from "react";
import { PageHeader } from "@/components/PageHeader";
import { getCourses } from "@/lib/actions/courses";
import { CourseList } from "@/components/courses/CourseList";

export const revalidate = 0; // Dynamic data

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="COURSES"
        title="Enrolled Modules"
        description="View and manage your current academic courses, instructors, credits, and progress."
      />

      <CourseList initialCourses={courses} />
    </div>
  );
}
