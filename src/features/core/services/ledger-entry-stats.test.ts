import { describe, expect, it } from "vitest";
import { LedgerEntry } from "../entities/ledger-entry";
import { computeLedgerEntryStats } from "./ledger-entry-stats";

function makeEntry(overrides: Partial<LedgerEntry>): LedgerEntry {
  return {
    id: "entry-1",
    createdAt: new Date(),
    accountId: "account-1",
    type: "debit",
    amount: 100,
    date: new Date(2026, 5, 15),
    ...overrides,
  };
}

const end = new Date(2026, 5, 30);
const start = new Date(2026, 5, 1);

describe("computeLedgerEntryStats", () => {
  it("returns all zeros for no entries", () => {
    expect(computeLedgerEntryStats([], new Set(), { start, end })).toEqual({
      avgTransactionSize: 0,
      largestDeposit: 0,
      largestWithdrawal: 0,
      entryCount: 0,
    });
  });

  it("computes stats from entries within range for included accounts", () => {
    const entries = [
      makeEntry({ id: "1", accountId: "account-1", type: "debit", amount: 300 }),
      makeEntry({ id: "2", accountId: "account-1", type: "credit", amount: 100 }),
      makeEntry({ id: "3", accountId: "account-2", type: "debit", amount: 500 }),
    ];

    const result = computeLedgerEntryStats(entries, new Set(["account-1", "account-2"]), {
      start,
      end,
    });

    expect(result).toEqual({
      avgTransactionSize: (300 + 100 + 500) / 3,
      largestDeposit: 500,
      largestWithdrawal: 100,
      entryCount: 3,
    });
  });

  it("excludes entries for accounts not in the given set (e.g. archived)", () => {
    const entries = [
      makeEntry({ id: "1", accountId: "account-1", amount: 100 }),
      makeEntry({ id: "2", accountId: "archived-account", amount: 999 }),
    ];

    const result = computeLedgerEntryStats(entries, new Set(["account-1"]), { start, end });

    expect(result.entryCount).toBe(1);
    expect(result.avgTransactionSize).toBe(100);
  });

  it("excludes entries outside the [start, end] range", () => {
    const entries = [
      makeEntry({ id: "1", date: new Date(2026, 4, 30) }), // before start
      makeEntry({ id: "2", date: new Date(2026, 5, 1) }), // at start
      makeEntry({ id: "3", date: new Date(2026, 5, 30) }), // at end
      makeEntry({ id: "4", date: new Date(2026, 6, 1) }), // after end
    ];

    const result = computeLedgerEntryStats(entries, new Set(["account-1"]), { start, end });

    expect(result.entryCount).toBe(2);
  });

  it("treats a null start as unbounded (all time)", () => {
    const entries = [
      makeEntry({ id: "1", date: new Date(2000, 0, 1) }),
      makeEntry({ id: "2", date: new Date(2026, 5, 15) }),
    ];

    const result = computeLedgerEntryStats(entries, new Set(["account-1"]), {
      start: null,
      end,
    });

    expect(result.entryCount).toBe(2);
  });

  it("returns 0 for largestWithdrawal when there are no withdrawals", () => {
    const entries = [makeEntry({ id: "1", type: "debit", amount: 200 })];

    const result = computeLedgerEntryStats(entries, new Set(["account-1"]), { start, end });

    expect(result.largestWithdrawal).toBe(0);
    expect(result.largestDeposit).toBe(200);
  });
});
