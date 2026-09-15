import { expect, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";
import { formatCurrency } from "@/lib/formatters";
import { addLedgerEntry, createAccount } from "./helpers";

test("dashboard reflects ledger activity across accounts", async ({ page }) => {
  const accountA = `Dash A ${Date.now()}`;
  const accountB = `Dash B ${Date.now()}`;

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

  await page.goto(PATHS.HOME);

  const grandTotal = 70000 + 50000;
  await expect(page.locator("span.text-3xl")).toHaveText(formatCurrency(grandTotal));

  const rowA = page.getByRole("listitem").filter({ hasText: accountA });
  await expect(rowA).toContainText(formatCurrency(70000));
  const rowB = page.getByRole("listitem").filter({ hasText: accountB });
  await expect(rowB).toContainText(formatCurrency(50000));

  const currentMonthLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date());
  const currentMonthCard = page.locator("div.rounded-lg", {
    has: page.getByText(currentMonthLabel, { exact: true }),
  });
  await expect(currentMonthCard.locator("span.text-xl")).toHaveText(formatCurrency(grandTotal));
});
