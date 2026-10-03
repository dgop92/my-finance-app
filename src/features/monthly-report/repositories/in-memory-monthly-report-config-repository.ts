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
}
