import { Button } from "@/components/ui/button";
import { useAccounts } from "@/features/accounts/pages/hooks/use-accounts";
import { useCreateLedgerEntry } from "../hooks/use-create-ledger-entry";
import { LedgerEntryFormFields } from "./ledger-entry-form-fields";

export const CreateEntryForm = () => {
  const { data: accounts, isPending, error: accountsError } = useAccounts(false);
  const {
    register,
    control,
    handleFormSubmit,
    formState: { errors },
    error: createError,
  } = useCreateLedgerEntry();

  if (isPending) {
    return <p className="text-muted-foreground">Loading accounts…</p>;
  }

  if (accountsError) {
    return <p className="text-red-500">Failed to load accounts: {accountsError.message}</p>;
  }

  if (accounts.length === 0) {
    return (
      <p className="text-muted-foreground">
        No active accounts yet. Create an account before logging entries.
      </p>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      <LedgerEntryFormFields
        idPrefix="create-entry"
        accounts={accounts}
        register={register}
        control={control}
        errors={errors}
      />
      <div>
        <Button type="submit">Add entry</Button>
      </div>
      {createError && <p className="text-sm text-red-500">{createError.message}</p>}
    </form>
  );
};
