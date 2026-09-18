import { describe, expect, it } from "vitest";
import { Account } from "../entities/account";
import { computeAccountBalanceDistribution } from "./account-balance-distribution";

function makeAccount(overrides: Partial<Account>): Account {
  return {
    id: "account-1",
    name: "Account",
    createdAt: new Date(),
    archived: false,
    ...overrides,
  };
}

describe("computeAccountBalanceDistribution", () => {
  it("returns no shares and no negative accounts for no accounts", () => {
    const result = computeAccountBalanceDistribution([], new Map(), 0);

    expect(result).toEqual({ shares: [], negativeBalanceAccounts: [] });
  });

  it("puts non-negative balances in shares, each with its percentage of net worth", () => {
    const accounts = [
      makeAccount({ id: "account-1", name: "Checking" }),
      makeAccount({ id: "account-2", name: "Savings" }),
    ];
    const balanceByAccountId = new Map([
      ["account-1", 750],
      ["account-2", 250],
    ]);

    const result = computeAccountBalanceDistribution(accounts, balanceByAccountId, 1000);

    expect(result.shares).toEqual([
      { accountId: "account-1", accountName: "Checking", balance: 750, percentageOfNetWorth: 75 },
      { accountId: "account-2", accountName: "Savings", balance: 250, percentageOfNetWorth: 25 },
    ]);
    expect(result.negativeBalanceAccounts).toEqual([]);
  });

  it("excludes a zero balance from negativeBalanceAccounts (it's a valid, harmless slice)", () => {
    const accounts = [makeAccount({ id: "account-1" })];
    const balanceByAccountId = new Map([["account-1", 0]]);

    const result = computeAccountBalanceDistribution(accounts, balanceByAccountId, 1000);

    expect(result.shares).toHaveLength(1);
    expect(result.negativeBalanceAccounts).toEqual([]);
  });

  it("routes negative balances to negativeBalanceAccounts instead of shares", () => {
    const accounts = [
      makeAccount({ id: "account-1", name: "Checking" }),
      makeAccount({ id: "account-2", name: "Credit Card" }),
    ];
    const balanceByAccountId = new Map([
      ["account-1", 1200],
      ["account-2", -200],
    ]);

    const result = computeAccountBalanceDistribution(accounts, balanceByAccountId, 1000);

    expect(result.shares).toEqual([
      { accountId: "account-1", accountName: "Checking", balance: 1200, percentageOfNetWorth: 120 },
    ]);
    expect(result.negativeBalanceAccounts).toEqual([
      { accountId: "account-2", accountName: "Credit Card", balance: -200, percentageOfNetWorth: -20 },
    ]);
  });

  it("treats an account missing from the balance map as a zero balance", () => {
    const accounts = [makeAccount({ id: "account-1" })];

    const result = computeAccountBalanceDistribution(accounts, new Map(), 1000);

    expect(result.shares).toEqual([
      { accountId: "account-1", accountName: "Account", balance: 0, percentageOfNetWorth: 0 },
    ]);
  });

  it("reports 0% for every account when net worth is zero, instead of dividing by zero", () => {
    const accounts = [makeAccount({ id: "account-1" })];
    const balanceByAccountId = new Map([["account-1", 500]]);

    const result = computeAccountBalanceDistribution(accounts, balanceByAccountId, 0);

    expect(result.shares[0].percentageOfNetWorth).toBe(0);
  });
});
