import { z } from "zod";

export type LedgerEntryType = "debit" | "credit";

export interface LedgerEntry {
  id: string;
  createdAt: Date;
  accountId: string;
  type: LedgerEntryType;
  amount: number;
  date: Date;
}

export const CreateLedgerEntryInputSchema = z.object({
  accountId: z.string(),
  type: z.enum(["debit", "credit"]),
  amount: z.number().int().positive(),
  date: z.date(),
});

export type CreateLedgerEntryInput = z.infer<
  typeof CreateLedgerEntryInputSchema
>;

export const UpdateLedgerEntryInputSchema = z.object({
  accountId: z.string().optional(),
  type: z.enum(["debit", "credit"]).optional(),
  amount: z.number().int().positive().optional(),
  date: z.date().optional(),
});

export type UpdateLedgerEntryInput = z.infer<
  typeof UpdateLedgerEntryInputSchema
>;
