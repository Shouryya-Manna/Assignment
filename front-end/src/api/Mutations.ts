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
  any, // returned data from API
  AxiosError, // error type
  string // variable passed to mutate
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePupil(id),
    onSuccess: () => {
      toast("Pupil deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pupils"] });
    },
    onError: (error: AxiosError) => {
      toast("Failed to delete pupil");
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