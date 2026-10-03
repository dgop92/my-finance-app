import { describe, expect, it } from "vitest";
import {
  MonthlyReportConfigFormSchema,
  configToFormValues,
  formValuesToConfig,
  formValuesToConfigInput,
} from "./monthly-report-config-form";

const VALID = {
  netSalaryOverride: "6000000",
  manualOtherIncome: "250000",
  savingAccountDepositThreshold: "500000",
  automaticInterestEnabled: false,
};

describe("MonthlyReportConfigFormSchema", () => {
  it("accepts valid values, and an empty net salary override", () => {
    expect(MonthlyReportConfigFormSchema.safeParse(VALID).success).toBe(true);
    expect(MonthlyReportConfigFormSchema.safeParse({ ...VALID, netSalaryOverride: "" }).success).toBe(true);
  });

  it("accepts zero manual other income", () => {
    expect(MonthlyReportConfigFormSchema.safeParse({ ...VALID, manualOtherIncome: "0" }).success).toBe(true);
  });

  it("rejects negative manual other income", () => {
    expect(MonthlyReportConfigFormSchema.safeParse({ ...VALID, manualOtherIncome: "-1" }).success).toBe(false);
  });

  it("rejects an empty manual other income", () => {
    expect(MonthlyReportConfigFormSchema.safeParse({ ...VALID, manualOtherIncome: "" }).success).toBe(false);
  });

  it("rejects a zero net salary override and a zero threshold", () => {
    expect(MonthlyReportConfigFormSchema.safeParse({ ...VALID, netSalaryOverride: "0" }).success).toBe(false);
    expect(MonthlyReportConfigFormSchema.safeParse({ ...VALID, savingAccountDepositThreshold: "0" }).success).toBe(
      false
    );
  });
});

describe("configToFormValues", () => {
  it("uses the defaults when the month has no saved config", () => {
    expect(configToFormValues(undefined)).toEqual({
      netSalaryOverride: "",
      manualOtherIncome: "0",
      savingAccountDepositThreshold: "1000000",
      automaticInterestEnabled: true,
    });
  });

  it("shows the saved values", () => {
    expect(
      configToFormValues({
        netSalaryOverride: 6_000_000,
        manualOtherIncome: 250_000,
        savingAccountDepositThreshold: 500_000,
        automaticInterestEnabled: false,
      })
    ).toEqual(VALID);
  });
});

describe("formValuesToConfigInput", () => {
  it("converts valid values to numbers", () => {
    expect(formValuesToConfigInput(VALID)).toEqual({
      netSalaryOverride: 6_000_000,
      manualOtherIncome: 250_000,
      savingAccountDepositThreshold: 500_000,
      automaticInterestEnabled: false,
    });
  });

  it("falls back to the defaults for invalid or empty fields so a live preview never breaks", () => {
    const input = formValuesToConfigInput({
      netSalaryOverride: "",
      manualOtherIncome: "-5",
      savingAccountDepositThreshold: "0",
      automaticInterestEnabled: true,
    });

    expect(input.netSalaryOverride).toBeUndefined();
    expect(input.manualOtherIncome).toBeUndefined();
    expect(input.savingAccountDepositThreshold).toBeUndefined();
  });
});

describe("formValuesToConfig", () => {
  it("builds a config for the month, leaving the net salary override unset when empty", () => {
    expect(formValuesToConfig("2026-09", { ...VALID, netSalaryOverride: "" })).toEqual({
      monthKey: "2026-09",
      manualOtherIncome: 250_000,
      savingAccountDepositThreshold: 500_000,
      automaticInterestEnabled: false,
    });
  });
});
