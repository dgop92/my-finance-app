export const MONTH_LABEL_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

// Shared by month-bucketed services (net worth history, deposits/withdrawals
// by month): for the i-th month back from referenceDate (i=0 is
// referenceDate's own month), returns that month's first-of-month date and
// the cutoff to filter entries against — referenceDate itself for the
// current month (which isn't over yet), or the month's end otherwise.
export function getMonthWindow(referenceDate: Date, i: number): { monthDate: Date; cutoff: Date } {
  const monthDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
  const cutoff = i === 0 ? referenceDate : endOfMonth(monthDate);
  return { monthDate, cutoff };
}
