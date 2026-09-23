import { contrastRatio, oklch, parseColor, readableTextColor, toHex } from "@/lib/color/color";
import type { BrandMode, BrandSurface, BrandTokens } from "@/types/brand";

/**
 * Light and dark surfaces tinted with the primary hue, plus a text color that is
 * guaranteed to reach 4.5:1 on the background.
 */
export function brandSurface(tokens: BrandTokens, mode: BrandMode): BrandSurface {
  const primaryHex = tokens.colors.primary[0] ?? tokens.colors.secondary[0] ?? "#6366f1";
  const secondaryHex = tokens.colors.secondary[0] ?? primaryHex;
  const primary = parseColor(primaryHex) ?? oklch(0.6, 0.2, 275);
  const hue = primary.h;
  const tint = Math.min(primary.c, 0.02);

  const background = mode === "light" ? oklch(0.99, tint * 0.5, hue) : oklch(0.16, tint, hue);
  const surface = mode === "light" ? oklch(0.965, tint, hue) : oklch(0.21, tint, hue);
  let text = mode === "light" ? oklch(0.2, tint, hue) : oklch(0.96, tint * 0.5, hue);
  if (contrastRatio(text, background) < 4.5) text = mode === "light" ? oklch(0, 0, 0) : oklch(1, 0, 0);
  const muted = mode === "light" ? oklch(0.45, tint, hue) : oklch(0.74, tint, hue);
  const border = mode === "light" ? oklch(0.9, tint, hue) : oklch(0.3, tint, hue);

  // The primary color nudged in lightness until small text in it reaches 4.5:1.
  let primaryText = primary;
  for (let i = 0; i < 40 && contrastRatio(primaryText, background) < 4.5; i += 1) {
    const l = mode === "light" ? primaryText.l - 0.02 : primaryText.l + 0.02;
    primaryText = oklch(Math.min(1, Math.max(0, l)), primaryText.c, primaryText.h);
  }

  return {
    background: toHex(background),
    surface: toHex(surface),
    text: toHex(text),
    muted: toHex(muted),
    border: toHex(border),
    primary: primaryHex,
    primaryText: toHex(primaryText),
    onPrimary: toHex(readableTextColor(primary)),
    secondary: secondaryHex,
  };
}
