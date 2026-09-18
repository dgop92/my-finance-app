import { describe, expect, it } from "vitest";
import { LedgerEntry } from "../entities/ledger-entry";
import { computeRunningBalance } from "./running-balance";

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

describe("computeRunningBalance", () => {
  it("returns an empty array when there are no entries", () => {
    const result = computeRunningBalance([], "account-1", { start: null, end: new Date("2026-09-15") });

    expect(result).toEqual([]);
  });

  it("ignores entries belonging to other accounts", () => {
    const entries = [
      makeEntry({ accountId: "account-1", type: "debit", amount: 100, date: new Date("2026-09-01") }),
      makeEntry({ accountId: "account-2", type: "debit", amount: 500, date: new Date("2026-09-02") }),
    ];

    const result = computeRunningBalance(entries, "account-1", { start: null, end: new Date("2026-09-15") });

    expect(result).toHaveLength(1);
    expect(result[0].balance).toBe(100);
  });

  it("sorts entries by date and accumulates debit/credit totals", () => {
    const entries = [
      makeEntry({ type: "debit", amount: 500, date: new Date("2026-09-10") }),
      makeEntry({ type: "credit", amount: 100, date: new Date("2026-09-01") }),
      makeEntry({ type: "debit", amount: 200, date: new Date("2026-09-05") }),
    ];

    const result = computeRunningBalance(entries, "account-1", { start: null, end: new Date("2026-09-15") });

    expect(result.map((point) => point.balance)).toEqual([-100, 100, 600]);
  });

  it("excludes entries dated after range.end", () => {
    const entries = [
      makeEntry({ type: "debit", amount: 100, date: new Date("2026-09-01") }),
      makeEntry({ type: "debit", amount: 900, date: new Date("2026-10-01") }),
    ];

    const result = computeRunningBalance(entries, "account-1", { start: null, end: new Date("2026-09-15") });

    expect(result).toHaveLength(1);
    expect(result[0].balance).toBe(100);
  });

  it("carries pre-range entries into the running total without emitting a point for them", () => {
    const entries = [
      makeEntry({ type: "debit", amount: 1000, date: new Date("2026-06-01") }),
      makeEntry({ type: "credit", amount: 200, date: new Date("2026-09-10") }),
    ];

    const result = computeRunningBalance(entries, "account-1", {
      start: new Date("2026-09-01"),
      end: new Date("2026-09-15"),
    });

    expect(result).toHaveLength(1);
    expect(result[0].balance).toBe(800);
  });

  it("treats a null range.start as unbounded", () => {
    const entries = [makeEntry({ type: "debit", amount: 100, date: new Date("2026-01-01") })];

    const result = computeRunningBalance(entries, "account-1", { start: null, end: new Date("2026-09-15") });

    expect(result).toHaveLength(1);
  });
});
