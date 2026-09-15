import { expect, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";
import { addLedgerEntry, createAccount } from "./helpers";

test("blocks archiving an account with a non-zero balance", async ({ page }) => {
  const accountName = `Non Zero Balance ${Date.now()}`;

  await page.goto(PATHS.ACCOUNTS);
  await createAccount(page, accountName);

  await page.goto(PATHS.LEDGER_ENTRIES);
  await addLedgerEntry(page, { accountName, amount: "9000" });
  await expect(page.getByRole("listitem").filter({ hasText: accountName })).toBeVisible();

  await page.goto(PATHS.ACCOUNTS);
  const accountRow = page.getByRole("listitem").filter({ hasText: accountName });
  await accountRow.getByRole("button", { name: `Archive ${accountName}` }).click();

  await expect(accountRow).toContainText(/balance must be zero/i);
  await expect(accountRow).not.toContainText("Archived");
  await expect(accountRow.getByRole("button", { name: `Archive ${accountName}` })).toBeVisible();
});
