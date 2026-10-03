import { z } from "zod";

// netSalary allows 0 (unlike UpdateSettingsInputSchema below) because 0 is
// the "not set yet" sentinel used by DEFAULT_SETTINGS and returned by a
// repository's get() before the user has ever saved a value. Rejecting it
// here would make that default round-trip fail through export/import.
export const SettingsSchema = z.object({
  netSalary: z.number().int().min(0),
});

export type Settings = z.infer<typeof SettingsSchema>;

export const DEFAULT_SETTINGS: Settings = {
  netSalary: 0,
};

export const UpdateSettingsInputSchema = z.object({
  netSalary: z.number().int().positive(),
});

export type UpdateSettingsInput = z.infer<typeof UpdateSettingsInputSchema>;
