import { describe, expect, it } from "vitest";
import { LedgerEntry } from "../entities/ledger-entry";
import { computeAccountBalancesByAccountId } from "./ledger-account-balances";

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

describe("computeAccountBalancesByAccountId", () => {
  it("returns an empty map for no entries", () => {
    expect(computeAccountBalancesByAccountId([])).toEqual(new Map());
  });

  it("groups entries by account before computing each balance", () => {
    const entries = [
      makeEntry({ accountId: "account-1", type: "debit", amount: 500 }),
      makeEntry({ accountId: "account-2", type: "debit", amount: 100 }),
      makeEntry({ accountId: "account-1", type: "credit", amount: 200 }),
    ];

    const balances = computeAccountBalancesByAccountId(entries);

    expect(balances.get("account-1")).toBe(300);
    expect(balances.get("account-2")).toBe(100);
  });
});
