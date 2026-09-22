import { Page, expect } from "@playwright/test";

export async function createAccount(page: Page, name: string): Promise<void> {
  await page.getByLabel("Account name").fill(name);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText(name)).toBeVisible();
}

export interface AddLedgerEntryOptions {
  accountName: string;
  amount: string;
  type?: "Deposit" | "Withdrawal";
}

export async function addLedgerEntry(page: Page, options: AddLedgerEntryOptions): Promise<void> {
  await page.getByRole("combobox", { name: "Account" }).click();
  await page.getByRole("option", { name: options.accountName }).click();

  if (options.type === "Withdrawal") {
    await page.getByRole("combobox", { name: "Type" }).click();
    await page.getByRole("option", { name: "Withdrawal" }).click();
  }

  await page.getByLabel("Amount (COP)").fill(options.amount);
  await page.getByRole("button", { name: "Add entry" }).click();
}

export interface AddExpenseOptions {
  category: string;
  amount: string;
  note?: string;
}

export async function addExpense(page: Page, options: AddExpenseOptions): Promise<void> {
  await page.getByRole("combobox", { name: "Category" }).click();
  await page.getByRole("option", { name: options.category }).click();

  await page.getByLabel("Amount (COP)").fill(options.amount);

  if (options.note) {
    await page.getByLabel("Note (optional)").fill(options.note);
  }

  await page.getByRole("button", { name: "Add expense" }).click();
}
