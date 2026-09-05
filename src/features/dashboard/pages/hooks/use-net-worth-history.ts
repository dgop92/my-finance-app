import { useQuery } from "@tanstack/react-query";
import { computeNetWorthHistory } from "@/features/core/services/net-worth-history";
import { ledgerEntryRepository } from "@/features/ledger-entries/repositories/repository.factory";

const MONTHS_SHOWN = 5;

// Keyed the same as the ledger-entries feature's own query so a create/update/
// delete there invalidates this too, keeping the history in sync.
export const useNetWorthHistory = () => {
  return useQuery({
    queryKey: ["ledgerEntries"],
    queryFn: () => ledgerEntryRepository.getMany(),
    select: (entries) => computeNetWorthHistory(entries, MONTHS_SHOWN, new Date()),
  });
};
