import { brandDomain } from "@/lib/brand/domain";
import type { SocialContent } from "@/lib/social/types";
import type { BrandTokens } from "@/types/brand";

/** Fills empty fields from the brand, so every asset has sensible copy out of the box. */
export function resolveSocialContent(content: SocialContent, brand: BrandTokens): SocialContent {
  const handle = content.handle.trim() || brand.name.toLowerCase().replace(/[^a-z0-9_]+/g, "");
  return {
    ...content,
    headline: content.headline.trim() || brand.description || brand.name,
    handle: handle.startsWith("@") ? handle : `@${handle}`,
    website: content.website.trim() || brandDomain(brand.name),
  };
}
