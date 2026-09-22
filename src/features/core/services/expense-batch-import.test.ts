import { describe, expect, it } from "vitest";
import { parseExpenseBatchImport } from "./expense-batch-import";

describe("parseExpenseBatchImport", () => {
  it("parses a valid array of expenses, forcing notes to an empty string", () => {
    const result = parseExpenseBatchImport([
      { amount: 15000, type: "groceries", date: "2026-01-15" },
      { amount: 5000, type: "transport", date: "2026-02-01", notes: "ignored" },
    ]);

    expect(result).toEqual({
      success: true,
      expenses: [
        { amount: 15000, type: "groceries", date: new Date(2026, 0, 15), notes: "" },
        { amount: 5000, type: "transport", date: new Date(2026, 1, 1), notes: "" },
      ],
    });
  });

  it("succeeds with an empty list for an empty array", () => {
    expect(parseExpenseBatchImport([])).toEqual({ success: true, expenses: [] });
  });

  it("rejects non-array input without a row number", () => {
    const result = parseExpenseBatchImport({ amount: 100, type: "groceries", date: "2026-01-01" });

    expect(result).toEqual({
      success: false,
      errors: [{ row: null, reasons: ["Input must be a JSON array of expenses."] }],
    });
  });

  it.each([[null], ["not-an-array"], [42], [undefined]])(
    "rejects non-array input: %p",
    (raw) => {
      const result = parseExpenseBatchImport(raw);
      expect(result.success).toBe(false);
    }
  );

  it("reports a missing amount", () => {
    const result = parseExpenseBatchImport([{ type: "groceries", date: "2026-01-01" }]);

    expect(result.success).toBe(false);
    if (result.success) throw new Error("expected failure");
    expect(result.errors).toEqual([
      { row: 1, reasons: expect.arrayContaining([expect.stringContaining("amount")]) },
    ]);
  });

  it("reports an invalid (non-positive, non-integer) amount", () => {
    const result = parseExpenseBatchImport([
      { amount: -5, type: "groceries", date: "2026-01-01" },
      { amount: 1.5, type: "groceries", date: "2026-01-01" },
    ]);

    expect(result.success).toBe(false);
    if (result.success) throw new Error("expected failure");
    expect(result.errors).toHaveLength(2);
    expect(result.errors[0].row).toBe(1);
    expect(result.errors[1].row).toBe(2);
  });

  it("reports an invalid expense type", () => {
    const result = parseExpenseBatchImport([
      { amount: 100, type: "not-a-real-type", date: "2026-01-01" },
    ]);

    expect(result.success).toBe(false);
    if (result.success) throw new Error("expected failure");
    expect(result.errors).toEqual([
      { row: 1, reasons: expect.arrayContaining([expect.stringContaining("type")]) },
    ]);
  });

  it("reports a malformed date", () => {
    const result = parseExpenseBatchImport([
      { amount: 100, type: "groceries", date: "01-01-2026" },
    ]);

    expect(result.success).toBe(false);
    if (result.success) throw new Error("expected failure");
    expect(result.errors).toEqual([
      { row: 1, reasons: expect.arrayContaining([expect.stringContaining("date")]) },
    ]);
  });

  it("reports a calendar-invalid date", () => {
    const result = parseExpenseBatchImport([
      { amount: 100, type: "groceries", date: "2026-02-30" },
    ]);

    expect(result.success).toBe(false);
    if (result.success) throw new Error("expected failure");
    expect(result.errors).toEqual([
      { row: 1, reasons: expect.arrayContaining([expect.stringContaining("date")]) },
    ]);
  });

  it("reports every failing row, not just the first", () => {
    const result = parseExpenseBatchImport([
      { amount: 100, type: "groceries", date: "2026-01-01" },
      { amount: -1, type: "groceries", date: "2026-01-01" },
      { amount: 100, type: "bogus", date: "2026-01-01" },
      { amount: 100, type: "groceries", date: "not-a-date" },
    ]);

    expect(result.success).toBe(false);
    if (result.success) throw new Error("expected failure");
    expect(result.errors.map((error) => error.row)).toEqual([2, 3, 4]);
  });

  it("adds no expenses when any row is invalid", () => {
    const result = parseExpenseBatchImport([
      { amount: 100, type: "groceries", date: "2026-01-01" },
      { amount: -1, type: "groceries", date: "2026-01-01" },
    ]);

    expect(result.success).toBe(false);
  });

  it("does not deduplicate rows identical to each other", () => {
    const row = { amount: 100, type: "groceries", date: "2026-01-01" };
    const result = parseExpenseBatchImport([row, row]);

    expect(result.success).toBe(true);
    if (!result.success) throw new Error("expected success");
    expect(result.expenses).toHaveLength(2);
  });
});
