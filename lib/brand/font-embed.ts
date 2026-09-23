import { googleFontsCssUrl, nearestWeight } from "@/lib/typography/google-fonts";
import type { FontFamily } from "@/types/typography";

const cache = new Map<string, Promise<string>>();

function toBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

/**
 * @font-face rules with the font files inlined as data URLs, so text inside an SVG
 * renders in the brand font even as an <img>, in PNG exports and in PDFs.
 * Only the glyphs in `text` are downloaded. Resolves to "" when offline or on failure.
 */
export function embeddedFontCss(font: FontFamily | undefined, weight: number, text: string): Promise<string> {
  if (!font || typeof window === "undefined") return Promise.resolve("");
  const glyphs = [...new Set(text)].join("") || "A";
  const w = nearestWeight(font, weight);
  const key = `${font.family}|${w}|${glyphs}`;
  const existing = cache.get(key);
  if (existing) return existing;

  const pending = (async () => {
    const response = await fetch(googleFontsCssUrl(font, { weight: w, text: glyphs }));
    if (!response.ok) return "";
    let css = await response.text();
    const urls = [...css.matchAll(/url\((https:[^)]+)\)/g)].map((match) => match[1]!);
    for (const url of urls) {
      const file = await fetch(url);
      if (!file.ok) continue;
      const type = file.headers.get("content-type") ?? "font/woff2";
      css = css.replace(url, `data:${type};base64,${toBase64(await file.arrayBuffer())}`);
    }
    return css;
  })().catch(() => {
    cache.delete(key);
    return "";
  });
  cache.set(key, pending);
  return pending;
}
