import type { FontFamily } from "@/types/typography";

const API = "https://fonts.googleapis.com/css2";

type CssUrlOptions = {
  /** Restrict the download to these glyphs (great for previews). */
  text?: string;
  /** Load only one weight instead of the full range. */
  weight?: number;
};

/** Google requires lowercase axes first, then uppercase, each group alphabetical. */
function sortAxisTags(a: string, b: string): number {
  const aLower = a === a.toLowerCase();
  const bLower = b === b.toLowerCase();
  if (aLower !== bLower) return aLower ? -1 : 1;
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Closest weight the family can actually serve (requesting a missing one is a 400). */
export function nearestWeight(font: FontFamily, weight: number): number {
  const axis = font.axes?.find((item) => item.tag === "wght");
  if (axis) return Math.min(axis.max, Math.max(axis.min, weight));
  return font.weights.reduce(
    (best, candidate) => (Math.abs(candidate - weight) < Math.abs(best - weight) ? candidate : best),
    font.weights[0] ?? 400,
  );
}

function familySpec(font: FontFamily, options: CssUrlOptions): string {
  const name = font.family.replace(/ /g, "+");

  if (options.weight !== undefined) return `${name}:wght@${nearestWeight(font, options.weight)}`;

  if (font.axes?.length) {
    const axes = [...font.axes].sort((a, b) => sortAxisTags(a.tag, b.tag));
    const tags = axes.map((axis) => axis.tag);
    const ranges = axes.map((axis) => (axis.min === axis.max ? `${axis.min}` : `${axis.min}..${axis.max}`));
    if (font.italic) {
      return `${name}:ital,${tags.join(",")}@0,${ranges.join(",")};1,${ranges.join(",")}`;
    }
    return `${name}:${tags.join(",")}@${ranges.join(",")}`;
  }

  if (font.italic) {
    const tuples = [...font.weights.map((w) => `0,${w}`), ...font.weights.map((w) => `1,${w}`)];
    return `${name}:ital,wght@${tuples.join(";")}`;
  }
  return `${name}:wght@${font.weights.join(";")}`;
}

export function googleFontsCssUrl(fonts: FontFamily | FontFamily[], options: CssUrlOptions = {}): string {
  const list = Array.isArray(fonts) ? fonts : [fonts];
  const params = list.map((font) => `family=${familySpec(font, options)}`);
  params.push("display=swap");
  if (options.text) params.push(`text=${encodeURIComponent(options.text)}`);
  return `${API}?${params.join("&")}`;
}

/** Plain `<link>` embed code users can paste into their own projects. */
export function googleFontsEmbed(fonts: FontFamily[]): string {
  const href = googleFontsCssUrl(fonts);
  return [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link href="${href}" rel="stylesheet">`,
  ].join("\n");
}

const injected = new Set<string>();

/** Injects a stylesheet once per URL. Safe to call repeatedly. */
export function injectStylesheet(href: string): void {
  if (typeof document === "undefined" || injected.has(href)) return;
  injected.add(href);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}
