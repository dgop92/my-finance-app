import { LedgerEntry } from "../entities/ledger-entry";
import { getMonthWindow, MONTH_LABEL_FORMAT } from "../lib/month-bucket";

export interface MonthlyTransactionVolume {
  monthLabel: string;
  entryCount: number;
}

// Newest month first (index 0 is the reference month, cut off at referenceDate
// itself rather than month end, since that month isn't over yet). Counts
// entries per month regardless of debit/credit type (unlike
// computeDepositsWithdrawalsByMonth, which sums amounts). accountIds
// optionally scopes the result to a caller-chosen set of accounts (e.g.
// non-archived); when omitted, all entries are included.
export function computeMonthlyTransactionVolume(
  entries: LedgerEntry[],
  monthsCount: number,
  referenceDate: Date,
  accountIds?: Set<string>
): MonthlyTransactionVolume[] {
  const scopedEntries = accountIds ? entries.filter((entry) => accountIds.has(entry.accountId)) : entries;

  const months: MonthlyTransactionVolume[] = [];
  for (let i = 0; i < monthsCount; i++) {
    const { monthDate, cutoff } = getMonthWindow(referenceDate, i);

    let entryCount = 0;
    for (const entry of scopedEntries) {
      if (entry.date < monthDate || entry.date > cutoff) continue;
      entryCount++;
    }

    months.push({ monthLabel: MONTH_LABEL_FORMAT.format(monthDate), entryCount });
  }

  return months;
}
