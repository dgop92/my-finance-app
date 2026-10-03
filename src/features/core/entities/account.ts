import { z } from "zod";

export const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  archived: z.boolean(),
  isSavingAccount: z.boolean().default(false),
});

export type Account = z.infer<typeof AccountSchema>;

export const CreateAccountInputSchema = z.object({
  name: z.string().min(1).max(100),
  isSavingAccount: z.boolean().default(false),
});

export type CreateAccountInput = z.input<typeof CreateAccountInputSchema>;

export const UpdateAccountInputSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  archived: z.boolean().optional(),
  isSavingAccount: z.boolean().optional(),
});

export type UpdateAccountInput = z.infer<typeof UpdateAccountInputSchema>;
