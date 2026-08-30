import { Account } from "@/features/core/entities/account";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface DashboardAccountRowProps {
  account: Account;
  balance: number;
}

export const DashboardAccountRow = ({ account, balance }: DashboardAccountRowProps) => {
  return (
    <li className="flex items-center justify-between border rounded-md p-4">
      <span className="font-medium">{account.name}</span>
      <span className={cn("tabular-nums", balance < 0 && "text-red-600")}>
        {formatCurrency(balance)}
      </span>
    </li>
  );
};
