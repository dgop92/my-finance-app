import {
  CreateSavingSourceInput,
  SavingsSource,
  UpdateSavingSourceInput,
} from "../../entities/saving-source";

export interface ISavingsSourceRepository {
  getMany(): Promise<SavingsSource[]>;
  create(input: CreateSavingSourceInput): Promise<SavingsSource>;
  update(
    id: string,
    input: UpdateSavingSourceInput
  ): Promise<SavingsSource | undefined>;
  delete(id: string): Promise<void>;
}
