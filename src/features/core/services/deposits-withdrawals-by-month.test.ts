import { describe, expect, it } from "vitest";
import { LedgerEntry } from "../entities/ledger-entry";
import { computeDepositsWithdrawalsByMonth } from "./deposits-withdrawals-by-month";

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

describe("computeDepositsWithdrawalsByMonth", () => {
  it("returns one entry per month with zero totals when there are no entries", () => {
    const referenceDate = new Date("2026-09-15");

    const result = computeDepositsWithdrawalsByMonth([], 3, referenceDate);

    expect(result).toHaveLength(3);
    expect(result.every((month) => month.deposits === 0 && month.withdrawals === 0)).toBe(true);
  });

  it("orders months newest first, starting with the current (reference) month", () => {
    const referenceDate = new Date("2026-09-15");

    const result = computeDepositsWithdrawalsByMonth([], 3, referenceDate);

    expect(result.map((month) => month.monthLabel)).toEqual(["Sep 2026", "Aug 2026", "Jul 2026"]);
  });

  it("sums debit entries as deposits and credit entries as withdrawals per month", () => {
    const referenceDate = new Date("2026-09-15");
    const entries = [
      makeEntry({ type: "debit", amount: 500, date: new Date("2026-08-05") }),
      makeEntry({ type: "debit", amount: 300, date: new Date("2026-08-20") }),
      makeEntry({ type: "credit", amount: 100, date: new Date("2026-08-10") }),
      makeEntry({ type: "credit", amount: 50, date: new Date("2026-09-01") }),
    ];

    const result = computeDepositsWithdrawalsByMonth(entries, 2, referenceDate);

    expect(result[0]).toMatchObject({ monthLabel: "Sep 2026", deposits: 0, withdrawals: 50 });
    expect(result[1]).toMatchObject({ monthLabel: "Aug 2026", deposits: 800, withdrawals: 100 });
  });

  it("cuts off the current month at the reference date but past months at month end", () => {
    const referenceDate = new Date("2026-09-15");
    const entries = [
      makeEntry({ type: "debit", amount: 1000, date: new Date("2026-08-31") }),
      // Dated after the reference date within the current month; should not count yet.
      makeEntry({ type: "debit", amount: 500, date: new Date("2026-09-20") }),
    ];

    const result = computeDepositsWithdrawalsByMonth(entries, 2, referenceDate);

    expect(result[0]).toMatchObject({ monthLabel: "Sep 2026", deposits: 0 });
    expect(result[1]).toMatchObject({ monthLabel: "Aug 2026", deposits: 1000 });
  });

  it("does not carry a month's totals into later months (unlike net worth history, this is not cumulative)", () => {
    const referenceDate = new Date("2026-09-15");
    const entries = [makeEntry({ type: "debit", amount: 1000, date: new Date("2026-07-10") })];

    const result = computeDepositsWithdrawalsByMonth(entries, 3, referenceDate);

    expect(result[0]).toMatchObject({ monthLabel: "Sep 2026", deposits: 0 });
    expect(result[1]).toMatchObject({ monthLabel: "Aug 2026", deposits: 0 });
    expect(result[2]).toMatchObject({ monthLabel: "Jul 2026", deposits: 1000 });
  });

  it("scopes totals to the given accountIds when provided, ignoring entries outside that set", () => {
    const referenceDate = new Date("2026-09-15");
    const entries = [
      makeEntry({ accountId: "account-1", type: "debit", amount: 1000, date: new Date("2026-09-10") }),
      makeEntry({ accountId: "account-2", type: "debit", amount: 500, date: new Date("2026-09-10") }),
    ];

    const result = computeDepositsWithdrawalsByMonth(entries, 1, referenceDate, new Set(["account-1"]));

    expect(result[0].deposits).toBe(1000);
  });

  it("includes all entries when accountIds is omitted", () => {
    const referenceDate = new Date("2026-09-15");
    const entries = [
      makeEntry({ accountId: "account-1", type: "debit", amount: 1000, date: new Date("2026-09-10") }),
      makeEntry({ accountId: "account-2", type: "debit", amount: 500, date: new Date("2026-09-10") }),
    ];

    const result = computeDepositsWithdrawalsByMonth(entries, 1, referenceDate);

    expect(result[0].deposits).toBe(1500);
  });
});
