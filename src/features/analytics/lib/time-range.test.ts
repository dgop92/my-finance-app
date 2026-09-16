import { describe, expect, it } from "vitest";
import { getTimeRangeMonthsCount, getTimeRangeStart } from "./time-range";

describe("getTimeRangeStart", () => {
  const referenceDate = new Date(2026, 5, 15);

  it("returns null for all time", () => {
    expect(getTimeRangeStart("all", referenceDate)).toBeNull();
  });

  it("subtracts 3 months for 3m", () => {
    expect(getTimeRangeStart("3m", referenceDate)).toEqual(new Date(2026, 2, 15));
  });

  it("subtracts 6 months for 6m", () => {
    expect(getTimeRangeStart("6m", referenceDate)).toEqual(new Date(2025, 11, 15));
  });

  it("subtracts 12 months for 12m", () => {
    expect(getTimeRangeStart("12m", referenceDate)).toEqual(new Date(2025, 5, 15));
  });

  it("subtracts 24 months for 24m", () => {
    expect(getTimeRangeStart("24m", referenceDate)).toEqual(new Date(2024, 5, 15));
  });

  it("clamps to the target month's last day instead of overflowing", () => {
    // Sep has 30 days, so "3 months before Dec 31" can't land on Sep 31.
    const endOfDecember = new Date(2026, 11, 31);
    expect(getTimeRangeStart("3m", endOfDecember)).toEqual(new Date(2026, 8, 30));
  });

  it("clamps to Feb 28 in a non-leap year instead of overflowing into March", () => {
    const endOfAugust = new Date(2026, 7, 31);
    // 2026 is not a leap year, so Feb has 28 days.
    expect(getTimeRangeStart("6m", endOfAugust)).toEqual(new Date(2026, 1, 28));
  });
});

describe("getTimeRangeMonthsCount", () => {
  const referenceDate = new Date(2026, 5, 15);

  it("returns the fixed month count for bounded ranges, ignoring oldestDate", () => {
    expect(getTimeRangeMonthsCount("3m", new Date(2020, 0, 1), referenceDate)).toBe(3);
    expect(getTimeRangeMonthsCount("6m", null, referenceDate)).toBe(6);
    expect(getTimeRangeMonthsCount("12m", null, referenceDate)).toBe(12);
    expect(getTimeRangeMonthsCount("24m", null, referenceDate)).toBe(24);
  });

  it("counts months back to oldestDate inclusive for all time", () => {
    // Jan 2026 through Jun 2026 is 6 months.
    expect(getTimeRangeMonthsCount("all", new Date(2026, 0, 20), referenceDate)).toBe(6);
  });

  it("returns 1 month for all time when oldestDate and referenceDate are in the same month", () => {
    expect(getTimeRangeMonthsCount("all", new Date(2026, 5, 1), referenceDate)).toBe(1);
  });

  it("falls back to 1 month for all time when there is no data yet", () => {
    expect(getTimeRangeMonthsCount("all", null, referenceDate)).toBe(1);
  });
});
