"use client";

import { useEffect, useMemo, useState } from "react";

import { useBrandTokens } from "@/hooks/use-brand";
import { useBrandFontCss } from "@/hooks/use-brand-font-css";
import { useBrandFonts } from "@/hooks/use-brand-fonts";
import { brandSurface } from "@/lib/brand/theme";
import { measureText } from "@/lib/logo/measure";
import type { DrawContext } from "@/lib/mockups/types";
import type { BrandMode } from "@/types/brand";

/** The live brand, surface colors and embedded fonts for one theme. */
export function useDrawContext(mode: BrandMode): DrawContext {
  const brand = useBrandTokens();
  useBrandFonts(brand);
  const fontCss = useBrandFontCss(brand);
  const [fontsReady, setFontsReady] = useState(0);
  useEffect(() => {
    let active = true;
    document.fonts?.ready.then(() => active && setFontsReady((value) => value + 1));
    return () => {
      active = false;
    };
  }, [brand.typography.heading, brand.typography.body, fontCss]);

  return useMemo(
    () => ({ brand, surface: brandSurface(brand, mode), mode, fontCss, measure: measureText }),
    // fontsReady re-runs measurement-dependent layouts once web fonts have loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [brand, mode, fontCss, fontsReady],
  );
}
