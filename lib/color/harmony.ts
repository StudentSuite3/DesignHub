import { oklch } from "@/lib/color/color";
import { randomPalette, type Random } from "@/lib/color/generate";
import type { HarmonyMode, Oklch } from "@/types/color";

export const harmonyModes: { value: HarmonyMode; label: string; description: string }[] = [
  { value: "random", label: "Random", description: "Golden-angle hues with alternating lightness." },
  { value: "analogous", label: "Analogous", description: "Neighbouring hues. Calm and cohesive." },
  { value: "complementary", label: "Complementary", description: "Opposite hues. Maximum vibrance." },
  {
    value: "split-complementary",
    label: "Split complementary",
    description: "Base plus the two hues beside its complement.",
  },
  { value: "triadic", label: "Triadic", description: "Three hues evenly spaced. Balanced and playful." },
  { value: "tetradic", label: "Tetradic", description: "Two complementary pairs. Rich but needs care." },
  { value: "monochromatic", label: "Monochromatic", description: "One hue, many lightness and chroma levels." },
];

/** Hue offsets (degrees) relative to the base color for each harmony. */
export const harmonyOffsets: Record<Exclude<HarmonyMode, "random">, number[]> = {
  analogous: [0, -30, 30, -60, 60],
  complementary: [0, 180],
  "split-complementary": [0, 150, 210],
  triadic: [0, 120, 240],
  tetradic: [0, 90, 180, 270],
  monochromatic: [0],
};

const jitter = (random: Random, amount: number) => (random() - 0.5) * amount;

/**
 * Builds a palette of `count` colors that follows the given harmony around `base`.
 * The base itself is always included at index `baseIndex` so locked anchors stay put.
 */
export function harmonyPalette(
  mode: HarmonyMode,
  base: Oklch,
  count: number,
  random: Random = Math.random,
  baseIndex = 0,
): Oklch[] {
  if (mode === "random") return randomPalette(count, random);

  const offsets = harmonyOffsets[mode];
  const colors: Oklch[] = [];

  let k = 0;
  for (let index = 0; index < count; index += 1) {
    if (index === baseIndex) {
      colors.push(base);
      continue;
    }
    k += 1;

    if (mode === "monochromatic") {
      // Evenly spread from deep to light; chroma eases off at the extremes.
      const t = index / Math.max(count - 1, 1);
      const l = 0.24 + t * 0.68 + jitter(random, 0.03);
      colors.push(oklch(l, base.c * (1 - Math.abs(t - 0.5)), base.h + jitter(random, 6)));
      continue;
    }

    const offset = offsets[k % offsets.length] ?? 0;
    // Cycle lightness tiers so repeated hues still read as distinct colors.
    const tier = Math.floor(k / offsets.length);
    const shift = tier % 2 === 0 ? jitter(random, 0.16) : (base.l > 0.55 ? -0.25 : 0.25) + jitter(random, 0.08);
    colors.push(
      oklch(
        Math.min(0.94, Math.max(0.2, base.l + shift)),
        Math.max(0.03, base.c * (0.75 + random() * 0.4)),
        base.h + offset + jitter(random, 10),
      ),
    );
  }
  return colors;
}
