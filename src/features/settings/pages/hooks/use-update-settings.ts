import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings } from "@/features/core/entities/settings";
import { settingsRepository } from "@/features/settings/repositories/repository.factory";
import {
  SettingsFormSchema,
  SettingsFormValues,
} from "@/features/settings/lib/settings-form-schema";

export interface UseUpdateSettingsArgs {
  settings: Settings;
}

export const useUpdateSettings = ({ settings }: UseUpdateSettingsArgs) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: SettingsFormValues) =>
      settingsRepository.update({ netSalary: Number(input.netSalary) }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["settings"], updated);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: { netSalary: String(settings.netSalary) },
  });

  const onSubmit = (input: SettingsFormValues) => {
    mutation.mutate(input, {
      onSuccess: (updated) => reset({ netSalary: String(updated.netSalary) }),
    });
  };

  return {
    register,
    handleFormSubmit: handleSubmit(onSubmit),
    formState: { errors },
    error: mutation.error,
  };
};
