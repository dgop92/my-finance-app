import { useUpdateFinancialRecord } from "../hooks/update-financial-record-hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "@/lib/paths";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const UpdateFinancialRecordForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Safely extract recordId from params
  const recordId = id || "";

  const {
    register,
    handleFormSubmit,
    recordForEdit,
    isLoadingRecord,
    error,
    formState: { errors, isDirty },
    currentTotal,
    fields,
    isUpdating,
  } = useUpdateFinancialRecord({
    recordId,
    onSuccess: () => {
      navigate(`/financial-records/${recordId}`);
    },
  });

  // Redirect if no ID is found
  if (!id) {
    navigate(PATHS.FINANCIAL_RECORDS);
    return null;
  }

  const handleCancel = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      navigate(`/financial-records/${id}`);
    }
  };

  if (isLoadingRecord) {
    return (
      <div className="flex justify-center my-8">
        <p>Loading financial record data...</p>
      </div>
    );
  }

  if (error || !recordForEdit) {
    return (
      <div className="flex flex-col items-center my-8">
        <p className="text-red-500 mb-4">
          Error loading financial record data.
        </p>
        <Button variant="outline" asChild>
          <Link to={PATHS.FINANCIAL_RECORDS}>Back to Financial Records</Link>
        </Button>
      </div>
    );
  }

  // Create a map of savings source IDs to names for easy lookup
  const savingsSourceMap = new Map(
    recordForEdit.values.map((source) => [source.savingsSource.id, source])
  );

  return (
    <>
      <div className="space-y-6">
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
          <Link to={`/financial-records/${id}`} className="hover:underline">
            Record Details
          </Link>
          <span className="mx-2">/</span>
          <span>Edit</span>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Created on {formatDate(recordForEdit.createdAt)}
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated on {formatDate(recordForEdit.updatedAt)}
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {fields.length > 0 ? (
            <>
              <div className="grid gap-4">
                {fields.map((field, index) => {
                  const source = savingsSourceMap.get(field.savingsSourceId);
                  if (!source) return null; // Safety check

                  return (
                    <div key={field.savingsSourceId} className="grid gap-2">
                      <Label htmlFor={`values.${index}.amount`}>
                        {source.savingsSource.name}
                      </Label>
                      <Input
                        id={`values.${index}.amount`}
                        type="number"
                        min="0"
                        step="0.01"
                        {...register(`values.${index}.amount`, {
                          valueAsNumber: true,
                        })}
                        className={
                          errors?.values?.[index]?.amount
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors?.values?.[index]?.amount && (
                        <p className="text-sm text-red-500">
                          {errors.values[index]?.amount?.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <Card className="bg-muted">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total:</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(currentTotal)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" type="button" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Record"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p>No savings sources found for this record.</p>
              <Button
                onClick={() => navigate(PATHS.FINANCIAL_RECORDS)}
                className="mt-4"
              >
                Back to Financial Records
              </Button>
            </div>
          )}
        </form>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave this
              page? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => navigate(`/financial-records/${id}`)}
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
