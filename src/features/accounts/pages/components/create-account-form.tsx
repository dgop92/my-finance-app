import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAccount } from "../hooks/use-create-account";

export const CreateAccountForm = () => {
  const {
    register,
    handleFormSubmit,
    formState: { errors },
  } = useCreateAccount();

  return (
    <form onSubmit={handleFormSubmit} className="flex items-end gap-2">
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
      <Button type="submit">Create account</Button>
    </form>
  );
};
