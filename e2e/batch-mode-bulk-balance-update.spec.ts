import { expect, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";
import { formatCurrency } from "@/lib/formatters";
import { addLedgerEntry, createAccount } from "./helpers";

test("updates multiple account balances at once via batch mode", async ({ page }) => {
  const accountA = `Batch A ${Date.now()}`;
  const accountB = `Batch B ${Date.now()}`;
  const accountC = `Batch C ${Date.now()}`;

  await page.goto(PATHS.ACCOUNTS);
  for (const name of [accountA, accountB, accountC]) {
    await createAccount(page, name);
  }

  // Give A and B existing balances: A = 100000, B = 50000.
  await page.goto(PATHS.LEDGER_ENTRIES);
  await addLedgerEntry(page, { accountName: accountA, amount: "100000" });
  await expect(page.getByRole("listitem").filter({ hasText: accountA })).toBeVisible();

  await addLedgerEntry(page, { accountName: accountB, amount: "50000" });
  await expect(page.getByRole("listitem").filter({ hasText: accountB })).toBeVisible();

  // C has a zero balance and gets archived, so it should be absent from batch mode.
  await page.goto(PATHS.ACCOUNTS);
  await page.getByRole("button", { name: `Archive ${accountC}` }).click();

  await page.goto(PATHS.BATCH_MODE);
  await expect(page.getByLabel(accountC)).toHaveCount(0);

  await page.getByLabel(accountA).fill("150000");
  await page.getByLabel(accountB).fill("20000");
  await page.getByRole("button", { name: "Save balances" }).click();
  await expect(page.getByText("Balances saved.")).toBeVisible();

  await page.goto(PATHS.ACCOUNTS);
  const rowA = page.getByRole("listitem").filter({ hasText: accountA });
  await expect(rowA).toContainText(formatCurrency(150000));
  const rowB = page.getByRole("listitem").filter({ hasText: accountB });
  await expect(rowB).toContainText(formatCurrency(20000));

  await page.goto(PATHS.LEDGER_ENTRIES);
  const diffEntryA = page
    .getByRole("listitem")
    .filter({ hasText: accountA })
    .filter({ hasText: formatCurrency(50000) });
  await expect(diffEntryA).toContainText("Deposit");

  const diffEntryB = page
    .getByRole("listitem")
    .filter({ hasText: accountB })
    .filter({ hasText: formatCurrency(30000) });
  await expect(diffEntryB).toContainText("Withdrawal");
});
