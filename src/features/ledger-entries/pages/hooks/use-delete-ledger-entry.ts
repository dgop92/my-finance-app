import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ledgerEntryRepository } from "@/features/ledger-entries/repositories/repository.factory";

export const useDeleteLedgerEntry = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => ledgerEntryRepository.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ledgerEntries"] });
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  return {
    deleteEntry: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
