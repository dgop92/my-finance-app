import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { financialRecordRepository } from "@/features/core/repositories/repository.factory";
import {
  CreateFinancialRecordInput,
  CreateFinancialRecordInputSchema,
} from "@/features/core/entities/financial-record";
import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

interface UseCreateFinancialRecordProps {
  onSuccess?: () => void;
}

const computeTotal = (input: Array<{ amount: number }>) => {
  return input.reduce(
    (sum, item) => sum + (isNaN(item.amount) ? 0 : item.amount),
    0
  );
};

// Adding a more specific return type
export const useCreateFinancialRecord = ({
  onSuccess,
}: UseCreateFinancialRecordProps) => {
  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingSavingsSources } = useQuery({
    queryKey: ["savingsSourcesForNewRecord"],
    queryFn: () => financialRecordRepository.getSavingsSourceForNewRecord(),
  });

  const savingsSourcesValues = useMemo(() => data || [], [data]);

  // Create form with dynamic validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateFinancialRecordInput>({
    resolver: zodResolver(CreateFinancialRecordInputSchema),
  });

  const { fields } = useFieldArray({
    control,
    name: "values",
  });

  useEffect(() => {
    if (savingsSourcesValues.length > 0 && fields.length === 0) {
      const initialValues = savingsSourcesValues.map((source) => ({
        savingsSourceId: source.savingsSource.id,
        amount: source.amount,
      }));
      setValue("values", initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savingsSourcesValues]);

  // Create mutation
  const mutation = useMutation({
    mutationFn: (formData: CreateFinancialRecordInput) => {
      return financialRecordRepository.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financialRecords"] });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const onSubmit = (data: CreateFinancialRecordInput) => {
    mutation.mutate(data);
  };

  const handleFormSubmit = handleSubmit(onSubmit);

  const currentValues = watch("values", []);
  const currentTotal = computeTotal(currentValues);

  return {
    register,
    handleFormSubmit,
    savingsSourcesValues,
    isLoadingSavingsSources,
    formState: { errors },
    setValue,
    currentTotal,
    fields,
    control,
  };
};
