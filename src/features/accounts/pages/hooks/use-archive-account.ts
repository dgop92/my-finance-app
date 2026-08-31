import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountRepository } from "@/features/accounts/repositories/repository.factory";

export const useArchiveAccount = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (accountId: string) => accountRepository.archive(accountId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  return {
    archive: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
