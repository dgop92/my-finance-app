import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
import { DepositsWithdrawalsMonth } from "@/features/core/services/deposits-withdrawals-by-month";

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

interface DepositsWithdrawalsTrendChartProps {
  data: DepositsWithdrawalsMonth[];
}

export const DepositsWithdrawalsTrendChart = ({ data }: DepositsWithdrawalsTrendChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Deposits vs. Withdrawals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} tickMargin={8} />
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
            <Line
              dataKey="deposits"
              type="monotone"
              stroke="var(--color-deposits)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="withdrawals"
              type="monotone"
              stroke="var(--color-withdrawals)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
