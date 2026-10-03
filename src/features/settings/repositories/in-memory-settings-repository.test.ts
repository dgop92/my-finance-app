import { describe, expect, it } from "vitest";
import { InMemorySettingsRepository } from "./in-memory-settings-repository";

describe("InMemorySettingsRepository", () => {
  it("returns default settings when none have been saved", async () => {
    const repository = new InMemorySettingsRepository();

    const settings = await repository.get();

    expect(settings.netSalary).toBe(0);
  });

  it("updates and persists the net salary", async () => {
    const repository = new InMemorySettingsRepository();

    const updated = await repository.update({ netSalary: 5_000_000 });

    expect(updated.netSalary).toBe(5_000_000);
    expect(await repository.get()).toEqual(updated);
  });

  it("overwrites the previous net salary on repeated updates", async () => {
    const repository = new InMemorySettingsRepository();
    await repository.update({ netSalary: 1_000_000 });

    const updated = await repository.update({ netSalary: 2_000_000 });

    expect(updated.netSalary).toBe(2_000_000);
    expect(await repository.get()).toEqual({ netSalary: 2_000_000 });
  });
});
