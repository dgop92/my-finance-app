import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Account, UpdateAccountInputSchema } from "@/features/core/entities/account";
import { accountRepository } from "@/features/accounts/repositories/repository.factory";

// The rename form always submits a name, unlike UpdateAccountInputSchema's
// optional `name` (which also covers archiving), so pick and require it.
const RenameAccountInputSchema = UpdateAccountInputSchema.pick({ name: true }).required();
type RenameAccountInput = z.infer<typeof RenameAccountInputSchema>;

export interface UseRenameAccountArgs {
  account: Account;
  onDone: () => void;
}

export const useRenameAccount = ({ account, onDone }: UseRenameAccountArgs) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: RenameAccountInput) =>
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
  } = useForm<RenameAccountInput>({
    resolver: zodResolver(RenameAccountInputSchema),
    defaultValues: { name: account.name },
  });

  return {
    register,
    handleFormSubmit: handleSubmit((input) => mutation.mutate(input)),
    formState: { errors },
  };
};
