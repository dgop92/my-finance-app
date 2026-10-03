import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/lib/formatters";
import { MonthlyReportConfigFormValues } from "@/features/monthly-report/lib/monthly-report-config-form";

interface MonthlyReportConfigFormProps {
  register: UseFormRegister<MonthlyReportConfigFormValues>;
  control: Control<MonthlyReportConfigFormValues>;
  errors: FieldErrors<MonthlyReportConfigFormValues>;
  settingsNetSalary: number;
  isSaving: boolean;
  isSaved: boolean;
  error: Error | null;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export const MonthlyReportConfigForm = ({
  register,
  control,
  errors,
  settingsNetSalary,
  isSaving,
  isSaved,
  error,
  onSubmit,
}: MonthlyReportConfigFormProps) => {
  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="grid content-start gap-1.5">
        <Label htmlFor="net-salary-override">Net salary override (COP)</Label>
        <Input
          id="net-salary-override"
          type="number"
          min={1}
          step={1}
          placeholder={`Settings: ${formatCurrency(settingsNetSalary)}`}
          {...register("netSalaryOverride")}
          aria-invalid={!!errors.netSalaryOverride}
          aria-describedby={errors.netSalaryOverride ? "net-salary-override-error" : undefined}
        />
        {errors.netSalaryOverride && (
          <p id="net-salary-override-error" className="text-sm text-red-500">
            {errors.netSalaryOverride.message}
          </p>
        )}
      </div>
      <div className="grid content-start gap-1.5">
        <Label htmlFor="manual-other-income">Other income (COP)</Label>
        <Input
          id="manual-other-income"
          type="number"
          min={0}
          step={1}
          {...register("manualOtherIncome")}
          aria-invalid={!!errors.manualOtherIncome}
          aria-describedby={errors.manualOtherIncome ? "manual-other-income-error" : undefined}
        />
        {errors.manualOtherIncome && (
          <p id="manual-other-income-error" className="text-sm text-red-500">
            {errors.manualOtherIncome.message}
          </p>
        )}
      </div>
      <div className="grid content-start gap-1.5">
        <Label htmlFor="saving-deposit-threshold">Savings deposit threshold (COP)</Label>
        <Input
          id="saving-deposit-threshold"
          type="number"
          min={1}
          step={1}
          {...register("savingAccountDepositThreshold")}
          aria-invalid={!!errors.savingAccountDepositThreshold}
          aria-describedby={errors.savingAccountDepositThreshold ? "saving-deposit-threshold-error" : undefined}
        />
        {errors.savingAccountDepositThreshold && (
          <p id="saving-deposit-threshold-error" className="text-sm text-red-500">
            {errors.savingAccountDepositThreshold.message}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 sm:h-9 sm:self-end">
        <Controller
          name="automaticInterestEnabled"
          control={control}
          render={({ field }) => (
            <Switch id="automatic-interest-enabled" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="automatic-interest-enabled">Automatic interest</Label>
      </div>
      <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-4">
        <Button type="submit" disabled={isSaving}>
          Save
        </Button>
        {isSaved && (
          <p role="status" className="text-sm text-muted-foreground">
            Saved
          </p>
        )}
        {error && <p className="text-sm text-red-500">{error.message}</p>}
      </div>
    </form>
  );
};
