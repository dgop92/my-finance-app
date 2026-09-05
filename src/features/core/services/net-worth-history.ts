import { LedgerEntry } from "../entities/ledger-entry";
import { computeAccountBalance } from "./ledger-balance";

export interface NetWorthMonth {
  monthLabel: string;
  netWorth: number;
  diff: number | null;
}

const MONTH_LABEL_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

// Newest month first (index 0 is the reference month, cut off at referenceDate
// itself rather than month end, since that month isn't over yet).
export function computeNetWorthHistory(
  entries: LedgerEntry[],
  monthsCount: number,
  referenceDate: Date
): NetWorthMonth[] {
  const netWorths: number[] = [];
  for (let i = 0; i < monthsCount; i++) {
    const monthDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
    const cutoff = i === 0 ? referenceDate : endOfMonth(monthDate);
    const entriesUpToCutoff = entries.filter((entry) => entry.date <= cutoff);
    netWorths.push(computeAccountBalance(entriesUpToCutoff));
  }

  return netWorths.map((netWorth, i) => {
    const monthDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
    const olderNetWorth = netWorths[i + 1];
    return {
      monthLabel: MONTH_LABEL_FORMAT.format(monthDate),
      netWorth,
      diff: olderNetWorth === undefined ? null : netWorth - olderNetWorth,
    };
  });
}
