import { describe, expect, it } from "vitest";
import {
  ledgerEntryLabelToType,
  ledgerEntryTypeToLabel,
} from "./ledger-entry-label";

describe("ledgerEntryTypeToLabel", () => {
  it("maps debit to Deposit", () => {
    expect(ledgerEntryTypeToLabel("debit")).toBe("Deposit");
  });

  it("maps credit to Withdrawal", () => {
    expect(ledgerEntryTypeToLabel("credit")).toBe("Withdrawal");
  });
});

describe("ledgerEntryLabelToType", () => {
  it("maps Deposit to debit", () => {
    expect(ledgerEntryLabelToType("Deposit")).toBe("debit");
  });

  it("maps Withdrawal to credit", () => {
    expect(ledgerEntryLabelToType("Withdrawal")).toBe("credit");
  });
});
