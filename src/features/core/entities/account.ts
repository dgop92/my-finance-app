import { z } from "zod";

export interface Account {
  id: string;
  name: string;
  createdAt: Date;
  archived: boolean;
}

export const CreateAccountInputSchema = z.object({
  name: z.string().min(1).max(100),
});

export type CreateAccountInput = z.infer<typeof CreateAccountInputSchema>;

export const UpdateAccountInputSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  archived: z.boolean().optional(),
});

export type UpdateAccountInput = z.infer<typeof UpdateAccountInputSchema>;
