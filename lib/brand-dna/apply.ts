import type { BrandDna } from "@/lib/brand-dna/types";
import { fromHex } from "@/lib/color/color";
import { captureSnapshot, type BrandSnapshot } from "@/lib/projects/snapshot";
import { useBrandStore } from "@/store/brand-store";
import { createSwatch, MAX_SWATCHES, MIN_SWATCHES, useColorStore } from "@/store/color-store";
import { useTokensStore } from "@/store/tokens-store";
import { useTypographyStore } from "@/store/typography-store";
import type { ColorRole } from "@/types/brand";

/**
 * Writes the DNA into the stores that own each value (palette, fonts, radius, voice).
 * Returns the previous state so the caller can offer undo.
 */
export function applyBrandDna(dna: BrandDna): BrandSnapshot {
  const before = captureSnapshot();
  const colors = dna.colors.slice(0, MAX_SWATCHES);
  if (colors.length >= MIN_SWATCHES) {
    const swatches = colors.map((color) => createSwatch(fromHex(color.hex)));
    const roles: Record<string, ColorRole> = {};
    swatches.forEach((swatch, i) => {
      const role = colors[i]?.role;
      if (role) roles[swatch.id] = role;
    });
    useColorStore.getState().setSwatches(swatches);
    useBrandStore.getState().updateProfile({ roles });
  }
  useTypographyStore.getState().setPair({ heading: dna.heading, body: dna.body });
  useTokensStore.getState().update({ radiusBase: Math.round(dna.radius) });
  if (dna.personality.length) useBrandStore.getState().updateVoice({ personality: dna.personality.slice(0, 4) });
  return before;
}
