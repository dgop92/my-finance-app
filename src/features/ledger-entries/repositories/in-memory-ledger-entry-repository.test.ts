import { describe, expect, it } from "vitest";
import { InMemoryLedgerEntryRepository } from "./in-memory-ledger-entry-repository";

describe("InMemoryLedgerEntryRepository", () => {
  it("creates an entry and lists it", async () => {
    const repository = new InMemoryLedgerEntryRepository();

    const created = await repository.create({
      accountId: "account-1",
      type: "debit",
      amount: 500,
      date: new Date("2026-01-05"),
    });
    const entries = await repository.getMany();

    expect(created.accountId).toBe("account-1");
    expect(created.type).toBe("debit");
    expect(created.amount).toBe(500);
    expect(entries).toEqual([created]);
  });

  it("filters by accountId", async () => {
    const repository = new InMemoryLedgerEntryRepository();
    await repository.create({
      accountId: "account-1",
      type: "debit",
      amount: 100,
      date: new Date("2026-01-01"),
    });
    const entryTwo = await repository.create({
      accountId: "account-2",
      type: "credit",
      amount: 50,
      date: new Date("2026-01-02"),
    });

    const filtered = await repository.getMany({ accountId: "account-2" });

    expect(filtered).toEqual([entryTwo]);
  });

  it("sorts entries by date descending by default", async () => {
    const repository = new InMemoryLedgerEntryRepository();
    const oldest = await repository.create({
      accountId: "account-1",
      type: "debit",
      amount: 100,
      date: new Date("2026-01-01"),
    });
    const newest = await repository.create({
      accountId: "account-1",
      type: "debit",
      amount: 200,
      date: new Date("2026-01-10"),
    });
    const middle = await repository.create({
      accountId: "account-1",
      type: "debit",
      amount: 150,
      date: new Date("2026-01-05"),
    });

    const entries = await repository.getMany();

    expect(entries).toEqual([newest, middle, oldest]);
  });

  it("updates an entry's fields", async () => {
    const repository = new InMemoryLedgerEntryRepository();
    const created = await repository.create({
      accountId: "account-1",
      type: "debit",
      amount: 100,
      date: new Date("2026-01-01"),
    });

    const updated = await repository.update(created.id, {
      accountId: "account-2",
      type: "credit",
      amount: 250,
      date: new Date("2026-02-01"),
    });

    expect(updated.accountId).toBe("account-2");
    expect(updated.type).toBe("credit");
    expect(updated.amount).toBe(250);
    expect(updated.date).toEqual(new Date("2026-02-01"));
  });

  it("throws when updating an entry that does not exist", async () => {
    const repository = new InMemoryLedgerEntryRepository();

    await expect(repository.update("missing", { amount: 10 })).rejects.toThrow(
      /not found/
    );
  });

  it("deletes an entry", async () => {
    const repository = new InMemoryLedgerEntryRepository();
    const created = await repository.create({
      accountId: "account-1",
      type: "debit",
      amount: 100,
      date: new Date("2026-01-01"),
    });

    await repository.delete(created.id);

    expect(await repository.getMany()).toEqual([]);
  });

  it("throws when deleting an entry that does not exist", async () => {
    const repository = new InMemoryLedgerEntryRepository();

    await expect(repository.delete("missing")).rejects.toThrow(/not found/);
  });
});
