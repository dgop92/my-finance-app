import { describe, expect, it } from "vitest";
import { computeBatchDiffEntries } from "./ledger-batch-diff";

const date = new Date("2026-01-01");

describe("computeBatchDiffEntries", () => {
  it("produces a debit entry when the new value is an increase", () => {
    const result = computeBatchDiffEntries(
      [{ accountId: "account-1", balance: 100 }],
      { "account-1": 150 },
      date
    );

    expect(result).toEqual([
      { accountId: "account-1", type: "debit", amount: 50, date },
    ]);
  });

  it("produces a credit entry when the new value is a decrease", () => {
    const result = computeBatchDiffEntries(
      [{ accountId: "account-1", balance: 100 }],
      { "account-1": 60 },
      date
    );

    expect(result).toEqual([
      { accountId: "account-1", type: "credit", amount: 40, date },
    ]);
  });

  it("produces no entry when the new value matches the current balance", () => {
    const result = computeBatchDiffEntries(
      [{ accountId: "account-1", balance: 100 }],
      { "account-1": 100 },
      date
    );

    expect(result).toEqual([]);
  });

  it("treats an account with no prior entries as having an implicit balance of 0", () => {
    const result = computeBatchDiffEntries([], { "account-1": 75 }, date);

    expect(result).toEqual([
      { accountId: "account-1", type: "debit", amount: 75, date },
    ]);
  });
});
