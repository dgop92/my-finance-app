import { Account } from "../entities/account";
import { LedgerEntry } from "../entities/ledger-entry";

export interface LedgerDataPayload {
  accounts: Account[];
  ledgerEntries: LedgerEntry[];
}

export function serializeLedgerDataPayload(payload: LedgerDataPayload): string {
  return JSON.stringify(payload, null, 2);
}

// Structural check only, per spec: presence and array-ness of both keys.
// Individual record shapes are trusted once that check passes.
export function parseLedgerDataPayload(raw: unknown): LedgerDataPayload {
  if (
    typeof raw !== "object" ||
    raw === null ||
    !Array.isArray((raw as Record<string, unknown>).accounts) ||
    !Array.isArray((raw as Record<string, unknown>).ledgerEntries)
  ) {
    throw new Error(
      "Invalid file format: expected an object with 'accounts' and 'ledgerEntries' arrays."
    );
  }

  const { accounts, ledgerEntries } = raw as {
    accounts: Account[];
    ledgerEntries: LedgerEntry[];
  };

  return {
    accounts: accounts.map((account) => ({
      ...account,
      createdAt: new Date(account.createdAt),
    })),
    ledgerEntries: ledgerEntries.map((entry) => ({
      ...entry,
      createdAt: new Date(entry.createdAt),
      date: new Date(entry.date),
    })),
  };
}
