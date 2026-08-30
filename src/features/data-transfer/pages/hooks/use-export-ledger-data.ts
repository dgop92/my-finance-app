import { useMutation } from "@tanstack/react-query";
import { accountRepository } from "@/features/accounts/repositories/repository.factory";
import { ledgerEntryRepository } from "@/features/ledger-entries/repositories/repository.factory";
import { downloadJsonFile } from "@/lib/download-json-file";
import { exportLedgerData } from "@/features/data-transfer/services/ledger-data-transfer";

export const useExportLedgerData = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      const payload = await exportLedgerData({ accountRepository, ledgerEntryRepository });
      const filename = `finance-app-data-${new Date().toISOString().split("T")[0]}.json`;
      downloadJsonFile(filename, payload);
    },
  });

  return {
    exportData: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
