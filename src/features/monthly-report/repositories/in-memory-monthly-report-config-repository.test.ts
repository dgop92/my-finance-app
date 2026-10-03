import { describe, expect, it } from "vitest";
import { MonthlyReportConfig } from "@/features/core/entities/monthly-report-config";
import { InMemoryMonthlyReportConfigRepository } from "./in-memory-monthly-report-config-repository";

const SEPTEMBER: MonthlyReportConfig = {
  monthKey: "2026-09",
  netSalaryOverride: 6_000_000,
  manualOtherIncome: 250_000,
  savingAccountDepositThreshold: 500_000,
  automaticInterestEnabled: false,
};

describe("InMemoryMonthlyReportConfigRepository", () => {
  it("returns nothing for a month with no saved config", async () => {
    const repository = new InMemoryMonthlyReportConfigRepository();

    expect(await repository.get("2026-09")).toBeUndefined();
  });

  it("returns the saved config for that month", async () => {
    const repository = new InMemoryMonthlyReportConfigRepository();
    await repository.save(SEPTEMBER);

    expect(await repository.get("2026-09")).toEqual(SEPTEMBER);
  });

  it("keeps configs of different months independent", async () => {
    const repository = new InMemoryMonthlyReportConfigRepository();
    await repository.save(SEPTEMBER);

    expect(await repository.get("2026-08")).toBeUndefined();
  });

  it("overwrites the previous config when saving the same month again", async () => {
    const repository = new InMemoryMonthlyReportConfigRepository();
    await repository.save(SEPTEMBER);
    const updated: MonthlyReportConfig = { ...SEPTEMBER, netSalaryOverride: undefined, manualOtherIncome: 0 };

    await repository.save(updated);

    expect(await repository.get("2026-09")).toEqual(updated);
  });

  it("lists every saved config", async () => {
    const repository = new InMemoryMonthlyReportConfigRepository();
    const august: MonthlyReportConfig = { ...SEPTEMBER, monthKey: "2026-08" };
    await repository.save(SEPTEMBER);
    await repository.save(august);

    expect(await repository.getAll()).toEqual([SEPTEMBER, august]);
  });

  it("replaces all saved configs, dropping the ones not provided", async () => {
    const repository = new InMemoryMonthlyReportConfigRepository();
    await repository.save(SEPTEMBER);
    const august: MonthlyReportConfig = { ...SEPTEMBER, monthKey: "2026-08" };

    await repository.replaceAll([august]);

    expect(await repository.getAll()).toEqual([august]);
    expect(await repository.get("2026-09")).toBeUndefined();
  });
});
