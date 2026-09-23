import { logo, mockupDoc, onPrimaryLarge, text, wrap } from "@/lib/mockups/kit";
import type { MockupTemplate } from "@/lib/mockups/types";

const PW = 900;
const PH = 1200;

export const poster: MockupTemplate = {
  id: "poster",
  label: "Poster",
  category: "Print",
  description: "18 × 24 in poster on a wall.",
  render(ctx) {
    const { surface, content, brand, mode } = ctx;
    const onPrimary = onPrimaryLarge(ctx);
    const pad = 80;
    const size = 92;
    const headline = wrap(ctx, content.headline, PW - pad * 2, size, "h", 4);
    const top = 560;
    const title = headline
      .map((line, i) => text(pad, top + i * size * 1.05, line, { size, fill: onPrimary, font: "h" }))
      .join("");
    const cta = content.cta.trim();
    const ctaWidth = cta ? ctx.measure(cta, brand.typography.body, 600, 26) + 72 : 0;
    const ctaY = top + headline.length * size * 1.05 + 40;

    const defs = `<linearGradient id="poster-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${surface.primary}"/><stop offset="1" stop-color="${surface.secondary}"/></linearGradient>
      <radialGradient id="wall" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="${mode === "light" ? "#f2f0ec" : "#1c1d22"}"/><stop offset="1" stop-color="${mode === "light" ? "#d9d5ce" : "#0c0d10"}"/></radialGradient>`;

    const page = `<rect width="${PW}" height="${PH}" fill="url(#poster-bg)" filter="url(#soft)"/>
      <circle cx="${PW - 120}" cy="220" r="260" fill="${onPrimary}" fill-opacity=".08"/>
      <circle cx="${PW - 60}" cy="320" r="150" fill="${onPrimary}" fill-opacity=".08"/>
      ${logo(ctx, { x: pad, y: pad, width: 110, height: 110 }, onPrimary, "poster")}
      ${text(pad, 470, brand.name.toUpperCase(), { size: 26, fill: onPrimary, font: "bb", spacing: 6, opacity: 0.8 })}
      ${title}
      ${cta ? `<rect x="${pad}" y="${ctaY}" width="${ctaWidth}" height="72" rx="36" fill="${onPrimary}"/>${text(pad + ctaWidth / 2, ctaY + 45, cta, { size: 26, fill: surface.primary, font: "bb", anchor: "middle" })}` : ""}
      ${text(pad, PH - pad, content.website, { size: 24, fill: onPrimary, font: "bb", opacity: 0.85 })}`;

    const width = 1400;
    const height = 1700;
    return mockupDoc(
      ctx,
      width,
      height,
      `<rect width="${width}" height="${height}" fill="url(#wall)"/>
      <g transform="translate(${(width - PW) / 2} ${(height - PH) / 2 - 20})">${page}</g>`,
      defs,
    );
  },
};
