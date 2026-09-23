import * as React from "react";
import { getAcademicAnalytics } from "@/lib/actions/analytics";
import { AcademicAnalyticsView } from "@/components/analytics/AcademicAnalyticsView";

export const revalidate = 0;

export default async function AnalyticsPage() {
  const analyticsData = await getAcademicAnalytics();

  return <AcademicAnalyticsView data={analyticsData} />;
}
