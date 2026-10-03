import { TriangleAlert } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { Account } from "@/features/core/entities/account";
import { Expense } from "@/features/core/entities/expense";
import { LedgerEntry } from "@/features/core/entities/ledger-entry";
import { MonthlyReportConfig } from "@/features/core/entities/monthly-report-config";
import { Settings } from "@/features/core/entities/settings";
import { previousMonth, ReportMonth } from "@/features/core/services/monthly-report";
import { expenseTypeToLabel } from "@/features/core/services/expense-type-label";
import { StatTile } from "@/features/analytics/pages/components/stat-tile";
import { formatReportMonth } from "@/features/monthly-report/lib/report-months";
import { useMonthlyReportEditor } from "../hooks/use-monthly-report-editor";
import { MonthlyReportConfigForm } from "./monthly-report-config-form";
import { PercentagePieChart } from "./percentage-pie-chart";

interface MonthlyReportContentProps {
  month: ReportMonth;
  monthKey: string;
  entries: LedgerEntry[];
  expenses: Expense[];
  accounts: Account[];
  settings: Settings;
  savedConfig: MonthlyReportConfig | undefined;
}

export const MonthlyReportContent = ({ month, monthKey, ...data }: MonthlyReportContentProps) => {
  const { report, register, control, handleFormSubmit, formState, isSaving, isSaved, error } = useMonthlyReportEditor({
    month,
    monthKey,
    ...data,
  });

  const previousMonthLabel = formatReportMonth(previousMonth(month));
  const hasUnexplainedIncome = report.unknownExpenses < 0;

  return (
    <>
      <MonthlyReportConfigForm
        register={register}
        control={control}
        errors={formState.errors}
        settingsNetSalary={data.settings.netSalary}
        isSaving={isSaving}
        isSaved={isSaved}
        error={error}
        onSubmit={handleFormSubmit}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile title="Total Saved" value={formatCurrency(report.totalSaved)} negative={report.totalSaved < 0} />
        <StatTile title={`Known Expenses (${previousMonthLabel})`} value={formatCurrency(report.knownExpenses)} />
        <StatTile title="Net Salary" value={formatCurrency(report.netSalary)} />
        <StatTile title="Other Income" value={formatCurrency(report.otherIncome)} />
        <StatTile
          title={hasUnexplainedIncome ? "Unexplained Income" : "Unknown Expenses"}
          value={formatCurrency(Math.abs(report.unknownExpenses))}
        />
        <StatTile title="Total Spent" value={formatCurrency(report.totalSpent)} />
      </div>

      {hasUnexplainedIncome && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            More money was saved and spent than the income on record explains, leaving{" "}
            {formatCurrency(Math.abs(report.unknownExpenses))} of unexplained income. Check for missing income, such
            as a bonus or a refund, or for expenses recorded in the wrong month.
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
  );
};
