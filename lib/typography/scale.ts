import type { TypeScaleSettings, TypeScaleStep } from "@/types/typography";

export const scaleRatios = [
  { value: 1.067, label: "Minor second" },
  { value: 1.125, label: "Major second" },
  { value: 1.2, label: "Minor third" },
  { value: 1.25, label: "Major third" },
  { value: 1.333, label: "Perfect fourth" },
  { value: 1.414, label: "Augmented fourth" },
  { value: 1.5, label: "Perfect fifth" },
  { value: 1.618, label: "Golden ratio" },
] as const;

const stepNames: Record<number, string> = {
  [-3]: "2xs",
  [-2]: "xs",
  [-1]: "sm",
  0: "base",
  1: "lg",
  2: "xl",
  3: "2xl",
  4: "3xl",
  5: "4xl",
  6: "5xl",
  7: "6xl",
  8: "7xl",
};

export function stepName(step: number): string {
  return stepNames[step] ?? (step > 0 ? `${step - 1}xl` : `${Math.abs(step)}xs`);
}

function round(value: number, precision = 4): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

/**
 * Builds a CSS `clamp()` that scales linearly from `minPx` at `minViewport`
 * to `maxPx` at `maxViewport`. Output uses rem so it respects user font settings.
 */
export function fluidClamp(
  minPx: number,
  maxPx: number,
  minViewport: number,
  maxViewport: number,
  rootPx = 16,
): string {
  if (minPx === maxPx || minViewport >= maxViewport) return `${round(maxPx / rootPx)}rem`;
  const slope = (maxPx - minPx) / (maxViewport - minViewport);
  const intercept = minPx - slope * minViewport;
  const lower = Math.min(minPx, maxPx) / rootPx;
  const upper = Math.max(minPx, maxPx) / rootPx;
  const preferred = `${round(intercept / rootPx)}rem + ${round(slope * 100)}vw`;
  return `clamp(${round(lower)}rem, ${preferred}, ${round(upper)}rem)`;
}

/** Resolves a fluid size at a specific viewport width (used for previews). */
export function sizeAtViewport(step: TypeScaleStep, viewport: number, settings: TypeScaleSettings): number {
  const { minViewport, maxViewport } = settings;
  if (viewport <= minViewport) return step.minPx;
  if (viewport >= maxViewport) return step.maxPx;
  const t = (viewport - minViewport) / (maxViewport - minViewport);
  return step.minPx + (step.maxPx - step.minPx) * t;
}

export function generateScale(settings: TypeScaleSettings): TypeScaleStep[] {
  const steps: TypeScaleStep[] = [];
  for (let step = settings.stepsUp; step >= -settings.stepsDown; step -= 1) {
    const minPx = round(settings.minBase * settings.minRatio ** step, 2);
    const maxPx = round(settings.baseSize * settings.ratio ** step, 2);
    steps.push({
      name: stepName(step),
      step,
      minPx,
      maxPx,
      clamp: fluidClamp(minPx, maxPx, settings.minViewport, settings.maxViewport),
    });
  }
  return steps;
}

/** Tighter leading for large sizes, looser for body copy. */
export function recommendedLineHeight(px: number): number {
  if (px >= 48) return 1.05;
  if (px >= 32) return 1.15;
  if (px >= 24) return 1.25;
  if (px >= 18) return 1.45;
  return 1.55;
}

/** Large display text reads better slightly tighter. */
export function recommendedTracking(px: number): number {
  if (px >= 48) return -0.03;
  if (px >= 32) return -0.02;
  if (px >= 24) return -0.01;
  return 0;
}
