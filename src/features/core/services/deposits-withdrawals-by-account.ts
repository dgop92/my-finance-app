import { Account } from "../entities/account";
import { LedgerEntry } from "../entities/ledger-entry";
import { DateRange } from "./ledger-entry-stats";

export interface AccountDepositsWithdrawals {
  accountId: string;
  accountName: string;
  deposits: number;
  withdrawals: number;
}

// One entry per given account (even those with no activity in range), in the
// given account order, scoped to the given date range. Deposits are debit
// entries, withdrawals are credit entries, summed per account (not per
// month, unlike computeDepositsWithdrawalsByMonth).
export function computeDepositsWithdrawalsByAccount(
  entries: LedgerEntry[],
  accounts: Account[],
  range: DateRange
): AccountDepositsWithdrawals[] {
  const totalsByAccountId = new Map<string, { deposits: number; withdrawals: number }>();
  for (const account of accounts) {
    totalsByAccountId.set(account.id, { deposits: 0, withdrawals: 0 });
  }

  for (const entry of entries) {
    const totals = totalsByAccountId.get(entry.accountId);
    if (!totals) continue;
    if (entry.date > range.end) continue;
    if (range.start !== null && entry.date < range.start) continue;

    if (entry.type === "debit") {
      totals.deposits += entry.amount;
    } else {
      totals.withdrawals += entry.amount;
    }
  }

  return accounts.map((account) => ({
    accountId: account.id,
    accountName: account.name,
    ...totalsByAccountId.get(account.id)!,
  }));
}
