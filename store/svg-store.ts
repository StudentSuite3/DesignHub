import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { indexedDbStorage } from "@/lib/db";
import { sampleSvg } from "@/lib/svg/sample";

type SvgState = {
  name: string;
  source: string;
  setDocument: (name: string, source: string) => void;
  setSource: (source: string) => void;
  loadSample: () => void;
};

export const useSvgStore = create<SvgState>()(
  persist(
    (set) => ({
      name: "badge.svg",
      source: sampleSvg,
      setDocument: (name, source) => set({ name, source }),
      setSource: (source) => set({ source }),
      loadSample: () => set({ name: "badge.svg", source: sampleSvg }),
    }),
    { name: "designhub:svg", version: 1, storage: createJSONStorage(() => indexedDbStorage) },
  ),
);
