import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetWorthMonth } from "@/features/core/services/net-worth-history";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface NetWorthHistoryCardsProps {
  months: NetWorthMonth[];
}

export const NetWorthHistoryCards = ({ months }: NetWorthHistoryCardsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {months.map((month) => (
        <Card key={month.monthLabel}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {month.monthLabel}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className={cn("text-xl font-bold tabular-nums", month.netWorth < 0 && "text-red-600")}>
              {formatCurrency(month.netWorth)}
            </span>
            <span
              className={cn(
                "text-sm tabular-nums",
                month.diff === null && "text-muted-foreground",
                month.diff !== null && month.diff > 0 && "text-green-600",
                month.diff !== null && month.diff < 0 && "text-red-600"
              )}
            >
              {month.diff === null
                ? "—"
                : `${month.diff > 0 ? "+" : ""}${formatCurrency(month.diff)}`}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
