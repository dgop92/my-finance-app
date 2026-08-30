import { z } from "zod";

export type LedgerEntryType = "debit" | "credit";

export interface LedgerEntry {
  id: string;
  createdAt: Date;
  accountId: string;
  type: LedgerEntryType;
  amount: number;
}

export const CreateLedgerEntryInputSchema = z.object({
  accountId: z.string(),
  type: z.enum(["debit", "credit"]),
  amount: z.number().int().positive(),
});

export type CreateLedgerEntryInput = z.infer<
  typeof CreateLedgerEntryInputSchema
>;

export const UpdateLedgerEntryInputSchema = z.object({
  type: z.enum(["debit", "credit"]).optional(),
  amount: z.number().int().positive().optional(),
});

export type UpdateLedgerEntryInput = z.infer<
  typeof UpdateLedgerEntryInputSchema
>;
