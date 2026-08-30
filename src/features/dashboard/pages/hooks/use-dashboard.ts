import { useAccounts } from "@/features/accounts/pages/hooks/use-accounts";
import { useAccountBalances } from "@/features/accounts/pages/hooks/use-account-balances";
import { computeGrandTotal } from "@/features/core/services/ledger-grand-total";

export const useDashboard = () => {
  const { data: accounts, isPending: isAccountsPending, error: accountsError } =
    useAccounts(false);
  const { data: balanceByAccountId, isPending: isBalancesPending, error: balancesError } =
    useAccountBalances();

  const grandTotal =
    accounts && balanceByAccountId ? computeGrandTotal(accounts, balanceByAccountId) : undefined;

  return {
    accounts,
    balanceByAccountId,
    grandTotal,
    isPending: isAccountsPending || isBalancesPending,
    error: accountsError ?? balancesError,
  };
};
