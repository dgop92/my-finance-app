import { expect, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";
import { addLedgerEntry, createAccount } from "./helpers";

test("rejects a malformed import file and keeps existing data", async ({ page }) => {
  const accountName = `Preexisting ${Date.now()}`;

  await page.goto(PATHS.ACCOUNTS);
  await createAccount(page, accountName);

  await page.goto(PATHS.LEDGER_ENTRIES);
  await addLedgerEntry(page, { accountName, amount: "12000" });
  await expect(page.getByRole("listitem").filter({ hasText: accountName })).toBeVisible();

  await page.goto(PATHS.DATA_TRANSFER);
  await page.locator("input[type=file]").setInputFiles({
    name: "malformed.json",
    mimeType: "application/json",
    buffer: Buffer.from("{ this is not valid json"),
  });

  await expect(page.getByText(/invalid file format/i)).toBeVisible();

  await page.goto(PATHS.ACCOUNTS);
  await expect(page.getByText(accountName)).toBeVisible();

  await page.goto(PATHS.LEDGER_ENTRIES);
  const entryRow = page.getByRole("listitem").filter({ hasText: accountName });
  await expect(entryRow).toHaveCount(1);
  await expect(entryRow).toContainText("12.000");
});
