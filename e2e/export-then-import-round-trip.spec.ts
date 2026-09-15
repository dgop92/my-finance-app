import { readFileSync } from "fs";
import { expect, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";
import { addLedgerEntry, createAccount } from "./helpers";

test("exports data then re-imports it, overwriting local mutations", async ({ page }) => {
  const accountName = `RT Account ${Date.now()}`;
  const mutationAccountName = `Mutation Extra ${Date.now()}`;

  await page.goto(PATHS.ACCOUNTS);
  await createAccount(page, accountName);

  await page.goto(PATHS.LEDGER_ENTRIES);
  await addLedgerEntry(page, { accountName, amount: "15000" });
  await expect(page.getByRole("listitem").filter({ hasText: accountName })).toBeVisible();

  await page.goto(PATHS.DATA_TRANSFER);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export data" }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  if (!downloadPath) {
    throw new Error("Expected the export download to be saved to disk.");
  }
  const exportedContent = readFileSync(downloadPath);
  const exportedPayload = JSON.parse(exportedContent.toString("utf-8"));
  expect(exportedPayload.accounts).toHaveLength(1);
  expect(exportedPayload.ledgerEntries).toHaveLength(1);

  await page.goto(PATHS.ACCOUNTS);
  await createAccount(page, mutationAccountName);

  await page.goto(PATHS.DATA_TRANSFER);
  await page
    .locator("input[type=file]")
    .setInputFiles({ name: "backup.json", mimeType: "application/json", buffer: exportedContent });

  await expect(page.getByText("Data imported successfully.")).toBeVisible();

  await page.goto(PATHS.ACCOUNTS);
  await expect(page.getByText(accountName)).toBeVisible();
  await expect(page.getByText(mutationAccountName)).toHaveCount(0);

  await page.goto(PATHS.LEDGER_ENTRIES);
  const entryRow = page.getByRole("listitem").filter({ hasText: accountName });
  await expect(entryRow).toHaveCount(1);
  await expect(entryRow).toContainText("15.000");
});
