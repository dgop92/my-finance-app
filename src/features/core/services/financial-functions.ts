import { FinancialRecord } from "../entities/financial-record";
import { SavingsSourceValue } from "../entities/savings-source-value";

export function calculateTotal(record: FinancialRecord): number {
  return record.values.reduce((total, value) => total + value.amount, 0);
}

export function calculateDifference(
  current: FinancialRecord,
  previous: FinancialRecord
): number {
  return calculateTotal(current) - calculateTotal(previous);
}

export function calculateDifferencePercentage(
  current: FinancialRecord,
  previous: FinancialRecord
): number {
  const currentTotal = calculateTotal(current);
  const previousTotal = calculateTotal(previous);

  if (previousTotal === 0) {
    return currentTotal > 0 ? 100 : 0;
  }

  return ((currentTotal - previousTotal) / Math.abs(previousTotal)) * 100;
}

export function calculateSourceValueDifference(
  current: SavingsSourceValue,
  previous: SavingsSourceValue
): number {
  return current.amount - previous.amount;
}

export function calculateSourceValueDifferencePercentage(
  current: SavingsSourceValue,
  previous: SavingsSourceValue
): number {
  if (previous.amount === 0) {
    return current.amount > 0 ? 100 : 0;
  }

  return ((current.amount - previous.amount) / Math.abs(previous.amount)) * 100;
}

export type FinancialDifferenceInput = {
  current: FinancialRecord;
  previous?: FinancialRecord;
};
export type FinancialDifference = { amount: number; percentage: number };

export const calculateFinancialRecordDifference = ({
  current,
  previous,
}: FinancialDifferenceInput): FinancialDifference => {
  if (!previous) {
    return {
      amount: 0,
      percentage: 0,
    };
  }

  return {
    amount: calculateDifference(current, previous),
    percentage: calculateDifferencePercentage(current, previous),
  };
};
