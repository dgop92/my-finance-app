import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { previousMonth } from "@/features/core/services/monthly-report";
import { expenseTypeToLabel } from "@/features/core/services/expense-type-label";
import { StatTile } from "@/features/analytics/pages/components/stat-tile";
import { useMonthlyReport } from "./hooks/use-monthly-report";
import { formatReportMonth } from "@/features/monthly-report/lib/closed-months";
import { MonthSelector } from "./components/month-selector";
import { PercentagePieChart } from "./components/percentage-pie-chart";

export const MonthlyReportPage = () => {
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);
  const { closedMonths, selectedMonth, report, isPending, error } = useMonthlyReport(selectedKey);

  const previousMonthLabel = selectedMonth
    ? formatReportMonth(previousMonth(selectedMonth))
    : undefined;
  const hasUnexplainedIncome = report !== undefined && report.unknownExpenses < 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-bold">Monthly Report</h1>
        {closedMonths && selectedMonth && (
          <MonthSelector months={closedMonths} value={selectedMonth} onChange={setSelectedKey} />
        )}
      </div>

      {isPending && <p className="text-muted-foreground">Loading…</p>}
      {error && <p className="text-red-500">Failed to load report: {error.message}</p>}

      {report && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatTile title="Total Saved" value={formatCurrency(report.totalSaved)} negative={report.totalSaved < 0} />
            <StatTile title={`Known Expenses (${previousMonthLabel})`} value={formatCurrency(report.knownExpenses)} />
            <StatTile title="Net Salary" value={formatCurrency(report.netSalary)} />
            <StatTile title="Other Income (interest)" value={formatCurrency(report.otherIncome)} />
            <StatTile
              title={hasUnexplainedIncome ? "Unexplained Income" : "Unknown Expenses"}
              value={formatCurrency(Math.abs(report.unknownExpenses))}
            />
          </div>

          {hasUnexplainedIncome && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
            >
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>
                More money was saved and spent than the income on record explains, leaving{" "}
                {formatCurrency(Math.abs(report.unknownExpenses))} of unexplained income. Check for missing income,
                such as a bonus or a refund, or for expenses recorded in the wrong month.
              </p>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <PercentagePieChart
              title={`Expenses by Category (${previousMonthLabel})`}
              slices={report.categoryBreakdown.map((category) => ({
                key: category.type,
                label: expenseTypeToLabel(category.type),
                amount: category.amount,
                percentage: category.percentage,
              }))}
              emptyMessage="No expenses recorded in the previous month."
            />
            {report.knownVsUnknown && (
              <PercentagePieChart
                title="Known vs Unknown Expenses"
                slices={[
                  {
                    key: "known",
                    label: "Known",
                    amount: report.knownExpenses,
                    percentage: report.knownVsUnknown.knownPercentage,
                  },
                  {
                    key: "unknown",
                    label: "Unknown",
                    amount: report.unknownExpenses,
                    percentage: report.knownVsUnknown.unknownPercentage,
                  },
                ]}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
