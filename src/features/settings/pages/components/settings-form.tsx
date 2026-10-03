import { Settings } from "@/features/core/entities/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateSettings } from "../hooks/use-update-settings";

interface SettingsFormProps {
  settings: Settings;
}

export const SettingsForm = ({ settings }: SettingsFormProps) => {
  const {
    register,
    handleFormSubmit,
    formState: { errors },
    error,
  } = useUpdateSettings({ settings });

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="grid gap-1.5">
        <Label htmlFor="net-salary">Net salary (COP)</Label>
        <Input
          id="net-salary"
          type="number"
          min={1}
          step={1}
          {...register("netSalary")}
          aria-invalid={!!errors.netSalary}
          aria-describedby={errors.netSalary ? "net-salary-error" : undefined}
        />
        {errors.netSalary && (
          <p id="net-salary-error" className="text-sm text-red-500">
            {errors.netSalary.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        Save
      </Button>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </form>
  );
};
