import {
  DEFAULT_SETTINGS,
  Settings,
  SettingsSchema,
  UpdateSettingsInput,
} from "@/features/core/entities/settings";
import { SettingsRepository } from "./definitions/settings-repository";

const SETTINGS_STORAGE_KEY = "financeApp:settings";

function loadSettings(): Settings {
  const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_SETTINGS;
  }
  return SettingsSchema.parse(JSON.parse(raw));
}

function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export class SettingsLocalStorageRepository implements SettingsRepository {
  async get(): Promise<Settings> {
    return loadSettings();
  }

  async update(input: UpdateSettingsInput): Promise<Settings> {
    const settings = SettingsSchema.parse({ netSalary: input.netSalary });
    saveSettings(settings);
    return settings;
  }
}
