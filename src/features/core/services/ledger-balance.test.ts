import { describe, expect, it } from "vitest";
import { LedgerEntry } from "../entities/ledger-entry";
import { computeAccountBalance } from "./ledger-balance";

function makeEntry(overrides: Partial<LedgerEntry>): LedgerEntry {
  return {
    id: "entry-1",
    createdAt: new Date(),
    accountId: "account-1",
    type: "debit",
    amount: 100,
    ...overrides,
  };
}

describe("computeAccountBalance", () => {
  it("returns 0 for an empty entry list", () => {
    expect(computeAccountBalance([])).toBe(0);
  });

  it("sums debits and subtracts credits for a mix of entries", () => {
    const entries = [
      makeEntry({ type: "debit", amount: 500 }),
      makeEntry({ type: "credit", amount: 200 }),
      makeEntry({ type: "debit", amount: 50 }),
    ];

    expect(computeAccountBalance(entries)).toBe(350);
  });

  it("returns a negative balance when credits exceed debits", () => {
    const entries = [
      makeEntry({ type: "debit", amount: 100 }),
      makeEntry({ type: "credit", amount: 300 }),
    ];

    expect(computeAccountBalance(entries)).toBe(-200);
  });
});
