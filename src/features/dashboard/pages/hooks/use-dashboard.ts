import { useNetWorth } from "@/features/accounts/pages/hooks/use-net-worth";

export const useDashboard = () => {
  const { accounts, balanceByAccountId, netWorth: grandTotal, isPending, error } = useNetWorth();

  return {
    accounts,
    balanceByAccountId,
    grandTotal,
    isPending,
    error,
  };
};
