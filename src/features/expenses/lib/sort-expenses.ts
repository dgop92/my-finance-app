import { Expense } from "@/features/core/entities/expense";

export function sortExpenses(expenses: Expense[]): Expense[] {
  return [...expenses].sort((a, b) => {
    const dateDiff = b.date.getTime() - a.date.getTime();
    if (dateDiff !== 0) {
      return dateDiff;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}
