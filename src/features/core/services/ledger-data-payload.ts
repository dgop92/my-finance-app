import { Account, AccountSchema } from "../entities/account";
import { LedgerEntry } from "../entities/ledger-entry";
import { Expense } from "../entities/expense";
import { MonthlyReportConfig, MonthlyReportConfigSchema } from "../entities/monthly-report-config";
import { Settings, SettingsSchema } from "../entities/settings";

export interface LedgerDataPayload {
  accounts: Account[];
  ledgerEntries: LedgerEntry[];
  expenses: Expense[];
  settings: Settings;
  monthlyReportConfigs: MonthlyReportConfig[];
}

export function serializeLedgerDataPayload(payload: LedgerDataPayload): string {
  return JSON.stringify(payload, null, 2);
}

// Structural check only, per spec: presence and array-ness of the three list
// keys, plus a 'settings' object. Accounts and settings are then parsed with
// their schemas (applies field defaults / validates netSalary); ledger
// entries and expenses are trusted once that check passes. Monthly report
// configs are optional so backups made before they existed still import (as
// "no configs"), but when present they must be an array of valid configs.
export function parseLedgerDataPayload(raw: unknown): LedgerDataPayload {
  if (
    typeof raw !== "object" ||
    raw === null ||
    !Array.isArray((raw as Record<string, unknown>).accounts) ||
    !Array.isArray((raw as Record<string, unknown>).ledgerEntries) ||
    !Array.isArray((raw as Record<string, unknown>).expenses) ||
    typeof (raw as Record<string, unknown>).settings !== "object" ||
    (raw as Record<string, unknown>).settings === null
  ) {
    throw new Error(
      "Invalid file format: expected an object with 'accounts', 'ledgerEntries', and 'expenses' arrays, and a 'settings' object."
    );
  }

  const { monthlyReportConfigs = [] } = raw as Record<string, unknown>;
  if (!Array.isArray(monthlyReportConfigs)) {
    throw new Error("Invalid file format: 'monthlyReportConfigs' must be an array when present.");
  }

  const { accounts, ledgerEntries, expenses, settings } = raw as {
    accounts: Account[];
    ledgerEntries: LedgerEntry[];
    expenses: Expense[];
    settings: Settings;
  };

  return {
    accounts: accounts.map((account) => AccountSchema.parse(account)),
    ledgerEntries: ledgerEntries.map((entry) => ({
      ...entry,
      createdAt: new Date(entry.createdAt),
      date: new Date(entry.date),
    })),
    expenses: expenses.map((expense) => ({
      ...expense,
      createdAt: new Date(expense.createdAt),
      date: new Date(expense.date),
    })),
    settings: SettingsSchema.parse(settings),
    monthlyReportConfigs: monthlyReportConfigs.map((config) => MonthlyReportConfigSchema.parse(config)),
  };
}
