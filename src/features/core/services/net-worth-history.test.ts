import { describe, expect, it } from "vitest";
import { LedgerEntry } from "../entities/ledger-entry";
import { computeNetWorthHistory } from "./net-worth-history";

function makeEntry(overrides: Partial<LedgerEntry>): LedgerEntry {
  return {
    id: "entry-1",
    createdAt: new Date(),
    accountId: "account-1",
    type: "debit",
    amount: 100,
    date: new Date(),
    ...overrides,
  };
}

describe("computeNetWorthHistory", () => {
  it("returns one entry per month with zero balances and null diffs when there are no entries", () => {
    const referenceDate = new Date("2026-09-15");

    const result = computeNetWorthHistory([], 5, referenceDate);

    expect(result).toHaveLength(5);
    expect(result.every((month) => month.netWorth === 0)).toBe(true);
    expect(result.slice(0, 4).every((month) => month.diff === 0)).toBe(true);
    expect(result[4].diff).toBeNull();
  });

  it("orders months newest first, starting with the current (reference) month", () => {
    const referenceDate = new Date("2026-09-15");

    const result = computeNetWorthHistory([], 3, referenceDate);

    expect(result.map((month) => month.monthLabel)).toEqual(["Sep 2026", "Aug 2026", "Jul 2026"]);
  });

  it("cuts off the current month at the reference date but past months at month end", () => {
    const referenceDate = new Date("2026-09-15");
    const entries = [
      makeEntry({ type: "debit", amount: 1000, date: new Date("2026-08-31") }),
      // Dated after the reference date within the current month; should not count yet.
      makeEntry({ type: "debit", amount: 500, date: new Date("2026-09-20") }),
    ];

    const result = computeNetWorthHistory(entries, 2, referenceDate);

    expect(result[0].monthLabel).toBe("Sep 2026");
    expect(result[0].netWorth).toBe(1000);
    expect(result[1].monthLabel).toBe("Aug 2026");
    expect(result[1].netWorth).toBe(1000);
  });

  it("computes diff as the change from the previous (older) month, and null for the oldest month", () => {
    const referenceDate = new Date("2026-09-15");
    const entries = [
      makeEntry({ type: "debit", amount: 1000, date: new Date("2026-07-10") }),
      makeEntry({ type: "debit", amount: 200, date: new Date("2026-08-10") }),
      makeEntry({ type: "credit", amount: 50, date: new Date("2026-09-10") }),
    ];

    const result = computeNetWorthHistory(entries, 3, referenceDate);

    expect(result[0]).toMatchObject({ monthLabel: "Sep 2026", netWorth: 1150, diff: -50 });
    expect(result[1]).toMatchObject({ monthLabel: "Aug 2026", netWorth: 1200, diff: 200 });
    expect(result[2]).toMatchObject({ monthLabel: "Jul 2026", netWorth: 1000, diff: null });
  });
});
