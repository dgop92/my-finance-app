import { ErrorCode, RepositoryError } from "@/lib/errors";
import { v4 as uuidv4 } from "uuid";
import {
  CreateFinancialRecordInput,
  FinancialRecord,
  FinancialRecordPair,
  UpdateFinancialRecordInput,
} from "../entities/financial-record";
import { SavingsSourceValue } from "../entities/savings-source-value";
import { ISavingsSourceRepository } from "./definitions/savings-source.def.repository";
import { IFinancialRecordRepository } from "./definitions/financial-record.def.repository";
import {
  loadFinancialRecords,
  saveFinancialRecords,
} from "./local-storage.memory";

export class FinancialRecordRepository implements IFinancialRecordRepository {
  constructor(
    private readonly savingsSourceRepository: ISavingsSourceRepository
  ) {}

  async getMany(): Promise<FinancialRecord[]> {
    const financialRecords = loadFinancialRecords();
    return Promise.resolve(
      [...financialRecords].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )
    );
  }

  async getById(id: string): Promise<FinancialRecord> {
    const financialRecords = loadFinancialRecords();
    const record = financialRecords.find((record) => record.id === id);
    if (!record) {
      throw new RepositoryError(
        "Financial record not found",
        ErrorCode.NOT_FOUND,
        { id }
      );
    }
    console.log("Found record:", record);
    return Promise.resolve(record);
  }

  async create(input: CreateFinancialRecordInput): Promise<FinancialRecord> {
    const financialRecords = loadFinancialRecords();
    const financialRecordId = uuidv4();
    const savingsSources = await this.savingsSourceRepository.getMany();
    const sourceIdToAmount = new Map(
      input.values.map((value) => [value.savingsSourceId, value.amount])
    );

    const allValues: SavingsSourceValue[] = savingsSources.map((source) => ({
      savingsSource: source,
      amount: sourceIdToAmount.get(source.id) || 0,
    }));

    const newRecord: FinancialRecord = {
      id: financialRecordId,
      createdAt: new Date(),
      updatedAt: new Date(),
      values: allValues,
      expenses: [],
    };

    const newRecords = [...financialRecords, newRecord];
    saveFinancialRecords(newRecords);
    return Promise.resolve(newRecord);
  }

  async update(
    id: string,
    input: UpdateFinancialRecordInput
  ): Promise<FinancialRecord> {
    const financialRecords = loadFinancialRecords();
    const index = financialRecords.findIndex((record) => record.id === id);
    if (index === -1) {
      throw new RepositoryError(
        "Financial record not found",
        ErrorCode.NOT_FOUND,
        { id }
      );
    }
    const existingRecord = financialRecords[index];
    const savingsSources = await this.savingsSourceRepository.getMany();
    const sourceIdToAmount = new Map(
      input.values.map((value) => [value.savingsSourceId, value.amount])
    );
    const newValues: SavingsSourceValue[] = savingsSources.map((source) => ({
      savingsSource: source,
      amount: sourceIdToAmount.get(source.id) || 0,
    }));

    const updatedRecord: FinancialRecord = {
      ...existingRecord,
      values: newValues,
      updatedAt: new Date(),
    };

    financialRecords[index] = updatedRecord;
    saveFinancialRecords(financialRecords);
    return Promise.resolve(updatedRecord);
  }

  async delete(id: string): Promise<void> {
    const financialRecords = loadFinancialRecords();
    const index = financialRecords.findIndex((record) => record.id === id);
    if (index === -1) {
      throw new RepositoryError(
        "Financial record not found",
        ErrorCode.NOT_FOUND,
        { id }
      );
    }
    financialRecords.splice(index, 1);
    saveFinancialRecords(financialRecords);
    return Promise.resolve();
  }

  async getFinancialRecordPair(id: string): Promise<FinancialRecordPair> {
    const financialRecords = loadFinancialRecords();
    const sortedRecords = [...financialRecords].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    const currentIndex = sortedRecords.findIndex((record) => record.id === id);
    if (currentIndex === -1) {
      throw new RepositoryError(
        "Financial record not found",
        ErrorCode.NOT_FOUND,
        { id }
      );
    }
    const current = sortedRecords[currentIndex];
    const previous = sortedRecords[currentIndex + 1];

    console.log("Current record:", current);
    console.log("Previous record:", previous);

    return Promise.resolve({ current, previous });
  }

  async getSavingsSourceForNewRecord(): Promise<SavingsSourceValue[]> {
    const financialRecords = loadFinancialRecords();
    const sortedRecords = [...financialRecords].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    if (sortedRecords.length === 0) {
      const savingsSources = await this.savingsSourceRepository.getMany();
      return savingsSources.map((source) => ({
        savingsSource: source,
        amount: 0,
      }));
    }

    const latestRecord = sortedRecords[0];
    const savingsSources = await this.savingsSourceRepository.getMany();
    const savingSourceAmountMap = new Map(
      latestRecord.values.map((value) => [value.savingsSource.id, value.amount])
    );
    return savingsSources.map((source) => ({
      savingsSource: source,
      amount: savingSourceAmountMap.get(source.id) || 0,
    }));
  }
}
