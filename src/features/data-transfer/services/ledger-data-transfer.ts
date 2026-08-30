import {
  LedgerDataPayload,
  parseLedgerDataPayload,
} from "@/features/core/services/ledger-data-payload";
import { AccountRepository } from "@/features/accounts/repositories/definitions/account-repository";
import { LedgerEntryRepository } from "@/features/ledger-entries/repositories/definitions/ledger-entry-repository";

export interface LedgerDataRepositories {
  accountRepository: AccountRepository;
  ledgerEntryRepository: LedgerEntryRepository;
}

export async function exportLedgerData(
  repositories: LedgerDataRepositories
): Promise<LedgerDataPayload> {
  const [accounts, ledgerEntries] = await Promise.all([
    repositories.accountRepository.getMany(true),
    repositories.ledgerEntryRepository.getMany(),
  ]);
  return { accounts, ledgerEntries };
}

// Validates before writing anything, so a malformed payload never touches
// either repository's stored data. If the ledger-entries write fails after
// accounts were already replaced, the accounts write is rolled back so the
// two repositories don't end up out of sync.
export async function importLedgerData(
  raw: unknown,
  repositories: LedgerDataRepositories
): Promise<void> {
  const { accounts, ledgerEntries } = parseLedgerDataPayload(raw);
  const previousAccounts = await repositories.accountRepository.getMany(true);

  await repositories.accountRepository.replaceAll(accounts);
  try {
    await repositories.ledgerEntryRepository.replaceAll(ledgerEntries);
  } catch (error) {
    await repositories.accountRepository.replaceAll(previousAccounts);
    throw error;
  }
}
