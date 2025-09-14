import { FinancialRecordRepository } from "./financial-record.repository";
import { SavingsSourceRepository } from "./savings-source.repository";

export const savingsSourceRepository = new SavingsSourceRepository();
export const financialRecordRepository = new FinancialRecordRepository(
  savingsSourceRepository
);
