import { Account } from "../entities/account";
import { Expense, ExpenseType } from "../entities/expense";
import { LedgerEntry } from "../entities/ledger-entry";
import { Settings } from "../entities/settings";
import { endOfMonth } from "../lib/month-bucket";
import { computeAccountBalance } from "./ledger-balance";

// A savings-account deposit at or above this amount is treated as interest
// rather than a regular transfer. Not yet configurable.
export const INTEREST_THRESHOLD = 1_000_000;

// Manual other income has no input yet, so it is always zero.
const MANUAL_OTHER_INCOME = 0;

// month is zero-based, matching Date#getMonth.
export interface ReportMonth {
  year: number;
  month: number;
}

export interface MonthlyReportInput {
  entries: LedgerEntry[];
  expenses: Expense[];
  accounts: Account[];
  settings: Settings;
  month: ReportMonth;
}

export interface CategoryShare {
  type: ExpenseType;
  amount: number;
  percentage: number;
}

export interface KnownVsUnknown {
  knownPercentage: number;
  unknownPercentage: number;
}

export interface MonthlyReport {
  totalSaved: number;
  knownExpenses: number;
  categoryBreakdown: CategoryShare[];
  netSalary: number;
  interestFromSavings: number;
  otherIncome: number;
  unknownExpenses: number;
  // Null when unknownExpenses is negative (shown as unexplained income
  // instead) or when there is nothing to split (known and unknown are both 0).
  knownVsUnknown: KnownVsUnknown | null;
}

function startOfMonth(month: ReportMonth): Date {
  return new Date(month.year, month.month, 1);
}

function previousMonth(month: ReportMonth): ReportMonth {
  const date = new Date(month.year, month.month - 1, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

function isInMonth(date: Date, month: ReportMonth): boolean {
  return date >= startOfMonth(month) && date <= endOfMonth(startOfMonth(month));
}

function computeNetWorthAtEndOf(entries: LedgerEntry[], month: ReportMonth, accountIds: Set<string>): number {
  const cutoff = endOfMonth(startOfMonth(month));
  return computeAccountBalance(entries.filter((entry) => accountIds.has(entry.accountId) && entry.date <= cutoff));
}

function computeCategoryBreakdown(expenses: Expense[], knownExpenses: number): CategoryShare[] {
  const amountByType = new Map<ExpenseType, number>();
  for (const expense of expenses) {
    amountByType.set(expense.type, (amountByType.get(expense.type) ?? 0) + expense.amount);
  }

  return [...amountByType.entries()]
    .filter(([, amount]) => amount > 0)
    .map(([type, amount]) => ({ type, amount, percentage: (amount / knownExpenses) * 100 }))
    .sort((a, b) => b.amount - a.amount || a.type.localeCompare(b.type));
}

// Known expenses intentionally come from the month *before* the selected one;
// total saved, net salary and interest all belong to the selected month itself.
export function computeMonthlyReport({ entries, expenses, accounts, settings, month }: MonthlyReportInput): MonthlyReport {
  const accountIds = new Set(accounts.map((account) => account.id));
  const previous = previousMonth(month);

  const totalSaved =
    computeNetWorthAtEndOf(entries, month, accountIds) - computeNetWorthAtEndOf(entries, previous, accountIds);

  const knownExpenseItems = expenses.filter((expense) => isInMonth(expense.date, previous));
  const knownExpenses = knownExpenseItems.reduce((sum, expense) => sum + expense.amount, 0);
  const categoryBreakdown = computeCategoryBreakdown(knownExpenseItems, knownExpenses);

  const savingAccountIds = new Set(accounts.filter((account) => account.isSavingAccount).map((account) => account.id));
  // debit = money in (see LedgerEntry sign convention), i.e. a deposit.
  const interestFromSavings = entries
    .filter(
      (entry) =>
        entry.type === "debit" &&
        savingAccountIds.has(entry.accountId) &&
        entry.amount >= INTEREST_THRESHOLD &&
        isInMonth(entry.date, month)
    )
    .reduce((sum, entry) => sum + entry.amount, 0);

  const netSalary = settings.netSalary;
  const otherIncome = interestFromSavings + MANUAL_OTHER_INCOME;
  const unknownExpenses = netSalary + otherIncome - knownExpenses - totalSaved;

  const splitTotal = knownExpenses + unknownExpenses;
  const knownVsUnknown: KnownVsUnknown | null =
    unknownExpenses < 0 || splitTotal === 0
      ? null
      : {
          knownPercentage: (knownExpenses / splitTotal) * 100,
          unknownPercentage: (unknownExpenses / splitTotal) * 100,
        };

  return {
    totalSaved,
    knownExpenses,
    categoryBreakdown,
    netSalary,
    interestFromSavings,
    otherIncome,
    unknownExpenses,
    knownVsUnknown,
  };
}
