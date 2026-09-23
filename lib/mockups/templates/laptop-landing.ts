import { lines, logo, mockupDoc, onPrimaryLarge, text, wrap } from "@/lib/mockups/kit";
import { laptop, studio } from "@/lib/mockups/templates/devices";
import type { MockupContext, MockupTemplate } from "@/lib/mockups/types";

const SW = 1440;
const SH = 900;

export function landingPage(ctx: MockupContext, width: number, height: number): string {
  const { surface, content, brand } = ctx;
  const onPrimary = onPrimaryLarge(ctx);
  const r = Math.min(brand.radius, 20);
  const pad = 96;
  const measureBody = (value: string, size: number) => ctx.measure(value, brand.typography.body, 600, size);

  const nav = ["Product", "Pricing", "Docs", "Company"];
  let navX = width / 2 - 200;
  const navLinks = nav
    .map((item) => {
      const out = text(navX, 64, item, { size: 17, fill: surface.muted });
      navX += measureBody(item, 17) + 40;
      return out;
    })
    .join("");
  const cta = content.cta || "Get started";
  const ctaW = measureBody(cta, 19) + 56;

  const size = 72;
  const headline = wrap(ctx, content.headline, width * 0.46, size, "h", 3);
  const heroTop = 250;
  const title = headline
    .map((line, i) => text(pad, heroTop + i * size * 1.08, line, { size, fill: surface.text, font: "h" }))
    .join("");
  const afterTitle = heroTop + (headline.length - 1) * size * 1.08 + 70;
  const sub = wrap(ctx, `${brand.name} helps teams move from idea to launch with one consistent system.`, width * 0.4, 22, "b", 3);
  const subText = sub
    .map((line, i) => text(pad, afterTitle + i * 34, line, { size: 22, fill: surface.muted }))
    .join("");
  const btnY = afterTitle + sub.length * 34 + 30;

  const cardX = width * 0.56;
  const cardW = width - cardX - pad;
  const hero = `<rect x="${cardX}" y="150" width="${cardW}" height="440" rx="${r + 6}" fill="url(#hero)"/>
    <rect x="${cardX + 40}" y="200" width="${cardW - 80}" height="340" rx="${r}" fill="${surface.background}" fill-opacity=".94"/>
    ${logo(ctx, { x: cardX + 72, y: 236, width: 44, height: 44 }, undefined, "lp-card")}
    ${text(cardX + 132, 267, brand.name, { size: 22, fill: surface.text, font: "h" })}
    ${lines(cardX + 72, 318, cardW - 144, 3, 26, surface.border)}
    <rect x="${cardX + 72}" y="420" width="${(cardW - 160) / 2}" height="84" rx="${r}" fill="${surface.secondary}" fill-opacity=".14"/>
    <rect x="${cardX + 88 + (cardW - 160) / 2}" y="420" width="${(cardW - 160) / 2}" height="84" rx="${r}" fill="${surface.primary}" fill-opacity=".14"/>`;

  const features = ["Consistent", "Accessible", "Local first"];
  const fw = (width - pad * 2 - 48) / 3;
  const featureCards = features
    .map((label, i) => {
      const x = pad + i * (fw + 24);
      return `<rect x="${x}" y="660" width="${fw}" height="190" rx="${r}" fill="${surface.surface}" stroke="${surface.border}"/>
        <rect x="${x + 28}" y="688" width="44" height="44" rx="${Math.min(r, 12)}" fill="${i === 1 ? surface.secondary : surface.primary}" fill-opacity=".16"/>
        <circle cx="${x + 50}" cy="710" r="8" fill="${i === 1 ? surface.secondary : surface.primary}"/>
        ${text(x + 28, 772, label, { size: 22, fill: surface.text, font: "h" })}
        ${lines(x + 28, 796, fw - 56, 2, 24, surface.border)}`;
    })
    .join("");

  return `<defs><linearGradient id="hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${surface.primary}"/><stop offset="1" stop-color="${surface.secondary}"/></linearGradient></defs>
    <rect width="${width}" height="${height}" fill="${surface.background}"/>
    ${logo(ctx, { x: pad, y: 40, width: 36, height: 36 }, undefined, "lp-nav")}
    ${text(pad + 50, 66, brand.name, { size: 22, fill: surface.text, font: "h" })}
    ${navLinks}
    <rect x="${width - pad - ctaW}" y="34" width="${ctaW}" height="48" rx="${Math.min(r, 24)}" fill="${surface.primary}"/>
    ${text(width - pad - ctaW / 2, 65, cta, { size: 19, fill: onPrimary, font: "bb", anchor: "middle" })}
    <rect y="112" width="${width}" height="1" fill="${surface.border}"/>
    ${text(pad, 190, `NEW  ·  ${brand.name.toUpperCase()} 2.0`, { size: 15, fill: surface.primary, font: "bb", spacing: 3 })}
    ${title}
    ${subText}
    <rect x="${pad}" y="${btnY}" width="${ctaW + 20}" height="60" rx="${Math.min(r, 30)}" fill="${surface.primary}"/>
    ${text(pad + (ctaW + 20) / 2, btnY + 38, cta, { size: 19, fill: onPrimary, font: "bb", anchor: "middle" })}
    <rect x="${pad + ctaW + 40}" y="${btnY}" width="170" height="60" rx="${Math.min(r, 30)}" fill="none" stroke="${surface.border}" stroke-width="2"/>
    ${text(pad + ctaW + 125, btnY + 38, "Learn more", { size: 19, fill: surface.text, font: "bb", anchor: "middle" })}
    ${hero}
    ${featureCards}`;
}

export const laptopLanding: MockupTemplate = {
  id: "laptop-landing",
  label: "Landing page",
  category: "Screens",
  description: "Marketing site on a laptop.",
  render(ctx) {
    const width = 1900;
    const height = 1300;
    const x = (width - (SW + 52)) / 2;
    return mockupDoc(ctx, width, height, `${studio(ctx, width, height)}${laptop(x, 150, SW, SH, landingPage(ctx, SW, SH))}`);
  },
};
