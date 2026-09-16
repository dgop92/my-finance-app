import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/formatters";
import { NetWorthMonth } from "@/features/core/services/net-worth-history";

const chartConfig = {
  netWorth: {
    label: "Net Worth",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface NetWorthTrendChartProps {
  data: NetWorthMonth[];
}

export const NetWorthTrendChart = ({ data }: NetWorthTrendChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Net Worth Over Time</CardTitle>
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
            <Line
              dataKey="netWorth"
              type="monotone"
              stroke="var(--color-netWorth)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
