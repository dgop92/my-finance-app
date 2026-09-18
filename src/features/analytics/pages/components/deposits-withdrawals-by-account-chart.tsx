import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/formatters";
import { AccountDepositsWithdrawals } from "@/features/core/services/deposits-withdrawals-by-account";

const chartConfig = {
  deposits: {
    label: "Deposits",
    color: "hsl(var(--chart-2))",
  },
  withdrawals: {
    label: "Withdrawals",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface DepositsWithdrawalsByAccountChartProps {
  data: AccountDepositsWithdrawals[];
}

export const DepositsWithdrawalsByAccountChart = ({ data }: DepositsWithdrawalsByAccountChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Deposits vs. Withdrawals by Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="accountName" tickLine={false} axisLine={false} tickMargin={8} />
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
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="deposits" stackId="account" fill="var(--color-deposits)" radius={0} />
            <Bar dataKey="withdrawals" stackId="account" fill="var(--color-withdrawals)" radius={0} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
