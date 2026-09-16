import { LedgerEntry } from "../entities/ledger-entry";
import { computeAccountBalance } from "./ledger-balance";
import { getMonthWindow, MONTH_LABEL_FORMAT } from "../lib/month-bucket";

export interface NetWorthMonth {
  monthLabel: string;
  netWorth: number;
  diff: number | null;
}

// Newest month first (index 0 is the reference month, cut off at referenceDate
// itself rather than month end, since that month isn't over yet).
// accountIds optionally scopes history to a caller-chosen set of accounts (e.g.
// non-archived); when omitted, all entries are included (unchanged behavior).
export function computeNetWorthHistory(
  entries: LedgerEntry[],
  monthsCount: number,
  referenceDate: Date,
  accountIds?: Set<string>
): NetWorthMonth[] {
  const scopedEntries = accountIds ? entries.filter((entry) => accountIds.has(entry.accountId)) : entries;

  const netWorths: number[] = [];
  for (let i = 0; i < monthsCount; i++) {
    const { cutoff } = getMonthWindow(referenceDate, i);
    const entriesUpToCutoff = scopedEntries.filter((entry) => entry.date <= cutoff);
    netWorths.push(computeAccountBalance(entriesUpToCutoff));
  }

  return netWorths.map((netWorth, i) => {
    const { monthDate } = getMonthWindow(referenceDate, i);
    const olderNetWorth = netWorths[i + 1];
    return {
      monthLabel: MONTH_LABEL_FORMAT.format(monthDate),
      netWorth,
      diff: olderNetWorth === undefined ? null : netWorth - olderNetWorth,
    };
  });
}
