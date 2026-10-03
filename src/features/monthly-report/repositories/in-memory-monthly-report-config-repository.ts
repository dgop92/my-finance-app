import { MonthlyReportConfig } from "@/features/core/entities/monthly-report-config";
import { MonthlyReportConfigRepository } from "./definitions/monthly-report-config-repository";

export class InMemoryMonthlyReportConfigRepository implements MonthlyReportConfigRepository {
  private configs = new Map<string, MonthlyReportConfig>();

  get(monthKey: string): Promise<MonthlyReportConfig | undefined> {
    return Promise.resolve(this.configs.get(monthKey));
  }

  save(config: MonthlyReportConfig): Promise<MonthlyReportConfig> {
    this.configs.set(config.monthKey, config);
    return Promise.resolve(config);
  }

  getAll(): Promise<MonthlyReportConfig[]> {
    return Promise.resolve([...this.configs.values()]);
  }

  replaceAll(configs: MonthlyReportConfig[]): Promise<void> {
    this.configs = new Map(configs.map((config) => [config.monthKey, config]));
    return Promise.resolve();
  }
}
