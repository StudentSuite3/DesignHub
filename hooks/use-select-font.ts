"use client";

import { useCallback } from "react";

import { useLibraryStore } from "@/store/library-store";
import { useTypographyStore } from "@/store/typography-store";

/** Opens a font in the specimen and records it in the recent history. */
export function useSelectFont(): (family: string) => void {
  const setActiveFont = useTypographyStore((state) => state.setActiveFont);
  const addRecentFont = useLibraryStore((state) => state.addRecentFont);

  return useCallback(
    (family: string) => {
      setActiveFont(family);
      addRecentFont(family);
    },
    [setActiveFont, addRecentFont],
  );
}
