import { describe, expect, it } from "vitest";
import { LedgerEntry } from "../entities/ledger-entry";
import { computeMonthlyTransactionVolume } from "./monthly-transaction-volume";

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

describe("computeMonthlyTransactionVolume", () => {
  it("returns one entry per month with zero counts when there are no entries", () => {
    const referenceDate = new Date("2026-09-15");

    const result = computeMonthlyTransactionVolume([], 3, referenceDate);

    expect(result).toHaveLength(3);
    expect(result.every((month) => month.entryCount === 0)).toBe(true);
  });

  it("orders months newest first, starting with the current (reference) month", () => {
    const referenceDate = new Date("2026-09-15");

    const result = computeMonthlyTransactionVolume([], 3, referenceDate);

    expect(result.map((month) => month.monthLabel)).toEqual(["Sep 2026", "Aug 2026", "Jul 2026"]);
  });

  it("counts entries per month regardless of debit/credit type", () => {
    const referenceDate = new Date("2026-09-15");
    const entries = [
      makeEntry({ type: "debit", amount: 500, date: new Date("2026-08-05") }),
      makeEntry({ type: "credit", amount: 100, date: new Date("2026-08-10") }),
      makeEntry({ type: "debit", amount: 50, date: new Date("2026-09-01") }),
    ];

    const result = computeMonthlyTransactionVolume(entries, 2, referenceDate);

    expect(result[0]).toMatchObject({ monthLabel: "Sep 2026", entryCount: 1 });
    expect(result[1]).toMatchObject({ monthLabel: "Aug 2026", entryCount: 2 });
  });

  it("cuts off the current month at the reference date but past months at month end", () => {
    const referenceDate = new Date("2026-09-15");
    const entries = [
      makeEntry({ date: new Date("2026-08-31") }),
      // Dated after the reference date within the current month; should not count yet.
      makeEntry({ date: new Date("2026-09-20") }),
    ];

    const result = computeMonthlyTransactionVolume(entries, 2, referenceDate);

    expect(result[0]).toMatchObject({ monthLabel: "Sep 2026", entryCount: 0 });
    expect(result[1]).toMatchObject({ monthLabel: "Aug 2026", entryCount: 1 });
  });

  it("scopes counts to the given accountIds when provided, ignoring entries outside that set", () => {
    const referenceDate = new Date("2026-09-15");
    const entries = [
      makeEntry({ accountId: "account-1", date: new Date("2026-09-10") }),
      makeEntry({ accountId: "account-2", date: new Date("2026-09-10") }),
    ];

    const result = computeMonthlyTransactionVolume(entries, 1, referenceDate, new Set(["account-1"]));

    expect(result[0].entryCount).toBe(1);
  });

  it("includes all entries when accountIds is omitted", () => {
    const referenceDate = new Date("2026-09-15");
    const entries = [
      makeEntry({ accountId: "account-1", date: new Date("2026-09-10") }),
      makeEntry({ accountId: "account-2", date: new Date("2026-09-10") }),
    ];

    const result = computeMonthlyTransactionVolume(entries, 1, referenceDate);

    expect(result[0].entryCount).toBe(2);
  });
});
