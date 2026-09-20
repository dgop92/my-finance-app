import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseRepository } from "@/features/expenses/repositories/repository.factory";
import {
  ExpenseFormSchema,
  ExpenseFormValues,
} from "@/features/expenses/lib/expense-form-schema";
import { parseFormDate, todayFormDate } from "@/lib/form-date";

const defaultValues: ExpenseFormValues = {
  type: "groceries",
  amount: "",
  date: todayFormDate(),
  notes: "",
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: ExpenseFormValues) =>
      expenseRepository.create({
        type: input.type,
        amount: Number(input.amount),
        date: parseFormDate(input.date),
        notes: input.notes,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
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
    defaultValues,
  });

  const onSubmit = (input: ExpenseFormValues) => {
    mutation.mutate(input, {
      onSuccess: () => reset(defaultValues),
    });
  };

  return {
    register,
    control,
    handleFormSubmit: handleSubmit(onSubmit),
    formState: { errors },
    error: mutation.error,
  };
};
