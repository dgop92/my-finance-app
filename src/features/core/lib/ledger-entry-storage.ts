import { LedgerEntry } from "../entities/ledger-entry";

// Storage key shared across features: the ledger-entries feature owns writes,
// while accounts reads through here to derive balances.
const LEDGER_ENTRIES_STORAGE_KEY = "financeApp:ledgerEntries";

export function loadLedgerEntries(): LedgerEntry[] {
  const raw = localStorage.getItem(LEDGER_ENTRIES_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  const parsed = JSON.parse(raw) as LedgerEntry[];
  return parsed.map((entry) => ({
    ...entry,
    createdAt: new Date(entry.createdAt),
    date: new Date(entry.date),
  }));
}

export function saveLedgerEntries(entries: LedgerEntry[]): void {
  localStorage.setItem(LEDGER_ENTRIES_STORAGE_KEY, JSON.stringify(entries));
}
