import { v4 as uuidv4 } from "uuid";
import {
  CreateExpenseInput,
  Expense,
  UpdateExpenseInput,
} from "@/features/core/entities/expense";
import {
  loadExpenses,
  saveExpenses,
} from "@/features/core/lib/expense-storage";
import { sortExpenses } from "../lib/sort-expenses";
import { ExpenseRepository } from "./definitions/expense-repository";

export class ExpenseLocalStorageRepository implements ExpenseRepository {
  async getMany(): Promise<Expense[]> {
    return sortExpenses(loadExpenses());
  }

  async create(input: CreateExpenseInput): Promise<Expense> {
    const expenses = loadExpenses();
    const expense: Expense = {
      id: uuidv4(),
      createdAt: new Date(),
      date: input.date,
      amount: input.amount,
      notes: input.notes,
      type: input.type,
    };
    saveExpenses([...expenses, expense]);
    return expense;
  }

  async update(id: string, input: UpdateExpenseInput): Promise<Expense> {
    const expenses = loadExpenses();
    const index = this.findIndexOrThrow(expenses, id);
    const updated: Expense = {
      ...expenses[index],
      date: input.date ?? expenses[index].date,
      amount: input.amount ?? expenses[index].amount,
      notes: input.notes ?? expenses[index].notes,
      type: input.type ?? expenses[index].type,
    };
    expenses[index] = updated;
    saveExpenses(expenses);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const expenses = loadExpenses();
    this.findIndexOrThrow(expenses, id);
    saveExpenses(expenses.filter((expense) => expense.id !== id));
  }

  async replaceAll(expenses: Expense[]): Promise<void> {
    saveExpenses(expenses);
  }

  private findIndexOrThrow(expenses: Expense[], id: string): number {
    const index = expenses.findIndex((expense) => expense.id === id);
    if (index === -1) {
      throw new Error(`Expense not found: ${id}`);
    }
    return index;
  }
}
