import { useQuery } from "@tanstack/react-query";
import { fetchAllPupilInfo, fetchPupilById } from "./Api";
import type { Pupil } from "@/schemas/schema";

export function useShowAllPupilsQuery() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["pupils"],
    queryFn: fetchAllPupilInfo,
  });

  return {
    pupils: data,
    isLoading,
    isError,
    error,
    refetch,
  };
}


export const usePupil = (id: string) => {
  return useQuery<Pupil, Error>({
    queryKey: ["pupil", id],
    queryFn: () => fetchPupilById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, 
  });
};