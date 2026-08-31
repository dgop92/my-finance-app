import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { Account } from "@/features/core/entities/account";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LedgerEntryFormValues } from "@/features/ledger-entries/lib/ledger-entry-form-schema";

interface LedgerEntryFormFieldsProps {
  idPrefix: string;
  accounts: Account[];
  register: UseFormRegister<LedgerEntryFormValues>;
  control: Control<LedgerEntryFormValues>;
  errors: FieldErrors<LedgerEntryFormValues>;
}

export const LedgerEntryFormFields = ({
  idPrefix,
  accounts,
  register,
  control,
  errors,
}: LedgerEntryFormFieldsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-4">
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-account`}>Account</Label>
        <Controller
          name="accountId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id={`${idPrefix}-account`} aria-invalid={!!errors.accountId}>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.accountId && (
          <p className="text-sm text-red-500">{errors.accountId.message}</p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-type`}>Type</Label>
        <Controller
          name="label"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id={`${idPrefix}-type`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Deposit">Deposit</SelectItem>
                <SelectItem value="Withdrawal">Withdrawal</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
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
    </div>
  );
};
