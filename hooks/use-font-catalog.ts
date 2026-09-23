"use client";

import { useEffect, useMemo, useState } from "react";

import { loadFontCatalog } from "@/lib/typography/catalog";
import type { FontFamily } from "@/types/typography";

export function useFontCatalog(): { fonts: FontFamily[]; loading: boolean } {
  const [fonts, setFonts] = useState<FontFamily[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadFontCatalog().then((catalog) => {
      if (cancelled) return;
      setFonts(catalog);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { fonts, loading };
}

/** Metadata for a single family, or undefined while the catalog loads. */
export function useFontMeta(family: string): FontFamily | undefined {
  const { fonts } = useFontCatalog();
  return useMemo(() => fonts.find((font) => font.family === family), [fonts, family]);
}
