import { expect, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";

test("creates an account and a ledger entry against it", async ({ page }) => {
  const accountName = `Checking ${Date.now()}`;
  const amount = "42500";

  await page.goto(PATHS.ACCOUNTS);
  await page.getByLabel("Account name").fill(accountName);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText(accountName)).toBeVisible();

  await page.goto(PATHS.LEDGER_ENTRIES);
  await page.getByRole("combobox", { name: "Account" }).click();
  await page.getByRole("option", { name: accountName }).click();
  await page.getByLabel("Amount (COP)").fill(amount);
  await page.getByRole("button", { name: "Add entry" }).click();

  const entryRow = page.getByRole("listitem").filter({ hasText: accountName });
  await expect(entryRow).toBeVisible();
  await expect(entryRow).toContainText("42.500");
});
