import { Expense } from "../entities/expense";

const EXPENSES_STORAGE_KEY = "financeApp:expenses";

export function loadExpenses(): Expense[] {
  const raw = localStorage.getItem(EXPENSES_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  const parsed = JSON.parse(raw) as Expense[];
  return parsed.map((expense) => ({
    ...expense,
    createdAt: new Date(expense.createdAt),
    date: new Date(expense.date),
  }));
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
}
