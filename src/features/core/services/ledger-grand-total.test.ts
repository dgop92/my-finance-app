import { describe, expect, it } from "vitest";
import { Account } from "../entities/account";
import { computeGrandTotal } from "./ledger-grand-total";

function makeAccount(overrides: Partial<Account>): Account {
  return {
    id: "account-1",
    name: "Account",
    createdAt: new Date(),
    archived: false,
    ...overrides,
  };
}

describe("computeGrandTotal", () => {
  it("returns 0 for no accounts", () => {
    expect(computeGrandTotal([], new Map())).toBe(0);
  });

  it("sums balances across the given accounts", () => {
    const accounts = [makeAccount({ id: "account-1" }), makeAccount({ id: "account-2" })];
    const balanceByAccountId = new Map([
      ["account-1", 500],
      ["account-2", -200],
    ]);

    expect(computeGrandTotal(accounts, balanceByAccountId)).toBe(300);
  });

  it("treats an account missing from the balance map as zero", () => {
    const accounts = [makeAccount({ id: "account-1" })];

    expect(computeGrandTotal(accounts, new Map())).toBe(0);
  });
});
