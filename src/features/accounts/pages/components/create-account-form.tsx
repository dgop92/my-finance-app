import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCreateAccount } from "../hooks/use-create-account";

export const CreateAccountForm = () => {
  const {
    register,
    control,
    handleFormSubmit,
    formState: { errors },
  } = useCreateAccount();

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="grid gap-1.5">
        <Label htmlFor="account-name">Account name</Label>
        <Input
          id="account-name"
          {...register("name")}
          placeholder="e.g. Checking"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "account-name-error" : undefined}
        />
        {errors.name && (
          <p id="account-name-error" className="text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 sm:h-9">
        <Controller
          name="isSavingAccount"
          control={control}
          render={({ field }) => (
            <Switch
              id="account-is-saving-account"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="account-is-saving-account">Savings account</Label>
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        Create account
      </Button>
    </form>
  );
};
