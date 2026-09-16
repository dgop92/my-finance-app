import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNetWorth } from "@/features/accounts/pages/hooks/use-net-worth";
import { computeLedgerEntryStats } from "@/features/core/services/ledger-entry-stats";
import { ledgerEntryRepository } from "@/features/ledger-entries/repositories/repository.factory";
import { getTimeRangeStart, TimeRange } from "@/features/analytics/lib/time-range";

export const useAnalytics = (timeRange: TimeRange) => {
  const {
    accounts,
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

  const stats = useMemo(() => {
    if (!accounts || !entries) return undefined;

    const now = new Date();
    return computeLedgerEntryStats(entries, new Set(accounts.map((account) => account.id)), {
      start: getTimeRangeStart(timeRange, now),
      end: now,
    });
  }, [accounts, entries, timeRange]);

  return {
    netWorth,
    stats,
    isPending: isNetWorthPending || isEntriesPending,
    error: netWorthError ?? entriesError,
  };
};
