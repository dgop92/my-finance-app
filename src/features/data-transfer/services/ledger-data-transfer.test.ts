import { describe, expect, it } from "vitest";
import { InMemoryAccountRepository } from "@/features/accounts/repositories/in-memory-account-repository";
import { InMemoryLedgerEntryRepository } from "@/features/ledger-entries/repositories/in-memory-ledger-entry-repository";
import { LedgerEntryRepository } from "@/features/ledger-entries/repositories/definitions/ledger-entry-repository";
import { exportLedgerData, importLedgerData } from "./ledger-data-transfer";

class FailingReplaceAllLedgerEntryRepository
  extends InMemoryLedgerEntryRepository
  implements LedgerEntryRepository
{
  replaceAll(): Promise<void> {
    return Promise.reject(new Error("storage write failed"));
  }
}

function buildRepositories() {
  return {
    accountRepository: new InMemoryAccountRepository(),
    ledgerEntryRepository: new InMemoryLedgerEntryRepository(),
  };
}

describe("exportLedgerData", () => {
  it("includes archived accounts and all ledger entries", async () => {
    const repositories = buildRepositories();
    const account = await repositories.accountRepository.create({ name: "Checking" });
    await repositories.accountRepository.archive(account.id);
    await repositories.ledgerEntryRepository.create({
      accountId: account.id,
      type: "credit",
      amount: 500,
      date: new Date("2026-01-01"),
    });

    const payload = await exportLedgerData(repositories);

    expect(payload.accounts).toHaveLength(1);
    expect(payload.accounts[0].archived).toBe(true);
    expect(payload.ledgerEntries).toHaveLength(1);
  });
});

describe("importLedgerData", () => {
  it("fully replaces existing data with the imported payload", async () => {
    const repositories = buildRepositories();
    await repositories.accountRepository.create({ name: "Old account" });

    const payload = {
      accounts: [
        {
          id: "acc-1",
          name: "Checking",
          createdAt: "2026-01-01T00:00:00.000Z",
          archived: false,
        },
      ],
      ledgerEntries: [
        {
          id: "entry-1",
          createdAt: "2026-01-02T00:00:00.000Z",
          accountId: "acc-1",
          type: "debit",
          amount: 1000,
          date: "2026-01-02T00:00:00.000Z",
        },
      ],
    };

    await importLedgerData(payload, repositories);

    const accounts = await repositories.accountRepository.getMany(true);
    const ledgerEntries = await repositories.ledgerEntryRepository.getMany();

    expect(accounts).toEqual([
      { ...payload.accounts[0], createdAt: new Date(payload.accounts[0].createdAt) },
    ]);
    expect(ledgerEntries).toEqual([
      {
        ...payload.ledgerEntries[0],
        createdAt: new Date(payload.ledgerEntries[0].createdAt),
        date: new Date(payload.ledgerEntries[0].date),
      },
    ]);
  });

  it("rejects a payload missing the accounts array and leaves stored data untouched", async () => {
    const repositories = buildRepositories();
    const existingAccount = await repositories.accountRepository.create({ name: "Checking" });

    await expect(
      importLedgerData({ ledgerEntries: [] }, repositories)
    ).rejects.toThrow();

    const accounts = await repositories.accountRepository.getMany(true);
    expect(accounts).toEqual([existingAccount]);
  });

  it("rejects a payload where ledgerEntries is not an array and leaves stored data untouched", async () => {
    const repositories = buildRepositories();
    const existingAccount = await repositories.accountRepository.create({ name: "Checking" });
    await repositories.ledgerEntryRepository.create({
      accountId: existingAccount.id,
      type: "credit",
      amount: 100,
      date: new Date("2026-01-01"),
    });

    await expect(
      importLedgerData({ accounts: [], ledgerEntries: "not-an-array" }, repositories)
    ).rejects.toThrow();

    const accounts = await repositories.accountRepository.getMany(true);
    const ledgerEntries = await repositories.ledgerEntryRepository.getMany();
    expect(accounts).toEqual([existingAccount]);
    expect(ledgerEntries).toHaveLength(1);
  });

  it("rolls back the accounts write if the ledger-entries write fails", async () => {
    const repositories = {
      accountRepository: new InMemoryAccountRepository(),
      ledgerEntryRepository: new FailingReplaceAllLedgerEntryRepository(),
    };
    const existingAccount = await repositories.accountRepository.create({ name: "Checking" });

    const payload = {
      accounts: [
        { id: "acc-1", name: "New account", createdAt: "2026-01-01T00:00:00.000Z", archived: false },
      ],
      ledgerEntries: [],
    };

    await expect(importLedgerData(payload, repositories)).rejects.toThrow(
      "storage write failed"
    );

    const accounts = await repositories.accountRepository.getMany(true);
    expect(accounts).toEqual([existingAccount]);
  });
});
