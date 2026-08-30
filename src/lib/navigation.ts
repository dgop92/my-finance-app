import { ArrowLeftRight, LayoutDashboard, Wallet } from "lucide-react";
import { PATHS } from "./paths";

export type NavigationItem = {
  name: string;
  path: string;
  icon: React.ElementType;
};

export const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    path: PATHS.HOME,
    icon: LayoutDashboard,
  },
  {
    name: "Accounts",
    path: PATHS.ACCOUNTS,
    icon: Wallet,
  },
  {
    name: "Entries",
    path: PATHS.LEDGER_ENTRIES,
    icon: ArrowLeftRight,
  },
];
