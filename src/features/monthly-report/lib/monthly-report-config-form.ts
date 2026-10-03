import { z } from "zod";
import {
  DEFAULT_SAVING_ACCOUNT_DEPOSIT_THRESHOLD,
  MonthlyReportConfig,
  MonthlyReportConfigSchema,
} from "@/features/core/entities/monthly-report-config";
import { MonthlyReportConfigInput } from "@/features/core/services/monthly-report";

function isWholeNumber(value: string): boolean {
  return /^\d+$/.test(value);
}

function isPositiveWholeNumber(value: string): boolean {
  return isWholeNumber(value) && Number(value) > 0;
}

export const MonthlyReportConfigFormSchema = z.object({
  netSalaryOverride: z
    .string()
    .refine(
      (value) => value === "" || isPositiveWholeNumber(value),
      "Net salary must be a whole number greater than zero"
    ),
  manualOtherIncome: z
    .string()
    .min(1, "Enter an amount, or 0 if none")
    .refine(isWholeNumber, "Other income must be a whole number, zero or greater"),
  savingAccountDepositThreshold: z
    .string()
    .min(1, "Enter a threshold")
    .refine(isPositiveWholeNumber, "Threshold must be a whole number greater than zero"),
  automaticInterestEnabled: z.boolean(),
});

export type MonthlyReportConfigFormValues = z.infer<typeof MonthlyReportConfigFormSchema>;

export function configToFormValues(config: MonthlyReportConfigInput | undefined): MonthlyReportConfigFormValues {
  return {
    netSalaryOverride: config?.netSalaryOverride === undefined ? "" : String(config.netSalaryOverride),
    manualOtherIncome: String(config?.manualOtherIncome ?? 0),
    savingAccountDepositThreshold: String(
      config?.savingAccountDepositThreshold ?? DEFAULT_SAVING_ACCOUNT_DEPOSIT_THRESHOLD
    ),
    automaticInterestEnabled: config?.automaticInterestEnabled ?? true,
  };
}

// Lenient: fields that don't parse are left undefined so the report falls back
// to its defaults while the user is still typing.
export function formValuesToConfigInput(values: MonthlyReportConfigFormValues): MonthlyReportConfigInput {
  return {
    netSalaryOverride: isPositiveWholeNumber(values.netSalaryOverride) ? Number(values.netSalaryOverride) : undefined,
    manualOtherIncome: isWholeNumber(values.manualOtherIncome) ? Number(values.manualOtherIncome) : undefined,
    savingAccountDepositThreshold: isPositiveWholeNumber(values.savingAccountDepositThreshold)
      ? Number(values.savingAccountDepositThreshold)
      : undefined,
    automaticInterestEnabled: values.automaticInterestEnabled,
  };
}

export function formValuesToConfig(monthKey: string, values: MonthlyReportConfigFormValues): MonthlyReportConfig {
  return MonthlyReportConfigSchema.parse({ monthKey, ...formValuesToConfigInput(values) });
}
