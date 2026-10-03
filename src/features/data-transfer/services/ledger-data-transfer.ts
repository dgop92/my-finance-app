import {
  LedgerDataPayload,
  parseLedgerDataPayload,
} from "@/features/core/services/ledger-data-payload";
import { AccountRepository } from "@/features/accounts/repositories/definitions/account-repository";
import { LedgerEntryRepository } from "@/features/ledger-entries/repositories/definitions/ledger-entry-repository";
import { ExpenseRepository } from "@/features/expenses/repositories/definitions/expense-repository";
import { SettingsRepository } from "@/features/settings/repositories/definitions/settings-repository";

export interface LedgerDataRepositories {
  accountRepository: AccountRepository;
  ledgerEntryRepository: LedgerEntryRepository;
  expenseRepository: ExpenseRepository;
  settingsRepository: SettingsRepository;
}

export async function exportLedgerData(
  repositories: LedgerDataRepositories
): Promise<LedgerDataPayload> {
  const [accounts, ledgerEntries, expenses, settings] = await Promise.all([
    repositories.accountRepository.getMany(true),
    repositories.ledgerEntryRepository.getMany(),
    repositories.expenseRepository.getMany(),
    repositories.settingsRepository.get(),
  ]);
  return { accounts, ledgerEntries, expenses, settings };
}

// Validates before writing anything, so a malformed payload never touches
// any repository's stored data. If a later write fails after earlier ones
// already succeeded, those earlier writes are rolled back so the
// repositories don't end up out of sync.
export async function importLedgerData(
  raw: unknown,
  repositories: LedgerDataRepositories
): Promise<void> {
  const { accounts, ledgerEntries, expenses, settings } = parseLedgerDataPayload(raw);
  const previousAccounts = await repositories.accountRepository.getMany(true);
  const previousLedgerEntries = await repositories.ledgerEntryRepository.getMany();
  const previousExpenses = await repositories.expenseRepository.getMany();

  await repositories.accountRepository.replaceAll(accounts);
  try {
    await repositories.ledgerEntryRepository.replaceAll(ledgerEntries);
  } catch (error) {
    await repositories.accountRepository.replaceAll(previousAccounts);
    throw error;
  }

  try {
    await repositories.expenseRepository.replaceAll(expenses);
  } catch (error) {
    await repositories.accountRepository.replaceAll(previousAccounts);
    await repositories.ledgerEntryRepository.replaceAll(previousLedgerEntries);
    throw error;
  }

  try {
    await repositories.settingsRepository.update(settings);
  } catch (error) {
    await repositories.accountRepository.replaceAll(previousAccounts);
    await repositories.ledgerEntryRepository.replaceAll(previousLedgerEntries);
    await repositories.expenseRepository.replaceAll(previousExpenses);
    throw error;
  }
}
