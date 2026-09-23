import { localProvider } from "@/lib/brand-dna/providers/local";
import { mockAiProvider } from "@/lib/brand-dna/providers/mock-ai";
import type { BrandDnaProvider } from "@/lib/brand-dna/types";

/** Add a provider here (for example one that calls a vision model) and it appears in the UI. */
export const dnaProviders: BrandDnaProvider[] = [localProvider, mockAiProvider];

export function getDnaProvider(id: string): BrandDnaProvider {
  return dnaProviders.find((provider) => provider.id === id) ?? localProvider;
}
