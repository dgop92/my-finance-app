import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/formatters";
import {
  AccountBalanceDistribution,
  AccountBalanceShare,
} from "@/features/core/services/account-balance-distribution";

// Cycled through when there are more accounts than colors; shadcn only
// defines five theme-aware chart colors out of the box.
const SLICE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

interface BalanceDistributionChartProps {
  data: AccountBalanceDistribution;
}

export const BalanceDistributionChart = ({ data }: BalanceDistributionChartProps) => {
  const chartConfig = data.shares.reduce((config, share, index) => {
    config[share.accountId] = {
      label: share.accountName,
      color: SLICE_COLORS[index % SLICE_COLORS.length],
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Balance Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {data.shares.length > 0 ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-56 w-full">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name, item) => {
                        const share = item.payload as AccountBalanceShare;
                        return (
                          <div className="flex w-full justify-between gap-4">
                            <span className="text-muted-foreground">{name}</span>
                            <span className="font-mono font-medium tabular-nums text-foreground">
                              {formatCurrency(Number(value))} ({share.percentageOfNetWorth.toFixed(1)}%)
                            </span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Pie
                  data={data.shares}
                  dataKey="balance"
                  nameKey="accountName"
                  innerRadius={50}
                  strokeWidth={2}
                >
                  {data.shares.map((share) => (
                    <Cell key={share.accountId} fill={`var(--color-${share.accountId})`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <ul className="flex flex-1 flex-col gap-2 overflow-hidden">
              {data.shares.map((share, index) => (
                <li key={share.accountId} className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: SLICE_COLORS[index % SLICE_COLORS.length] }}
                    />
                    <span className="truncate">{share.accountName}</span>
                  </div>
                  <span className="shrink-0 whitespace-nowrap font-mono tabular-nums text-muted-foreground">
                    {formatCurrency(share.balance)} ({share.percentageOfNetWorth.toFixed(1)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No positive account balances to show.</p>
        )}

        {data.negativeBalanceAccounts.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
            <p className="mb-2 text-xs font-medium text-red-700 dark:text-red-400">
              Excluded from the chart (negative balance)
            </p>
            <ul className="flex flex-col gap-1">
              {data.negativeBalanceAccounts.map((account) => (
                <li key={account.accountId} className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate">{account.accountName}</span>
                  <span className="shrink-0 whitespace-nowrap font-mono font-medium tabular-nums text-red-600">
                    {formatCurrency(account.balance)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
