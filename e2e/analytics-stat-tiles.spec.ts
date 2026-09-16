import { expect, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";
import { formatCurrency } from "@/lib/formatters";
import { addLedgerEntry, createAccount } from "./helpers";

function statTile(page: import("@playwright/test").Page, title: string) {
  return page.locator("div.rounded-lg", { has: page.getByText(title, { exact: true }) });
}

test("analytics page renders stat tiles computed from accounts and ledger entries", async ({
  page,
}) => {
  const accountA = `Analytics A ${Date.now()}`;
  const accountB = `Analytics B ${Date.now()}`;

  await page.goto(PATHS.ACCOUNTS);
  await createAccount(page, accountA);
  await createAccount(page, accountB);

  await page.goto(PATHS.LEDGER_ENTRIES);

  // Account A: deposit 100000, withdrawal 30000 -> balance 70000
  await addLedgerEntry(page, { accountName: accountA, amount: "100000" });
  await expect(page.getByRole("listitem").filter({ hasText: accountA })).toBeVisible();
  await addLedgerEntry(page, { accountName: accountA, amount: "30000", type: "Withdrawal" });

  // Account B: deposit 50000 -> balance 50000
  await addLedgerEntry(page, { accountName: accountB, amount: "50000" });
  await expect(page.getByRole("listitem").filter({ hasText: accountB })).toBeVisible();

  await page.goto(PATHS.ANALYTICS);

  const netWorth = 70000 + 50000;
  await expect(statTile(page, "Net Worth").locator("span")).toHaveText(formatCurrency(netWorth));

  const avgTransactionSize = (100000 + 30000 + 50000) / 3;
  await expect(statTile(page, "Avg Transaction Size").locator("span")).toHaveText(
    formatCurrency(avgTransactionSize)
  );

  await expect(statTile(page, "Largest Deposit").locator("span")).toHaveText(
    formatCurrency(100000)
  );
  await expect(statTile(page, "Largest Withdrawal").locator("span")).toHaveText(
    formatCurrency(30000)
  );
  await expect(statTile(page, "Entry Count").locator("span")).toHaveText("3");
});
