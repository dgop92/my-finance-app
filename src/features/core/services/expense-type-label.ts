import { ExpenseType } from "../entities/expense";

const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = {
  groceries: "Groceries",
  fast_food: "Fast food",
  transport: "Transport",
  utilities: "Utilities",
  entertainment: "Entertainment",
  health: "Health",
  shopping: "Shopping",
  subscriptions: "Subscriptions",
  travel: "Travel",
  other: "Other",
};

export function expenseTypeToLabel(type: ExpenseType): string {
  return EXPENSE_TYPE_LABELS[type];
}

export const EXPENSE_TYPE_OPTIONS: { value: ExpenseType; label: string }[] =
  Object.entries(EXPENSE_TYPE_LABELS).map(([value, label]) => ({
    value: value as ExpenseType,
    label,
  }));
