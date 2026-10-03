import { expect, Page, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";
import { formatCurrency } from "@/lib/formatters";

function statTile(page: Page, title: string) {
  return page.locator("div.rounded-lg", { has: page.getByText(title, { exact: true }) });
}

// Dates are relative to today so the seeded months are always closed months.
async function seedPastMonths(page: Page, netSalary: number) {
  await page.addInitScript((salary) => {
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
    localStorage.setItem(
      "financeApp:expenses",
      JSON.stringify([
        { id: "x-1", createdAt, date: twoMonthsAgo, amount: 400000, notes: "", type: "groceries" },
        { id: "x-2", createdAt, date: twoMonthsAgo, amount: 100000, notes: "", type: "transport" },
      ])
    );
    localStorage.setItem("financeApp:settings", JSON.stringify({ netSalary: salary }));
  }, netSalary);
}

test("monthly report shows the analysis for the latest closed month and only offers past months", async ({
  page,
}) => {
  await seedPastMonths(page, 5000000);

  await page.goto(PATHS.MONTHLY_REPORT);

  // Total saved: 500.000 deposited last month. Known expenses: 500.000 from two months ago.
  // Unknown expenses: 5.000.000 + 0 - 500.000 - 500.000 = 4.000.000.
  await expect(statTile(page, "Total Saved").locator("span")).toHaveText(formatCurrency(500000));
  await expect(statTile(page, "Net Salary").locator("span")).toHaveText(formatCurrency(5000000));
  await expect(statTile(page, "Other Income").locator("span")).toHaveText(formatCurrency(0));
  await expect(statTile(page, "Unknown Expenses").locator("span")).toHaveText(formatCurrency(4000000));
  await expect(page.getByText("Groceries")).toBeVisible();
  await expect(page.getByText("Known vs Unknown Expenses")).toBeVisible();

  await page.getByRole("combobox", { name: "Month" }).click();
  await expect(page.getByRole("option")).toHaveCount(2);
});

test("monthly report shows unexplained income with a warning instead of the chart when unknown expenses are negative", async ({
  page,
}) => {
  await seedPastMonths(page, 0);

  await page.goto(PATHS.MONTHLY_REPORT);

  // Unknown expenses: 0 + 0 - 500.000 - 500.000 = -1.000.000
  await expect(statTile(page, "Unexplained Income").locator("span")).toHaveText(formatCurrency(1000000));
  await expect(page.getByRole("alert")).toContainText("unexplained income");
  await expect(page.getByText("Known vs Unknown Expenses")).toHaveCount(0);
});
