import { expenseTypeToLabel } from "@/features/core/services/expense-type-label";
import { formatCurrency } from "@/lib/formatters";
import { useExpenses } from "../hooks/use-expenses";

export const ExpenseList = () => {
  const { data: expenses, isPending, error } = useExpenses();

  if (isPending) {
    return <p className="text-muted-foreground">Loading expenses…</p>;
  }

  if (error) {
    return <p className="text-red-500">Failed to load expenses: {error.message}</p>;
  }

  if (expenses.length === 0) {
    return <p className="text-muted-foreground">No expenses yet. Add one above.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {expenses.map((expense) => (
        <li key={expense.id} className="flex flex-col gap-2 border rounded-md p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="font-medium">{expenseTypeToLabel(expense.type)}</span>
              <span className="text-sm text-muted-foreground">
                {expense.date.toLocaleDateString()}
              </span>
            </div>
            <span className="tabular-nums">{formatCurrency(expense.amount)}</span>
          </div>
          {expense.notes && (
            <p className="text-sm text-muted-foreground">{expense.notes}</p>
          )}
        </li>
      ))}
    </ul>
  );
};
