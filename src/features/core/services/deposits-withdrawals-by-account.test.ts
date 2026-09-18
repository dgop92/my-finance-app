import { describe, expect, it } from "vitest";
import { Account } from "../entities/account";
import { LedgerEntry } from "../entities/ledger-entry";
import { computeDepositsWithdrawalsByAccount } from "./deposits-withdrawals-by-account";

function makeAccount(overrides: Partial<Account>): Account {
  return {
    id: "account-1",
    name: "Account",
    createdAt: new Date(),
    archived: false,
    ...overrides,
  };
}

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

describe("computeDepositsWithdrawalsByAccount", () => {
  it("returns one entry per given account with zero totals when there are no entries", () => {
    const accounts = [makeAccount({ id: "account-1" }), makeAccount({ id: "account-2" })];

    const result = computeDepositsWithdrawalsByAccount(entries(), accounts, {
      start: null,
      end: new Date("2026-09-15"),
    });

    expect(result).toEqual([
      { accountId: "account-1", accountName: "Account", deposits: 0, withdrawals: 0 },
      { accountId: "account-2", accountName: "Account", deposits: 0, withdrawals: 0 },
    ]);
  });

  it("sums debit entries as deposits and credit entries as withdrawals per account", () => {
    const accounts = [
      makeAccount({ id: "account-1", name: "Checking" }),
      makeAccount({ id: "account-2", name: "Savings" }),
    ];
    const result = computeDepositsWithdrawalsByAccount(
      entries(
        makeEntry({ accountId: "account-1", type: "debit", amount: 500, date: new Date("2026-08-05") }),
        makeEntry({ accountId: "account-1", type: "credit", amount: 100, date: new Date("2026-08-10") }),
        makeEntry({ accountId: "account-2", type: "debit", amount: 300, date: new Date("2026-08-20") })
      ),
      accounts,
      { start: null, end: new Date("2026-09-15") }
    );

    expect(result).toEqual([
      { accountId: "account-1", accountName: "Checking", deposits: 500, withdrawals: 100 },
      { accountId: "account-2", accountName: "Savings", deposits: 300, withdrawals: 0 },
    ]);
  });

  it("excludes entries outside the given date range", () => {
    const accounts = [makeAccount({ id: "account-1" })];
    const result = computeDepositsWithdrawalsByAccount(
      entries(
        makeEntry({ type: "debit", amount: 1000, date: new Date("2026-01-01") }),
        makeEntry({ type: "debit", amount: 200, date: new Date("2026-08-10") })
      ),
      accounts,
      { start: new Date("2026-08-01"), end: new Date("2026-09-15") }
    );

    expect(result[0].deposits).toBe(200);
  });

  it("treats a null start as unbounded (all time)", () => {
    const accounts = [makeAccount({ id: "account-1" })];
    const result = computeDepositsWithdrawalsByAccount(
      entries(makeEntry({ type: "debit", amount: 1000, date: new Date("2020-01-01") })),
      accounts,
      { start: null, end: new Date("2026-09-15") }
    );

    expect(result[0].deposits).toBe(1000);
  });

  it("ignores entries for accounts not in the given accounts list", () => {
    const accounts = [makeAccount({ id: "account-1" })];
    const result = computeDepositsWithdrawalsByAccount(
      entries(makeEntry({ accountId: "account-2", type: "debit", amount: 999, date: new Date("2026-08-10") })),
      accounts,
      { start: null, end: new Date("2026-09-15") }
    );

    expect(result).toEqual([
      { accountId: "account-1", accountName: "Account", deposits: 0, withdrawals: 0 },
    ]);
  });

  function entries(...items: LedgerEntry[]): LedgerEntry[] {
    return items;
  }
});
