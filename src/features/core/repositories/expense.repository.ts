import { v4 as uuidv4 } from "uuid";
import { ErrorCode, RepositoryError } from "@/lib/errors";
import {
  CreateExpenseInput,
  Expense,
  UpdateExpenseInput,
} from "../entities/expense";
import {
  loadFinancialRecords,
  saveFinancialRecords,
} from "./local-storage.memory";

export class ExpenseRepository {
  /**
   * Add a new expense to a financial record
   */
  async addExpenseToFinancialRecord(
    input: CreateExpenseInput
  ): Promise<Expense> {
    const financialRecords = loadFinancialRecords();
    const recordIndex = financialRecords.findIndex(
      (record) => record.id === input.financialRecordId
    );

    if (recordIndex === -1) {
      throw new RepositoryError(
        "Financial record not found",
        ErrorCode.NOT_FOUND,
        { id: input.financialRecordId }
      );
    }

    // Create a new expense object
    const newExpense: Expense = {
      id: uuidv4(),
      name: input.name,
      amount: input.amount,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Initialize expenses array if it doesn't exist
    if (!financialRecords[recordIndex].expenses) {
      financialRecords[recordIndex].expenses = [];
    }

    // Add expense to the financial record
    financialRecords[recordIndex].expenses!.push(newExpense);

    // Update the record's updatedAt timestamp
    financialRecords[recordIndex].updatedAt = new Date();

    // Save updated records
    saveFinancialRecords(financialRecords);

    return Promise.resolve(newExpense);
  }

  /**
   * Update an expense in a financial record
   */
  async updateExpense(
    financialRecordId: string,
    expenseId: string,
    input: UpdateExpenseInput
  ): Promise<Expense> {
    const financialRecords = loadFinancialRecords();
    const recordIndex = financialRecords.findIndex(
      (record) => record.id === financialRecordId
    );

    if (recordIndex === -1) {
      throw new RepositoryError(
        "Financial record not found",
        ErrorCode.NOT_FOUND,
        { id: financialRecordId }
      );
    }

    const record = financialRecords[recordIndex];

    if (!record.expenses) {
      throw new RepositoryError(
        "No expenses found for this record",
        ErrorCode.NOT_FOUND,
        { id: financialRecordId }
      );
    }

    const expenseIndex = record.expenses.findIndex(
      (expense) => expense.id === expenseId
    );

    if (expenseIndex === -1) {
      throw new RepositoryError("Expense not found", ErrorCode.NOT_FOUND, {
        id: expenseId,
        financialRecordId,
      });
    }

    // Update expense properties
    const updatedExpense = {
      ...record.expenses[expenseIndex],
      ...(input.name !== undefined && { name: input.name }),
      ...(input.amount !== undefined && { amount: input.amount }),
      updatedAt: new Date(),
    };

    // Replace the expense in the array
    record.expenses[expenseIndex] = updatedExpense;

    // Update the record's updatedAt timestamp
    record.updatedAt = new Date();

    // Save updated records
    saveFinancialRecords(financialRecords);

    return Promise.resolve(updatedExpense);
  }

  /**
   * Delete an expense from a financial record
   */
  async deleteExpense(
    financialRecordId: string,
    expenseId: string
  ): Promise<void> {
    const financialRecords = loadFinancialRecords();
    const recordIndex = financialRecords.findIndex(
      (record) => record.id === financialRecordId
    );

    if (recordIndex === -1) {
      throw new RepositoryError(
        "Financial record not found",
        ErrorCode.NOT_FOUND,
        { id: financialRecordId }
      );
    }

    const record = financialRecords[recordIndex];

    if (!record.expenses) {
      throw new RepositoryError(
        "No expenses found for this record",
        ErrorCode.NOT_FOUND,
        { id: financialRecordId }
      );
    }

    const expenseIndex = record.expenses.findIndex(
      (expense) => expense.id === expenseId
    );

    if (expenseIndex === -1) {
      throw new RepositoryError("Expense not found", ErrorCode.NOT_FOUND, {
        id: expenseId,
        financialRecordId,
      });
    }

    // Remove expense from array
    record.expenses.splice(expenseIndex, 1);

    // Update the record's updatedAt timestamp
    record.updatedAt = new Date();

    // Save updated records
    saveFinancialRecords(financialRecords);

    return Promise.resolve();
  }

  /**
   * Get all expenses for a financial record
   */
  async getExpensesForFinancialRecord(
    financialRecordId: string
  ): Promise<Expense[]> {
    const financialRecords = loadFinancialRecords();
    const record = financialRecords.find(
      (record) => record.id === financialRecordId
    );

    if (!record) {
      throw new RepositoryError(
        "Financial record not found",
        ErrorCode.NOT_FOUND,
        { id: financialRecordId }
      );
    }

    return Promise.resolve(record.expenses || []);
  }
}
