import { useMemo } from "react";
import { useAccounts } from "@/features/accounts/pages/hooks/use-accounts";
import { useExpenses } from "@/features/expenses/pages/hooks/use-expenses";
import { useSettings } from "@/features/settings/pages/hooks/use-settings";
import { useLedgerEntries } from "@/features/ledger-entries/pages/hooks/use-ledger-entries";
import { computeMonthlyReport } from "@/features/core/services/monthly-report";
import { computeOldestEntryDate } from "@/features/core/services/oldest-entry-date";
import { listClosedMonths, monthKey } from "@/features/monthly-report/lib/closed-months";

export const useMonthlyReport = (selectedKey: string | undefined) => {
  const { data: entries, isPending: isEntriesPending, error: entriesError } = useLedgerEntries();
  const { data: expenses, isPending: isExpensesPending, error: expensesError } = useExpenses();
  const { data: accounts, isPending: isAccountsPending, error: accountsError } = useAccounts(true);
  const { data: settings, isPending: isSettingsPending, error: settingsError } = useSettings();

  const now = useMemo(() => new Date(), []);

  const closedMonths = useMemo(() => {
    if (!entries || !expenses) return undefined;

    const dates = [computeOldestEntryDate(entries), ...expenses.map((expense) => expense.date)].filter(
      (date): date is Date => date !== null
    );
    const oldest = dates.length > 0 ? new Date(Math.min(...dates.map((date) => date.getTime()))) : undefined;
    return listClosedMonths(now, oldest);
  }, [entries, expenses, now]);

  const selectedMonth = closedMonths?.find((month) => monthKey(month) === selectedKey) ?? closedMonths?.[0];

  const report = useMemo(() => {
    if (!entries || !expenses || !accounts || !settings || !selectedMonth) return undefined;
    return computeMonthlyReport({ entries, expenses, accounts, settings, month: selectedMonth });
  }, [entries, expenses, accounts, settings, selectedMonth]);

  return {
    closedMonths,
    selectedMonth,
    report,
    isPending: isEntriesPending || isExpensesPending || isAccountsPending || isSettingsPending,
    error: entriesError ?? expensesError ?? accountsError ?? settingsError,
  };
};
