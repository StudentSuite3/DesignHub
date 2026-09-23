import type { Rect } from "@/lib/logo/compose";
import type { DrawContext } from "@/lib/mockups/types";

export type SocialContent = {
  headline: string;
  subtitle: string;
  handle: string;
  website: string;
  cta: string;
};

export type SocialContext = DrawContext & { content: SocialContent };

export type SocialPlatform = "GitHub" | "LinkedIn" | "X" | "Instagram" | "Open Graph" | "Product Hunt" | "YouTube";

export type SocialTemplate = {
  id: string;
  platform: SocialPlatform;
  label: string;
  width: number;
  height: number;
  description: string;
  /** Area every platform crop keeps visible. Content should stay inside it. */
  safe: Rect;
  /** Areas covered by platform UI (profile photo, timestamps). */
  covered?: Rect[];
  render: (ctx: SocialContext) => string;
};
