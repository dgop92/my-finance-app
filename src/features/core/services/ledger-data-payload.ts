import { Account, AccountSchema } from "../entities/account";
import { LedgerEntry } from "../entities/ledger-entry";
import { Expense } from "../entities/expense";

export interface LedgerDataPayload {
  accounts: Account[];
  ledgerEntries: LedgerEntry[];
  expenses: Expense[];
}

export function serializeLedgerDataPayload(payload: LedgerDataPayload): string {
  return JSON.stringify(payload, null, 2);
}

// Structural check only, per spec: presence and array-ness of all three keys.
// Individual record shapes are trusted once that check passes.
export function parseLedgerDataPayload(raw: unknown): LedgerDataPayload {
  if (
    typeof raw !== "object" ||
    raw === null ||
    !Array.isArray((raw as Record<string, unknown>).accounts) ||
    !Array.isArray((raw as Record<string, unknown>).ledgerEntries) ||
    !Array.isArray((raw as Record<string, unknown>).expenses)
  ) {
    throw new Error(
      "Invalid file format: expected an object with 'accounts', 'ledgerEntries', and 'expenses' arrays."
    );
  }

  const { accounts, ledgerEntries, expenses } = raw as {
    accounts: Account[];
    ledgerEntries: LedgerEntry[];
    expenses: Expense[];
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
  };
}
