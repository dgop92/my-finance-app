import {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
} from "@/features/core/entities/account";

export interface AccountRepository {
  getMany(includeArchived?: boolean): Promise<Account[]>;
  create(input: CreateAccountInput): Promise<Account>;
  update(id: string, input: Pick<UpdateAccountInput, "name">): Promise<Account>;
  archive(id: string): Promise<Account>;
  replaceAll(accounts: Account[]): Promise<void>;
}
