import { expect, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";
import { formatCurrency } from "@/lib/formatters";
import { addLedgerEntry, createAccount } from "./helpers";

test("edits a ledger entry and then deletes it", async ({ page }) => {
  const accountName = `Ledger Lifecycle ${Date.now()}`;

  await page.goto(PATHS.ACCOUNTS);
  await createAccount(page, accountName);

  await page.goto(PATHS.LEDGER_ENTRIES);
  await addLedgerEntry(page, { accountName, amount: "10000" });

  const entryRow = page.getByRole("listitem").filter({ hasText: accountName });
  await expect(entryRow).toBeVisible();
  await expect(entryRow).toContainText("10.000");

  await entryRow.getByRole("button", { name: "Edit" }).click();
  await entryRow.getByLabel("Amount (COP)").fill("20000");
  await entryRow.getByRole("combobox", { name: "Type" }).click();
  await page.getByRole("option", { name: "Withdrawal" }).click();
  await entryRow.getByRole("button", { name: "Save" }).click();

  await expect(entryRow).toContainText("20.000");
  await expect(entryRow).toContainText("Withdrawal");
  await expect(entryRow).not.toContainText("10.000");

  await entryRow.getByRole("button", { name: `Delete entry for ${accountName}` }).click();
  await expect(page.getByRole("alertdialog")).toContainText("Delete this entry?");
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();

  await expect(entryRow).toHaveCount(0);

  await page.goto(PATHS.ACCOUNTS);
  const accountRow = page.getByRole("listitem").filter({ hasText: accountName });
  await expect(accountRow).toContainText(formatCurrency(0));
});
