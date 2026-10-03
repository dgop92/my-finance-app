import { MONTH_LABEL_FORMAT } from "@/features/core/lib/month-bucket";
import { ReportMonth } from "@/features/core/services/monthly-report";

export const REPORT_MONTH_LIMIT = 5;

// Newest first, starting with the current (in-progress) month and reaching
// back to the month of oldestDate, capped at `limit` entries so lifetime data
// doesn't flood the picker.
export function listReportMonths(now: Date, oldestDate: Date | undefined, limit = REPORT_MONTH_LIMIT): ReportMonth[] {
  const current = new Date(now.getFullYear(), now.getMonth(), 1);
  const first = oldestDate ? new Date(oldestDate.getFullYear(), oldestDate.getMonth(), 1) : current;

  const months: ReportMonth[] = [];
  for (
    let cursor = current;
    (cursor >= first || months.length === 0) && months.length < limit;
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
