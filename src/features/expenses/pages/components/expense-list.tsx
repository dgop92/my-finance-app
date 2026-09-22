import { useExpenses } from "../hooks/use-expenses";
import { ExpenseRow } from "./expense-row";

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
        <ExpenseRow key={expense.id} expense={expense} />
      ))}
    </ul>
  );
};
