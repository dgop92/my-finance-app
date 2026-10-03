import { expect, Page, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";
import { formatCurrency } from "@/lib/formatters";

function statTile(page: Page, title: string) {
  return page.locator("div.rounded-lg", { has: page.getByText(title, { exact: true }) });
}

// Dates are relative to today so the seeded months are always closed months.
// Seeds only once so values saved through the UI survive later navigations.
async function seedPastMonths(page: Page) {
  await page.addInitScript(() => {
    if (localStorage.getItem("financeApp:accounts")) return;

    const now = new Date();
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 10, 12).toISOString();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 10, 12).toISOString();
    const createdAt = now.toISOString();

    localStorage.setItem(
      "financeApp:accounts",
      JSON.stringify([{ id: "acc-1", name: "Main", createdAt, archived: false, isSavingAccount: false }])
    );
    localStorage.setItem(
      "financeApp:ledgerEntries",
      JSON.stringify([
        { id: "e-1", createdAt, accountId: "acc-1", type: "debit", amount: 1000000, date: twoMonthsAgo },
        { id: "e-2", createdAt, accountId: "acc-1", type: "debit", amount: 500000, date: lastMonth },
      ])
    );
  });
}

async function selectOlderMonth(page: Page) {
  await page.getByRole("combobox", { name: "Month" }).click();
  await page.getByRole("option").nth(2).click();
}

test("edits a month's report inputs, saves them, and reloads them when the month is selected again", async ({
  page,
}) => {
  await seedPastMonths(page);

  await page.goto(PATHS.SETTINGS);
  await page.getByLabel("Net salary (COP)").fill("5000000");
  await page.getByRole("button", { name: "Save" }).click();

  await page.goto(PATHS.MONTHLY_REPORT);
  await selectOlderMonth(page);

  // Defaults: global net salary, no manual income, 1.000.000 threshold, interest enabled.
  await expect(page.getByLabel("Net salary override (COP)")).toHaveValue("");
  await expect(page.getByLabel("Other income (COP)")).toHaveValue("0");
  await expect(page.getByLabel("Max interest deposit (COP)")).toHaveValue("1000000");
  await expect(page.getByRole("switch", { name: "Automatic interest" })).toBeChecked();
  // Total saved: 1.000.000. Unknown expenses: 5.000.000 + 0 - 0 - 1.000.000 = 4.000.000.
  await expect(statTile(page, "Total Saved").locator("span")).toHaveText(formatCurrency(1000000));
  await expect(statTile(page, "Net Salary").locator("span")).toHaveText(formatCurrency(5000000));
  await expect(statTile(page, "Unknown Expenses").locator("span")).toHaveText(formatCurrency(4000000));

  // Editing recomputes live, before saving.
  await page.getByLabel("Net salary override (COP)").fill("6000000");
  await page.getByLabel("Other income (COP)").fill("250000");
  await expect(statTile(page, "Net Salary").locator("span")).toHaveText(formatCurrency(6000000));
  await expect(statTile(page, "Other Income").locator("span")).toHaveText(formatCurrency(250000));
  await expect(statTile(page, "Unknown Expenses").locator("span")).toHaveText(formatCurrency(5250000));

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("status")).toHaveText("Saved");

  await page.goto(PATHS.SETTINGS);
  await page.goto(PATHS.MONTHLY_REPORT);

  // The latest month has no saved config, so it still shows the defaults.
  await expect(page.getByLabel("Net salary override (COP)")).toHaveValue("");

  await selectOlderMonth(page);

  await expect(page.getByLabel("Net salary override (COP)")).toHaveValue("6000000");
  await expect(page.getByLabel("Other income (COP)")).toHaveValue("250000");
  await expect(statTile(page, "Net Salary").locator("span")).toHaveText(formatCurrency(6000000));
  await expect(statTile(page, "Unknown Expenses").locator("span")).toHaveText(formatCurrency(5250000));
});

test("rejects negative manual other income", async ({ page }) => {
  await seedPastMonths(page);
  await page.goto(PATHS.MONTHLY_REPORT);

  await page.getByLabel("Other income (COP)").fill("-5");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Other income must be a whole number, zero or greater")).toBeVisible();
});
