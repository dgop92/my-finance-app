import { useAccounts } from "@/features/accounts/pages/hooks/use-accounts";
import { useLedgerEntries } from "../hooks/use-ledger-entries";
import { EntryRow } from "./entry-row";

export const EntryList = () => {
  const { data: entries, isPending: entriesPending, error: entriesError } = useLedgerEntries();
  const { data: accounts, isPending: accountsPending, error: accountsError } = useAccounts(true);

  const error = entriesError ?? accountsError;

  if (entriesPending || accountsPending || !entries || !accounts) {
    return <p className="text-muted-foreground">Loading entries…</p>;
  }

  if (error) {
    return <p className="text-red-500">Failed to load entries: {error.message}</p>;
  }

  if (entries.length === 0) {
    return <p className="text-muted-foreground">No entries yet. Add one above.</p>;
  }

  const accountNameById = new Map(accounts.map((account) => [account.id, account.name]));

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => (
        <EntryRow
          key={entry.id}
          entry={entry}
          accountName={accountNameById.get(entry.accountId) ?? "Unknown account"}
          accounts={accounts}
        />
      ))}
    </ul>
  );
};
