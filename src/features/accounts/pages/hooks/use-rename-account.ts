import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Account,
  CreateAccountInput,
  CreateAccountInputSchema,
} from "@/features/core/entities/account";
import { accountRepository } from "@/features/accounts/repositories/repository.factory";

export interface UseRenameAccountArgs {
  account: Account;
  onDone: () => void;
}

export const useRenameAccount = ({ account, onDone }: UseRenameAccountArgs) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateAccountInput) =>
      accountRepository.update(account.id, { name: input.name }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onDone();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountInput>({
    resolver: zodResolver(CreateAccountInputSchema),
    defaultValues: { name: account.name },
  });

  return {
    register,
    handleFormSubmit: handleSubmit((input) => mutation.mutate(input)),
    formState: { errors },
  };
};
