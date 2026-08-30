import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ledgerEntryLabelToType } from "@/features/core/services/ledger-entry-label";
import { ledgerEntryRepository } from "@/features/ledger-entries/repositories/repository.factory";
import {
  LedgerEntryFormSchema,
  LedgerEntryFormValues,
} from "@/features/ledger-entries/lib/ledger-entry-form-schema";
import { parseFormDate, todayFormDate } from "@/features/ledger-entries/lib/ledger-entry-form-date";

const defaultValues: LedgerEntryFormValues = {
  accountId: "",
  label: "Deposit",
  amount: "",
  date: todayFormDate(),
};

export const useCreateLedgerEntry = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: LedgerEntryFormValues) =>
      ledgerEntryRepository.create({
        accountId: input.accountId,
        type: ledgerEntryLabelToType(input.label),
        amount: Number(input.amount),
        date: parseFormDate(input.date),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ledgerEntries"] });
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LedgerEntryFormValues>({
    resolver: zodResolver(LedgerEntryFormSchema),
    defaultValues,
  });

  const onSubmit = (input: LedgerEntryFormValues) => {
    mutation.mutate(input, {
      onSuccess: () => reset({ ...defaultValues, accountId: input.accountId }),
    });
  };

  return {
    register,
    control,
    handleFormSubmit: handleSubmit(onSubmit),
    formState: { errors },
    error: mutation.error,
  };
};
