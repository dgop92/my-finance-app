import { LedgerEntry } from "../entities/ledger-entry";

// Expects entries already filtered to a single account; entries from
// multiple accounts will silently produce a meaningless total.
export function computeAccountBalance(entries: LedgerEntry[]): number {
  return entries.reduce((balance, entry) => {
    return entry.type === "debit" ? balance + entry.amount : balance - entry.amount;
  }, 0);
}
