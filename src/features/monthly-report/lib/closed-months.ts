import { MONTH_LABEL_FORMAT } from "@/features/core/lib/month-bucket";
import { ReportMonth } from "@/features/core/services/monthly-report";

// Newest first. Only months strictly before now's calendar month are returned,
// reaching back to the month of oldestDate; with no data (or only current-month
// data) the previous month alone is offered so the picker is never empty.
export function listClosedMonths(now: Date, oldestDate: Date | undefined): ReportMonth[] {
  const lastClosed = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const first = oldestDate ? new Date(oldestDate.getFullYear(), oldestDate.getMonth(), 1) : lastClosed;

  const months: ReportMonth[] = [];
  for (
    let cursor = lastClosed;
    cursor >= first || months.length === 0;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
  ) {
    months.push({ year: cursor.getFullYear(), month: cursor.getMonth() });
  }
  return months;
}

export function formatReportMonth(month: ReportMonth): string {
  return MONTH_LABEL_FORMAT.format(new Date(month.year, month.month, 1));
}

export function monthKey(month: ReportMonth): string {
  return `${month.year}-${String(month.month + 1).padStart(2, "0")}`;
}
