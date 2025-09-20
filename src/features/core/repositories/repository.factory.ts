import { FinancialRecordRepository } from "./financial-record.repository";
import { SavingsSourceRepository } from "./savings-source.repository";
import { ExpenseRepository } from "./expense.repository";

export const savingsSourceRepository = new SavingsSourceRepository();
export const financialRecordRepository = new FinancialRecordRepository(
  savingsSourceRepository
);
export const expenseRepository = new ExpenseRepository();
