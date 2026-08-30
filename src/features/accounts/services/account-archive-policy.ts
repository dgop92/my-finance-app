// Archiving hides an account from the default view but must never make a
// non-zero balance unreachable, so it's only allowed once the balance nets to 0.
export function assertAccountCanBeArchived(balance: number): void {
  if (balance !== 0) {
    throw new Error(
      `Cannot archive account: balance must be zero to archive, but current balance is ${balance}.`
    );
  }
}
