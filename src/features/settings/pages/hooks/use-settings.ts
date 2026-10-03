import { useQuery } from "@tanstack/react-query";
import { settingsRepository } from "@/features/settings/repositories/repository.factory";

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsRepository.get(),
  });
};
