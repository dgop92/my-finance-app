// Ledger amounts are stored as whole-peso integers (see LedgerEntry.amount).
export function formatCurrency(pesos: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(pesos);
}
