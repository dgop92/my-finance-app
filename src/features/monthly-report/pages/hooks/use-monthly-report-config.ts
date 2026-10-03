import { useQuery } from "@tanstack/react-query";
import { monthlyReportConfigRepository } from "@/features/monthly-report/repositories/repository.factory";

export const monthlyReportConfigQueryKey = (monthKey: string | undefined) => ["monthlyReportConfig", monthKey];

export const useMonthlyReportConfig = (monthKey: string | undefined) => {
  return useQuery({
    queryKey: monthlyReportConfigQueryKey(monthKey),
    queryFn: async () => (await monthlyReportConfigRepository.get(monthKey as string)) ?? null,
    enabled: monthKey !== undefined,
  });
};
