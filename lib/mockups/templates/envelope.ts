import { desk, logo, mockupDoc, onPrimaryLarge, rotate, text } from "@/lib/mockups/kit";
import type { MockupTemplate } from "@/lib/mockups/types";

const W = 1100;
const H = 550;

export const envelope: MockupTemplate = {
  id: "envelope",
  label: "Envelope",
  category: "Print",
  description: "DL envelope, front and flap.",
  render(ctx) {
    const { surface, content, brand } = ctx;
    const onPrimary = onPrimaryLarge(ctx);

    const back = `<rect width="${W}" height="${H}" rx="6" fill="${surface.surface}" filter="url(#soft)"/>
      <path d="M0 6 Q0 0 6 0 H${W - 6} Q${W} 0 ${W} 6 L${W / 2 + 40} ${H * 0.52} Q${W / 2} ${H * 0.58} ${W / 2 - 40} ${H * 0.52} Z" fill="${surface.primary}"/>
      ${logo(ctx, { x: W / 2 - 34, y: H * 0.18, width: 68, height: 68 }, onPrimary, "env-back")}`;

    const front = `<rect width="${W}" height="${H}" rx="6" fill="${surface.background}" filter="url(#soft)"/>
      ${logo(ctx, { x: 56, y: 52, width: 52, height: 52 }, undefined, "env-front")}
      ${text(124, 88, brand.name, { size: 24, fill: surface.text, font: "h" })}
      ${text(56, 138, content.address, { size: 15, fill: surface.muted })}
      <rect x="${W - 156}" y="48" width="100" height="120" rx="4" fill="none" stroke="${surface.border}" stroke-width="2" stroke-dasharray="6 5"/>
      ${text(W - 106, 116, "STAMP", { size: 13, fill: surface.muted, anchor: "middle", spacing: 2 })}
      ${text(W / 2 - 60, 300, "Alex Morgan", { size: 24, fill: surface.text, font: "bb" })}
      ${text(W / 2 - 60, 336, "24 Harbour Lane", { size: 19, fill: surface.text })}
      ${text(W / 2 - 60, 366, "Portland, OR 97205", { size: 19, fill: surface.text })}
      <rect y="${H - 12}" width="${W}" height="12" fill="${surface.primary}"/>`;

    const width = 1600;
    const height = 1100;
    return mockupDoc(
      ctx,
      width,
      height,
      `${desk(ctx, width, height)}
      <g transform="translate(180 110)">${rotate(-5, W / 2, H / 2, back)}</g>
      <g transform="translate(330 470)">${rotate(3, W / 2, H / 2, front)}</g>`,
    );
  },
};
