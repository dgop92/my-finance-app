import { useState } from "react";
import { Expense } from "@/features/core/entities/expense";
import { expenseTypeToLabel } from "@/features/core/services/expense-type-label";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUpdateExpense } from "../hooks/use-update-expense";
import { useDeleteExpense } from "../hooks/use-delete-expense";
import { ExpenseFormFields } from "./expense-form-fields";

interface ExpenseRowProps {
  expense: Expense;
}

export const ExpenseRow = ({ expense }: ExpenseRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    control,
    handleFormSubmit,
    formState: { errors },
    error: updateError,
    resetToExpense,
  } = useUpdateExpense({ expense, onDone: () => setIsEditing(false) });
  const { deleteExpense, isPending: isDeleting, error: deleteError } = useDeleteExpense();

  if (isEditing) {
    return (
      <li className="flex flex-col gap-2 border rounded-md p-4">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
          <ExpenseFormFields
            idPrefix={`expense-${expense.id}`}
            register={register}
            control={control}
            errors={errors}
          />
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm">
              Save
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
        {updateError && <p className="text-sm text-red-500">{updateError.message}</p>}
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-2 border rounded-md p-4">
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
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            resetToExpense();
            setIsEditing(true);
          }}
        >
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={isDeleting}
              aria-label={`Delete expense: ${expenseTypeToLabel(expense.type)} for ${formatCurrency(expense.amount)}`}
            >
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes the {expenseTypeToLabel(expense.type).toLowerCase()} expense of{" "}
                {formatCurrency(expense.amount)}. This can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteExpense(expense.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {deleteError && <p className="text-sm text-red-500">{deleteError.message}</p>}
    </li>
  );
};
