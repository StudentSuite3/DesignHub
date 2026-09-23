"use client";

import { useEffect, useMemo, useState } from "react";

import { useBrandTokens } from "@/hooks/use-brand";
import { useBrandFontCss } from "@/hooks/use-brand-font-css";
import { useBrandFonts } from "@/hooks/use-brand-fonts";
import { brandSurface } from "@/lib/brand/theme";
import { measureText } from "@/lib/logo/measure";
import { slugify } from "@/lib/logo/pack";
import type { MockupContext } from "@/lib/mockups/types";
import { useMockupStore } from "@/store/mockup-store";

/** The live brand, surface colors, copy and embedded fonts every mockup is drawn from. */
export function useMockupContext(): MockupContext {
  const brand = useBrandTokens();
  useBrandFonts(brand);
  const fontCss = useBrandFontCss(brand);
  const mode = useMockupStore((state) => state.mode);
  const content = useMockupStore((state) => state.content);
  const [fontsReady, setFontsReady] = useState(0);
  useEffect(() => {
    let active = true;
    document.fonts?.ready.then(() => active && setFontsReady((value) => value + 1));
    return () => {
      active = false;
    };
  }, [brand.typography.heading, brand.typography.body, fontCss]);

  return useMemo(
    () => {
      const domain = `${slugify(brand.name).replace(/-/g, "")}.com`;
      const first = content.person.split(" ")[0]?.toLowerCase() || "hello";
      const resolved = {
        ...content,
        website: content.website || domain,
        email: content.email || `${first}@${domain}`,
        headline: content.headline || brand.description || brand.name,
      };
      return { brand, surface: brandSurface(brand, mode), mode, content: resolved, fontCss, measure: measureText };
    },
    // fontsReady re-runs measurement-dependent layouts once web fonts have loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [brand, mode, content, fontCss, fontsReady],
  );
}
