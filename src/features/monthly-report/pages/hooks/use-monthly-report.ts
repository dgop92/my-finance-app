import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccounts } from "@/features/accounts/pages/hooks/use-accounts";
import { useExpenses } from "@/features/expenses/pages/hooks/use-expenses";
import { useSettings } from "@/features/settings/pages/hooks/use-settings";
import { ledgerEntryRepository } from "@/features/ledger-entries/repositories/repository.factory";
import { computeMonthlyReport } from "@/features/core/services/monthly-report";
import { computeOldestEntryDate } from "@/features/core/services/oldest-entry-date";
import { listClosedMonths } from "@/features/monthly-report/lib/closed-months";

export const monthKey = (month: { year: number; month: number }) => `${month.year}-${month.month}`;

export const useMonthlyReport = (selectedKey: string | undefined) => {
  const { data: entries, isPending: isEntriesPending, error: entriesError } = useQuery({
    queryKey: ["ledgerEntries"],
    queryFn: () => ledgerEntryRepository.getMany(),
  });
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
