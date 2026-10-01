import { useState } from "react";
import { Account } from "@/features/core/entities/account";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRenameAccount } from "../hooks/use-rename-account";
import { useArchiveAccount } from "../hooks/use-archive-account";

interface AccountRowProps {
  account: Account;
  balance: number;
}

export const AccountRow = ({ account, balance }: AccountRowProps) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const { register, handleFormSubmit, formState } = useRenameAccount({
    account,
    onDone: () => setIsRenaming(false),
  });
  const { archive, isPending, error } = useArchiveAccount();

  if (isRenaming) {
    return (
      <li className="flex flex-col gap-2 border rounded-md p-4">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
          <Input {...register("name")} aria-label={`Rename ${account.name}`} autoFocus />
          <div className="flex items-center gap-2">
            <input
              id={`savings-${account.id}`}
              type="checkbox"
              className="size-4"
              aria-label={`Savings account ${account.name}`}
              {...register("isSavingAccount")}
            />
            <Label htmlFor={`savings-${account.id}`}>Savings account</Label>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm">
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsRenaming(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
        {formState.errors.name && (
          <p className="text-sm text-red-500">{formState.errors.name.message}</p>
        )}
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-2 border rounded-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{account.name}</span>
          {account.archived && <Badge variant="secondary">Archived</Badge>}
        </div>
        <span className="tabular-nums">{formatCurrency(balance)}</span>
      </div>
      {!account.archived && (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsRenaming(true)}>
            Rename
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => archive(account.id)}
            aria-label={`Archive ${account.name}`}
          >
            Archive
          </Button>
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </li>
  );
};
