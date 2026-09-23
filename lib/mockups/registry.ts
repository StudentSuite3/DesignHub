import { businessCard } from "@/lib/mockups/templates/business-card";
import { envelope } from "@/lib/mockups/templates/envelope";
import { letterhead } from "@/lib/mockups/templates/letterhead";
import { poster } from "@/lib/mockups/templates/poster";
import { sticker } from "@/lib/mockups/templates/sticker";
import type { MockupTemplate } from "@/lib/mockups/types";

/** Templates register here as they are implemented. */
export const mockupTemplates: MockupTemplate[] = [businessCard, letterhead, envelope, sticker, poster];

export function getTemplate(id: string): MockupTemplate | undefined {
  return mockupTemplates.find((template) => template.id === id);
}
