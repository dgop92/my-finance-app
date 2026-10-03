import { describe, expect, it } from "vitest";
import { AccountSchema, CreateAccountInputSchema } from "./account";

const storedAccount = {
  id: "acc-1",
  name: "Checking",
  createdAt: "2026-01-01T00:00:00.000Z",
  archived: false,
};

describe("AccountSchema", () => {
  it("defaults isSavingAccount to false for accounts stored before the field existed", () => {
    const account = AccountSchema.parse(storedAccount);

    expect(account.isSavingAccount).toBe(false);
  });

  it("keeps an explicitly stored isSavingAccount value", () => {
    const account = AccountSchema.parse({ ...storedAccount, isSavingAccount: true });

    expect(account.isSavingAccount).toBe(true);
  });

  it("revives createdAt as a Date", () => {
    const account = AccountSchema.parse(storedAccount);

    expect(account.createdAt).toEqual(new Date("2026-01-01T00:00:00.000Z"));
  });
});

describe("CreateAccountInputSchema", () => {
  it("defaults isSavingAccount to false", () => {
    const input = CreateAccountInputSchema.parse({ name: "Checking" });

    expect(input.isSavingAccount).toBe(false);
  });
});
