import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateAccountInput,
  CreateAccountInputSchema,
} from "@/features/core/entities/account";
import { accountRepository } from "@/features/accounts/repositories/repository.factory";

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateAccountInput) => accountRepository.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAccountInput>({
    resolver: zodResolver(CreateAccountInputSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (input: CreateAccountInput) => {
    mutation.mutate(input, { onSuccess: () => reset() });
  };

  return {
    register,
    handleFormSubmit: handleSubmit(onSubmit),
    formState: { errors },
  };
};
