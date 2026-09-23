"use client";

import { useMemo } from "react";

import { useFontCatalog } from "@/hooks/use-font-catalog";
import { buildBrandTokens } from "@/lib/brand/tokens";
import { useBrandStore } from "@/store/brand-store";
import { useColorStore } from "@/store/color-store";
import { useEffectsStore } from "@/store/effects-store";
import { useTokensStore } from "@/store/tokens-store";
import { useTypographyStore } from "@/store/typography-store";
import type { BrandTokens } from "@/types/brand";

/**
 * The brand, assembled live from every studio's store. There is no second copy of any
 * value: editing a color in Color Studio or a font in Typography Studio updates this instantly.
 */
export function useBrandTokens(): BrandTokens {
  const profile = useBrandStore((state) => state.profile);
  const swatches = useColorStore((state) => state.swatches);
  const gradient = useColorStore((state) => state.gradient);
  const headingFont = useTypographyStore((state) => state.headingFont);
  const bodyFont = useTypographyStore((state) => state.bodyFont);
  const rhythm = useTypographyStore((state) => state.rhythm);
  const scale = useTypographyStore((state) => state.scale);
  const radiusBase = useTokensStore((state) => state.settings.radiusBase);
  const spacingBase = useTokensStore((state) => state.settings.spacingBase);
  const shadowLayers = useEffectsStore((state) => state.settings.shadow.layers);
  const { fonts } = useFontCatalog();

  return useMemo(
    () =>
      buildBrandTokens({
        profile,
        swatches,
        gradient,
        headingFont,
        bodyFont,
        catalog: fonts,
        rhythm,
        scale,
        radiusBase,
        spacingBase,
        shadowLayers,
      }),
    [profile, swatches, gradient, headingFont, bodyFont, fonts, rhythm, scale, radiusBase, spacingBase, shadowLayers],
  );
}
