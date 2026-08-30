import { useQuery } from "@tanstack/react-query";
import { accountRepository } from "@/features/accounts/repositories/repository.factory";

export const useAccounts = (includeArchived: boolean) => {
  return useQuery({
    queryKey: ["accounts", { includeArchived }],
    queryFn: () => accountRepository.getMany(includeArchived),
  });
};
