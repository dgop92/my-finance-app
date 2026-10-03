import {
  DEFAULT_SETTINGS,
  Settings,
  UpdateSettingsInput,
} from "@/features/core/entities/settings";
import { SettingsRepository } from "./definitions/settings-repository";

export class InMemorySettingsRepository implements SettingsRepository {
  private settings: Settings = { ...DEFAULT_SETTINGS };

  get(): Promise<Settings> {
    return Promise.resolve(this.settings);
  }

  update(input: UpdateSettingsInput): Promise<Settings> {
    this.settings = { netSalary: input.netSalary };
    return Promise.resolve(this.settings);
  }
}
