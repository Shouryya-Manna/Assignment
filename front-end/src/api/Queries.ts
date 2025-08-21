import { useQuery } from "@tanstack/react-query";
import { fetchAllPupilInfo } from "./Api";

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
