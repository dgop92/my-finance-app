import { z } from "zod";

export const DEFAULT_SAVING_ACCOUNT_DEPOSIT_THRESHOLD = 1_000_000;

export const MonthlyReportConfigSchema = z.object({
  monthKey: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  netSalaryOverride: z.number().int().positive().optional(),
  manualOtherIncome: z.number().int().min(0).default(0),
  savingAccountDepositThreshold: z.number().int().positive().default(DEFAULT_SAVING_ACCOUNT_DEPOSIT_THRESHOLD),
  automaticInterestEnabled: z.boolean().default(true),
});

export type MonthlyReportConfig = z.infer<typeof MonthlyReportConfigSchema>;
