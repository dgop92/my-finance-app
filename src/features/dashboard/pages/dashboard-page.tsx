import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useDashboard } from "./hooks/use-dashboard";
import { useNetWorthHistory } from "./hooks/use-net-worth-history";
import { DashboardAccountRow } from "./components/dashboard-account-row";
import { NetWorthHistoryCards } from "./components/net-worth-history-cards";

export const DashboardPage = () => {
  const { accounts, balanceByAccountId, grandTotal, isPending, error } = useDashboard();
  const { data: netWorthHistory } = useNetWorthHistory();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Net worth</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending && <p className="text-muted-foreground">Loading…</p>}
          {error && <p className="text-red-500">Failed to load dashboard: {error.message}</p>}
          {grandTotal !== undefined && (
            <span
              className={cn("text-3xl font-bold tabular-nums", grandTotal < 0 && "text-red-600")}
            >
              {formatCurrency(grandTotal)}
            </span>
          )}
        </CardContent>
      </Card>

      {netWorthHistory && <NetWorthHistoryCards months={netWorthHistory} />}

      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending && <p className="text-muted-foreground">Loading accounts…</p>}
          {error && <p className="text-red-500">Failed to load dashboard: {error.message}</p>}

          {accounts && accounts.length === 0 && (
            <p className="text-muted-foreground">No accounts yet.</p>
          )}

          {accounts && accounts.length > 0 && (
            <ul className="flex flex-col gap-2">
              {accounts.map((account) => (
                <DashboardAccountRow
                  key={account.id}
                  account={account}
                  balance={balanceByAccountId?.get(account.id) ?? 0}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
