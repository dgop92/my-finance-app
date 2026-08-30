import { useQuery } from "@tanstack/react-query";
import { computeAccountBalancesByAccountId } from "@/features/core/services/ledger-account-balances";
import { ledgerEntryRepository } from "@/features/ledger-entries/repositories/repository.factory";

// Keyed the same as the ledger-entries feature's own query so a create/update/
// delete there invalidates this too, keeping displayed balances in sync.
export const useAccountBalances = () => {
  return useQuery({
    queryKey: ["ledgerEntries"],
    queryFn: () => ledgerEntryRepository.getMany(),
    select: computeAccountBalancesByAccountId,
  });
};
