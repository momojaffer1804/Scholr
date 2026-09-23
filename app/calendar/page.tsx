import * as React from "react";
import { PageHeader } from "@/components/PageHeader";
import { getCalendarEvents } from "@/lib/actions/calendar";
import { AcademicCalendar } from "@/components/calendar/AcademicCalendar";

export const revalidate = 0;

export default async function CalendarPage() {
  const events = await getCalendarEvents();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="TIMETABLE"
        title="Academic Calendar"
        description="Unified schedule of course assignment deadlines, lab submissions, and tasks."
      />

      <AcademicCalendar initialEvents={events} />
    </div>
  );
}
