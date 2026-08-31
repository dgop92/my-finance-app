import { LedgerEntry } from "../entities/ledger-entry";
import { computeAccountBalance } from "./ledger-balance";

// Entries may span multiple accounts (e.g. the full ledger-entries list),
// unlike computeAccountBalance which expects entries pre-filtered to one.
export function computeAccountBalancesByAccountId(
  entries: LedgerEntry[]
): Map<string, number> {
  const entriesByAccountId = new Map<string, LedgerEntry[]>();
  for (const entry of entries) {
    const accountEntries = entriesByAccountId.get(entry.accountId) ?? [];
    accountEntries.push(entry);
    entriesByAccountId.set(entry.accountId, accountEntries);
  }

  const balanceByAccountId = new Map<string, number>();
  for (const [accountId, accountEntries] of entriesByAccountId) {
    balanceByAccountId.set(accountId, computeAccountBalance(accountEntries));
  }
  return balanceByAccountId;
}
