import { describe, expect, it } from "vitest";
import { listReportMonths, monthKey } from "./report-months";

describe("listReportMonths", () => {
  it("lists months from the oldest data month up to and including the current month, newest first", () => {
    const now = new Date(2026, 9, 3);
    const oldest = new Date(2026, 6, 20);

    expect(listReportMonths(now, oldest)).toEqual([
      { year: 2026, month: 9 },
      { year: 2026, month: 8 },
      { year: 2026, month: 7 },
      { year: 2026, month: 6 },
    ]);
  });

  it("caps the result at the given limit even when older data exists", () => {
    const now = new Date(2026, 9, 3);
    const oldest = new Date(2025, 0, 1);

    expect(listReportMonths(now, oldest, 3)).toEqual([
      { year: 2026, month: 9 },
      { year: 2026, month: 8 },
      { year: 2026, month: 7 },
    ]);
  });

  it("defaults the limit to 5 months", () => {
    const now = new Date(2026, 9, 3);
    const oldest = new Date(2025, 0, 1);

    expect(listReportMonths(now, oldest)).toHaveLength(5);
  });

  it("crosses year boundaries", () => {
    const now = new Date(2026, 1, 10);

    const months = listReportMonths(now, new Date(2025, 10, 5));

    expect(months).toEqual([
      { year: 2026, month: 1 },
      { year: 2026, month: 0 },
      { year: 2025, month: 11 },
      { year: 2025, month: 10 },
    ]);
  });

  it("falls back to only the current month when there is no data", () => {
    expect(listReportMonths(new Date(2026, 0, 15), undefined)).toEqual([{ year: 2026, month: 0 }]);
  });

  it("falls back to only the current month when all data is in the current month", () => {
    expect(listReportMonths(new Date(2026, 9, 15), new Date(2026, 9, 2))).toEqual([{ year: 2026, month: 9 }]);
  });
});

describe("monthKey", () => {
  it("formats a month as YYYY-MM with a one-based, zero-padded month", () => {
    expect(monthKey({ year: 2026, month: 8 })).toBe("2026-09");
    expect(monthKey({ year: 2026, month: 0 })).toBe("2026-01");
    expect(monthKey({ year: 2025, month: 11 })).toBe("2025-12");
  });
});
