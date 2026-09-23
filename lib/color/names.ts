import type { Oklch } from "@/types/color";

/** Rough, human-friendly hue families used for token names ("blue-500"). */
const hueNames: [number, string][] = [
  [15, "red"],
  [45, "orange"],
  [70, "amber"],
  [100, "yellow"],
  [130, "lime"],
  [155, "green"],
  [175, "emerald"],
  [195, "teal"],
  [215, "cyan"],
  [245, "sky"],
  [265, "blue"],
  [285, "indigo"],
  [305, "violet"],
  [325, "purple"],
  [345, "fuchsia"],
  [360, "pink"],
];

export function hueName(color: Oklch): string {
  if (color.c < 0.03) return color.l > 0.97 ? "white" : color.l < 0.12 ? "black" : "gray";
  return hueNames.find(([limit]) => color.h < limit)?.[1] ?? "red";
}

/** Unique names for a palette: ["blue", "orange", "blue-2"]. */
export function paletteNames(colors: Oklch[]): string[] {
  const counts = new Map<string, number>();
  return colors.map((color) => {
    const base = hueName(color);
    const count = (counts.get(base) ?? 0) + 1;
    counts.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  });
}
