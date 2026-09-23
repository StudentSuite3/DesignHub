import type { VariantContext } from "@/lib/logo/variants";
import type { DrawContext } from "@/lib/mockups/types";
import type { BrandVoice } from "@/types/brand";
import type { DesignTokens } from "@/types/tokens";

export type GuidelineContext = DrawContext & {
  voice: BrandVoice;
  /** The same token set the Export Engine produces. */
  tokens: DesignTokens;
  logo: VariantContext;
  /** Clear space as a fraction of the logo height, from Logo Studio. */
  clearSpace: number;
  /** Month and year shown on the cover; empty until the client has mounted. */
  date: string;
  /** Included pages in order, for the contents list and page numbers. */
  contents: { id: string; title: string; number: number }[];
};

export type GuidelineBase = Omit<GuidelineContext, "contents">;

export type GuidelinePage = {
  id: string;
  title: string;
  description: string;
  render: (ctx: GuidelineContext, number: number) => string;
};

export const PAGE_WIDTH = 1600;
export const PAGE_HEIGHT = 1000;
