import { create } from "zustand";
import type { Pupil } from "@/schemas/Schema";

interface PupilStore {
  selectedPupil: Pupil | null;
  setSelectedPupil: (pupil: Pupil) => void;
  clearSelectedPupil: () => void;
}

export const useSelectedPupil = create<PupilStore>((set) => ({
  selectedPupil: null,
  setSelectedPupil: (pupil: Pupil) => set({ selectedPupil: pupil }),
  clearSelectedPupil: () => set({ selectedPupil: null }),
}));
