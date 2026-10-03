import { describe, expect, it } from "vitest";
import { listClosedMonths, monthKey } from "./closed-months";

describe("listClosedMonths", () => {
  it("lists months from the oldest data month up to the month before now, newest first", () => {
    const now = new Date(2026, 9, 3);
    const oldest = new Date(2026, 6, 20);

    expect(listClosedMonths(now, oldest)).toEqual([
      { year: 2026, month: 8 },
      { year: 2026, month: 7 },
      { year: 2026, month: 6 },
    ]);
  });

  it("never includes the current in-progress month", () => {
    const now = new Date(2026, 9, 31, 23, 59);

    const months = listClosedMonths(now, new Date(2026, 8, 1));

    expect(months).toEqual([{ year: 2026, month: 8 }]);
  });

  it("crosses year boundaries", () => {
    const now = new Date(2026, 1, 10);

    const months = listClosedMonths(now, new Date(2025, 10, 5));

    expect(months).toEqual([
      { year: 2026, month: 0 },
      { year: 2025, month: 11 },
      { year: 2025, month: 10 },
    ]);
  });

  it("falls back to only the previous month when there is no data", () => {
    expect(listClosedMonths(new Date(2026, 0, 15), undefined)).toEqual([{ year: 2025, month: 11 }]);
  });

  it("falls back to only the previous month when all data is in the current month", () => {
    expect(listClosedMonths(new Date(2026, 9, 15), new Date(2026, 9, 2))).toEqual([{ year: 2026, month: 8 }]);
  });
});

describe("monthKey", () => {
  it("formats a month as YYYY-MM with a one-based, zero-padded month", () => {
    expect(monthKey({ year: 2026, month: 8 })).toBe("2026-09");
    expect(monthKey({ year: 2026, month: 0 })).toBe("2026-01");
    expect(monthKey({ year: 2025, month: 11 })).toBe("2025-12");
  });
});
