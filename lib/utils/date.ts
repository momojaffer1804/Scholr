export function toValidDate(dateInput: Date | string | null | undefined): Date | null {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDateHuman(dateInput: Date | string | null | undefined): string {
  const d = toValidDate(dateInput);
  if (!d) return "No due date";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffDays = Math.round((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";

  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateFull(dateInput: Date | string | null | undefined): string {
  const d = toValidDate(dateInput);
  if (!d) return "No date specified";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTimeOnly(dateInput: Date | string | null | undefined): string {
  const d = toValidDate(dateInput);
  if (!d) return "";
  const hours = d.getHours();
  const minutes = d.getMinutes();
  if (hours === 0 && minutes === 0) return "";
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function isSameDay(d1Input: Date | string, d2Input: Date | string): boolean {
  const d1 = toValidDate(d1Input);
  const d2 = toValidDate(d2Input);
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isOverdue(dueDateInput: Date | string | null | undefined, isCompleted: boolean): boolean {
  if (isCompleted) return false;
  const d = toValidDate(dueDateInput);
  if (!d) return false;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  return dueDayStart.getTime() < todayStart.getTime();
}
