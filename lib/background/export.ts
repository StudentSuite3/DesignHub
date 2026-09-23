import { getGenerator, renderBackgroundSvg } from "@/lib/background/registry";
import type { BackgroundSettings } from "@/types/background";

function svgDataUri(svg: string): string {
  // Only the characters that break a CSS url("…") need escaping; the rest stays readable-ish and small.
  const encoded = svg
    .replace(/"/g, "'")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/\s+/g, " ");
  return `url("data:image/svg+xml,${encoded}")`;
}

/** A ready-to-paste CSS rule. Native CSS when the generator supports it, an inline SVG otherwise. */
export function backgroundCss(settings: BackgroundSettings, selector = ".background"): string {
  const native = getGenerator(settings.kind)?.css?.(settings);
  if (native) return `${selector} {\n${native}\n}\n`;
  return `${selector} {\n  background-color: ${settings.background};\n  background-image: ${svgDataUri(renderBackgroundSvg(settings))};\n  background-size: cover;\n  background-position: center;\n}\n`;
}
