import { useQuery } from "@tanstack/react-query";
import { ledgerEntryRepository } from "@/features/ledger-entries/repositories/repository.factory";

export const useLedgerEntries = () => {
  return useQuery({
    queryKey: ["ledgerEntries"],
    queryFn: () => ledgerEntryRepository.getMany(),
  });
};
