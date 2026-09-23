import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { indexedDbStorage } from "@/lib/db";
import type { BrandMode } from "@/types/brand";

/** View and selection state only. Every value on the pages comes from the brand. */
type GuidelinesState = {
  selected: string;
  excluded: string[];
  mode: BrandMode;
  select: (id: string) => void;
  toggle: (id: string) => void;
  setMode: (mode: BrandMode) => void;
};

export const useGuidelinesStore = create<GuidelinesState>()(
  persist(
    (set) => ({
      selected: "cover",
      excluded: [],
      mode: "light",
      select: (selected) => set({ selected }),
      toggle: (id) =>
        set((state) => ({
          excluded: state.excluded.includes(id) ? state.excluded.filter((item) => item !== id) : [...state.excluded, id],
        })),
      setMode: (mode) => set({ mode }),
    }),
    { name: "designhub:guidelines", version: 1, storage: createJSONStorage(() => indexedDbStorage) },
  ),
);
