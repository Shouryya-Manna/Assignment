import { useMutation } from "@tanstack/react-query";
import { createPupilInfo } from "./Api";
import type { Pupil } from "@/schemas/schema";

export function usePupilMutation() {
  return useMutation({
    mutationFn: createPupilInfo,
    onSuccess: (data) => {
      console.log("Pupil Created:", data);
    },
    onError: (err: any) => {
      // Log full error for debugging
      console.error("Error Creating Pupil", err?.response?.data || err.message || err);
    },
  });
}