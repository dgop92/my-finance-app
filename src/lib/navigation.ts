import {
  CircleDollarSign,
  BarChart3,
  History,
  PiggyBank,
  FileJson,
} from "lucide-react";
import { PATHS } from "./paths";

export type NavigationItem = {
  name: string;
  path: string;
  icon: React.ElementType;
};

export const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    path: PATHS.DASHBOARD,
    icon: CircleDollarSign,
  },
  {
    name: "Savings Sources",
    path: PATHS.SAVINGS_SOURCES,
    icon: PiggyBank,
  },
  {
    name: "Financial Records",
    path: PATHS.FINANCIAL_RECORDS,
    icon: History,
  },
  {
    name: "Analysis & Reports",
    path: PATHS.ANALYSIS,
    icon: BarChart3,
  },
  {
    name: "Import / Export",
    path: PATHS.IMPORT_EXPORT,
    icon: FileJson,
  },
];
