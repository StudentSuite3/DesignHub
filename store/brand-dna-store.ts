import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { indexedDbStorage } from "@/lib/db";

/** Only the chosen provider persists. Images and results stay in memory. */
type BrandDnaState = {
  providerId: string;
  setProvider: (providerId: string) => void;
};

export const useBrandDnaStore = create<BrandDnaState>()(
  persist(
    (set) => ({
      providerId: "local",
      setProvider: (providerId) => set({ providerId }),
    }),
    { name: "designhub:brand-dna", version: 1, storage: createJSONStorage(() => indexedDbStorage) },
  ),
);
