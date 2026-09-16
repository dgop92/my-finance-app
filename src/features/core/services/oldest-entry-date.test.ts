import { describe, expect, it } from "vitest";
import { LedgerEntry } from "../entities/ledger-entry";
import { computeOldestEntryDate } from "./oldest-entry-date";

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

describe("computeOldestEntryDate", () => {
  it("returns null when there are no entries", () => {
    expect(computeOldestEntryDate([])).toBeNull();
  });

  it("returns the date of the single oldest entry", () => {
    const entries = [
      makeEntry({ date: new Date("2026-03-10") }),
      makeEntry({ date: new Date("2026-01-05") }),
      makeEntry({ date: new Date("2026-06-01") }),
    ];

    expect(computeOldestEntryDate(entries)).toEqual(new Date("2026-01-05"));
  });

  it("scopes to the given accountIds when provided, ignoring entries outside that set", () => {
    const entries = [
      makeEntry({ accountId: "account-1", date: new Date("2026-01-05") }),
      makeEntry({ accountId: "account-2", date: new Date("2025-01-01") }),
    ];

    expect(computeOldestEntryDate(entries, new Set(["account-1"]))).toEqual(new Date("2026-01-05"));
  });

  it("returns null when accountIds excludes every entry", () => {
    const entries = [makeEntry({ accountId: "account-2", date: new Date("2025-01-01") })];

    expect(computeOldestEntryDate(entries, new Set(["account-1"]))).toBeNull();
  });
});
