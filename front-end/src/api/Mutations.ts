import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { createPupilInfo, updatePupilById } from "./Api";
import { deletePupil } from "./Api";
import type { Pupil } from "@/schemas/Schema";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function usePupilMutation() {
  return useMutation<Pupil, Error, Pupil>({
    mutationFn: createPupilInfo,
    onSuccess: () => {
      console.log("Pupil Created ...");
    },
    onError: (err: Error) => {
      console.error("Error Creating Pupil", err);
    },
  });
}

export const useDeletePupil = (): UseMutationResult<
  any,
  AxiosError,
  string | string[]
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string | string[]) => {
      if (Array.isArray(ids)) {
        // call deletePupil for each ID
        return Promise.all(ids.map((id) => deletePupil(id)));
      } else {
        return deletePupil(ids);
      }
    },
    onSuccess: () => {
      toast("Pupil(s) deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pupils"] });
    },
    onError: () => {
      toast("Failed to delete pupil(s)");
    },
  });
};

export const useUpdatePupil = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<Pupil, Error, Pupil>({
    mutationFn: (updatedData) => updatePupilById(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pupil", id] });
      queryClient.invalidateQueries({ queryKey: ["pupils"] });
    },
  });
};