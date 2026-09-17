import { useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import { DEFAULT_TIME_RANGE, TimeRange } from "@/features/analytics/lib/time-range";
import { useAnalytics } from "./hooks/use-analytics";
import { TimeRangeSelector } from "./components/time-range-selector";
import { StatTile } from "./components/stat-tile";
import { NetWorthTrendChart } from "./components/net-worth-trend-chart";
import { DepositsWithdrawalsTrendChart } from "./components/deposits-withdrawals-trend-chart";
import { BalanceDistributionChart } from "./components/balance-distribution-chart";
import { DepositsWithdrawalsByAccountChart } from "./components/deposits-withdrawals-by-account-chart";

export const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>(DEFAULT_TIME_RANGE);
  const {
    netWorth,
    stats,
    netWorthTrend,
    depositsWithdrawalsTrend,
    balanceDistribution,
    depositsWithdrawalsByAccount,
    isPending,
    error,
  } = useAnalytics(timeRange);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {isPending && <p className="text-muted-foreground">Loading…</p>}
      {error && <p className="text-red-500">Failed to load analytics: {error.message}</p>}

      {netWorth !== undefined && stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatTile title="Net Worth" value={formatCurrency(netWorth)} negative={netWorth < 0} />
          <StatTile
            title="Avg Transaction Size"
            value={formatCurrency(stats.avgTransactionSize)}
          />
          <StatTile title="Largest Deposit" value={formatCurrency(stats.largestDeposit)} />
          <StatTile title="Largest Withdrawal" value={formatCurrency(stats.largestWithdrawal)} />
          <StatTile title="Entry Count" value={stats.entryCount.toString()} />
        </div>
      )}

      {netWorthTrend && depositsWithdrawalsTrend && (
        <div className="grid gap-4 lg:grid-cols-2">
          <NetWorthTrendChart data={netWorthTrend} />
          <DepositsWithdrawalsTrendChart data={depositsWithdrawalsTrend} />
        </div>
      )}

      {balanceDistribution && depositsWithdrawalsByAccount && (
        <div className="grid gap-4 lg:grid-cols-2">
          <BalanceDistributionChart data={balanceDistribution} />
          <DepositsWithdrawalsByAccountChart data={depositsWithdrawalsByAccount} />
        </div>
      )}
    </div>
  );
};
