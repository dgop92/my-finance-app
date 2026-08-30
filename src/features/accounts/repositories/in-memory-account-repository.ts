import { v4 as uuidv4 } from "uuid";
import {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
} from "@/features/core/entities/account";
import { LedgerEntry } from "@/features/core/entities/ledger-entry";
import { computeAccountBalance } from "@/features/core/services/ledger-balance";
import { AccountRepository } from "./definitions/account-repository";
import { assertAccountCanBeArchived } from "../services/account-archive-policy";

// Test double for AccountRepository — holds accounts and ledger entries in
// memory so repository behavior (including the archive balance invariant)
// can be unit tested without touching localStorage.
export class InMemoryAccountRepository implements AccountRepository {
  private accounts: Account[] = [];
  private entriesByAccountId = new Map<string, LedgerEntry[]>();

  seedEntries(accountId: string, entries: LedgerEntry[]): void {
    this.entriesByAccountId.set(accountId, entries);
  }

  getMany(includeArchived = false): Promise<Account[]> {
    const accounts = includeArchived
      ? this.accounts
      : this.accounts.filter((account) => !account.archived);
    return Promise.resolve([...accounts]);
  }

  create(input: CreateAccountInput): Promise<Account> {
    const account: Account = {
      id: uuidv4(),
      name: input.name.trim(),
      createdAt: new Date(),
      archived: false,
    };
    this.accounts.push(account);
    return Promise.resolve(account);
  }

  async update(id: string, input: Pick<UpdateAccountInput, "name">): Promise<Account> {
    const account = this.findOrThrow(id);
    if (input.name !== undefined) {
      account.name = input.name.trim();
    }
    return account;
  }

  async archive(id: string): Promise<Account> {
    const account = this.findOrThrow(id);
    const balance = computeAccountBalance(this.entriesByAccountId.get(id) ?? []);
    assertAccountCanBeArchived(balance);
    account.archived = true;
    return account;
  }

  replaceAll(accounts: Account[]): Promise<void> {
    this.accounts = [...accounts];
    return Promise.resolve();
  }

  private findOrThrow(id: string): Account {
    const account = this.accounts.find((account) => account.id === id);
    if (!account) {
      throw new Error(`Account not found: ${id}`);
    }
    return account;
  }
}
