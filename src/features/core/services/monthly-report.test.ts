import { describe, expect, it } from "vitest";
import { Account } from "../entities/account";
import { Expense } from "../entities/expense";
import { LedgerEntry } from "../entities/ledger-entry";
import { Settings } from "../entities/settings";
import { DEFAULT_SAVING_ACCOUNT_DEPOSIT_THRESHOLD as INTEREST_THRESHOLD } from "../entities/monthly-report-config";
import { computeMonthlyReport, MonthlyReportInput } from "./monthly-report";

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

function makeExpense(overrides: Partial<Expense>): Expense {
  return {
    id: "expense-1",
    createdAt: new Date(),
    date: new Date(),
    amount: 100,
    notes: "",
    type: "groceries",
    ...overrides,
  };
}

function makeAccount(overrides: Partial<Account>): Account {
  return {
    id: "account-1",
    name: "Account",
    createdAt: new Date(),
    archived: false,
    isSavingAccount: false,
    ...overrides,
  };
}

const SETTINGS: Settings = { netSalary: 5_000_000 };

// September 2026 is the selected month throughout; August is its "previous" month.
function makeInput(overrides: Partial<MonthlyReportInput>): MonthlyReportInput {
  return {
    entries: [],
    expenses: [],
    accounts: [makeAccount({ id: "account-1" })],
    settings: SETTINGS,
    month: { year: 2026, month: 8 },
    ...overrides,
  };
}

describe("computeMonthlyReport", () => {
  describe("one-month lag", () => {
    it("sums known expenses from the previous calendar month only, not the selected month", () => {
      const expenses = [
        makeExpense({ amount: 300, date: new Date(2026, 7, 10) }),
        makeExpense({ amount: 200, date: new Date(2026, 7, 31, 23, 59) }),
        makeExpense({ amount: 9_999, date: new Date(2026, 8, 5) }),
        makeExpense({ amount: 9_999, date: new Date(2026, 6, 31) }),
      ];

      const result = computeMonthlyReport(makeInput({ expenses }));

      expect(result.knownExpenses).toBe(500);
    });

    it("wraps the previous month across a year boundary for January", () => {
      const expenses = [
        makeExpense({ amount: 400, date: new Date(2025, 11, 15) }),
        makeExpense({ amount: 9_999, date: new Date(2026, 0, 15) }),
      ];

      const result = computeMonthlyReport(makeInput({ expenses, month: { year: 2026, month: 0 } }));

      expect(result.knownExpenses).toBe(400);
    });

    it("takes net salary from settings without any month scoping", () => {
      const result = computeMonthlyReport(makeInput({ settings: { netSalary: 7_000_000 } }));

      expect(result.netSalary).toBe(7_000_000);
    });

    it("computes total saved as net worth at selected month end minus net worth at previous month end", () => {
      const entries = [
        makeEntry({ type: "debit", amount: 1000, date: new Date(2026, 6, 10) }),
        makeEntry({ type: "debit", amount: 700, date: new Date(2026, 7, 31, 23, 59) }),
        makeEntry({ type: "credit", amount: 200, date: new Date(2026, 8, 12) }),
        makeEntry({ type: "debit", amount: 50, date: new Date(2026, 8, 30, 23, 59) }),
        // After the selected month; must not count.
        makeEntry({ type: "debit", amount: 9_999, date: new Date(2026, 9, 1) }),
      ];

      const result = computeMonthlyReport(makeInput({ entries }));

      expect(result.totalSaved).toBe(-150);
    });

    it("reports a negative total saved when more money left than came in during the month", () => {
      const entries = [
        makeEntry({ type: "debit", amount: 1000, date: new Date(2026, 7, 10) }),
        makeEntry({ type: "credit", amount: 600, date: new Date(2026, 8, 10) }),
      ];

      const result = computeMonthlyReport(makeInput({ entries }));

      expect(result.totalSaved).toBe(-600);
    });

    it("scopes net worth to the provided accounts, ignoring entries of unknown accounts", () => {
      const entries = [
        makeEntry({ accountId: "account-1", type: "debit", amount: 1000, date: new Date(2026, 8, 10) }),
        makeEntry({ accountId: "ghost", type: "debit", amount: 500, date: new Date(2026, 8, 10) }),
      ];

      const result = computeMonthlyReport(makeInput({ entries }));

      expect(result.totalSaved).toBe(1000);
    });
  });

  describe("category breakdown", () => {
    it("groups known expenses by type as percentages of known expenses", () => {
      const expenses = [
        makeExpense({ type: "groceries", amount: 300, date: new Date(2026, 7, 2) }),
        makeExpense({ type: "groceries", amount: 200, date: new Date(2026, 7, 3) }),
        makeExpense({ type: "transport", amount: 250, date: new Date(2026, 7, 4) }),
        makeExpense({ type: "health", amount: 250, date: new Date(2026, 7, 5) }),
      ];

      const result = computeMonthlyReport(makeInput({ expenses }));

      expect(result.categoryBreakdown).toEqual([
        { type: "groceries", amount: 500, percentage: 50 },
        { type: "health", amount: 250, percentage: 25 },
        { type: "transport", amount: 250, percentage: 25 },
      ]);
    });

    it("omits categories with no expenses in the previous month", () => {
      const expenses = [
        makeExpense({ type: "groceries", amount: 100, date: new Date(2026, 7, 2) }),
        // Other months must not make a category appear.
        makeExpense({ type: "travel", amount: 100, date: new Date(2026, 8, 2) }),
      ];

      const result = computeMonthlyReport(makeInput({ expenses }));

      expect(result.categoryBreakdown.map((category) => category.type)).toEqual(["groceries"]);
    });

    it("sorts categories by percentage descending", () => {
      const expenses = [
        makeExpense({ type: "transport", amount: 100, date: new Date(2026, 7, 2) }),
        makeExpense({ type: "shopping", amount: 300, date: new Date(2026, 7, 3) }),
      ];

      const result = computeMonthlyReport(makeInput({ expenses }));

      expect(result.categoryBreakdown.map((category) => category.type)).toEqual(["shopping", "transport"]);
    });

    it("returns an empty breakdown when there are no known expenses", () => {
      const result = computeMonthlyReport(makeInput({}));

      expect(result.knownExpenses).toBe(0);
      expect(result.categoryBreakdown).toEqual([]);
    });
  });

  describe("interest from savings", () => {
    const savings = makeAccount({ id: "savings", isSavingAccount: true });
    const checking = makeAccount({ id: "checking", isSavingAccount: false });

    it("counts small debit entries on savings accounts in the selected month and ignores large transfers", () => {
      const entries = [
        makeEntry({ accountId: "savings", type: "debit", amount: 100_000, date: new Date(2026, 8, 4) }),
        makeEntry({ accountId: "savings", type: "debit", amount: INTEREST_THRESHOLD - 1, date: new Date(2026, 8, 10) }),
        makeEntry({ accountId: "savings", type: "debit", amount: 2_000_000, date: new Date(2026, 8, 14) }),
      ];

      const result = computeMonthlyReport(makeInput({ entries, accounts: [savings, checking] }));

      expect(result.interestFromSavings).toBe(100_000 + INTEREST_THRESHOLD - 1);
    });

    it("ignores debit entries at or above the threshold", () => {
      const entries = [
        makeEntry({ accountId: "savings", type: "debit", amount: INTEREST_THRESHOLD, date: new Date(2026, 8, 10) }),
      ];

      const result = computeMonthlyReport(makeInput({ entries, accounts: [savings] }));

      expect(result.interestFromSavings).toBe(0);
    });

    it("ignores credit entries on a savings account", () => {
      const entries = [
        makeEntry({ accountId: "savings", type: "credit", amount: 100_000, date: new Date(2026, 8, 10) }),
      ];

      const result = computeMonthlyReport(makeInput({ entries, accounts: [savings] }));

      expect(result.interestFromSavings).toBe(0);
    });

    it("ignores entries on accounts that are not savings accounts", () => {
      const entries = [
        makeEntry({ accountId: "checking", type: "debit", amount: 100_000, date: new Date(2026, 8, 10) }),
      ];

      const result = computeMonthlyReport(makeInput({ entries, accounts: [checking] }));

      expect(result.interestFromSavings).toBe(0);
    });

    it("ignores entries outside the selected month, including the previous month", () => {
      const entries = [
        makeEntry({ accountId: "savings", type: "debit", amount: 100_000, date: new Date(2026, 7, 31, 23, 59) }),
        makeEntry({ accountId: "savings", type: "debit", amount: 200_000, date: new Date(2026, 9, 1) }),
      ];

      const result = computeMonthlyReport(makeInput({ entries, accounts: [savings] }));

      expect(result.interestFromSavings).toBe(0);
    });

    it("sets other income to interest from savings plus zero manual income", () => {
      const entries = [
        makeEntry({ accountId: "savings", type: "debit", amount: 100_000, date: new Date(2026, 8, 10) }),
      ];

      const result = computeMonthlyReport(makeInput({ entries, accounts: [savings] }));

      expect(result.otherIncome).toBe(100_000);
    });
  });

  describe("per-month config", () => {
    const savings = makeAccount({ id: "savings", isSavingAccount: true });
    const deposit = (amount: number) =>
      makeEntry({ accountId: "savings", type: "debit", amount, date: new Date(2026, 8, 10) });

    it("uses the net salary override instead of the settings net salary", () => {
      const result = computeMonthlyReport(makeInput({ config: { netSalaryOverride: 6_500_000 } }));

      expect(result.netSalary).toBe(6_500_000);
    });

    it("adds manual other income on top of interest", () => {
      const result = computeMonthlyReport(
        makeInput({ entries: [deposit(100_000)], accounts: [savings], config: { manualOtherIncome: 300_000 } })
      );

      expect(result.interestFromSavings).toBe(100_000);
      expect(result.otherIncome).toBe(400_000);
    });

    it("counts only deposits below a custom threshold as interest", () => {
      const result = computeMonthlyReport(
        makeInput({
          entries: [deposit(300_000), deposit(600_000)],
          accounts: [savings],
          config: { savingAccountDepositThreshold: 500_000 },
        })
      );

      expect(result.interestFromSavings).toBe(300_000);
    });

    it("ignores savings deposits when automatic interest is disabled but keeps manual income", () => {
      const result = computeMonthlyReport(
        makeInput({
          entries: [deposit(100_000)],
          accounts: [savings],
          config: { automaticInterestEnabled: false, manualOtherIncome: 300_000 },
        })
      );

      expect(result.interestFromSavings).toBe(0);
      expect(result.otherIncome).toBe(300_000);
    });
  });

  describe("unknown expenses", () => {
    it("computes unknown expenses as net salary + other income - known expenses - total saved", () => {
      const savings = makeAccount({ id: "savings", isSavingAccount: true });
      const entries = [
        makeEntry({ accountId: "savings", type: "debit", amount: 500_000, date: new Date(2026, 8, 10) }),
        makeEntry({ accountId: "account-1", type: "debit", amount: 1_000_000, date: new Date(2026, 8, 11) }),
      ];
      const expenses = [makeExpense({ amount: 1_500_000, date: new Date(2026, 7, 10) })];

      const result = computeMonthlyReport(makeInput({ entries, expenses, accounts: [makeAccount({}), savings] }));

      // 5_000_000 + 500_000 - 1_500_000 - 1_500_000
      expect(result.unknownExpenses).toBe(2_500_000);
    });

    it("still produces the breakdown when unknown expenses are exactly zero", () => {
      const expenses = [makeExpense({ amount: 1_000_000, date: new Date(2026, 7, 10) })];
      const entries = [makeEntry({ type: "debit", amount: 2_000_000, date: new Date(2026, 8, 10) })];

      const result = computeMonthlyReport(makeInput({ entries, expenses, settings: { netSalary: 3_000_000 } }));

      // unknown = 3_000_000 + 0 - 1_000_000 - 2_000_000 = 0
      expect(result.unknownExpenses).toBe(0);
      expect(result.knownVsUnknown).toEqual({ knownPercentage: 100, unknownPercentage: 0 });
    });

    it("produces no breakdown when both known and unknown expenses are zero, since there is nothing to split", () => {
      const result = computeMonthlyReport(makeInput({ settings: { netSalary: 0 } }));

      expect(result.unknownExpenses).toBe(0);
      expect(result.knownVsUnknown).toBeNull();
    });

    it("splits percentages between known and unknown expenses", () => {
      const expenses = [makeExpense({ amount: 1_000_000, date: new Date(2026, 7, 10) })];

      const result = computeMonthlyReport(makeInput({ expenses, settings: { netSalary: 4_000_000 } }));

      // unknown = 4_000_000 - 1_000_000 - 0 = 3_000_000
      expect(result.unknownExpenses).toBe(3_000_000);
      expect(result.knownVsUnknown).toEqual({ knownPercentage: 25, unknownPercentage: 75 });
    });

    it("suppresses the chart and keeps the negative value when unknown expenses are negative", () => {
      const entries = [makeEntry({ type: "debit", amount: 6_000_000, date: new Date(2026, 8, 10) })];

      const result = computeMonthlyReport(makeInput({ entries }));

      // unknown = 5_000_000 - 0 - 6_000_000 = -1_000_000
      expect(result.unknownExpenses).toBe(-1_000_000);
      expect(result.knownVsUnknown).toBeNull();
    });
  });
});
