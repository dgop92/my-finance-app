import { useState } from "react";
import { Account } from "@/features/core/entities/account";
import { LedgerEntry } from "@/features/core/entities/ledger-entry";
import { ledgerEntryTypeToLabel } from "@/features/core/services/ledger-entry-label";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUpdateLedgerEntry } from "../hooks/use-update-ledger-entry";
import { useDeleteLedgerEntry } from "../hooks/use-delete-ledger-entry";
import { LedgerEntryFormFields } from "./ledger-entry-form-fields";

interface EntryRowProps {
  entry: LedgerEntry;
  accountName: string;
  accounts: Account[];
}

export const EntryRow = ({ entry, accountName, accounts }: EntryRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    control,
    handleFormSubmit,
    formState: { errors },
    error: updateError,
  } = useUpdateLedgerEntry({ entry, onDone: () => setIsEditing(false) });
  const { deleteEntry, isPending: isDeleting, error: deleteError } = useDeleteLedgerEntry();

  if (isEditing) {
    return (
      <li className="flex flex-col gap-2 border rounded-md p-4">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
          <LedgerEntryFormFields
            idPrefix={`entry-${entry.id}`}
            accounts={accounts}
            register={register}
            control={control}
            errors={errors}
          />
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm">
              Save
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
        {updateError && <p className="text-sm text-red-500">{updateError.message}</p>}
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-2 border rounded-md p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="font-medium">{accountName}</span>
          <span className="text-sm text-muted-foreground">
            {ledgerEntryTypeToLabel(entry.type)} · {entry.date.toLocaleDateString()}
          </span>
        </div>
        <span className="tabular-nums">{formatCurrency(entry.amount)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={isDeleting}
              aria-label={`Delete entry for ${accountName}`}
            >
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes the {ledgerEntryTypeToLabel(entry.type).toLowerCase()} of{" "}
                {formatCurrency(entry.amount)} for {accountName}. This can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteEntry(entry.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {deleteError && <p className="text-sm text-red-500">{deleteError.message}</p>}
    </li>
  );
};
