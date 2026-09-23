import type { SocialPlatform, SocialTemplate } from "@/lib/social/types";

/** Templates register here as they are implemented. */
export const socialTemplates: SocialTemplate[] = [];

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
