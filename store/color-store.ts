import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { fromHex } from "@/lib/color/color";
import { indexedDbStorage } from "@/lib/db";
import { createId } from "@/lib/id";
import type { ColorFormat, Oklch, Swatch } from "@/types/color";

export const MIN_SWATCHES = 2;
export const MAX_SWATCHES = 10;

const starter = ["#0f172a", "#6366f1", "#f472b6", "#fbbf24", "#34d399"];

export function createSwatch(color: Oklch, locked = false): Swatch {
  return { id: createId("sw"), color, locked };
}

export type ColorTab = "palette" | "shades" | "gradient" | "contrast" | "export";

type ColorState = {
  tab: ColorTab;
  swatches: Swatch[];
  selectedId: string | null;
  format: ColorFormat;
  setTab: (tab: ColorTab) => void;
  setFormat: (format: ColorFormat) => void;
  select: (id: string) => void;
  updateColor: (id: string, color: Oklch) => void;
  toggleLock: (id: string) => void;
  addSwatch: (color: Oklch, afterId?: string) => void;
  removeSwatch: (id: string) => void;
  moveSwatch: (id: string, direction: -1 | 1) => void;
  setSwatches: (swatches: Swatch[]) => void;
};

export const useColorStore = create<ColorState>()(
  persist(
    (set) => ({
      tab: "palette",
      swatches: starter.map((hex) => createSwatch(fromHex(hex))),
      selectedId: null,
      format: "hex",
      setTab: (tab) => set({ tab }),
      setFormat: (format) => set({ format }),
      select: (id) => set({ selectedId: id }),
      updateColor: (id, color) =>
        set((state) => ({
          swatches: state.swatches.map((swatch) => (swatch.id === id ? { ...swatch, color } : swatch)),
        })),
      toggleLock: (id) =>
        set((state) => ({
          swatches: state.swatches.map((swatch) => (swatch.id === id ? { ...swatch, locked: !swatch.locked } : swatch)),
        })),
      addSwatch: (color, afterId) =>
        set((state) => {
          if (state.swatches.length >= MAX_SWATCHES) return state;
          const swatch = createSwatch(color);
          const index = afterId ? state.swatches.findIndex((item) => item.id === afterId) : -1;
          const swatches = [...state.swatches];
          swatches.splice(index === -1 ? swatches.length : index + 1, 0, swatch);
          return { swatches, selectedId: swatch.id };
        }),
      removeSwatch: (id) =>
        set((state) => {
          if (state.swatches.length <= MIN_SWATCHES) return state;
          return {
            swatches: state.swatches.filter((swatch) => swatch.id !== id),
            selectedId: state.selectedId === id ? null : state.selectedId,
          };
        }),
      moveSwatch: (id, direction) =>
        set((state) => {
          const index = state.swatches.findIndex((swatch) => swatch.id === id);
          const target = index + direction;
          if (index === -1 || target < 0 || target >= state.swatches.length) return state;
          const swatches = [...state.swatches];
          const [moved] = swatches.splice(index, 1);
          if (moved) swatches.splice(target, 0, moved);
          return { swatches };
        }),
      setSwatches: (swatches) => set({ swatches }),
    }),
    {
      name: "designhub:colors",
      version: 1,
      storage: createJSONStorage(() => indexedDbStorage),
      partialize: ({ swatches, selectedId, format }) => ({ swatches, selectedId, format }),
    },
  ),
);

/** The selected swatch, falling back to the first one. */
export function useSelectedSwatch(): Swatch | undefined {
  return useColorStore((state) => state.swatches.find((swatch) => swatch.id === state.selectedId) ?? state.swatches[0]);
}
