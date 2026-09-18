import { LedgerEntry } from "../entities/ledger-entry";
import { DateRange } from "./ledger-entry-stats";

const DATE_LABEL_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export interface RunningBalancePoint {
  dateLabel: string;
  balance: number;
}

// Cumulative debit/credit total for a single account, over its entries
// sorted oldest first. Entries before range.start still feed the running
// total (mirroring computeNetWorthHistory, which always sums from the
// beginning of time), so the first visible point reflects the account's
// true balance at that time — but only points within [range.start, range.end]
// are returned.
export function computeRunningBalance(
  entries: LedgerEntry[],
  accountId: string,
  range: DateRange
): RunningBalancePoint[] {
  const accountEntries = entries
    .filter((entry) => entry.accountId === accountId && entry.date <= range.end)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const points: RunningBalancePoint[] = [];
  let balance = 0;
  for (const entry of accountEntries) {
    balance = entry.type === "debit" ? balance + entry.amount : balance - entry.amount;
    if (range.start === null || entry.date >= range.start) {
      points.push({ dateLabel: DATE_LABEL_FORMAT.format(entry.date), balance });
    }
  }

  return points;
}
