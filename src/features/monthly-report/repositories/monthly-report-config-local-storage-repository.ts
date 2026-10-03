import { MonthlyReportConfig, MonthlyReportConfigSchema } from "@/features/core/entities/monthly-report-config";
import { MonthlyReportConfigRepository } from "./definitions/monthly-report-config-repository";

const MONTHLY_REPORT_CONFIGS_STORAGE_KEY = "financeApp:monthlyReportConfigs";

function loadConfigs(): Record<string, MonthlyReportConfig> {
  const raw = localStorage.getItem(MONTHLY_REPORT_CONFIGS_STORAGE_KEY);
  if (!raw) {
    return {};
  }
  return JSON.parse(raw) as Record<string, MonthlyReportConfig>;
}

export class MonthlyReportConfigLocalStorageRepository implements MonthlyReportConfigRepository {
  async get(monthKey: string): Promise<MonthlyReportConfig | undefined> {
    const stored = loadConfigs()[monthKey];
    return stored ? MonthlyReportConfigSchema.parse(stored) : undefined;
  }

  async save(config: MonthlyReportConfig): Promise<MonthlyReportConfig> {
    const parsed = MonthlyReportConfigSchema.parse(config);
    localStorage.setItem(
      MONTHLY_REPORT_CONFIGS_STORAGE_KEY,
      JSON.stringify({ ...loadConfigs(), [parsed.monthKey]: parsed })
    );
    return parsed;
  }
}
