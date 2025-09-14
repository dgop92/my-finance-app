import { z } from "zod"; // or 'zod/v4'

export interface SavingsSource {
  id: string;
  name: string;
  isNA?: boolean; // To identify the special "NA" source
  createdAt: Date;
  updatedAt: Date;
}

export const CreateSavingSourceInputSchema = z.object({
  name: z.string().min(2).max(100),
});

export type CreateSavingSourceInput = z.infer<
  typeof CreateSavingSourceInputSchema
>;

export const UpdateSavingSourceInputSchema = z.object({
  name: z.string().min(2).max(100).optional(),
});

export type UpdateSavingSourceInput = z.infer<
  typeof UpdateSavingSourceInputSchema
>;
