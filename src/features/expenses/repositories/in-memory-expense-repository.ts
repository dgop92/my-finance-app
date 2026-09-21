import { v4 as uuidv4 } from "uuid";
import {
  CreateExpenseInput,
  Expense,
  UpdateExpenseInput,
} from "@/features/core/entities/expense";
import { sortExpenses } from "../lib/sort-expenses";
import { ExpenseRepository } from "./definitions/expense-repository";

export class InMemoryExpenseRepository implements ExpenseRepository {
  private expenses: Expense[] = [];

  getMany(): Promise<Expense[]> {
    return Promise.resolve(sortExpenses(this.expenses));
  }

  create(input: CreateExpenseInput): Promise<Expense> {
    const expense: Expense = {
      id: uuidv4(),
      createdAt: new Date(),
      date: input.date,
      amount: input.amount,
      notes: input.notes,
      type: input.type,
    };
    this.expenses.push(expense);
    return Promise.resolve(expense);
  }

  async update(id: string, input: UpdateExpenseInput): Promise<Expense> {
    const expense = this.findOrThrow(id);
    const updated: Expense = {
      ...expense,
      date: input.date ?? expense.date,
      amount: input.amount ?? expense.amount,
      notes: input.notes ?? expense.notes,
      type: input.type ?? expense.type,
    };
    this.expenses = this.expenses.map((existing) =>
      existing.id === id ? updated : existing
    );
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.findOrThrow(id);
    this.expenses = this.expenses.filter((expense) => expense.id !== id);
  }

  replaceAll(expenses: Expense[]): Promise<void> {
    this.expenses = [...expenses];
    return Promise.resolve();
  }

  private findOrThrow(id: string): Expense {
    const expense = this.expenses.find((expense) => expense.id === id);
    if (!expense) {
      throw new Error(`Expense not found: ${id}`);
    }
    return expense;
  }
}
