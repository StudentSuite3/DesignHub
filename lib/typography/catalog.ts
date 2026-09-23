import type { FontCategory, FontFamily } from "@/types/typography";

const categories: readonly FontCategory[] = ["sans-serif", "serif", "display", "handwriting", "monospace"];

function isFontFamily(value: unknown): value is FontFamily {
  if (typeof value !== "object" || value === null) return false;
  const font = value as Record<string, unknown>;
  return (
    typeof font.family === "string" &&
    typeof font.category === "string" &&
    categories.includes(font.category as FontCategory) &&
    Array.isArray(font.weights)
  );
}

let cache: Promise<FontFamily[]> | null = null;

/** Lazily loads the bundled Google Fonts catalog (code-split, ~13 KB gzipped). */
export function loadFontCatalog(): Promise<FontFamily[]> {
  cache ??= import("./catalog.json").then((module) => {
    const data: unknown = module.default;
    return Array.isArray(data) ? data.filter(isFontFamily) : [];
  });
  return cache;
}

export function isVariableFont(font: FontFamily): boolean {
  return Boolean(font.axes?.length);
}

export const fontCategoryLabels: Record<FontCategory, string> = {
  "sans-serif": "Sans serif",
  serif: "Serif",
  display: "Display",
  handwriting: "Handwriting",
  monospace: "Monospace",
};

export { categories as fontCategories };
