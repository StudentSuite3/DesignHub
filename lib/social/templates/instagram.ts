import { logo, mockupDoc, onPrimaryLarge, text } from "@/lib/mockups/kit";
import { glowBackdrop, gradientBackdrop, heading, lockup, pill } from "@/lib/social/templates/shared";
import type { SocialTemplate } from "@/lib/social/types";

export const instagramSquare: SocialTemplate = {
  id: "instagram-square",
  platform: "Instagram",
  label: "Square post",
  width: 1080,
  height: 1080,
  description: "Feed post, 1080 × 1080. The profile grid shows a 3:4 center crop.",
  safe: { x: 90, y: 90, width: 900, height: 900 },
  render(ctx) {
    const { surface, content } = ctx;
    const W = 1080;
    const pad = 110;
    const title = heading(ctx, content.headline, pad, 470, W - pad * 2, 96, surface.text, { maxLines: 4 });
    const body = `${glowBackdrop(ctx, W, W, 54)}
      ${lockup(ctx, pad, 170, 56, undefined, "ig-lockup")}
      ${title.markup}
      <rect x="${pad}" y="${title.bottom + 60}" width="120" height="10" rx="5" fill="${surface.primary}"/>
      ${text(pad, title.bottom + 136, content.subtitle, { size: 34, fill: surface.muted })}
      ${text(pad, W - pad, content.handle, { size: 32, fill: surface.text, font: "bb" })}
      ${text(W - pad, W - pad, content.website, { size: 32, fill: surface.primary, font: "bb", anchor: "end" })}`;
    return mockupDoc(ctx, W, W, body);
  },
};

export const instagramStory: SocialTemplate = {
  id: "instagram-story",
  platform: "Instagram",
  label: "Story",
  width: 1080,
  height: 1920,
  description: "Story and Reel cover, 1080 × 1920. Keep 250 px clear at the top and 340 px at the bottom.",
  safe: { x: 64, y: 250, width: 952, height: 1330 },
  covered: [
    { x: 0, y: 0, width: 1080, height: 200 },
    { x: 0, y: 1620, width: 1080, height: 300 },
  ],
  render(ctx) {
    const { surface, content } = ctx;
    const W = 1080;
    const H = 1920;
    const on = onPrimaryLarge(ctx);
    const title = heading(ctx, content.headline, W / 2, 880, W - 200, 104, on, { maxLines: 4, anchor: "middle" });
    const cta = content.cta.trim();
    const ctaWidth = cta ? ctx.measure(cta, ctx.brand.typography.body, 600, 40) + 88 : 0;
    const ctaY = 1360;
    const body = `${gradientBackdrop(ctx, W, H)}
      ${logo(ctx, { x: W / 2 - 110, y: 380, width: 220, height: 220 }, on, "story-mark")}
      ${text(W / 2, 700, ctx.brand.name.toUpperCase(), { size: 36, fill: on, font: "bb", anchor: "middle", spacing: 10, opacity: 0.85 })}
      ${title.markup}
      ${text(W / 2, title.bottom + 110, content.subtitle, { size: 40, fill: on, anchor: "middle", opacity: 0.85 })}
      ${
        cta
          ? pill(ctx, W / 2 - ctaWidth / 2, ctaY, cta, 40, { fill: on, text: surface.primary }).markup
          : ""
      }
      ${text(W / 2, 1540, content.handle, { size: 34, fill: on, font: "bb", anchor: "middle", opacity: 0.9 })}`;
    return mockupDoc(ctx, W, H, body);
  },
};
