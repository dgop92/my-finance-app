import { describe, expect, it } from "vitest";
import { parseLedgerDataPayload, serializeLedgerDataPayload } from "./ledger-data-payload";

describe("parseLedgerDataPayload", () => {
  it("converts date strings back to Date objects", () => {
    const parsed = parseLedgerDataPayload({
      accounts: [
        { id: "acc-1", name: "Checking", createdAt: "2026-01-01T00:00:00.000Z", archived: false },
      ],
      ledgerEntries: [
        {
          id: "entry-1",
          createdAt: "2026-01-02T00:00:00.000Z",
          accountId: "acc-1",
          type: "debit",
          amount: 1000,
          date: "2026-01-02T00:00:00.000Z",
        },
      ],
      expenses: [
        {
          id: "expense-1",
          createdAt: "2026-01-03T00:00:00.000Z",
          date: "2026-01-03T00:00:00.000Z",
          amount: 2000,
          notes: "Groceries",
          type: "groceries",
        },
      ],
      settings: { netSalary: 3_000_000 },
    });

    expect(parsed.accounts[0].createdAt).toEqual(new Date("2026-01-01T00:00:00.000Z"));
    expect(parsed.ledgerEntries[0].createdAt).toEqual(new Date("2026-01-02T00:00:00.000Z"));
    expect(parsed.ledgerEntries[0].date).toEqual(new Date("2026-01-02T00:00:00.000Z"));
    expect(parsed.expenses[0].createdAt).toEqual(new Date("2026-01-03T00:00:00.000Z"));
    expect(parsed.expenses[0].date).toEqual(new Date("2026-01-03T00:00:00.000Z"));
    expect(parsed.settings).toEqual({ netSalary: 3_000_000 });
  });

  it("accepts a settings.netSalary of 0, the 'not set yet' default", () => {
    const parsed = parseLedgerDataPayload({
      accounts: [],
      ledgerEntries: [],
      expenses: [],
      settings: { netSalary: 0 },
    });

    expect(parsed.settings).toEqual({ netSalary: 0 });
  });

  it("parses monthly report configs, applying field defaults", () => {
    const parsed = parseLedgerDataPayload({
      accounts: [],
      ledgerEntries: [],
      expenses: [],
      settings: { netSalary: 0 },
      monthlyReportConfigs: [{ monthKey: "2026-09", netSalaryOverride: 6_000_000 }],
    });

    expect(parsed.monthlyReportConfigs).toEqual([
      {
        monthKey: "2026-09",
        netSalaryOverride: 6_000_000,
        manualOtherIncome: 0,
        savingAccountDepositThreshold: 1_000_000,
        automaticInterestEnabled: true,
      },
    ]);
  });

  it("treats a payload without monthly report configs as having none", () => {
    const parsed = parseLedgerDataPayload({
      accounts: [],
      ledgerEntries: [],
      expenses: [],
      settings: { netSalary: 0 },
    });

    expect(parsed.monthlyReportConfigs).toEqual([]);
  });

  it.each([
    ["null", null],
    [
      "non-array monthlyReportConfigs",
      { accounts: [], ledgerEntries: [], expenses: [], settings: { netSalary: 1 }, monthlyReportConfigs: "nope" },
    ],
    [
      "a monthly report config with a negative manualOtherIncome",
      {
        accounts: [],
        ledgerEntries: [],
        expenses: [],
        settings: { netSalary: 1 },
        monthlyReportConfigs: [{ monthKey: "2026-09", manualOtherIncome: -1 }],
      },
    ],
    [
      "a monthly report config with a malformed monthKey",
      {
        accounts: [],
        ledgerEntries: [],
        expenses: [],
        settings: { netSalary: 1 },
        monthlyReportConfigs: [{ monthKey: "2026-9" }],
      },
    ],
    ["a string", "not-an-object"],
    ["missing accounts", { ledgerEntries: [], expenses: [], settings: { netSalary: 1 } }],
    ["missing ledgerEntries", { accounts: [], expenses: [], settings: { netSalary: 1 } }],
    ["missing expenses", { accounts: [], ledgerEntries: [], settings: { netSalary: 1 } }],
    ["missing settings", { accounts: [], ledgerEntries: [], expenses: [] }],
    [
      "non-array accounts",
      { accounts: "nope", ledgerEntries: [], expenses: [], settings: { netSalary: 1 } },
    ],
    [
      "non-array ledgerEntries",
      { accounts: [], ledgerEntries: "nope", expenses: [], settings: { netSalary: 1 } },
    ],
    [
      "non-array expenses",
      { accounts: [], ledgerEntries: [], expenses: "nope", settings: { netSalary: 1 } },
    ],
    [
      "non-object settings",
      { accounts: [], ledgerEntries: [], expenses: [], settings: "nope" },
    ],
    [
      "null settings",
      { accounts: [], ledgerEntries: [], expenses: [], settings: null },
    ],
    [
      "settings with a negative netSalary",
      { accounts: [], ledgerEntries: [], expenses: [], settings: { netSalary: -1 } },
    ],
  ])("throws for %s", (_description, input) => {
    expect(() => parseLedgerDataPayload(input)).toThrow();
  });
});

describe("serializeLedgerDataPayload", () => {
  it("round-trips through JSON", () => {
    const payload = {
      accounts: [],
      ledgerEntries: [],
      expenses: [],
      settings: { netSalary: 0 },
      monthlyReportConfigs: [],
    };
    expect(JSON.parse(serializeLedgerDataPayload(payload))).toEqual(payload);
  });
});
