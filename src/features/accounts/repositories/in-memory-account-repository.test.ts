import { describe, expect, it } from "vitest";
import { LedgerEntry } from "@/features/core/entities/ledger-entry";
import { InMemoryAccountRepository } from "./in-memory-account-repository";

function makeEntry(overrides: Partial<LedgerEntry>): LedgerEntry {
  return {
    id: "entry-1",
    createdAt: new Date(),
    accountId: "account-1",
    type: "debit",
    amount: 100,
    ...overrides,
  };
}

describe("InMemoryAccountRepository", () => {
  it("creates an account and lists it", async () => {
    const repository = new InMemoryAccountRepository();

    const created = await repository.create({ name: "Checking" });
    const accounts = await repository.getMany();

    expect(created.name).toBe("Checking");
    expect(created.archived).toBe(false);
    expect(accounts).toEqual([created]);
  });

  it("excludes archived accounts by default and includes them when requested", async () => {
    const repository = new InMemoryAccountRepository();
    const account = await repository.create({ name: "Savings" });
    await repository.archive(account.id);

    const activeOnly = await repository.getMany();
    const all = await repository.getMany(true);

    expect(activeOnly).toEqual([]);
    expect(all).toEqual([{ ...account, archived: true }]);
  });

  it("archives an account with a zero balance", async () => {
    const repository = new InMemoryAccountRepository();
    const account = await repository.create({ name: "Checking" });

    const archived = await repository.archive(account.id);

    expect(archived.archived).toBe(true);
  });

  it("rejects archiving an account with a non-zero balance", async () => {
    const repository = new InMemoryAccountRepository();
    const account = await repository.create({ name: "Checking" });
    repository.seedEntries(account.id, [makeEntry({ accountId: account.id })]);

    await expect(repository.archive(account.id)).rejects.toThrow(/balance must be zero/);

    const accounts = await repository.getMany();
    expect(accounts[0].archived).toBe(false);
  });

  it("renames an account", async () => {
    const repository = new InMemoryAccountRepository();
    const account = await repository.create({ name: "Checking" });

    const renamed = await repository.update(account.id, { name: "Primary Checking" });

    expect(renamed.name).toBe("Primary Checking");
  });
});
