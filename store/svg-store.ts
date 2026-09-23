import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { indexedDbStorage } from "@/lib/db";
import { defaultOptimizeOptions, type SvgOptimizeOptions } from "@/lib/svg/optimize";
import { sampleSvg } from "@/lib/svg/sample";
import type { NodePath } from "@/lib/svg/tree";

type SvgState = {
  name: string;
  source: string;
  setDocument: (name: string, source: string) => void;
  setSource: (source: string) => void;
  loadSample: () => void;
  selected: NodePath | null;
  select: (path: NodePath | null) => void;
  currentColor: boolean;
  setCurrentColor: (value: boolean) => void;
  options: SvgOptimizeOptions;
  setOptions: (patch: Partial<SvgOptimizeOptions>) => void;
};

export const useSvgStore = create<SvgState>()(
  persist(
    (set) => ({
      name: "badge.svg",
      source: sampleSvg,
      setDocument: (name, source) => set({ name, source, selected: null }),
      selected: null,
      select: (selected) => set({ selected }),
      setSource: (source) => set({ source }),
      loadSample: () => set({ name: "badge.svg", source: sampleSvg, selected: null }),
      currentColor: false,
      setCurrentColor: (currentColor) => set({ currentColor }),
      options: defaultOptimizeOptions,
      setOptions: (patch) => set((state) => ({ options: { ...state.options, ...patch } })),
    }),
    {
      name: "designhub:svg",
      version: 1,
      storage: createJSONStorage(() => indexedDbStorage),
      partialize: ({ name, source, options, currentColor }) => ({ name, source, options, currentColor }),
    },
  ),
);
