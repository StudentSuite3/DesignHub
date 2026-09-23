import { coverPage, introductionPage, voicePage } from "@/lib/guidelines/pages/intro";
import { clearSpacePage, incorrectUsagePage, logoUsagePage, minimumSizePage } from "@/lib/guidelines/pages/logo";
import type { GuidelinePage } from "@/lib/guidelines/types";

/** Pages in book order. Logo, color, type and token pages register here as they are implemented. */
export const guidelinePages: GuidelinePage[] = [
  coverPage,
  introductionPage,
  logoUsagePage,
  clearSpacePage,
  minimumSizePage,
  incorrectUsagePage,
  voicePage,
];

export function getGuidelinePage(id: string): GuidelinePage | undefined {
  return guidelinePages.find((page) => page.id === id);
}
