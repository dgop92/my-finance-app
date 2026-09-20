import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPENSE_TYPE_OPTIONS } from "@/features/core/services/expense-type-label";
import { ExpenseFormValues } from "@/features/expenses/lib/expense-form-schema";

interface ExpenseFormFieldsProps {
  idPrefix: string;
  register: UseFormRegister<ExpenseFormValues>;
  control: Control<ExpenseFormValues>;
  errors: FieldErrors<ExpenseFormValues>;
}

export const ExpenseFormFields = ({
  idPrefix,
  register,
  control,
  errors,
}: ExpenseFormFieldsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-4">
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-type`}>Category</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id={`${idPrefix}-type`} aria-invalid={!!errors.type}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-amount`}>Amount (COP)</Label>
        <Input
          id={`${idPrefix}-amount`}
          type="number"
          min={1}
          step={1}
          {...register("amount")}
          aria-invalid={!!errors.amount}
          aria-describedby={errors.amount ? `${idPrefix}-amount-error` : undefined}
        />
        {errors.amount && (
          <p id={`${idPrefix}-amount-error`} className="text-sm text-red-500">
            {errors.amount.message}
          </p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-date`}>Date</Label>
        <Input
          id={`${idPrefix}-date`}
          type="date"
          {...register("date")}
          aria-invalid={!!errors.date}
        />
        {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
      </div>

      <div className="grid gap-1.5 sm:col-span-4">
        <Label htmlFor={`${idPrefix}-notes`}>Note (optional)</Label>
        <Textarea
          id={`${idPrefix}-notes`}
          maxLength={280}
          {...register("notes")}
          aria-invalid={!!errors.notes}
        />
        {errors.notes && <p className="text-sm text-red-500">{errors.notes.message}</p>}
      </div>
    </div>
  );
};
