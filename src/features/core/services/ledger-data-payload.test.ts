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
    });

    expect(parsed.accounts[0].createdAt).toEqual(new Date("2026-01-01T00:00:00.000Z"));
    expect(parsed.ledgerEntries[0].createdAt).toEqual(new Date("2026-01-02T00:00:00.000Z"));
    expect(parsed.ledgerEntries[0].date).toEqual(new Date("2026-01-02T00:00:00.000Z"));
    expect(parsed.expenses[0].createdAt).toEqual(new Date("2026-01-03T00:00:00.000Z"));
    expect(parsed.expenses[0].date).toEqual(new Date("2026-01-03T00:00:00.000Z"));
  });

  it.each([
    ["null", null],
    ["a string", "not-an-object"],
    ["missing accounts", { ledgerEntries: [], expenses: [] }],
    ["missing ledgerEntries", { accounts: [], expenses: [] }],
    ["missing expenses", { accounts: [], ledgerEntries: [] }],
    ["non-array accounts", { accounts: "nope", ledgerEntries: [], expenses: [] }],
    ["non-array ledgerEntries", { accounts: [], ledgerEntries: "nope", expenses: [] }],
    ["non-array expenses", { accounts: [], ledgerEntries: [], expenses: "nope" }],
  ])("throws for %s", (_description, input) => {
    expect(() => parseLedgerDataPayload(input)).toThrow();
  });
});

describe("serializeLedgerDataPayload", () => {
  it("round-trips through JSON", () => {
    const payload = { accounts: [], ledgerEntries: [], expenses: [] };
    expect(JSON.parse(serializeLedgerDataPayload(payload))).toEqual(payload);
  });
});
