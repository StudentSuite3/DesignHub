import { logo, mockupDoc, onPrimaryLarge, text } from "@/lib/mockups/kit";
import { glowBackdrop, heading, lockup, pill } from "@/lib/social/templates/shared";
import type { SocialTemplate } from "@/lib/social/types";

const W = 1280;
const H = 640;

export const githubBanner: SocialTemplate = {
  id: "github-banner",
  platform: "GitHub",
  label: "Repository banner",
  width: W,
  height: H,
  description: "Social preview and README header. GitHub recommends 1280 × 640.",
  safe: { x: 40, y: 40, width: W - 80, height: H - 80 },
  render(ctx) {
    const { surface, content } = ctx;
    const pad = 80;
    const title = heading(ctx, content.headline, pad, 300, W * 0.56, 64, surface.text, { maxLines: 3 });
    const subtitleY = title.bottom + 64;
    const cta = pill(ctx, pad, H - pad - 58, content.website, 22, {
      fill: surface.primary,
      text: onPrimaryLarge(ctx),
    });
    const body = `${glowBackdrop(ctx, W, H, 40)}
      ${lockup(ctx, pad, 124, 48, undefined, "gh-lockup")}
      ${title.markup}
      ${text(pad, subtitleY, content.subtitle, { size: 26, fill: surface.muted })}
      ${cta.markup}
      ${text(pad + cta.width + 24, H - pad - 21, content.handle, { size: 22, fill: surface.muted, font: "bb" })}
      <g opacity=".95">${logo(ctx, { x: W - 380, y: H / 2 - 150, width: 300, height: 300 }, undefined, "gh-mark")}</g>`;
    return mockupDoc(ctx, W, H, body);
  },
};
