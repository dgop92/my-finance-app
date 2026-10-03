import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Account } from "@/features/core/entities/account";
import { Expense } from "@/features/core/entities/expense";
import { LedgerEntry } from "@/features/core/entities/ledger-entry";
import { MonthlyReportConfig } from "@/features/core/entities/monthly-report-config";
import { Settings } from "@/features/core/entities/settings";
import { computeMonthlyReport, ReportMonth } from "@/features/core/services/monthly-report";
import {
  MonthlyReportConfigFormSchema,
  MonthlyReportConfigFormValues,
  configToFormValues,
  formValuesToConfig,
  formValuesToConfigInput,
} from "@/features/monthly-report/lib/monthly-report-config-form";
import { monthlyReportConfigRepository } from "@/features/monthly-report/repositories/repository.factory";
import { monthlyReportConfigQueryKey } from "./use-monthly-report-config";

export interface UseMonthlyReportEditorArgs {
  month: ReportMonth;
  monthKey: string;
  entries: LedgerEntry[];
  expenses: Expense[];
  accounts: Account[];
  settings: Settings;
  savedConfig: MonthlyReportConfig | undefined;
}

export const useMonthlyReportEditor = ({
  month,
  monthKey,
  entries,
  expenses,
  accounts,
  settings,
  savedConfig,
}: UseMonthlyReportEditorArgs) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: MonthlyReportConfigFormValues) =>
      monthlyReportConfigRepository.save(formValuesToConfig(monthKey, values)),
    onSuccess: (saved) => {
      queryClient.setQueryData(monthlyReportConfigQueryKey(monthKey), saved);
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<MonthlyReportConfigFormValues>({
    resolver: zodResolver(MonthlyReportConfigFormSchema),
    defaultValues: configToFormValues(savedConfig),
  });

  const values = useWatch({ control });
  const config = useMemo(
    () => formValuesToConfigInput({ ...configToFormValues(undefined), ...values }),
    [values]
  );

  const report = useMemo(
    () => computeMonthlyReport({ entries, expenses, accounts, settings, month, config }),
    [entries, expenses, accounts, settings, month, config]
  );

  const onSubmit = (input: MonthlyReportConfigFormValues) => {
    mutation.mutate(input, {
      onSuccess: (saved) => reset(configToFormValues(saved)),
    });
  };

  return {
    register,
    control,
    report,
    handleFormSubmit: handleSubmit(onSubmit),
    formState: { errors },
    isSaving: mutation.isPending,
    isSaved: mutation.isSuccess && !isDirty,
    error: mutation.error,
  };
};
