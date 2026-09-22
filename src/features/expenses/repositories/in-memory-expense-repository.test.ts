import { afterEach, describe, expect, it, vi } from "vitest";
import { InMemoryExpenseRepository } from "./in-memory-expense-repository";

afterEach(() => {
  vi.useRealTimers();
});

describe("InMemoryExpenseRepository", () => {
  it("creates an expense and lists it", async () => {
    const repository = new InMemoryExpenseRepository();

    const created = await repository.create({
      type: "groceries",
      amount: 500,
      date: new Date("2026-01-05"),
      notes: "Weekly groceries",
    });
    const expenses = await repository.getMany();

    expect(created.type).toBe("groceries");
    expect(created.amount).toBe(500);
    expect(created.notes).toBe("Weekly groceries");
    expect(expenses).toEqual([created]);
  });

  it("sorts expenses by date descending by default", async () => {
    const repository = new InMemoryExpenseRepository();
    const oldest = await repository.create({
      type: "groceries",
      amount: 100,
      date: new Date("2026-01-01"),
      notes: "",
    });
    const newest = await repository.create({
      type: "transport",
      amount: 200,
      date: new Date("2026-01-10"),
      notes: "",
    });
    const middle = await repository.create({
      type: "health",
      amount: 150,
      date: new Date("2026-01-05"),
      notes: "",
    });

    const expenses = await repository.getMany();

    expect(expenses).toEqual([newest, middle, oldest]);
  });

  it("tie-breaks equal dates by createdAt descending", async () => {
    const repository = new InMemoryExpenseRepository();

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const createdFirst = await repository.create({
      type: "groceries",
      amount: 100,
      date: new Date("2026-01-05"),
      notes: "",
    });
    vi.setSystemTime(new Date("2026-01-01T00:00:01Z"));
    const createdSecond = await repository.create({
      type: "transport",
      amount: 200,
      date: new Date("2026-01-05"),
      notes: "",
    });

    const expenses = await repository.getMany();

    expect(expenses).toEqual([createdSecond, createdFirst]);
  });

  it("creates many expenses in one call, additive to existing ones", async () => {
    const repository = new InMemoryExpenseRepository();
    const existing = await repository.create({
      type: "groceries",
      amount: 100,
      date: new Date("2026-01-01"),
      notes: "",
    });

    const created = await repository.createMany([
      { type: "transport", amount: 200, date: new Date("2026-01-02"), notes: "" },
      { type: "health", amount: 300, date: new Date("2026-01-03"), notes: "" },
    ]);

    expect(created).toHaveLength(2);
    const expenses = await repository.getMany();
    expect(expenses).toHaveLength(3);
    expect(expenses.map((expense) => expense.id)).toEqual(
      expect.arrayContaining([existing.id, created[0].id, created[1].id])
    );
  });

  it("updates an expense's fields", async () => {
    const repository = new InMemoryExpenseRepository();
    const created = await repository.create({
      type: "groceries",
      amount: 100,
      date: new Date("2026-01-01"),
      notes: "",
    });

    const updated = await repository.update(created.id, {
      type: "travel",
      amount: 250,
      date: new Date("2026-02-01"),
      notes: "Trip",
    });

    expect(updated.type).toBe("travel");
    expect(updated.amount).toBe(250);
    expect(updated.date).toEqual(new Date("2026-02-01"));
    expect(updated.notes).toBe("Trip");
  });

  it("throws when updating an expense that does not exist", async () => {
    const repository = new InMemoryExpenseRepository();

    await expect(
      repository.update("missing", { amount: 10 })
    ).rejects.toThrow(/not found/);
  });

  it("deletes an expense", async () => {
    const repository = new InMemoryExpenseRepository();
    const created = await repository.create({
      type: "groceries",
      amount: 100,
      date: new Date("2026-01-01"),
      notes: "",
    });

    await repository.delete(created.id);

    expect(await repository.getMany()).toEqual([]);
  });

  it("throws when deleting an expense that does not exist", async () => {
    const repository = new InMemoryExpenseRepository();

    await expect(repository.delete("missing")).rejects.toThrow(/not found/);
  });
});
