import { ErrorCode, RepositoryError } from "@/lib/errors";
import {
  CreateSavingSourceInput,
  SavingsSource,
  UpdateSavingSourceInput,
} from "../entities/saving-source";
import { v4 as uuidv4 } from "uuid";
import { ISavingsSourceRepository } from "./definitions/savings-source.def.repository";
import {
  addNewSavingsSourceToFinancialRecords,
  loadSavingsSources,
  removeSavingsSourceFromFinancialRecords,
  saveSavingsSources,
  updateSavingsSourceInFinancialRecords,
} from "./local-storage.memory";

export class SavingsSourceRepository implements ISavingsSourceRepository {
  getMany(): Promise<SavingsSource[]> {
    const sources = loadSavingsSources();
    return Promise.resolve(sources);
  }

  create(input: CreateSavingSourceInput): Promise<SavingsSource> {
    const sources = loadSavingsSources();
    const newSource: SavingsSource = {
      id: uuidv4(),
      name: input.name.trim(),
      isNA: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newSources = [...sources, newSource];
    saveSavingsSources(newSources);
    addNewSavingsSourceToFinancialRecords(newSource);
    return Promise.resolve(newSource);
  }

  update(
    id: string,
    input: UpdateSavingSourceInput
  ): Promise<SavingsSource | undefined> {
    const sources = loadSavingsSources();
    const index = sources.findIndex((source) => source.id === id);
    if (index === -1) {
      throw new RepositoryError(
        "Savings source not found",
        ErrorCode.NOT_FOUND,
        { id }
      );
    }
    const updatedSource: SavingsSource = {
      ...sources[index],
      name: input.name?.trim() || sources[index].name,
      updatedAt: new Date(),
    };
    sources[index] = updatedSource;
    saveSavingsSources(sources);
    updateSavingsSourceInFinancialRecords(updatedSource);
    return Promise.resolve(updatedSource);
  }

  delete(id: string): Promise<void> {
    const sources = loadSavingsSources();
    const index = sources.findIndex((source) => source.id === id);
    if (index === -1) {
      throw new RepositoryError(
        "Savings source not found",
        ErrorCode.NOT_FOUND,
        { id }
      );
    }
    const savingSourceToDelete = sources[index];
    sources.splice(index, 1);
    saveSavingsSources(sources);
    removeSavingsSourceFromFinancialRecords(savingSourceToDelete.id);
    return Promise.resolve();
  }
}
