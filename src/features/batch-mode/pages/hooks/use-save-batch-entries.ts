import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Account } from "@/features/core/entities/account";
import { computeBatchDiffEntries } from "@/features/core/services/ledger-batch-diff";
import { ledgerEntryRepository } from "@/features/ledger-entries/repositories/repository.factory";
import {
  BatchModeFormSchema,
  BatchModeFormValues,
} from "../../lib/batch-mode-form-schema";

export const useSaveBatchEntries = (
  accounts: Account[],
  balanceByAccountId: Map<string, number>
) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (values: BatchModeFormValues) => {
      const accountsWithBalances = accounts.map((account) => ({
        accountId: account.id,
        balance: balanceByAccountId.get(account.id) ?? 0,
      }));
      const newValuesByAccountId = Object.fromEntries(
        Object.entries(values).map(([accountId, value]) => [accountId, Number(value)])
      );

      const entries = computeBatchDiffEntries(
        accountsWithBalances,
        newValuesByAccountId,
        new Date()
      );

      for (const entry of entries) {
        await ledgerEntryRepository.create(entry);
      }

      return entries;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ledgerEntries"] });
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const defaultValues: BatchModeFormValues = Object.fromEntries(
    accounts.map((account) => [account.id, String(balanceByAccountId.get(account.id) ?? 0)])
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BatchModeFormValues>({
    resolver: zodResolver(BatchModeFormSchema),
    defaultValues,
  });

  const onSubmit = (values: BatchModeFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => reset(values),
    });
  };

  return {
    register,
    handleFormSubmit: handleSubmit(onSubmit),
    formState: { errors },
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};
