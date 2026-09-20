import { describe, expect, it } from "vitest";
import { EXPENSE_TYPE_OPTIONS, expenseTypeToLabel } from "./expense-type-label";

describe("expenseTypeToLabel", () => {
  it("maps groceries to Groceries", () => {
    expect(expenseTypeToLabel("groceries")).toBe("Groceries");
  });

  it("maps fast_food to Fast food", () => {
    expect(expenseTypeToLabel("fast_food")).toBe("Fast food");
  });

  it("maps other to Other", () => {
    expect(expenseTypeToLabel("other")).toBe("Other");
  });
});

describe("EXPENSE_TYPE_OPTIONS", () => {
  it("includes an option for every expense type", () => {
    expect(EXPENSE_TYPE_OPTIONS).toHaveLength(10);
    expect(EXPENSE_TYPE_OPTIONS).toContainEqual({
      value: "groceries",
      label: "Groceries",
    });
  });
});
