import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { formatCurrency, formatDate, formatChange } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFinancialRecordDetails } from "../hooks/financial-record-details-hook";
import { useExpenses } from "../hooks/expenses-hook";
import { calculateTotal } from "../../../services/financial-functions";
import { AddExpenseDialog } from "./add-expense-dialog";
import { EditExpenseDialog } from "./edit-expense-dialog";
import { DeleteExpenseDialog } from "./delete-expense-dialog";
import { ExpensesList } from "./expenses-list";

const FinancialRecordDetails = () => {
  // Get record ID from URL params
  const { id } = useParams<{ id: string }>();

  // Use the custom hook to fetch the record details
  const { record, previousRecord, difference, isLoading, error } =
    useFinancialRecordDetails(id || "");

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center my-8">
          <p>Loading financial record details...</p>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center my-8">
          <p className="text-red-500 mb-4">
            Error loading financial record details.
          </p>
          <Button variant="outline" asChild>
            <Link to="/financial-records">Back to Financial Records</Link>
          </Button>
        </div>
      </div>
    );
  }

  const total = calculateTotal(record);
  const { formatted: diffFormatted, colorClass } = difference
    ? formatChange(difference.amount)
    : { formatted: "$0", colorClass: "text-gray-600" };

  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb */}
      <div className="flex items-center mb-6 text-sm text-muted-foreground">
        <Link
          to="/financial-records"
          className="hover:underline flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Financial Records
        </Link>
        <span className="mx-2">/</span>
        <span>Record Details</span>
      </div>

      {/* Record Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Financial Record</h1>
          <p className="text-muted-foreground">
            Created on {formatDate(record.createdAt)}
          </p>
          {record.updatedAt &&
            record.updatedAt.getTime() !== record.createdAt.getTime() && (
              <p className="text-sm text-muted-foreground">
                Last updated on {formatDate(record.updatedAt)}
              </p>
            )}
        </div>
        <Button className="mt-4 md:mt-0" asChild>
          <Link to={`/financial-records/${record.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Record
          </Link>
        </Button>
      </div>

      {/* Financial Summary Card */}
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Balance
              </p>
              <p className="text-3xl font-bold">{formatCurrency(total)}</p>
            </div>
            {previousRecord && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Change from Previous Record
                </p>
                <p className={`text-xl font-medium ${colorClass}`}>
                  {diffFormatted}
                  {difference && (
                    <span className="text-sm ml-1">
                      ({difference.percentage.toFixed(2)}%)
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Savings Sources Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Savings Sources Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop view - Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source Name</TableHead>
                  <TableHead>Value</TableHead>
                  {previousRecord && (
                    <TableHead>Difference from Previous</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {record.values.map((value) => {
                  const prevValue = previousRecord?.values.find(
                    (prev) => prev.savingsSource.id === value.savingsSource.id
                  );

                  let diffAmount = 0;
                  let diffFormatted = "";
                  let diffColorClass = "text-gray-600";

                  if (prevValue) {
                    diffAmount = value.amount - prevValue.amount;
                    const result = formatChange(diffAmount);
                    diffFormatted = result.formatted;
                    diffColorClass = result.colorClass;
                  }

                  return (
                    <TableRow key={value.savingsSource.id}>
                      <TableCell className="font-medium">
                        {/* This would ideally display the source name from a context/store */}
                        {value.savingsSource.name}
                      </TableCell>
                      <TableCell>{formatCurrency(value.amount)}</TableCell>
                      {previousRecord && (
                        <TableCell className={diffColorClass}>
                          {prevValue ? (
                            <>
                              {diffFormatted}
                              {diffAmount !== 0 && prevValue.amount !== 0 && (
                                <span className="text-sm ml-1">
                                  (
                                  {(
                                    (diffAmount / Math.abs(prevValue.amount)) *
                                    100
                                  ).toFixed(2)}
                                  %)
                                </span>
                              )}
                            </>
                          ) : (
                            "New source"
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(total)}
                  </TableCell>
                  {previousRecord && (
                    <TableCell className={`font-bold ${colorClass}`}>
                      {diffFormatted}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Mobile view - Cards */}
          <div className="md:hidden space-y-4 p-4">
            {record.values.map((value) => {
              const prevValue = previousRecord?.values.find(
                (prev) => prev.savingsSource.id === value.savingsSource.id
              );

              let diffAmount = 0;
              let diffFormatted = "";
              let diffColorClass = "text-gray-600";

              if (prevValue) {
                diffAmount = value.amount - prevValue.amount;
                const result = formatChange(diffAmount);
                diffFormatted = result.formatted;
                diffColorClass = result.colorClass;
              }

              return (
                <Card key={value.savingsSource.id} className="w-full">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {value.savingsSource.name}
                        </span>
                        <span className="text-lg font-bold">
                          {formatCurrency(value.amount)}
                        </span>
                      </div>

                      {previousRecord && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Change:
                          </span>
                          <span
                            className={`text-sm font-medium ${diffColorClass}`}
                          >
                            {prevValue ? diffFormatted : "New source"}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Total for Mobile */}
            <Card className="w-full border-t-2 border-primary">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(total)}
                  </span>
                </div>
                {previousRecord && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">
                      Total Change:
                    </span>
                    <span className={`text-sm font-medium ${colorClass}`}>
                      {diffFormatted}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Section */}
      <Card className="mt-8">
        <ExpensesSection recordId={record.id} />
      </Card>
    </div>
  );
};

// Separate component for expenses to keep the main component cleaner
const ExpensesSection: React.FC<{ recordId: string }> = ({ recordId }) => {
  const {
    expenses,
    isLoading: isLoadingExpenses,
    error: expensesError,
    // Add dialog
    isAddDialogOpen,
    setIsAddDialogOpen,
    openAddDialog,
    addExpense,
    isAddingExpense,
    // Edit dialog
    isEditDialogOpen,
    setIsEditDialogOpen,
    openEditDialog,
    selectedExpense,
    updateExpense,
    isUpdatingExpense,
    // Delete dialog
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    openDeleteDialog,
    selectedExpenseName,
    deleteExpense,
    isDeletingExpense,
  } = useExpenses(recordId);

  if (isLoadingExpenses) {
    return <div className="p-4">Loading expenses...</div>;
  }

  if (expensesError) {
    return <div className="p-4 text-red-500">Error loading expenses</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <CardHeader className="pb-2 flex flex-row items-center justify-between w-full">
          <CardTitle className="text-lg">Relevant Expenses</CardTitle>
          <Button onClick={openAddDialog} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </CardHeader>
      </div>

      <CardContent className="p-0">
        <ExpensesList
          expenses={expenses}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />
      </CardContent>

      {/* Dialogs for adding, editing, and deleting expenses */}
      <AddExpenseDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={addExpense}
        isLoading={isAddingExpense}
      />

      {selectedExpense && (
        <EditExpenseDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={updateExpense}
          isLoading={isUpdatingExpense}
          initialData={{
            name: selectedExpense.name,
            amount: selectedExpense.amount,
          }}
        />
      )}

      <DeleteExpenseDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={deleteExpense}
        isLoading={isDeletingExpense}
        expenseName={selectedExpenseName}
      />
    </div>
  );
};

export { FinancialRecordDetails };
