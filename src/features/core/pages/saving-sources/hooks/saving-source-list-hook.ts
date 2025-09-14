import { useState } from "react";
import { SavingsSource } from "@/features/core/entities/saving-source";
import { savingsSourceRepository } from "@/features/core/repositories/repository.factory";
import { useQuery } from "@tanstack/react-query";

export const useSavingSourceList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["savingsSources"],
    queryFn: () => savingsSourceRepository.getMany(),
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [savingSourceForEdition, setSavingSourceForEdition] =
    useState<SavingsSource | null>(null);
  const [savingSourceForDeletion, setSavingSourceForDeletion] =
    useState<SavingsSource | null>(null);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = (source: SavingsSource) => {
    setSavingSourceForEdition(source);
  };

  const handleDeleteClick = (source: SavingsSource) => {
    setSavingSourceForDeletion(source);
  };

  const savingsSources = data || [];

  return {
    isPending,
    error,
    savingsSources,
    isAddModalOpen,
    setIsAddModalOpen,
    savingSourceForEdition,
    setSavingSourceForEdition,
    savingSourceForDeletion,
    setSavingSourceForDeletion,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
  };
};
