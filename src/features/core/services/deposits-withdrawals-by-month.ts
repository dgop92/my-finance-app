import { LedgerEntry } from "../entities/ledger-entry";
import { getMonthWindow, MONTH_LABEL_FORMAT } from "../lib/month-bucket";

export interface DepositsWithdrawalsMonth {
  monthLabel: string;
  deposits: number;
  withdrawals: number;
}

// Newest month first (index 0 is the reference month, cut off at referenceDate
// itself rather than month end, since that month isn't over yet). Deposits are
// debit entries, withdrawals are credit entries, summed per month (not
// cumulative, unlike computeNetWorthHistory). accountIds optionally scopes the
// result to a caller-chosen set of accounts (e.g. non-archived); when omitted,
// all entries are included.
export function computeDepositsWithdrawalsByMonth(
  entries: LedgerEntry[],
  monthsCount: number,
  referenceDate: Date,
  accountIds?: Set<string>
): DepositsWithdrawalsMonth[] {
  const scopedEntries = accountIds ? entries.filter((entry) => accountIds.has(entry.accountId)) : entries;

  const months: DepositsWithdrawalsMonth[] = [];
  for (let i = 0; i < monthsCount; i++) {
    const { monthDate, cutoff } = getMonthWindow(referenceDate, i);

    let deposits = 0;
    let withdrawals = 0;
    for (const entry of scopedEntries) {
      if (entry.date < monthDate || entry.date > cutoff) continue;
      if (entry.type === "debit") {
        deposits += entry.amount;
      } else {
        withdrawals += entry.amount;
      }
    }

    months.push({ monthLabel: MONTH_LABEL_FORMAT.format(monthDate), deposits, withdrawals });
  }

  return months;
}
