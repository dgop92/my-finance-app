import { useQuery } from "@tanstack/react-query";
import { financialRecordRepository } from "@/features/core/repositories/repository.factory";
import { calculateFinancialRecordDifference } from "../../../services/financial-functions";

/**
 * Hook for fetching financial record details along with its previous record if available
 * Uses the getFinancialRecordPair method to fetch both records in a single query
 */
export const useFinancialRecordDetails = (recordId: string) => {
  // Fetch the current financial record and its previous record in one query
  const {
    data: recordPair,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["financialRecordPair", recordId],
    queryFn: () => financialRecordRepository.getFinancialRecordPair(recordId),
    enabled: !!recordId,
  });

  // Calculate the difference if the records are available
  const difference =
    recordPair &&
    calculateFinancialRecordDifference({
      current: recordPair.current,
      previous: recordPair.previous,
    });

  return {
    record: recordPair?.current,
    previousRecord: recordPair?.previous,
    difference,
    isLoading,
    error,
  };
};
