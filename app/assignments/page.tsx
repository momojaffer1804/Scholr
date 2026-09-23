import * as React from "react";
import { PageHeader } from "@/components/PageHeader";
import { getAssignments } from "@/lib/actions/assignments";
import { getCourses } from "@/lib/actions/courses";
import { AssignmentList } from "@/components/assignments/AssignmentList";

export const revalidate = 0;

export default async function AssignmentsPage() {
  const assignments = await getAssignments();
  const courses = await getCourses();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="TASKS & DEADLINES"
        title="Assignments"
        description="Track academic coursework, lab reports, and examination deadlines."
      />

      <AssignmentList
        initialAssignments={assignments}
        courses={courses.map((c) => ({ id: c.id, code: c.code, name: c.name }))}
      />
    </div>
  );
}
