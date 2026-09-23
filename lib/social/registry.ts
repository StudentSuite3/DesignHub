import { githubBanner } from "@/lib/social/templates/github-banner";
import { linkedinCover } from "@/lib/social/templates/linkedin-cover";
import type { SocialPlatform, SocialTemplate } from "@/lib/social/types";

/** Templates register here as they are implemented. */
export const socialTemplates: SocialTemplate[] = [githubBanner, linkedinCover];

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
