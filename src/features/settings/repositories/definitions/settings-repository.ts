import { Settings, UpdateSettingsInput } from "@/features/core/entities/settings";

export interface SettingsRepository {
  get(): Promise<Settings>;
  update(input: UpdateSettingsInput): Promise<Settings>;
}
