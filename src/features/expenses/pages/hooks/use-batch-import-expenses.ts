import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseRepository } from "@/features/expenses/repositories/repository.factory";
import {
  ExpenseBatchImportValidationError,
  parseExpenseBatchImport,
} from "@/features/core/services/expense-batch-import";

function readInputAsText(source: File | string): Promise<string> {
  if (typeof source === "string") {
    return Promise.resolve(source);
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(source);
  });
}

export const useBatchImportExpenses = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (source: File | string) => {
      const text = await readInputAsText(source);
      let raw: unknown;
      try {
        raw = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON. Check the file or pasted text for syntax errors.");
      }
      const result = parseExpenseBatchImport(raw);
      if (!result.success) {
        throw new ExpenseBatchImportValidationError(result.errors);
      }
      return expenseRepository.createMany(result.expenses);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  return {
    importExpenses: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    importedCount: mutation.data?.length ?? 0,
    error: mutation.error,
    reset: mutation.reset,
  };
};
