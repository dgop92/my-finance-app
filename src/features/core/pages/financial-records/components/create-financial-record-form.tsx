import { useCreateFinancialRecord } from "../hooks/create-financial-record-hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/lib/paths";
import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";

export const CreateFinancialRecordForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleFormSubmit,
    savingsSourcesValues,
    isLoadingSavingsSources,
    formState: { errors },
    currentTotal,
    fields,
  } = useCreateFinancialRecord({
    onSuccess: () => navigate(PATHS.FINANCIAL_RECORDS),
  });

  const handleCancel = () => {
    navigate(PATHS.FINANCIAL_RECORDS);
  };

  if (isLoadingSavingsSources) {
    return (
      <div className="flex justify-center my-8">
        <p>Loading savings sources...</p>
      </div>
    );
  }

  // Create a map of savings source IDs to names for easy lookup
  const savingsSourceMap = new Map(
    savingsSourcesValues.map((source) => [
      source.savingsSource.id,
      source.savingsSource,
    ])
  );

  return (
    <div className="space-y-6">
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
                      {source.name}
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
                        errors?.values?.[index]?.amount ? "border-red-500" : ""
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
              <Button type="submit">Create Record</Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p>
              No savings sources found. Please create a savings source first.
            </p>
            <Button
              onClick={() => navigate(PATHS.SAVINGS_SOURCES)}
              className="mt-4"
            >
              Go to Savings Sources
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
