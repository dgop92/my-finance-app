import { LedgerEntry } from "../entities/ledger-entry";

export interface LedgerEntryStats {
  avgTransactionSize: number;
  largestDeposit: number;
  largestWithdrawal: number;
  entryCount: number;
}

export interface DateRange {
  start: Date | null;
  end: Date;
}

// accountIds scopes stats to a caller-chosen set of accounts (e.g. non-archived);
// entries for accounts outside that set are ignored.
export function computeLedgerEntryStats(
  entries: LedgerEntry[],
  accountIds: Set<string>,
  range: DateRange
): LedgerEntryStats {
  const filtered = entries.filter(
    (entry) =>
      accountIds.has(entry.accountId) &&
      entry.date <= range.end &&
      (range.start === null || entry.date >= range.start)
  );

  if (filtered.length === 0) {
    return { avgTransactionSize: 0, largestDeposit: 0, largestWithdrawal: 0, entryCount: 0 };
  }

  let totalAmount = 0;
  let largestDeposit = 0;
  let largestWithdrawal = 0;
  for (const entry of filtered) {
    totalAmount += entry.amount;
    if (entry.type === "debit") {
      largestDeposit = Math.max(largestDeposit, entry.amount);
    } else {
      largestWithdrawal = Math.max(largestWithdrawal, entry.amount);
    }
  }

  return {
    avgTransactionSize: totalAmount / filtered.length,
    largestDeposit,
    largestWithdrawal,
    entryCount: filtered.length,
  };
}
