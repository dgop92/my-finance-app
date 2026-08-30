import { z } from "zod";

export const LedgerEntryFormSchema = z.object({
  accountId: z.string().min(1, "Select an account"),
  label: z.enum(["Deposit", "Withdrawal"]),
  amount: z
    .string()
    .min(1, "Enter an amount")
    .refine(
      (value) => /^\d+$/.test(value) && Number(value) > 0,
      "Amount must be a whole number greater than zero"
    ),
  date: z.string().min(1, "Select a date"),
});

export type LedgerEntryFormValues = z.infer<typeof LedgerEntryFormSchema>;
