import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LedgerEntry } from "@/features/core/entities/ledger-entry";
import {
  ledgerEntryLabelToType,
  ledgerEntryTypeToLabel,
} from "@/features/core/services/ledger-entry-label";
import { ledgerEntryRepository } from "@/features/ledger-entries/repositories/repository.factory";
import {
  LedgerEntryFormSchema,
  LedgerEntryFormValues,
} from "@/features/ledger-entries/lib/ledger-entry-form-schema";
import { formatFormDate, parseFormDate } from "@/features/ledger-entries/lib/ledger-entry-form-date";

export interface UseUpdateLedgerEntryArgs {
  entry: LedgerEntry;
  onDone: () => void;
}

export const useUpdateLedgerEntry = ({ entry, onDone }: UseUpdateLedgerEntryArgs) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: LedgerEntryFormValues) =>
      ledgerEntryRepository.update(entry.id, {
        accountId: input.accountId,
        type: ledgerEntryLabelToType(input.label),
        amount: Number(input.amount),
        date: parseFormDate(input.date),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ledgerEntries"] });
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onDone();
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LedgerEntryFormValues>({
    resolver: zodResolver(LedgerEntryFormSchema),
    defaultValues: {
      accountId: entry.accountId,
      label: ledgerEntryTypeToLabel(entry.type),
      amount: String(entry.amount),
      date: formatFormDate(entry.date),
    },
  });

  return {
    register,
    control,
    handleFormSubmit: handleSubmit((input) => mutation.mutate(input)),
    formState: { errors },
    error: mutation.error,
  };
};
