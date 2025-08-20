import { useMutation } from "@tanstack/react-query";
import { createPupilInfo } from "./Api";
import type { Pupil } from "@/schemas/schema";

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
