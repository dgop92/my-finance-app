import {
  CreateLedgerEntryInput,
  LedgerEntry,
  UpdateLedgerEntryInput,
} from "@/features/core/entities/ledger-entry";

export interface LedgerEntryFilter {
  accountId?: string;
}

export interface LedgerEntryRepository {
  getMany(filter?: LedgerEntryFilter): Promise<LedgerEntry[]>;
  create(input: CreateLedgerEntryInput): Promise<LedgerEntry>;
  update(id: string, input: UpdateLedgerEntryInput): Promise<LedgerEntry>;
  delete(id: string): Promise<void>;
}
