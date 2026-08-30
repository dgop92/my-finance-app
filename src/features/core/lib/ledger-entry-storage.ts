import { LedgerEntry } from "../entities/ledger-entry";

// No feature writes ledger entries yet (a future ticket owns that), but the
// key is shared now so account balance derivation has a stable source to read.
const LEDGER_ENTRIES_STORAGE_KEY = "financeApp:ledgerEntries";

export function loadLedgerEntries(): LedgerEntry[] {
  const raw = localStorage.getItem(LEDGER_ENTRIES_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  const parsed = JSON.parse(raw) as LedgerEntry[];
  return parsed.map((entry) => ({ ...entry, createdAt: new Date(entry.createdAt) }));
}
