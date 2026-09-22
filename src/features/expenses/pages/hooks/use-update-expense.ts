import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Expense } from "@/features/core/entities/expense";
import { expenseRepository } from "@/features/expenses/repositories/repository.factory";
import {
  ExpenseFormSchema,
  ExpenseFormValues,
} from "@/features/expenses/lib/expense-form-schema";
import { formatFormDate, parseFormDate } from "@/lib/form-date";

export interface UseUpdateExpenseArgs {
  expense: Expense;
  onDone: () => void;
}

export const useUpdateExpense = ({ expense, onDone }: UseUpdateExpenseArgs) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: ExpenseFormValues) =>
      expenseRepository.update(expense.id, {
        type: input.type,
        amount: Number(input.amount),
        date: parseFormDate(input.date),
        notes: input.notes,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
      onDone();
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      type: expense.type,
      amount: String(expense.amount),
      date: formatFormDate(expense.date),
      notes: expense.notes,
    },
  });

  return {
    register,
    control,
    handleFormSubmit: handleSubmit((input) => mutation.mutate(input)),
    formState: { errors },
    error: mutation.error,
    resetToExpense: () =>
      reset({
        type: expense.type,
        amount: String(expense.amount),
        date: formatFormDate(expense.date),
        notes: expense.notes,
      }),
  };
};
