import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

// Cycled through when there are more slices than colors; shadcn only defines
// five theme-aware chart colors out of the box.
const SLICE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];
const SWATCH_CLASSES = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"];

export interface PercentageSlice {
  key: string;
  label: string;
  amount: number;
  percentage: number;
}

interface PercentagePieChartProps {
  title: string;
  slices: PercentageSlice[];
  emptyMessage?: string;
}

export const PercentagePieChart = ({ title, slices, emptyMessage }: PercentagePieChartProps) => {
  const chartConfig = slices.reduce((config, slice, index) => {
    config[slice.key] = { label: slice.label, color: SLICE_COLORS[index % SLICE_COLORS.length] };
    return config;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {slices.length > 0 ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-56 w-full shrink-0 sm:w-56"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name, item) => {
                        const slice = item.payload as PercentageSlice;
                        return (
                          <div className="flex w-full justify-between gap-4">
                            <span className="text-muted-foreground">{name}</span>
                            <span className="font-mono font-medium tabular-nums text-foreground">
                              {formatCurrency(Number(value))} ({slice.percentage.toFixed(1)}%)
                            </span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Pie data={slices} dataKey="amount" nameKey="label" innerRadius={50} strokeWidth={2}>
                  {slices.map((slice) => (
                    <Cell key={slice.key} fill={`var(--color-${slice.key})`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <ul className="flex min-w-0 flex-1 flex-col gap-2">
              {slices.map((slice, index) => (
                <li key={slice.key} className="flex min-w-0 flex-col text-sm">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span
                      className={cn("h-2.5 w-2.5 shrink-0 rounded-[2px]", SWATCH_CLASSES[index % SWATCH_CLASSES.length])}
                    />
                    <span className="truncate">{slice.label}</span>
                  </div>
                  <span className="whitespace-nowrap pl-4 font-mono text-xs tabular-nums text-muted-foreground">
                    {formatCurrency(slice.amount)} ({slice.percentage.toFixed(1)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
};
