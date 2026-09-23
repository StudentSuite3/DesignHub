import { oklch } from "@/lib/color/color";
import type { Oklch, Shade } from "@/types/color";

export const SHADE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type ShadeStep = (typeof SHADE_STEPS)[number];

/** Target OKLCH lightness per step, modelled on Tailwind v4's palette. */
const lightness: Record<ShadeStep, number> = {
  50: 0.975,
  100: 0.94,
  200: 0.885,
  300: 0.81,
  400: 0.71,
  500: 0.625,
  600: 0.55,
  700: 0.48,
  800: 0.41,
  900: 0.35,
  950: 0.26,
};

/** Chroma relative to the base: soft tints at the ends, full color in the middle. */
const chroma: Record<ShadeStep, number> = {
  50: 0.14,
  100: 0.28,
  200: 0.5,
  300: 0.72,
  400: 0.9,
  500: 1,
  600: 1,
  700: 0.92,
  800: 0.8,
  900: 0.68,
  950: 0.52,
};

export type ShadeOptions = {
  /** Degrees of hue rotation from lightest to darkest (warm highlights / cool shadows). */
  hueShift: number;
  /** Keep the exact input color on its nearest step. */
  anchor: boolean;
};

export const defaultShadeOptions: ShadeOptions = { hueShift: 0, anchor: true };

export function nearestStep(color: Oklch): ShadeStep {
  return SHADE_STEPS.reduce((best, step) =>
    Math.abs(lightness[step] - color.l) < Math.abs(lightness[best] - color.l) ? step : best,
  );
}

export function generateShades(base: Oklch, options: ShadeOptions = defaultShadeOptions): Shade[] {
  const anchorStep = nearestStep(base);
  const anchorIndex = SHADE_STEPS.indexOf(anchorStep);
  const delta = base.l - lightness[anchorStep];
  // Chroma is measured relative to the anchor step so vivid inputs stay vivid.
  const peakChroma = base.c / chroma[anchorStep];

  return SHADE_STEPS.map((step, index) => {
    if (options.anchor && step === anchorStep) return { step, color: base };
    // Spread the lightness correction, fading out with distance from the anchor.
    const falloff = Math.max(0, 1 - Math.abs(index - anchorIndex) / 4);
    const l = lightness[step] + (options.anchor ? delta * falloff : 0);
    const t = index / (SHADE_STEPS.length - 1) - 0.5;
    return {
      step,
      color: oklch(l, Math.min(0.37, peakChroma * chroma[step]), base.h + options.hueShift * t, base.alpha),
    };
  });
}
