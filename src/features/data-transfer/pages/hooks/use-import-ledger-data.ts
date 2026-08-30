import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountRepository } from "@/features/accounts/repositories/repository.factory";
import { ledgerEntryRepository } from "@/features/ledger-entries/repositories/repository.factory";
import { importLedgerData } from "@/features/data-transfer/services/ledger-data-transfer";

function readFileAsJson(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result as string));
      } catch {
        reject(new Error("Invalid file format: not valid JSON."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(file);
  });
}

export const useImportLedgerData = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const raw = await readFileAsJson(file);
      await importLedgerData(raw, { accountRepository, ledgerEntryRepository });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
      await queryClient.invalidateQueries({ queryKey: ["ledgerEntries"] });
    },
  });

  return {
    importData: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
};
