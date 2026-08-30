import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAccounts } from "../hooks/use-accounts";
import { useAccountBalances } from "../hooks/use-account-balances";
import { AccountRow } from "./account-row";

export const AccountList = () => {
  const [includeArchived, setIncludeArchived] = useState(false);
  const { data: accounts, isPending, error } = useAccounts(includeArchived);
  const { data: balanceByAccountId } = useAccountBalances();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Switch
          id="include-archived"
          checked={includeArchived}
          onCheckedChange={setIncludeArchived}
        />
        <Label htmlFor="include-archived">Show archived accounts</Label>
      </div>

      {isPending && <p className="text-muted-foreground">Loading accounts…</p>}
      {error && <p className="text-red-500">Failed to load accounts: {error.message}</p>}

      {accounts && accounts.length === 0 && (
        <p className="text-muted-foreground">No accounts yet. Create one above.</p>
      )}

      {accounts && accounts.length > 0 && (
        <ul className="flex flex-col gap-2">
          {accounts.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              balance={balanceByAccountId?.get(account.id) ?? 0}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
