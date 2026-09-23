import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { indexedDbStorage } from "@/lib/db";
import { defaultIconStyle } from "@/lib/icons/svg";
import type { IconId, IconStyle } from "@/types/icons";

type IconState = {
  query: string;
  prefix: string | null;
  selected: IconId;
  style: IconStyle;
  favorites: IconId[];
  setQuery: (query: string) => void;
  setPrefix: (prefix: string | null) => void;
  select: (id: IconId) => void;
  updateStyle: (patch: Partial<IconStyle>) => void;
  resetStyle: () => void;
  toggleFavorite: (id: IconId) => void;
};

export const useIconStore = create<IconState>()(
  persist(
    (set) => ({
      query: "",
      prefix: null,
      selected: "lucide:house",
      style: defaultIconStyle,
      favorites: [],
      setQuery: (query) => set({ query }),
      setPrefix: (prefix) => set({ prefix }),
      select: (selected) => set({ selected }),
      updateStyle: (patch) => set((state) => ({ style: { ...state.style, ...patch } })),
      resetStyle: () => set((state) => ({ style: { ...defaultIconStyle, size: state.style.size } })),
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((item) => item !== id)
            : [id, ...state.favorites],
        })),
    }),
    {
      name: "designhub:icons",
      version: 1,
      storage: createJSONStorage(() => indexedDbStorage),
      partialize: ({ selected, style, favorites, prefix }) => ({ selected, style, favorites, prefix }),
    },
  ),
);
