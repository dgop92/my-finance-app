import { v4 as uuidv4 } from "uuid";
import {
  CreateLedgerEntryInput,
  LedgerEntry,
  UpdateLedgerEntryInput,
} from "@/features/core/entities/ledger-entry";
import {
  LedgerEntryFilter,
  LedgerEntryRepository,
} from "./definitions/ledger-entry-repository";

export class InMemoryLedgerEntryRepository implements LedgerEntryRepository {
  private entries: LedgerEntry[] = [];

  getMany(filter?: LedgerEntryFilter): Promise<LedgerEntry[]> {
    const filtered = filter?.accountId
      ? this.entries.filter((entry) => entry.accountId === filter.accountId)
      : this.entries;
    const sorted = [...filtered].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
    return Promise.resolve(sorted);
  }

  create(input: CreateLedgerEntryInput): Promise<LedgerEntry> {
    const entry: LedgerEntry = {
      id: uuidv4(),
      createdAt: new Date(),
      accountId: input.accountId,
      type: input.type,
      amount: input.amount,
      date: input.date,
    };
    this.entries.push(entry);
    return Promise.resolve(entry);
  }

  async update(id: string, input: UpdateLedgerEntryInput): Promise<LedgerEntry> {
    const entry = this.findOrThrow(id);
    const updated: LedgerEntry = {
      ...entry,
      accountId: input.accountId ?? entry.accountId,
      type: input.type ?? entry.type,
      amount: input.amount ?? entry.amount,
      date: input.date ?? entry.date,
    };
    this.entries = this.entries.map((existing) =>
      existing.id === id ? updated : existing
    );
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.findOrThrow(id);
    this.entries = this.entries.filter((entry) => entry.id !== id);
  }

  replaceAll(entries: LedgerEntry[]): Promise<void> {
    this.entries = [...entries];
    return Promise.resolve();
  }

  private findOrThrow(id: string): LedgerEntry {
    const entry = this.entries.find((entry) => entry.id === id);
    if (!entry) {
      throw new Error(`Ledger entry not found: ${id}`);
    }
    return entry;
  }
}
