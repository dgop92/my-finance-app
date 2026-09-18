import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNetWorth } from "@/features/accounts/pages/hooks/use-net-worth";
import { computeLedgerEntryStats } from "@/features/core/services/ledger-entry-stats";
import { computeNetWorthHistory } from "@/features/core/services/net-worth-history";
import { computeDepositsWithdrawalsByMonth } from "@/features/core/services/deposits-withdrawals-by-month";
import { computeDepositsWithdrawalsByAccount } from "@/features/core/services/deposits-withdrawals-by-account";
import { computeAccountBalanceDistribution } from "@/features/core/services/account-balance-distribution";
import { computeOldestEntryDate } from "@/features/core/services/oldest-entry-date";
import { computeRunningBalance } from "@/features/core/services/running-balance";
import { computeMonthlyTransactionVolume } from "@/features/core/services/monthly-transaction-volume";
import { ledgerEntryRepository } from "@/features/ledger-entries/repositories/repository.factory";
import { getTimeRangeMonthsCount, getTimeRangeStart, TimeRange } from "@/features/analytics/lib/time-range";

export const useAnalytics = (timeRange: TimeRange, selectedAccountId?: string) => {
  const {
    accounts,
    balanceByAccountId,
    netWorth,
    isPending: isNetWorthPending,
    error: netWorthError,
  } = useNetWorth();
  const {
    data: entries,
    isPending: isEntriesPending,
    error: entriesError,
  } = useQuery({
    queryKey: ["ledgerEntries"],
    queryFn: () => ledgerEntryRepository.getMany(),
  });

  // Shared across all derivations below so the trend series and the month
  // count they're built from never disagree on "now".
  const now = useMemo(() => new Date(), []);

  const accountIds = useMemo(
    () => (accounts ? new Set(accounts.map((account) => account.id)) : undefined),
    [accounts]
  );

  const stats = useMemo(() => {
    if (!entries || !accountIds) return undefined;

    return computeLedgerEntryStats(entries, accountIds, {
      start: getTimeRangeStart(timeRange, now),
      end: now,
    });
  }, [entries, accountIds, timeRange, now]);

  const monthsCount = useMemo(() => {
    if (!entries || !accountIds) return undefined;

    const oldestDate = computeOldestEntryDate(entries, accountIds);
    return getTimeRangeMonthsCount(timeRange, oldestDate, now);
  }, [entries, accountIds, timeRange, now]);

  // Both trends read oldest-first, left-to-right, matching how the charts render them.
  const netWorthTrend = useMemo(() => {
    if (!entries || !accountIds || monthsCount === undefined) return undefined;
    return [...computeNetWorthHistory(entries, monthsCount, now, accountIds)].reverse();
  }, [entries, accountIds, monthsCount, now]);

  const depositsWithdrawalsTrend = useMemo(() => {
    if (!entries || !accountIds || monthsCount === undefined) return undefined;
    return [...computeDepositsWithdrawalsByMonth(entries, monthsCount, now, accountIds)].reverse();
  }, [entries, accountIds, monthsCount, now]);

  // Point-in-time view of current balances, unaffected by the time-range selector.
  const balanceDistribution = useMemo(() => {
    if (!accounts || !balanceByAccountId || netWorth === undefined) return undefined;
    return computeAccountBalanceDistribution(accounts, balanceByAccountId, netWorth);
  }, [accounts, balanceByAccountId, netWorth]);

  const depositsWithdrawalsByAccount = useMemo(() => {
    if (!entries || !accounts) return undefined;
    return computeDepositsWithdrawalsByAccount(entries, accounts, {
      start: getTimeRangeStart(timeRange, now),
      end: now,
    });
  }, [entries, accounts, timeRange, now]);

  const runningBalance = useMemo(() => {
    if (!entries || !selectedAccountId) return undefined;
    return computeRunningBalance(entries, selectedAccountId, {
      start: getTimeRangeStart(timeRange, now),
      end: now,
    });
  }, [entries, selectedAccountId, timeRange, now]);

  const monthlyTransactionVolume = useMemo(() => {
    if (!entries || !accountIds || monthsCount === undefined) return undefined;
    return [...computeMonthlyTransactionVolume(entries, monthsCount, now, accountIds)].reverse();
  }, [entries, accountIds, monthsCount, now]);

  return {
    netWorth,
    stats,
    netWorthTrend,
    depositsWithdrawalsTrend,
    balanceDistribution,
    depositsWithdrawalsByAccount,
    runningBalance,
    monthlyTransactionVolume,
    isPending: isNetWorthPending || isEntriesPending,
    error: netWorthError ?? entriesError,
  };
};
