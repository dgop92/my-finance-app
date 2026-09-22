import { expect, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";
import { addExpense } from "./helpers";

test("edits an expense and then deletes it", async ({ page }) => {
  await page.goto(PATHS.EXPENSES);
  await addExpense(page, { category: "Fast food", amount: "10000", note: "Coffee run" });

  const expenseRow = page.getByRole("listitem");
  await expect(expenseRow).toHaveCount(1);
  await expect(expenseRow).toContainText("Fast food");
  await expect(expenseRow).toContainText("10.000");

  await expenseRow.getByRole("button", { name: "Edit" }).click();
  await expenseRow.getByLabel("Amount (COP)").fill("20000");
  await expenseRow.getByRole("combobox", { name: "Category" }).click();
  await page.getByRole("option", { name: "Transport" }).click();
  await expenseRow.getByRole("button", { name: "Save" }).click();

  await expect(expenseRow).toContainText("20.000");
  await expect(expenseRow).toContainText("Transport");
  await expect(expenseRow).not.toContainText("10.000");

  await expenseRow
    .getByRole("button", { name: "Delete expense: Transport for" })
    .click();
  await expect(page.getByRole("alertdialog")).toContainText("Delete this expense?");
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();

  await expect(expenseRow).toHaveCount(0);
});
