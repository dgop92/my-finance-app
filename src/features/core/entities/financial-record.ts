import { z } from "zod";
import { SavingsSourceValue } from "./savings-source-value";
import { Expense } from "./expense";

export interface FinancialRecord {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  values: SavingsSourceValue[];
  expenses?: Expense[];
}

export interface FinancialRecordPair {
  current: FinancialRecord;
  previous?: FinancialRecord;
}

export const CreateFinancialRecordInputSchema = z.object({
  values: z.array(
    z
      .object({
        savingsSourceId: z.string(),
        amount: z.number().min(0),
      })
      .required()
  ),
});

export type CreateFinancialRecordInput = z.infer<
  typeof CreateFinancialRecordInputSchema
>;

// For updates, we'll use the same schema as create
export const UpdateFinancialRecordInputSchema =
  CreateFinancialRecordInputSchema;

export type UpdateFinancialRecordInput = z.infer<
  typeof UpdateFinancialRecordInputSchema
>;
