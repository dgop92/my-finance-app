import { MonthlyReportConfig } from "@/features/core/entities/monthly-report-config";

export interface MonthlyReportConfigRepository {
  get(monthKey: string): Promise<MonthlyReportConfig | undefined>;
  save(config: MonthlyReportConfig): Promise<MonthlyReportConfig>;
  getAll(): Promise<MonthlyReportConfig[]>;
  replaceAll(configs: MonthlyReportConfig[]): Promise<void>;
}
