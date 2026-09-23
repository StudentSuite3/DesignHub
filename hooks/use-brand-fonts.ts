"use client";

import { useFontMeta } from "@/hooks/use-font-catalog";
import { useGoogleFonts } from "@/hooks/use-google-font";
import type { BrandTokens } from "@/types/brand";

/** Makes the brand's heading and body fonts available to HTML previews. */
export function useBrandFonts(brand: BrandTokens): void {
  const heading = useFontMeta(brand.typography.heading);
  const body = useFontMeta(brand.typography.body);
  useGoogleFonts([heading, body]);
}
