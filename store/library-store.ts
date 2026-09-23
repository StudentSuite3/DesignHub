import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { indexedDbStorage } from "@/lib/db";
import type { FontPair } from "@/lib/typography/pairing";

const MAX_RECENTS = 12;

function pushRecent(list: string[], item: string): string[] {
  return [item, ...list.filter((entry) => entry !== item)].slice(0, MAX_RECENTS);
}

function toggle(list: string[], item: string): string[] {
  return list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item];
}

type LibraryState = {
  favoriteFonts: string[];
  recentFonts: string[];
  toggleFavoriteFont: (family: string) => void;
  addRecentFont: (family: string) => void;
  clearRecentFonts: () => void;
  savedPairs: FontPair[];
  toggleSavedPair: (pair: FontPair) => void;
};

const samePair = (a: FontPair, b: FontPair) => a.heading === b.heading && a.body === b.body;

/** Personal, device-local library: favorites and history. Persisted to IndexedDB. */
export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      favoriteFonts: [],
      recentFonts: [],
      toggleFavoriteFont: (family) => set((state) => ({ favoriteFonts: toggle(state.favoriteFonts, family) })),
      addRecentFont: (family) => set((state) => ({ recentFonts: pushRecent(state.recentFonts, family) })),
      clearRecentFonts: () => set({ recentFonts: [] }),
      savedPairs: [],
      toggleSavedPair: (pair) =>
        set((state) => ({
          savedPairs: state.savedPairs.some((saved) => samePair(saved, pair))
            ? state.savedPairs.filter((saved) => !samePair(saved, pair))
            : [{ heading: pair.heading, body: pair.body }, ...state.savedPairs],
        })),
    }),
    {
      name: "designhub:library",
      version: 1,
      storage: createJSONStorage(() => indexedDbStorage),
    },
  ),
);
