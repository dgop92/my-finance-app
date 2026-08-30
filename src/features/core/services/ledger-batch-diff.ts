import { CreateLedgerEntryInput } from "../entities/ledger-entry";

export interface AccountWithBalance {
  accountId: string;
  balance: number;
}

export function computeBatchDiffEntries(
  accountsWithBalances: AccountWithBalance[],
  newValuesByAccountId: Record<string, number>
): CreateLedgerEntryInput[] {
  const balanceByAccountId = new Map(
    accountsWithBalances.map((account) => [account.accountId, account.balance])
  );

  const entries: CreateLedgerEntryInput[] = [];

  for (const [accountId, newValue] of Object.entries(newValuesByAccountId)) {
    const currentBalance = balanceByAccountId.get(accountId) ?? 0;
    const diff = newValue - currentBalance;

    if (diff === 0) {
      continue;
    }

    entries.push({
      accountId,
      type: diff > 0 ? "debit" : "credit",
      amount: Math.abs(diff),
    });
  }

  return entries;
}
