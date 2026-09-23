import { githubBanner } from "@/lib/social/templates/github-banner";
import { instagramSquare, instagramStory } from "@/lib/social/templates/instagram";
import { linkedinCover } from "@/lib/social/templates/linkedin-cover";
import { ogTemplates } from "@/lib/social/templates/open-graph";
import { productHuntGallery, youtubeThumbnail } from "@/lib/social/templates/product-hunt";
import { xBanner } from "@/lib/social/templates/x-banner";
import type { SocialPlatform, SocialTemplate } from "@/lib/social/types";

/** Templates register here as they are implemented. */
export const socialTemplates: SocialTemplate[] = [
  githubBanner,
  linkedinCover,
  xBanner,
  instagramSquare,
  instagramStory,
  ...ogTemplates,
  productHuntGallery,
  youtubeThumbnail,
];

export const socialPlatforms: SocialPlatform[] = [
  "GitHub",
  "LinkedIn",
  "X",
  "Instagram",
  "Open Graph",
  "Product Hunt",
  "YouTube",
];

export function getSocialTemplate(id: string): SocialTemplate | undefined {
  return socialTemplates.find((template) => template.id === id);
}
