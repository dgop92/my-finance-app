import { LedgerEntryType } from "../entities/ledger-entry";

export type LedgerEntryLabel = "Deposit" | "Withdrawal";

// Accounts are asset accounts: a debit increases the balance (a deposit),
// a credit decreases it (a withdrawal) — the reverse of a liability account.
export function ledgerEntryTypeToLabel(type: LedgerEntryType): LedgerEntryLabel {
  return type === "debit" ? "Deposit" : "Withdrawal";
}

export function ledgerEntryLabelToType(label: LedgerEntryLabel): LedgerEntryType {
  return label === "Deposit" ? "debit" : "credit";
}
