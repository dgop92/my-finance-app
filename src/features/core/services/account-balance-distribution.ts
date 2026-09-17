import { Account } from "../entities/account";

export interface AccountBalanceShare {
  accountId: string;
  accountName: string;
  balance: number;
  percentageOfNetWorth: number;
}

export interface AccountBalanceDistribution {
  shares: AccountBalanceShare[];
  negativeBalanceAccounts: AccountBalanceShare[];
}

// Splits accounts into non-negative shares (safe to render as donut slices)
// and negative balances (a negative slice is meaningless in a share-of-total
// chart, so callers show these in a separate callout instead). Caller passes
// only the accounts that should be considered (e.g. non-archived).
export function computeAccountBalanceDistribution(
  accounts: Account[],
  balanceByAccountId: Map<string, number>,
  netWorth: number
): AccountBalanceDistribution {
  const shares: AccountBalanceShare[] = [];
  const negativeBalanceAccounts: AccountBalanceShare[] = [];

  for (const account of accounts) {
    const balance = balanceByAccountId.get(account.id) ?? 0;
    const percentageOfNetWorth = netWorth !== 0 ? (balance / netWorth) * 100 : 0;
    const share: AccountBalanceShare = {
      accountId: account.id,
      accountName: account.name,
      balance,
      percentageOfNetWorth,
    };

    if (balance < 0) {
      negativeBalanceAccounts.push(share);
    } else {
      shares.push(share);
    }
  }

  return { shares, negativeBalanceAccounts };
}
