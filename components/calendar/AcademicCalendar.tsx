"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { CalendarEventItem } from "@/lib/actions/calendar";
import { isSameDay, formatDateFull } from "@/lib/utils/date";

interface AcademicCalendarProps {
  initialEvents: CalendarEventItem[];
}

export function AcademicCalendar({ initialEvents }: AcademicCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<"MONTH" | "WEEK">("MONTH");
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEventItem | null>(null);

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handlePrev = () => {
    if (viewMode === "MONTH") {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setCurrentDate(prevWeek);
    }
  };

  const handleNext = () => {
    if (viewMode === "MONTH") {
      setCurrentDate(new Date(year, month + 1, 1));
    } else {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setCurrentDate(nextWeek);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Generate Month Grid Days
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: Array<{ date: Date; isCurrentMonth: boolean }> = [];

  // Previous month padding
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // Next month padding to fill 35 or 42 grid cells
  const remainingCells = 35 - calendarDays.length;
  const paddingCount = remainingCells >= 0 ? remainingCells : 42 - calendarDays.length;
  for (let i = 1; i <= paddingCount; i++) {
    calendarDays.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  // Generate Week View Days (Sunday to Saturday)
  const getWeekDays = (centerDate: Date) => {
    const d = new Date(centerDate);
    const dayOfWeek = d.getDay();
    const startOfWeek = new Date(d);
    startOfWeek.setDate(d.getDate() - dayOfWeek);

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek);
      weekDay.setDate(startOfWeek.getDate() + i);
      week.push(weekDay);
    }
    return week;
  };

  const weekDays = getWeekDays(currentDate);

  const getEventsForDay = (date: Date) => {
    return initialEvents.filter((e) => isSameDay(e.dueDate, date));
  };

  const todayDate = new Date();

  return (
    <div className="space-y-6">
      {/* Calendar Top Navigation Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900/60">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-50 min-w-[180px]">
            {viewMode === "MONTH"
              ? monthName
              : `Week of ${weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
          </h2>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous period"
              className="p-1.5 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleToday}
              aria-label="Go to Today"
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next period"
              className="p-1.5 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Month / Week View Toggle */}
        <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-50 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setViewMode("MONTH")}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              viewMode === "MONTH"
                ? "bg-purple-700 dark:bg-purple-600 text-white"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Month
          </button>
          <button
            type="button"
            onClick={() => setViewMode("WEEK")}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              viewMode === "WEEK"
                ? "bg-purple-700 dark:bg-purple-600 text-white"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === "MONTH" && (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-center text-xs font-bold uppercase tracking-wider py-2.5 text-zinc-600 dark:text-zinc-400">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Grid Cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-zinc-200 dark:divide-zinc-800">
              {calendarDays.map((item, index) => {
                const dayEvents = getEventsForDay(item.date);
                const isToday = isSameDay(item.date, todayDate);

                return (
                  <div
                    key={index}
                    className={`min-h-[110px] p-1.5 flex flex-col justify-between transition-colors ${
                      item.isCurrentMonth
                        ? "bg-white dark:bg-zinc-900/60"
                        : "bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-400 dark:text-zinc-600"
                    } ${isToday ? "ring-2 ring-purple-600 dark:ring-purple-400 inset-0 z-10" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-mono font-bold px-1.5 py-0.5 ${
                          isToday
                            ? "bg-purple-700 text-white dark:bg-purple-500"
                            : item.isCurrentMonth
                            ? "text-zinc-900 dark:text-zinc-100"
                            : "text-zinc-400 dark:text-zinc-600"
                        }`}
                      >
                        {item.date.getDate()}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-mono text-zinc-400">
                          {dayEvents.length} {dayEvents.length === 1 ? "EVENT" : "EVENTS"}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 flex-1 overflow-y-auto max-h-[80px]">
                      {dayEvents.map((evt) => (
                        <button
                          key={evt.id}
                          type="button"
                          onClick={() => setSelectedEvent(evt)}
                          className={`w-full text-left p-1 text-[10px] font-medium leading-tight border transition-colors cursor-pointer truncate ${
                            evt.status === "COMPLETED"
                              ? "bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-400 line-through"
                              : evt.status === "OVERDUE"
                              ? "bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 font-bold"
                              : evt.type === "ASSIGNMENT"
                              ? "bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900 text-purple-900 dark:text-purple-200 font-semibold"
                              : "bg-zinc-50 dark:bg-zinc-800/60 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                          }`}
                        >
                          <span className="font-mono font-bold uppercase mr-1">
                            {evt.type === "ASSIGNMENT" ? evt.courseCode : "TASK"}:
                          </span>
                          {evt.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === "WEEK" && (
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-x-auto">
          <div className="min-w-[700px] grid grid-cols-7 divide-x divide-zinc-200 dark:divide-zinc-800">
            {weekDays.map((day, idx) => {
              const dayEvents = getEventsForDay(day);
              const isToday = isSameDay(day, todayDate);

              return (
                <div key={idx} className="min-h-[350px] p-3 flex flex-col justify-start">
                  <div className="text-center border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span
                      className={`font-serif text-lg font-bold inline-block px-2 py-0.5 mt-0.5 ${
                        isToday
                          ? "bg-purple-700 text-white dark:bg-purple-500"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {day.getDate()}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {dayEvents.length === 0 ? (
                      <p className="text-[11px] font-mono text-zinc-400 text-center py-4">No events</p>
                    ) : (
                      dayEvents.map((evt) => (
                        <button
                          key={evt.id}
                          type="button"
                          onClick={() => setSelectedEvent(evt)}
                          className={`w-full text-left p-2 text-xs border transition-colors cursor-pointer block ${
                            evt.status === "COMPLETED"
                              ? "bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 text-zinc-400 line-through"
                              : evt.status === "OVERDUE"
                              ? "bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 font-bold"
                              : "bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900 text-purple-900 dark:text-purple-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-mono font-bold uppercase">
                              {evt.type === "ASSIGNMENT" ? evt.courseCode : "TASK"}
                            </span>
                            <span className="text-[9px] font-mono uppercase">{evt.priority}</span>
                          </div>
                          <p className="font-bold leading-tight">{evt.title}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EVENT DETAIL MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-700 dark:text-purple-400">
                  {selectedEvent.type} {selectedEvent.courseCode ? `• ${selectedEvent.courseCode}` : ""}
                </span>
                <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                  {selectedEvent.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close detail modal"
                className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedEvent.description && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-800/40 p-3 border border-zinc-200 dark:border-zinc-800">
                {selectedEvent.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Due Date</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {formatDateFull(selectedEvent.dueDate)}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Priority & Status</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedEvent.priority}</span>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
                      selectedEvent.status === "COMPLETED"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : selectedEvent.status === "OVERDUE"
                        ? "border-red-300 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300"
                        : "border-purple-200 bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300"
                    }`}
                  >
                    {selectedEvent.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <Link
                href={selectedEvent.type === "ASSIGNMENT" ? "/assignments" : "/tasks"}
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 hover:underline"
              >
                Go to {selectedEvent.type === "ASSIGNMENT" ? "Assignments" : "Tasks"} Page
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
