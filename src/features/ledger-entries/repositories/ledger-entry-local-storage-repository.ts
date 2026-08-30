import { v4 as uuidv4 } from "uuid";
import {
  CreateLedgerEntryInput,
  LedgerEntry,
  UpdateLedgerEntryInput,
} from "@/features/core/entities/ledger-entry";
import {
  loadLedgerEntries,
  saveLedgerEntries,
} from "@/features/core/lib/ledger-entry-storage";
import {
  LedgerEntryFilter,
  LedgerEntryRepository,
} from "./definitions/ledger-entry-repository";

export class LedgerEntryLocalStorageRepository implements LedgerEntryRepository {
  async getMany(filter?: LedgerEntryFilter): Promise<LedgerEntry[]> {
    const entries = loadLedgerEntries();
    const filtered = filter?.accountId
      ? entries.filter((entry) => entry.accountId === filter.accountId)
      : entries;
    return [...filtered].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async create(input: CreateLedgerEntryInput): Promise<LedgerEntry> {
    const entries = loadLedgerEntries();
    const entry: LedgerEntry = {
      id: uuidv4(),
      createdAt: new Date(),
      accountId: input.accountId,
      type: input.type,
      amount: input.amount,
      date: input.date,
    };
    saveLedgerEntries([...entries, entry]);
    return entry;
  }

  async update(id: string, input: UpdateLedgerEntryInput): Promise<LedgerEntry> {
    const entries = loadLedgerEntries();
    const index = this.findIndexOrThrow(entries, id);
    const updated: LedgerEntry = {
      ...entries[index],
      accountId: input.accountId ?? entries[index].accountId,
      type: input.type ?? entries[index].type,
      amount: input.amount ?? entries[index].amount,
      date: input.date ?? entries[index].date,
    };
    entries[index] = updated;
    saveLedgerEntries(entries);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const entries = loadLedgerEntries();
    this.findIndexOrThrow(entries, id);
    saveLedgerEntries(entries.filter((entry) => entry.id !== id));
  }

  async replaceAll(entries: LedgerEntry[]): Promise<void> {
    saveLedgerEntries(entries);
  }

  private findIndexOrThrow(entries: LedgerEntry[], id: string): number {
    const index = entries.findIndex((entry) => entry.id === id);
    if (index === -1) {
      throw new Error(`Ledger entry not found: ${id}`);
    }
    return index;
  }
}
