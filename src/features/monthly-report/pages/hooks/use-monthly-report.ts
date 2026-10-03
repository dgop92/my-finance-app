import { useMemo } from "react";
import { useAccounts } from "@/features/accounts/pages/hooks/use-accounts";
import { useExpenses } from "@/features/expenses/pages/hooks/use-expenses";
import { useSettings } from "@/features/settings/pages/hooks/use-settings";
import { useLedgerEntries } from "@/features/ledger-entries/pages/hooks/use-ledger-entries";
import { computeOldestEntryDate } from "@/features/core/services/oldest-entry-date";
import { listReportMonths, monthKey } from "@/features/monthly-report/lib/report-months";
import { useMonthlyReportConfig } from "./use-monthly-report-config";

export const useMonthlyReport = (selectedKey: string | undefined) => {
  const { data: entries, isPending: isEntriesPending, error: entriesError } = useLedgerEntries();
  const { data: expenses, isPending: isExpensesPending, error: expensesError } = useExpenses();
  const { data: accounts, isPending: isAccountsPending, error: accountsError } = useAccounts(true);
  const { data: settings, isPending: isSettingsPending, error: settingsError } = useSettings();

  const now = useMemo(() => new Date(), []);

  const months = useMemo(() => {
    if (!entries || !expenses) return undefined;

    const dates = [computeOldestEntryDate(entries), ...expenses.map((expense) => expense.date)].filter(
      (date): date is Date => date !== null
    );
    const oldest = dates.length > 0 ? new Date(Math.min(...dates.map((date) => date.getTime()))) : undefined;
    return listReportMonths(now, oldest);
  }, [entries, expenses, now]);

  const selectedMonth = months?.find((month) => monthKey(month) === selectedKey) ?? months?.[0];
  const selectedMonthKey = selectedMonth ? monthKey(selectedMonth) : undefined;

  const { data: savedConfig, isPending: isConfigPending, error: configError } = useMonthlyReportConfig(selectedMonthKey);

  const reportData =
    entries && expenses && accounts && settings && savedConfig !== undefined
      ? { entries, expenses, accounts, settings, savedConfig: savedConfig ?? undefined }
      : undefined;

  return {
    months,
    selectedMonth,
    selectedMonthKey,
    reportData,
    isPending:
      isEntriesPending ||
      isExpensesPending ||
      isAccountsPending ||
      isSettingsPending ||
      (selectedMonthKey !== undefined && isConfigPending),
    error: entriesError ?? expensesError ?? accountsError ?? settingsError ?? configError,
  };
};
