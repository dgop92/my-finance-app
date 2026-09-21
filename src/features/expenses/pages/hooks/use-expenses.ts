import { useQuery } from "@tanstack/react-query";
import { expenseRepository } from "@/features/expenses/repositories/repository.factory";

export const useExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: () => expenseRepository.getMany(),
  });
};
