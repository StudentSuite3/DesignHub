import type { MetadataRoute } from "next";

import { studios } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    ...studios.map((studio) => ({
      url: `${siteConfig.url}${studio.href}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
