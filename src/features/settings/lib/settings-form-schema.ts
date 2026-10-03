import { z } from "zod";

export const SettingsFormSchema = z.object({
  netSalary: z
    .string()
    .min(1, "Enter a net salary")
    .refine(
      (value) => /^\d+$/.test(value) && Number(value) > 0,
      "Net salary must be a whole number greater than zero"
    ),
});

export type SettingsFormValues = z.infer<typeof SettingsFormSchema>;
