import { desk, escapeXml, logo, mockupDoc, onPrimaryLarge, rotate, text } from "@/lib/mockups/kit";
import type { MockupTemplate } from "@/lib/mockups/types";

export const sticker: MockupTemplate = {
  id: "sticker",
  label: "Stickers",
  category: "Print",
  description: "Die-cut round and badge stickers.",
  render(ctx) {
    const { surface, content, brand } = ctx;
    const onPrimary = onPrimaryLarge(ctx);
    const r = 260;
    // Repeat the label until it wraps the whole ring, then stretch it to close the loop exactly.
    const unit = `${brand.name}  ·  ${content.website}  ·  `.toUpperCase();
    const ring = 2 * Math.PI * (r - 36);
    const unitWidth = Math.max(1, ctx.measure(unit, brand.typography.body, 600, 26) + unit.length * 5);
    const label = unit.repeat(Math.max(1, Math.round(ring / unitWidth)));

    const round = `<circle cx="0" cy="0" r="${r + 18}" fill="#ffffff" filter="url(#soft)"/>
      <circle cx="0" cy="0" r="${r}" fill="${surface.primary}"/>
      <circle cx="0" cy="0" r="${r - 64}" fill="none" stroke="${onPrimary}" stroke-opacity=".35" stroke-width="2"/>
      <path id="ring" d="M ${-(r - 36)} 0 A ${r - 36} ${r - 36} 0 1 1 ${r - 36} 0 A ${r - 36} ${r - 36} 0 1 1 ${-(r - 36)} 0" fill="none"/>
      <text class="bb" font-size="26" letter-spacing="5" fill="${onPrimary}"><textPath href="#ring" startOffset="0" textLength="${ring.toFixed(1)}" lengthAdjust="spacing">${escapeXml(label)}</textPath></text>
      ${logo(ctx, { x: -88, y: -88, width: 176, height: 176 }, onPrimary, "st-round")}`;

    const bw = 520;
    const bh = 300;
    const badge = `<rect x="-14" y="-14" width="${bw + 28}" height="${bh + 28}" rx="${bh / 2 + 14}" fill="#ffffff" filter="url(#soft)"/>
      <rect width="${bw}" height="${bh}" rx="${bh / 2}" fill="${ctx.mode === "dark" ? surface.surface : surface.background}"/>
      ${logo(ctx, { x: 58, y: bh / 2 - 60, width: 120, height: 120 }, undefined, "st-badge")}
      ${text(200, bh / 2 + 16, brand.name, { size: 50, fill: surface.text, font: "h" })}`;

    const width = 1600;
    const height = 1000;
    return mockupDoc(
      ctx,
      width,
      height,
      `${desk(ctx, width, height)}
      <g transform="translate(500 500)">${rotate(-12, 0, 0, round)}</g>
      <g transform="translate(880 520)">${rotate(8, bw / 2, bh / 2, badge)}</g>`,
    );
  },
};
