import { v4 as uuidv4 } from "uuid";
import {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
} from "@/features/core/entities/account";
import { computeAccountBalance } from "@/features/core/services/ledger-balance";
import { loadLedgerEntries } from "@/features/core/lib/ledger-entry-storage";
import { AccountRepository } from "./definitions/account-repository";
import { assertAccountCanBeArchived } from "../services/account-archive-policy";

const ACCOUNTS_STORAGE_KEY = "financeApp:accounts";

function loadAccounts(): Account[] {
  const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  const parsed = JSON.parse(raw) as Account[];
  return parsed.map((account) => ({ ...account, createdAt: new Date(account.createdAt) }));
}

function saveAccounts(accounts: Account[]): void {
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

export class AccountLocalStorageRepository implements AccountRepository {
  async getMany(includeArchived = false): Promise<Account[]> {
    const accounts = loadAccounts();
    return includeArchived ? accounts : accounts.filter((account) => !account.archived);
  }

  async create(input: CreateAccountInput): Promise<Account> {
    const accounts = loadAccounts();
    const account: Account = {
      id: uuidv4(),
      name: input.name.trim(),
      createdAt: new Date(),
      archived: false,
    };
    saveAccounts([...accounts, account]);
    return account;
  }

  async update(id: string, input: Pick<UpdateAccountInput, "name">): Promise<Account> {
    const accounts = loadAccounts();
    const index = this.findIndexOrThrow(accounts, id);
    const updated: Account = {
      ...accounts[index],
      name: input.name !== undefined ? input.name.trim() : accounts[index].name,
    };
    accounts[index] = updated;
    saveAccounts(accounts);
    return updated;
  }

  async archive(id: string): Promise<Account> {
    const accounts = loadAccounts();
    const index = this.findIndexOrThrow(accounts, id);

    const entries = loadLedgerEntries().filter((entry) => entry.accountId === id);
    assertAccountCanBeArchived(computeAccountBalance(entries));

    const updated: Account = { ...accounts[index], archived: true };
    accounts[index] = updated;
    saveAccounts(accounts);
    return updated;
  }

  private findIndexOrThrow(accounts: Account[], id: string): number {
    const index = accounts.findIndex((account) => account.id === id);
    if (index === -1) {
      throw new Error(`Account not found: ${id}`);
    }
    return index;
  }
}
