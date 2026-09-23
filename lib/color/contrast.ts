import { contrastRatio, oklch } from "@/lib/color/color";
import type { Oklch } from "@/types/color";

export type WcagCheck = {
  id: "normal-aa" | "normal-aaa" | "large-aa" | "large-aaa" | "ui";
  label: string;
  threshold: number;
  pass: boolean;
};

/** WCAG 2.1 success criteria 1.4.3, 1.4.6 and 1.4.11. */
export function wcagChecks(ratio: number): WcagCheck[] {
  const checks: Omit<WcagCheck, "pass">[] = [
    { id: "normal-aa", label: "Normal text · AA", threshold: 4.5 },
    { id: "normal-aaa", label: "Normal text · AAA", threshold: 7 },
    { id: "large-aa", label: "Large text · AA", threshold: 3 },
    { id: "large-aaa", label: "Large text · AAA", threshold: 4.5 },
    { id: "ui", label: "UI components · AA", threshold: 3 },
  ];
  return checks.map((check) => ({ ...check, pass: ratio >= check.threshold }));
}

export function ratingLabel(ratio: number): "AAA" | "AA" | "AA Large" | "Fail" {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

/** Truncates (never rounds up) so 4.499 is not reported as passing 4.5. */
export function formatRatio(ratio: number): string {
  return `${(Math.floor(ratio * 100) / 100).toFixed(2)}:1`;
}

function searchLightness(fg: Oklch, bg: Oklch, target: number, towards: 0 | 1): Oklch | null {
  const extreme = oklch(towards, fg.c, fg.h, fg.alpha);
  if (contrastRatio(extreme, bg) < target) return null;
  let low = fg.l;
  let high: number = towards;
  for (let i = 0; i < 24; i += 1) {
    const mid = (low + high) / 2;
    if (contrastRatio(oklch(mid, fg.c, fg.h, fg.alpha), bg) >= target) high = mid;
    else low = mid;
  }
  return oklch(high, fg.c, fg.h, fg.alpha);
}

/**
 * Smallest lightness change to `fg` (keeping hue and chroma) that reaches `target`.
 * Returns null when it already passes or nothing works.
 */
export function suggestForeground(fg: Oklch, bg: Oklch, target = 4.5): Oklch | null {
  if (contrastRatio(fg, bg) >= target) return null;
  const candidates = [searchLightness(fg, bg, target, 0), searchLightness(fg, bg, target, 1)].filter(
    (candidate): candidate is Oklch => candidate !== null,
  );
  candidates.sort((a, b) => Math.abs(a.l - fg.l) - Math.abs(b.l - fg.l));
  return candidates[0] ?? null;
}
