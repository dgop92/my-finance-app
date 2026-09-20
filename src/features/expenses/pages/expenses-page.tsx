import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateExpenseForm } from "./components/create-expense-form";
import { ExpenseList } from "./components/expense-list";

export const ExpensesPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Expenses</h1>

      <Card>
        <CardHeader>
          <CardTitle>New expense</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateExpenseForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseList />
        </CardContent>
      </Card>
    </div>
  );
};
