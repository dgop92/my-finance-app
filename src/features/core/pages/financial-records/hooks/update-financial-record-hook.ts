import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { financialRecordRepository } from "@/features/core/repositories/repository.factory";
import {
  UpdateFinancialRecordInput,
  UpdateFinancialRecordInputSchema,
} from "@/features/core/entities/financial-record";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

interface UseUpdateFinancialRecordProps {
  recordId: string;
  onSuccess?: () => void;
}

const computeTotal = (input: Array<{ amount: number }>) => {
  return input.reduce(
    (sum, item) => sum + (isNaN(item.amount) ? 0 : item.amount),
    0
  );
};

export const useUpdateFinancialRecord = ({
  recordId,
  onSuccess,
}: UseUpdateFinancialRecordProps) => {
  const queryClient = useQueryClient();

  const {
    data: recordForEdit,
    isLoading: isLoadingRecord,
    error,
  } = useQuery({
    queryKey: ["financialRecordForEdit", recordId],
    queryFn: () => financialRecordRepository.getById(recordId),
    enabled: !!recordId,
  });

  // Create form with dynamic validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isDirty },
  } = useForm<UpdateFinancialRecordInput>({
    resolver: zodResolver(UpdateFinancialRecordInputSchema),
  });

  const { fields } = useFieldArray({
    control,
    name: "values",
  });

  useEffect(() => {
    if (recordForEdit && fields.length === 0) {
      const initialValues = recordForEdit.values.map((source) => ({
        savingsSourceId: source.savingsSource.id,
        amount: source.amount,
      }));
      setValue("values", initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordForEdit]);

  // Update mutation
  const mutation = useMutation({
    mutationFn: (formData: UpdateFinancialRecordInput) => {
      return financialRecordRepository.update(recordId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financialRecords"] });
      queryClient.invalidateQueries({
        queryKey: ["financialRecordPair", recordId],
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const onSubmit = (data: UpdateFinancialRecordInput) => {
    mutation.mutate(data);
  };

  const handleFormSubmit = handleSubmit(onSubmit);

  const currentValues = watch("values", []);
  const currentTotal = computeTotal(currentValues);

  return {
    register,
    handleFormSubmit,
    recordForEdit,
    isLoadingRecord,
    error,
    formState: { errors, isDirty },
    setValue,
    currentTotal,
    fields,
    control,
    isUpdating: mutation.isPending,
  };
};
