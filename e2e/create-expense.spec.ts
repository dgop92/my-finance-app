import { expect, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";

test("creates an expense through the form and sees it in the list", async ({
  page,
}) => {
  const note = `Coffee ${Date.now()}`;
  const amount = "15000";

  await page.goto(PATHS.EXPENSES);
  await page.getByRole("combobox", { name: "Category" }).click();
  await page.getByRole("option", { name: "Fast food" }).click();
  await page.getByLabel("Amount (COP)").fill(amount);
  await page.getByLabel("Note (optional)").fill(note);
  await page.getByRole("button", { name: "Add expense" }).click();

  const expenseRow = page.getByRole("listitem").filter({ hasText: note });
  await expect(expenseRow).toBeVisible();
  await expect(expenseRow).toContainText("Fast food");
  await expect(expenseRow).toContainText("15.000");
});
