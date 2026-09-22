import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseRepository } from "@/features/expenses/repositories/repository.factory";

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => expenseRepository.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  return {
    deleteExpense: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
