import { LedgerEntry } from "../entities/ledger-entry";

// accountIds optionally scopes the search to a caller-chosen set of accounts
// (e.g. non-archived); when omitted, all entries are considered. Returns null
// when there are no (scoped) entries.
export function computeOldestEntryDate(entries: LedgerEntry[], accountIds?: Set<string>): Date | null {
  return entries.reduce<Date | null>((oldest, entry) => {
    if (accountIds && !accountIds.has(entry.accountId)) return oldest;
    return oldest === null || entry.date < oldest ? entry.date : oldest;
  }, null);
}
