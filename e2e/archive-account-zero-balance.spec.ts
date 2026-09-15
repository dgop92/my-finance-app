import { expect, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";
import { addLedgerEntry, createAccount } from "./helpers";

test("archives an account once its balance nets to zero", async ({ page }) => {
  const accountName = `Zero Balance ${Date.now()}`;
  // A second, untouched account keeps the account selectors on other pages
  // rendered after the first account is archived, so their contents can
  // still be inspected.
  const controlAccountName = `Control ${Date.now()}`;

  await page.goto(PATHS.ACCOUNTS);
  await createAccount(page, accountName);
  await createAccount(page, controlAccountName);

  await page.goto(PATHS.LEDGER_ENTRIES);
  await addLedgerEntry(page, { accountName, amount: "8000" });
  await expect(page.getByRole("listitem").filter({ hasText: accountName })).toBeVisible();
  await addLedgerEntry(page, { accountName, amount: "8000", type: "Withdrawal" });

  await page.goto(PATHS.ACCOUNTS);
  await page.getByRole("button", { name: `Archive ${accountName}` }).click();

  await page.getByRole("switch", { name: "Show archived accounts" }).click();
  const accountRow = page.getByRole("listitem").filter({ hasText: accountName });
  await expect(accountRow).toContainText("Archived");

  await page.goto(PATHS.LEDGER_ENTRIES);
  await page.getByRole("combobox", { name: "Account" }).click();
  await expect(page.getByRole("option", { name: accountName })).toHaveCount(0);
  await page.keyboard.press("Escape");

  await page.goto(PATHS.BATCH_MODE);
  await expect(page.getByLabel(accountName)).toHaveCount(0);
});
