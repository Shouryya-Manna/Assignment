import { useQuery } from "@tanstack/react-query";
import { fetchAllPupilInfo} from "./Api";



export function useShowAllPupilsQuery() {
  const pupils = useQuery({
    queryKey: ["pupils"],
    queryFn: fetchAllPupilInfo,
  });
  return{pupils}
}
