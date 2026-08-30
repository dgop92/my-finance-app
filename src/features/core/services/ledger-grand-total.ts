import { Account } from "../entities/account";

export function computeGrandTotal(
  accounts: Account[],
  balanceByAccountId: Map<string, number>
): number {
  return accounts.reduce(
    (total, account) => total + (balanceByAccountId.get(account.id) ?? 0),
    0
  );
}
