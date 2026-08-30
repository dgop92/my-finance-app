import { Account } from "@/features/core/entities/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveBatchEntries } from "../hooks/use-save-batch-entries";

interface BatchModeFormProps {
  accounts: Account[];
  balanceByAccountId: Map<string, number>;
}

export const BatchModeForm = ({ accounts, balanceByAccountId }: BatchModeFormProps) => {
  const {
    register,
    handleFormSubmit,
    formState: { errors },
    isPending,
    isSuccess,
    error,
  } = useSaveBatchEntries(accounts, balanceByAccountId);

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {accounts.map((account) => (
          <div key={account.id} className="grid gap-1.5 sm:grid-cols-[1fr_auto] sm:items-center">
            <Label htmlFor={`batch-${account.id}`}>{account.name}</Label>
            <Input
              id={`batch-${account.id}`}
              type="number"
              step={1}
              {...register(account.id)}
              aria-invalid={!!errors[account.id]}
              aria-describedby={errors[account.id] ? `batch-${account.id}-error` : undefined}
            />
            {errors[account.id] && (
              <p id={`batch-${account.id}-error`} className="text-sm text-red-500 sm:col-span-2">
                {errors[account.id]?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      <div>
        <Button type="submit" disabled={isPending}>
          Save balances
        </Button>
      </div>

      {isSuccess && <p className="text-sm text-muted-foreground">Balances saved.</p>}
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </form>
  );
};
