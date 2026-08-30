import { useQuery } from "@tanstack/react-query";
import { LedgerEntry } from "@/features/core/entities/ledger-entry";
import { computeAccountBalance } from "@/features/core/services/ledger-balance";
import { ledgerEntryRepository } from "@/features/ledger-entries/repositories/repository.factory";

// Keyed the same as the ledger-entries feature's own query so a create/update/
// delete there invalidates this too, keeping displayed balances in sync.
export const useAccountBalances = () => {
  return useQuery({
    queryKey: ["ledgerEntries"],
    queryFn: () => ledgerEntryRepository.getMany(),
    select: (entries) => {
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
    },
  });
};
