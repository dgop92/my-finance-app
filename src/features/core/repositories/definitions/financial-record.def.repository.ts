import {
  CreateFinancialRecordInput,
  FinancialRecord,
  FinancialRecordPair,
  UpdateFinancialRecordInput,
} from "../../entities/financial-record";
import { SavingsSourceValue } from "../../entities/savings-source-value";

export interface IFinancialRecordRepository {
  getMany(): Promise<FinancialRecord[]>;
  getById(id: string): Promise<FinancialRecord>;
  create(input: CreateFinancialRecordInput): Promise<FinancialRecord>;
  update(
    id: string,
    input: UpdateFinancialRecordInput
  ): Promise<FinancialRecord>;
  delete(id: string): Promise<void>;
  getFinancialRecordPair(id: string): Promise<FinancialRecordPair>;
  getSavingsSourceForNewRecord(): Promise<SavingsSourceValue[]>;
}
