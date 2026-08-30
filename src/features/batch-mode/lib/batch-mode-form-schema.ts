import { z } from "zod";

export const BatchModeFormSchema = z.record(
  z.string(),
  z
    .string()
    .min(1, "Enter a value")
    .refine((value) => /^-?\d+$/.test(value), "Must be a whole number")
);

export type BatchModeFormValues = z.infer<typeof BatchModeFormSchema>;
