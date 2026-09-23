import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { indexedDbStorage } from "@/lib/db";
import type { BrandProfile, BrandVoice, ColorRole } from "@/types/brand";

export const defaultVoice: BrandVoice = {
  personality: ["Clear", "Confident", "Warm"],
  dos: ["Lead with the benefit", "Use plain words", "Write like you talk"],
  donts: ["Jargon without a reason", "Exclamation marks everywhere", "Passive voice"],
  sample: "We build tools that get out of your way, so you can do the best work of your life.",
};

export const defaultProfile: BrandProfile = {
  name: "Acme",
  description: "Design tools for people who ship.",
  logoSvg: null,
  roles: {},
  voice: defaultVoice,
};

type BrandState = {
  profile: BrandProfile;
  updateProfile: (patch: Partial<BrandProfile>) => void;
  setRole: (swatchId: string, role: ColorRole | null) => void;
  updateVoice: (patch: Partial<BrandVoice>) => void;
  /** Replaces the whole profile (used when switching local brand projects). */
  replaceProfile: (profile: BrandProfile) => void;
};

export const useBrandStore = create<BrandState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      updateProfile: (patch) => set((state) => ({ profile: { ...state.profile, ...patch } })),
      setRole: (swatchId, role) =>
        set((state) => {
          const roles = { ...state.profile.roles };
          if (role) roles[swatchId] = role;
          else delete roles[swatchId];
          return { profile: { ...state.profile, roles } };
        }),
      updateVoice: (patch) =>
        set((state) => ({ profile: { ...state.profile, voice: { ...state.profile.voice, ...patch } } })),
      replaceProfile: (profile) => set({ profile }),
    }),
    { name: "designhub:brand", version: 1, storage: createJSONStorage(() => indexedDbStorage) },
  ),
);
