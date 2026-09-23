import * as React from "react";
import { getDashboardData } from "@/lib/actions/dashboard";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const revalidate = 0;

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <DashboardView
      stats={data.stats}
      courses={data.courses}
      todayTasks={data.todayTasks}
      assignmentsDueSoon={data.assignmentsDueSoon}
      upcomingAssignments={data.upcomingAssignments}
    />
  );
}
