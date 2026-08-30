import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccounts } from "@/features/accounts/pages/hooks/use-accounts";
import { useAccountBalances } from "@/features/accounts/pages/hooks/use-account-balances";
import { BatchModeForm } from "./components/batch-mode-form";

export const BatchModePage = () => {
  const { data: accounts, isPending: accountsPending, error: accountsError } =
    useAccounts(false);
  const { data: balanceByAccountId, isPending: balancesPending } = useAccountBalances();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Batch mode</h1>

      <Card>
        <CardHeader>
          <CardTitle>Update account balances</CardTitle>
        </CardHeader>
        <CardContent>
          {(accountsPending || balancesPending) && (
            <p className="text-muted-foreground">Loading accounts…</p>
          )}

          {accountsError && (
            <p className="text-red-500">Failed to load accounts: {accountsError.message}</p>
          )}

          {accounts && accounts.length === 0 && (
            <p className="text-muted-foreground">
              No active accounts yet. Create an account before using batch mode.
            </p>
          )}

          {accounts && accounts.length > 0 && balanceByAccountId && (
            <BatchModeForm
              key={accounts.map((account) => account.id).join(",")}
              accounts={accounts}
              balanceByAccountId={balanceByAccountId}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
