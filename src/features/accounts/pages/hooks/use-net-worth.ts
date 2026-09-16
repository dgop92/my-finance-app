import { useAccounts } from "./use-accounts";
import { useAccountBalances } from "./use-account-balances";
import { computeGrandTotal } from "@/features/core/services/ledger-grand-total";

// Current total balance across non-archived accounts.
export const useNetWorth = () => {
  const {
    data: accounts,
    isPending: isAccountsPending,
    error: accountsError,
  } = useAccounts(false);
  const {
    data: balanceByAccountId,
    isPending: isBalancesPending,
    error: balancesError,
  } = useAccountBalances();

  const netWorth =
    accounts && balanceByAccountId ? computeGrandTotal(accounts, balanceByAccountId) : undefined;

  return {
    accounts,
    balanceByAccountId,
    netWorth,
    isPending: isAccountsPending || isBalancesPending,
    error: accountsError ?? balancesError,
  };
};
