import type { CssDeclaration, EffectCss } from "@/types/effects";

export function cssRule(selector: string, declarations: CssDeclaration[]): string {
  const body = declarations.map(({ property, value }) => `  ${property}: ${value};`).join("\n");
  return `${selector} {\n${body}\n}\n`;
}

/** Full stylesheet for an effect: the main rule plus any pseudo-element / keyframe rules. */
export function effectStylesheet(effect: EffectCss, selector: string): string {
  const extra = effect.extra?.(selector);
  return extra
    ? `${cssRule(selector, effect.declarations)}\n${extra.trim()}\n`
    : cssRule(selector, effect.declarations);
}

/** Tailwind arbitrary-value syntax: spaces become underscores, literal underscores are escaped. */
export function tailwindValue(value: string): string {
  return value
    .replace(/_/g, "\\_")
    .replace(/\s*,\s*/g, ",")
    .replace(/\s+/g, "_");
}

/** Arbitrary properties (`[backdrop-filter:blur(12px)]`) work for any declaration in Tailwind v3.2+ and v4. */
export function tailwindClasses(declarations: CssDeclaration[]): string {
  return declarations
    .filter(({ property }) => !property.startsWith("-webkit-"))
    .map(({ property, value }) => `[${property}:${tailwindValue(value)}]`)
    .join(" ");
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.replace(/./g, (char) => char + char) : clean.slice(0, 6);
  const value = Number.parseInt(full, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgb(${r} ${g} ${b} / ${Math.round(alpha * 1000) / 1000})`;
}

export const px = (value: number) => (value === 0 ? "0" : `${Math.round(value * 100) / 100}px`);
