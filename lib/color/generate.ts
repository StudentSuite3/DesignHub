import { oklch } from "@/lib/color/color";
import type { Oklch } from "@/types/color";

export type Random = () => number;

const GOLDEN_ANGLE = 137.508;

function between(random: Random, min: number, max: number): number {
  return min + (max - min) * random();
}

/**
 * A pleasing random color: mid-to-high chroma in a lightness band that
 * stays in (or close to) the sRGB gamut.
 */
export function randomColor(random: Random = Math.random, hue?: number): Oklch {
  return oklch(between(random, 0.45, 0.9), between(random, 0.08, 0.2), hue ?? between(random, 0, 360));
}

/**
 * Builds `count` colors spread around the hue wheel by the golden angle,
 * with alternating lightness so neighbours never blur together.
 */
export function randomPalette(count: number, random: Random = Math.random): Oklch[] {
  const start = between(random, 0, 360);
  const colors: Oklch[] = [];
  for (let index = 0; index < count; index += 1) {
    const hue = start + index * GOLDEN_ANGLE;
    const lightness = index % 2 === 0 ? between(random, 0.55, 0.85) : between(random, 0.3, 0.6);
    colors.push(oklch(lightness, between(random, 0.06, 0.19), hue));
  }
  // An occasional deep neutral grounds the palette the way designers usually do.
  if (count >= 4 && random() < 0.5) {
    colors[Math.floor(random() * count)] = oklch(between(random, 0.16, 0.26), between(random, 0.01, 0.04), start);
  }
  return colors;
}
