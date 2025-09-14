import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateSavingSourceInputSchema,
  CreateSavingSourceInput,
} from "@/features/core/entities/saving-source";
import { savingsSourceRepository } from "@/features/core/repositories/repository.factory";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateSavingSourceHook {
  onClose: () => void;
}

export const useCreateSavingSource = ({ onClose }: CreateSavingSourceHook) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateSavingSourceInput) =>
      savingsSourceRepository.create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["savingsSources"] });
      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateSavingSourceInput>({
    resolver: zodResolver(CreateSavingSourceInputSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (input: CreateSavingSourceInput) => {
    mutation.mutate(input);
    reset();
  };

  const handleFormSubmit = handleSubmit(onSubmit);

  return {
    register,
    handleFormSubmit,
    formState: { errors },
  };
};
