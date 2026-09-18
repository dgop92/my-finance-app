import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters";
import { Account } from "@/features/core/entities/account";
import { RunningBalancePoint } from "@/features/core/services/running-balance";

const chartConfig = {
  balance: {
    label: "Balance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface RunningBalanceChartProps {
  data: RunningBalancePoint[];
  accounts: Account[];
  selectedAccountId: string | undefined;
  onAccountChange: (accountId: string) => void;
}

export const RunningBalanceChart = ({
  data,
  accounts,
  selectedAccountId,
  onAccountChange,
}: RunningBalanceChartProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Running Balance</CardTitle>
        <Select value={selectedAccountId} onValueChange={onAccountChange}>
          <SelectTrigger className="w-48" aria-label="Account">
            <SelectValue placeholder="Select an account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="w-full">
            <LineChart data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="dateLabel" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={80}
                tickFormatter={(value: number) => formatCurrency(value)}
              />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
              />
              <Line
                dataKey="balance"
                type="monotone"
                stroke="var(--color-balance)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <p className="text-sm text-muted-foreground">No entries for this account in the selected range.</p>
        )}
      </CardContent>
    </Card>
  );
};
