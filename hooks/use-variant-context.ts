"use client";

import { useEffect, useMemo, useState } from "react";

import { useBrandTokens } from "@/hooks/use-brand";
import { useBrandFonts } from "@/hooks/use-brand-fonts";
import { useEmbeddedFont } from "@/hooks/use-embedded-font";
import { brandSurface } from "@/lib/brand/theme";
import { measureText } from "@/lib/logo/measure";
import type { VariantContext } from "@/lib/logo/variants";

/** Everything a logo variant needs, derived from the live brand. */
export function useVariantContext(): VariantContext {
  const brand = useBrandTokens();
  useBrandFonts(brand);
  const { heading, headingWeight } = brand.typography;
  const fontCss = useEmbeddedFont(heading, headingWeight, brand.name);
  // Text is measured in the real font, so re-measure once it has loaded.
  const [fontsReady, setFontsReady] = useState(0);
  useEffect(() => {
    let active = true;
    document.fonts?.ready.then(() => active && setFontsReady((value) => value + 1));
    return () => {
      active = false;
    };
  }, [heading, fontCss]);

  return useMemo(() => {
    const light = brandSurface(brand, "light");
    const dark = brandSurface(brand, "dark");
    return {
      logo: brand.logo.svg,
      name: brand.name,
      fontFamily: heading,
      fontWeight: headingWeight,
      fontCss,
      measure: (text: string, size: number) => measureText(text, heading, headingWeight, size),
      primary: light.primary,
      text: light.text,
      light: light.background,
      dark: dark.background,
    };
    // fontsReady is a dependency on purpose: it re-runs measurement after web fonts load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, heading, headingWeight, fontCss, fontsReady]);
}
