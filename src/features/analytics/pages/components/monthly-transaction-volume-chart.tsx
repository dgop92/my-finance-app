import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { MonthlyTransactionVolume } from "@/features/core/services/monthly-transaction-volume";

const chartConfig = {
  entryCount: {
    label: "Entries",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

interface MonthlyTransactionVolumeChartProps {
  data: MonthlyTransactionVolume[];
}

export const MonthlyTransactionVolumeChart = ({ data }: MonthlyTransactionVolumeChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Monthly Transaction Volume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="entryCount" fill="var(--color-entryCount)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
