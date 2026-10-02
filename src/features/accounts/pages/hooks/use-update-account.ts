import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Account, UpdateAccountInputSchema } from "@/features/core/entities/account";
import { accountRepository } from "@/features/accounts/repositories/repository.factory";

// The edit form always submits both fields, unlike UpdateAccountInputSchema's
// optional fields (which also cover archiving), so pick and require them.
const UpdateAccountFormSchema = UpdateAccountInputSchema.pick({
  name: true,
  isSavingAccount: true,
}).required();
type UpdateAccountFormValues = z.infer<typeof UpdateAccountFormSchema>;

export interface UseUpdateAccountArgs {
  account: Account;
  onDone: () => void;
}

export const useUpdateAccount = ({ account, onDone }: UseUpdateAccountArgs) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: UpdateAccountFormValues) =>
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
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateAccountFormValues>({
    resolver: zodResolver(UpdateAccountFormSchema),
    defaultValues: { name: account.name, isSavingAccount: account.isSavingAccount },
  });

  return {
    register,
    control,
    handleFormSubmit: handleSubmit((input) => mutation.mutate(input)),
    formState: { errors },
  };
};
