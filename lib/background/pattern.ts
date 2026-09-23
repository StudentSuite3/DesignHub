import { r1 } from "@/lib/background/random";
import { wrapSvg } from "@/lib/background/svg";
import type { BackgroundSettings } from "@/types/background";

/** Fills the canvas with a repeating tile. Rotation is handled by `wrapSvg`. */
export function patternSvg(settings: BackgroundSettings, tileWidth: number, tileHeight: number, tile: string): string {
  const defs = `<pattern id="tile" width="${r1(tileWidth)}" height="${r1(tileHeight)}" patternUnits="userSpaceOnUse">${tile}</pattern>`;
  return wrapSvg(settings, `<rect width="${settings.width}" height="${settings.height}" fill="url(#tile)"/>`, defs);
}

/** Tile spacing in px: density 0 → sparse, 100 → tight. */
export function spacingFor(density: number, scale: number, sparse = 72, tight = 12): number {
  return Math.max(4, (sparse - (density / 100) * (sparse - tight)) * scale);
}

export function cssRotationNote(settings: BackgroundSettings): string {
  return settings.rotation % 360
    ? "\n  /* CSS patterns can't be rotated; use the SVG export for the rotated version. */"
    : "";
}
