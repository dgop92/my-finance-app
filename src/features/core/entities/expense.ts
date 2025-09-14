import { z } from "zod";

export interface Expense {
  id: string;
  financialRecordId: string;
  name: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const CreateExpenseInputSchema = z.object({
  financialRecordId: z.string(),
  name: z.string().min(1).max(100),
  amount: z.number().positive(),
});

export type CreateExpenseInput = z.infer<typeof CreateExpenseInputSchema>;

export const UpdateExpenseInputSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  amount: z.number().positive().optional(),
});

export type UpdateExpenseInput = z.infer<typeof UpdateExpenseInputSchema>;
