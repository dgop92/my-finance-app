import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Account, UpdateAccountInputSchema } from "@/features/core/entities/account";
import { accountRepository } from "@/features/accounts/repositories/repository.factory";

// The edit form always submits both fields, unlike UpdateAccountInputSchema's
// optional fields (which also cover archiving), so pick and require them.
const RenameAccountInputSchema = UpdateAccountInputSchema.pick({
  name: true,
  isSavingAccount: true,
}).required();
type RenameAccountInput = z.infer<typeof RenameAccountInputSchema>;

export interface UseRenameAccountArgs {
  account: Account;
  onDone: () => void;
}

export const useRenameAccount = ({ account, onDone }: UseRenameAccountArgs) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: RenameAccountInput) =>
      accountRepository.update(account.id, {
        name: input.name,
        isSavingAccount: input.isSavingAccount,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onDone();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RenameAccountInput>({
    resolver: zodResolver(RenameAccountInputSchema),
    defaultValues: { name: account.name, isSavingAccount: account.isSavingAccount },
  });

  return {
    register,
    handleFormSubmit: handleSubmit((input) => mutation.mutate(input)),
    formState: { errors },
  };
};
