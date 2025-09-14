/* eslint-disable @typescript-eslint/no-explicit-any */
import { FinancialRecord } from "../entities/financial-record";
import { SavingsSource } from "../entities/saving-source";

const SAVINGS_SOURCES_KEY = "savingsSources";
const FINANCIAL_RECORDS_KEY = "financialRecords";

const DEFAULT_SAVINGS_SOURCES = {
  id: "na-source",
  name: "NA",
  isNA: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function initializeSavingSources() {
  saveSavingsSources([DEFAULT_SAVINGS_SOURCES]);
}

// Helper function to convert date strings to Date objects in SavingsSource objects
function convertSavingsSourceDates(source: any): SavingsSource {
  return {
    ...source,
    createdAt: new Date(source.createdAt),
    updatedAt: new Date(source.updatedAt),
  };
}

// Helper function to convert date strings to Date objects in FinancialRecord objects
function convertFinancialRecordDates(record: any): FinancialRecord {
  return {
    ...record,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
    values: record.values.map((value: any) => ({
      ...value,
      savingsSource: convertSavingsSourceDates(value.savingsSource),
    })),
  };
}

export function loadSavingsSources(): SavingsSource[] {
  const data = localStorage.getItem(SAVINGS_SOURCES_KEY);
  if (data !== null) {
    const parsedData = JSON.parse(data);
    return parsedData.map(convertSavingsSourceDates);
  }
  initializeSavingSources();
  return [DEFAULT_SAVINGS_SOURCES];
}

export function saveSavingsSources(sources: SavingsSource[]): void {
  localStorage.setItem(SAVINGS_SOURCES_KEY, JSON.stringify(sources));
}

export function loadFinancialRecords(): FinancialRecord[] {
  const data = localStorage.getItem(FINANCIAL_RECORDS_KEY);
  if (!data) return [];

  const parsedData = JSON.parse(data);
  return parsedData.map(convertFinancialRecordDates);
}

export function saveFinancialRecords(records: FinancialRecord[]): void {
  localStorage.setItem(FINANCIAL_RECORDS_KEY, JSON.stringify(records));
}

export function addNewSavingsSourceToFinancialRecords(
  newSource: SavingsSource
): void {
  const records = loadFinancialRecords();
  records.forEach((record) => {
    record.values.push({
      savingsSource: newSource,
      amount: 0,
    });
  });
  saveFinancialRecords(records);
}

export function updateSavingsSourceInFinancialRecords(
  updatedSource: SavingsSource
): void {
  const records = loadFinancialRecords();
  records.forEach((record) => {
    const value = record.values.find(
      (v) => v.savingsSource.id === updatedSource.id
    );
    if (value) {
      value.savingsSource = updatedSource;
    }
  });
  saveFinancialRecords(records);
}

export function removeSavingsSourceFromFinancialRecords(
  sourceId: string
): void {
  const records = loadFinancialRecords();

  records.forEach((record) => {
    const index = record.values.findIndex(
      (v) => v.savingsSource.id === sourceId
    );
    const indexOfNa = record.values.findIndex((v) => v.savingsSource.isNA);
    if (index !== -1) {
      if (indexOfNa !== -1) {
        record.values[indexOfNa].amount += record.values[index].amount;
      }
      record.values.splice(index, 1);
    }
  });
  saveFinancialRecords(records);
}
