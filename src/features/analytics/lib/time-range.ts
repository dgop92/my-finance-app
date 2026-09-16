export const TIME_RANGE_OPTIONS = ["3m", "6m", "12m", "24m", "all"] as const;

export type TimeRange = (typeof TIME_RANGE_OPTIONS)[number];

export const DEFAULT_TIME_RANGE: TimeRange = "12m";

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  "3m": "3 months",
  "6m": "6 months",
  "12m": "12 months",
  "24m": "24 months",
  all: "All time",
};

const TIME_RANGE_MONTHS: Record<Exclude<TimeRange, "all">, number> = {
  "3m": 3,
  "6m": 6,
  "12m": 12,
  "24m": 24,
};

// Null means unbounded (all time).
export function getTimeRangeStart(range: TimeRange, referenceDate: Date): Date | null {
  if (range === "all") return null;

  const months = TIME_RANGE_MONTHS[range];
  const start = new Date(referenceDate);
  start.setMonth(start.getMonth() - months);

  // Subtracting months can overflow into the next month when referenceDate's
  // day doesn't exist that many months back (e.g. Dec 31 - 3 months has no
  // Sep 31) — setMonth silently rolls forward, so clamp to the target
  // month's last day instead.
  if (start.getDate() !== referenceDate.getDate()) {
    start.setDate(0);
  }

  return start;
}
