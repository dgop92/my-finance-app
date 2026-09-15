import { expect, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";
import { addLedgerEntry, createAccount } from "./helpers";

test("renames an account and entries keep attributing to it", async ({ page }) => {
  const oldName = `Old Checking ${Date.now()}`;
  const newName = `New Savings ${Date.now()}`;

  await page.goto(PATHS.ACCOUNTS);
  await createAccount(page, oldName);

  await page.goto(PATHS.LEDGER_ENTRIES);
  await addLedgerEntry(page, { accountName: oldName, amount: "15000" });
  await expect(page.getByRole("listitem").filter({ hasText: oldName })).toBeVisible();

  await page.goto(PATHS.ACCOUNTS);
  const accountRow = page.getByRole("listitem").filter({ hasText: oldName });
  await accountRow.getByRole("button", { name: "Rename" }).click();
  // Once renaming, the account name lives in the input's value rather than
  // text content, so `accountRow`'s hasText filter no longer matches it —
  // query the rename form at the page level instead.
  await page.getByLabel(`Rename ${oldName}`).fill(newName);
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText(newName, { exact: true })).toBeVisible();
  await expect(page.getByText(oldName, { exact: true })).toHaveCount(0);

  await page.goto(PATHS.LEDGER_ENTRIES);
  const entryRow = page.getByRole("listitem").filter({ hasText: "15.000" });
  await expect(entryRow).toContainText(newName);
  await expect(entryRow).not.toContainText(oldName);
});
