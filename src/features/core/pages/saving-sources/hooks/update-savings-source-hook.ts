import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateSavingSourceInputSchema,
  UpdateSavingSourceInput,
  SavingsSource,
} from "@/features/core/entities/saving-source";
import { savingsSourceRepository } from "@/features/core/repositories/repository.factory";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateSavingSourceHook {
  onClose: () => void;
  savingsSource: SavingsSource;
}

export const useUpdateSavingSource = ({
  onClose,
  savingsSource,
}: UpdateSavingSourceHook) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: UpdateSavingSourceInput) =>
      savingsSourceRepository.update(savingsSource.id, data),
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
  } = useForm<UpdateSavingSourceInput>({
    resolver: zodResolver(UpdateSavingSourceInputSchema),
    defaultValues: { name: savingsSource?.name || "" },
  });

  const onSubmit = (input: UpdateSavingSourceInput) => {
    mutation.mutate(input);
  };

  const handleFormSubmit = handleSubmit(onSubmit);

  const handleDialogClose = () => {
    reset();
    onClose();
  };

  return {
    register,
    handleFormSubmit,
    handleDialogClose,
    formState: { errors },
  };
};
