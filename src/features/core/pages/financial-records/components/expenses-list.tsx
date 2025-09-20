import React from "react";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Expense } from "../../../entities/expense";
import { formatCurrency } from "@/lib/formatters";

interface ExpensesListProps {
  expenses: Expense[];
  onEdit: (expenseId: string) => void;
  onDelete: (expenseId: string) => void;
}

export const ExpensesList: React.FC<ExpensesListProps> = ({
  expenses,
  onEdit,
  onDelete,
}) => {
  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No expenses added yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expense Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.name}</TableCell>
                <TableCell>{formatCurrency(expense.amount)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(expense.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(expense.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-bold">Total Expenses</TableCell>
              <TableCell className="font-bold">
                {formatCurrency(totalExpenses)}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {expenses.map((expense) => (
          <Card key={expense.id} className="w-full">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{expense.name}</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(expense.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(expense.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Total for Mobile */}
        <Card className="w-full border-t-2 border-primary">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Expenses</span>
              <span className="text-lg font-bold">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
