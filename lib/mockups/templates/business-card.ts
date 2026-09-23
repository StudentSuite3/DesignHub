import { desk, logo, mockupDoc, onPrimaryLarge, rotate, text } from "@/lib/mockups/kit";
import type { MockupTemplate } from "@/lib/mockups/types";

const W = 700;
const H = 400;

export const businessCard: MockupTemplate = {
  id: "business-card",
  label: "Business card",
  category: "Print",
  description: "Front and back, 3.5 × 2 in, on a desk.",
  render(ctx) {
    const { surface, content, brand } = ctx;
    const r = Math.min(brand.radius, 24);
    const onPrimary = onPrimaryLarge(ctx);
    const front = `<g filter="url(#soft)"><rect width="${W}" height="${H}" rx="${r}" fill="${surface.primary}"/></g>
      ${logo(ctx, { x: W / 2 - 60, y: H / 2 - 88, width: 120, height: 120 }, onPrimary, "front")}
      ${text(W / 2, H / 2 + 88, brand.name, { size: 38, fill: onPrimary, font: "h", anchor: "middle" })}`;

    const back = `<g filter="url(#soft)"><rect width="${W}" height="${H}" rx="${r}" fill="${surface.background}"/></g>
      <clipPath id="card-clip"><rect width="${W}" height="${H}" rx="${r}"/></clipPath>
      <rect x="0" y="${H - 14}" width="${W}" height="14" fill="${surface.primary}" clip-path="url(#card-clip)"/>
      ${logo(ctx, { x: 48, y: 48, width: 56, height: 56 }, undefined, "back")}
      ${text(120, 88, brand.name, { size: 26, fill: surface.text, font: "h" })}
      ${text(48, 212, content.person, { size: 30, fill: surface.text, font: "bb" })}
      ${text(48, 246, content.role, { size: 19, fill: surface.muted })}
      ${text(48, 300, content.email, { size: 18, fill: surface.text })}
      ${text(48, 328, content.phone, { size: 18, fill: surface.text })}
      ${text(W - 48, 328, content.website, { size: 18, fill: surface.primaryText, font: "bb", anchor: "end" })}`;

    const width = 1600;
    const height = 1000;
    return mockupDoc(
      ctx,
      width,
      height,
      `${desk(ctx, width, height)}
      <g transform="translate(130 150)">${rotate(-6, W / 2, H / 2, front)}</g>
      <g transform="translate(770 430)">${rotate(4, W / 2, H / 2, back)}</g>`,
    );
  },
};
