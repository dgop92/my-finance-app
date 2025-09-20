import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseRepository } from "../../../repositories/repository.factory";
import {
  CreateExpenseInput,
  UpdateExpenseInput,
} from "../../../entities/expense";

/**
 * Hook for managing expenses for a specific financial record
 */
export const useExpenses = (financialRecordId: string) => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(
    null
  );
  const [selectedExpenseName, setSelectedExpenseName] = useState("");

  // Get expenses for the financial record
  const {
    data: expenses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expenses", financialRecordId],
    queryFn: () =>
      expenseRepository.getExpensesForFinancialRecord(financialRecordId),
    enabled: !!financialRecordId,
  });

  // Add a new expense
  const addExpenseMutation = useMutation({
    mutationFn: (data: Omit<CreateExpenseInput, "financialRecordId">) => {
      return expenseRepository.addExpenseToFinancialRecord({
        ...data,
        financialRecordId,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch the expenses query
      queryClient.invalidateQueries({
        queryKey: ["expenses", financialRecordId],
      });
      queryClient.invalidateQueries({
        queryKey: ["financialRecordPair", financialRecordId],
      });
      setIsAddDialogOpen(false);
    },
  });

  // Update an expense
  const updateExpenseMutation = useMutation({
    mutationFn: (data: { id: string; input: UpdateExpenseInput }) => {
      return expenseRepository.updateExpense(
        financialRecordId,
        data.id,
        data.input
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", financialRecordId],
      });
      queryClient.invalidateQueries({
        queryKey: ["financialRecordPair", financialRecordId],
      });
      setIsEditDialogOpen(false);
      setSelectedExpenseId(null);
    },
  });

  // Delete an expense
  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId: string) => {
      return expenseRepository.deleteExpense(financialRecordId, expenseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", financialRecordId],
      });
      queryClient.invalidateQueries({
        queryKey: ["financialRecordPair", financialRecordId],
      });
      setIsDeleteDialogOpen(false);
      setSelectedExpenseId(null);
      setSelectedExpenseName("");
    },
  });

  // Function to open the add dialog
  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  // Function to open the edit dialog for a specific expense
  const openEditDialog = (expenseId: string) => {
    const expense = expenses.find((e) => e.id === expenseId);
    if (expense) {
      setSelectedExpenseId(expenseId);
      setIsEditDialogOpen(true);
    }
  };

  // Function to open the delete dialog for a specific expense
  const openDeleteDialog = (expenseId: string) => {
    const expense = expenses.find((e) => e.id === expenseId);
    if (expense) {
      setSelectedExpenseId(expenseId);
      setSelectedExpenseName(expense.name);
      setIsDeleteDialogOpen(true);
    }
  };

  // Get the selected expense for editing
  const selectedExpense = selectedExpenseId
    ? expenses.find((e) => e.id === selectedExpenseId)
    : null;

  return {
    expenses,
    isLoading,
    error,
    // Add dialog
    isAddDialogOpen,
    setIsAddDialogOpen,
    openAddDialog,
    addExpense: addExpenseMutation.mutate,
    isAddingExpense: addExpenseMutation.isPending,
    // Edit dialog
    isEditDialogOpen,
    setIsEditDialogOpen,
    openEditDialog,
    selectedExpense,
    updateExpense: (input: UpdateExpenseInput) => {
      if (selectedExpenseId) {
        updateExpenseMutation.mutate({ id: selectedExpenseId, input });
      }
    },
    isUpdatingExpense: updateExpenseMutation.isPending,
    // Delete dialog
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    openDeleteDialog,
    selectedExpenseName,
    deleteExpense: () => {
      if (selectedExpenseId) {
        deleteExpenseMutation.mutate(selectedExpenseId);
      }
    },
    isDeletingExpense: deleteExpenseMutation.isPending,
  };
};
