import type { FontCategory, OpenTypeSettings } from "@/types/typography";

const fallbacks: Record<FontCategory, string> = {
  "sans-serif": "ui-sans-serif, system-ui, sans-serif",
  serif: "ui-serif, Georgia, serif",
  display: "ui-sans-serif, system-ui, sans-serif",
  handwriting: "cursive",
  monospace: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

export function fontStack(family: string, category: FontCategory = "sans-serif"): string {
  return `"${family}", ${fallbacks[category]}`;
}

/** Only emits features that differ from the browser default (`liga` and `kern` on). */
export function openTypeFeatureSettings(settings: OpenTypeSettings): string {
  const entries = Object.entries(settings) as [keyof OpenTypeSettings, boolean][];
  const parts = entries
    .filter(([tag, enabled]) => (tag === "liga" || tag === "kern" ? !enabled : enabled))
    .map(([tag, enabled]) => `"${tag}" ${enabled ? 1 : 0}`);
  return parts.length ? parts.join(", ") : "normal";
}

export function fontVariationSettings(axes: Record<string, number>): string {
  const parts = Object.entries(axes)
    .filter(([tag]) => tag !== "wght")
    .map(([tag, value]) => `"${tag}" ${value}`);
  return parts.length ? parts.join(", ") : "normal";
}
