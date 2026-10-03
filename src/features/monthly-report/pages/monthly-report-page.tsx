import { useState } from "react";
import { useMonthlyReport } from "./hooks/use-monthly-report";
import { MonthSelector } from "./components/month-selector";
import { MonthlyReportContent } from "./components/monthly-report-content";

export const MonthlyReportPage = () => {
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);
  const { months, selectedMonth, selectedMonthKey, reportData, isPending, error } = useMonthlyReport(selectedKey);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-bold">Monthly Report</h1>
        {months && selectedMonth && (
          <MonthSelector months={months} value={selectedMonth} onChange={setSelectedKey} />
        )}
      </div>

      {isPending && <p className="text-muted-foreground">Loading…</p>}
      {error && <p className="text-red-500">Failed to load report: {error.message}</p>}

      {reportData && selectedMonth && selectedMonthKey && (
        <MonthlyReportContent key={selectedMonthKey} month={selectedMonth} monthKey={selectedMonthKey} {...reportData} />
      )}
    </div>
  );
};
