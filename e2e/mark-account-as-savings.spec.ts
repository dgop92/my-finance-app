import { expect, test } from "@playwright/test";
import { PATHS } from "@/lib/paths";

test("flags an account as a savings account and it persists after reload", async ({
  page,
}) => {
  const name = `Emergency Fund ${Date.now()}`;

  await page.goto(PATHS.ACCOUNTS);
  await expect(page.getByLabel("Savings account")).not.toBeChecked();

  await page.getByLabel("Account name").fill(name);
  await page.getByLabel("Savings account").check();
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText(name)).toBeVisible();

  await page.reload();

  const accountRow = page.getByRole("listitem").filter({ hasText: name });
  await accountRow.getByRole("button", { name: "Rename" }).click();
  await expect(page.getByLabel(`Savings account ${name}`)).toBeChecked();
});
