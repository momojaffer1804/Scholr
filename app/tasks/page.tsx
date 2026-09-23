import * as React from "react";
import { PageHeader } from "@/components/PageHeader";
import { getTasks } from "@/lib/actions/tasks";
import { TaskList } from "@/components/tasks/TaskList";

export const revalidate = 0;

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="ACTION ITEMS"
        title="Tasks & Checklists"
        description="Daily academic to-do items, reading goals, and study preparations."
      />

      <TaskList initialTasks={tasks} />
    </div>
  );
}
