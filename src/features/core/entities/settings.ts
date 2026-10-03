import { z } from "zod";

export const SettingsSchema = z.object({
  netSalary: z.number().int().positive(),
});

export type Settings = z.infer<typeof SettingsSchema>;

// netSalary: 0 marks "not set yet" and intentionally does not satisfy
// SettingsSchema's positive constraint — never run this through .parse().
export const DEFAULT_SETTINGS: Settings = {
  netSalary: 0,
};

export const UpdateSettingsInputSchema = z.object({
  netSalary: z.number().int().positive(),
});

export type UpdateSettingsInput = z.infer<typeof UpdateSettingsInputSchema>;
