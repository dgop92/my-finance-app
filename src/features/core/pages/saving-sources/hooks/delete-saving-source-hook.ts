import { SavingsSource } from "@/features/core/entities/saving-source";
import { savingsSourceRepository } from "@/features/core/repositories/repository.factory";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface DeleteSavingSourceHook {
  onClose: () => void;
  savingsSource: SavingsSource;
}

export const useDeleteSavingSource = ({
  onClose,
  savingsSource,
}: DeleteSavingSourceHook) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => savingsSourceRepository.delete(savingsSource.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["savingsSources"] });
      onClose();
    },
  });

  const handleConfirm = () => {
    mutation.mutate();
  };

  return {
    handleConfirm,
    isPending: mutation.isPending,
  };
};
