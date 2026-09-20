import { z } from "zod";

export const ExpenseTypeSchema = z.enum([
  "groceries",
  "fast_food",
  "transport",
  "utilities",
  "entertainment",
  "health",
  "shopping",
  "subscriptions",
  "travel",
  "other",
]);

export type ExpenseType = z.infer<typeof ExpenseTypeSchema>;

export interface Expense {
  id: string;
  createdAt: Date;
  date: Date;
  amount: number;
  notes: string;
  type: ExpenseType;
}

export const CreateExpenseInputSchema = z.object({
  date: z.date(),
  amount: z.number().int().positive(),
  notes: z.string().max(280).default(""),
  type: ExpenseTypeSchema,
});

export type CreateExpenseInput = z.infer<typeof CreateExpenseInputSchema>;

export const UpdateExpenseInputSchema = z.object({
  date: z.date().optional(),
  amount: z.number().int().positive().optional(),
  notes: z.string().max(280).optional(),
  type: ExpenseTypeSchema.optional(),
});

export type UpdateExpenseInput = z.infer<typeof UpdateExpenseInputSchema>;
