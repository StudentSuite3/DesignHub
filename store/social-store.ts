import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { indexedDbStorage } from "@/lib/db";
import type { SocialContent } from "@/lib/social/types";
import type { BrandMode } from "@/types/brand";

/** Empty fields fall back to values derived from the brand (see useSocialContext). */
export const defaultSocialContent: SocialContent = {
  headline: "",
  subtitle: "Open source. Local first. Free forever.",
  handle: "",
  website: "",
  cta: "Try it free",
};

type SocialState = {
  template: string;
  mode: BrandMode;
  content: SocialContent;
  safeArea: boolean;
  scale: number;
  setTemplate: (template: string) => void;
  setMode: (mode: BrandMode) => void;
  setContent: (patch: Partial<SocialContent>) => void;
  setSafeArea: (safeArea: boolean) => void;
  setScale: (scale: number) => void;
};

export const useSocialStore = create<SocialState>()(
  persist(
    (set) => ({
      template: "github-banner",
      mode: "dark",
      content: defaultSocialContent,
      safeArea: false,
      scale: 1,
      setTemplate: (template) => set({ template }),
      setMode: (mode) => set({ mode }),
      setContent: (patch) => set((state) => ({ content: { ...state.content, ...patch } })),
      setSafeArea: (safeArea) => set({ safeArea }),
      setScale: (scale) => set({ scale }),
    }),
    { name: "designhub:social", version: 1, storage: createJSONStorage(() => indexedDbStorage) },
  ),
);
