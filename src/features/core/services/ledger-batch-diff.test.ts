import { describe, expect, it } from "vitest";
import { computeBatchDiffEntries } from "./ledger-batch-diff";

describe("computeBatchDiffEntries", () => {
  it("produces a debit entry when the new value is an increase", () => {
    const result = computeBatchDiffEntries(
      [{ accountId: "account-1", balance: 100 }],
      { "account-1": 150 }
    );

    expect(result).toEqual([
      { accountId: "account-1", type: "debit", amount: 50 },
    ]);
  });

  it("produces a credit entry when the new value is a decrease", () => {
    const result = computeBatchDiffEntries(
      [{ accountId: "account-1", balance: 100 }],
      { "account-1": 60 }
    );

    expect(result).toEqual([
      { accountId: "account-1", type: "credit", amount: 40 },
    ]);
  });

  it("produces no entry when the new value matches the current balance", () => {
    const result = computeBatchDiffEntries(
      [{ accountId: "account-1", balance: 100 }],
      { "account-1": 100 }
    );

    expect(result).toEqual([]);
  });

  it("treats an account with no prior entries as having an implicit balance of 0", () => {
    const result = computeBatchDiffEntries([], { "account-1": 75 });

    expect(result).toEqual([
      { accountId: "account-1", type: "debit", amount: 75 },
    ]);
  });
});
