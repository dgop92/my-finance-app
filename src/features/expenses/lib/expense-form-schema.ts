import { z } from "zod";
import { ExpenseTypeSchema } from "@/features/core/entities/expense";

export const ExpenseFormSchema = z.object({
  type: ExpenseTypeSchema,
  amount: z
    .string()
    .min(1, "Enter an amount")
    .refine(
      (value) => /^\d+$/.test(value) && Number(value) > 0,
      "Amount must be a whole number greater than zero"
    ),
  date: z.string().min(1, "Select a date"),
  notes: z.string().max(280, "Note must be 280 characters or fewer"),
});

export type ExpenseFormValues = z.infer<typeof ExpenseFormSchema>;
