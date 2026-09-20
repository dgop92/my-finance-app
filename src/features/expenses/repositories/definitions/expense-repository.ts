import {
  CreateExpenseInput,
  Expense,
  UpdateExpenseInput,
} from "@/features/core/entities/expense";

export interface ExpenseRepository {
  getMany(): Promise<Expense[]>;
  create(input: CreateExpenseInput): Promise<Expense>;
  update(id: string, input: UpdateExpenseInput): Promise<Expense>;
  delete(id: string): Promise<void>;
  replaceAll(expenses: Expense[]): Promise<void>;
}
