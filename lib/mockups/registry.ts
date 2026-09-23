import type { MockupTemplate } from "@/lib/mockups/types";

/** Templates register here as they are implemented. */
export const mockupTemplates: MockupTemplate[] = [];

export function getTemplate(id: string): MockupTemplate | undefined {
  return mockupTemplates.find((template) => template.id === id);
}
