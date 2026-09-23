import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { indexedDbStorage } from "@/lib/db";
import { effectDefaults } from "@/lib/effects/defaults";
import type { EffectBackdrop, EffectKind, EffectSettingsMap } from "@/types/effects";

type EffectsState = {
  kind: EffectKind;
  backdrop: EffectBackdrop;
  settings: EffectSettingsMap;
  setKind: (kind: EffectKind) => void;
  setBackdrop: (backdrop: EffectBackdrop) => void;
  update: <K extends EffectKind>(kind: K, patch: Partial<EffectSettingsMap[K]>) => void;
  reset: (kind: EffectKind) => void;
};

export const useEffectsStore = create<EffectsState>()(
  persist(
    (set) => ({
      kind: "glass",
      backdrop: "gradient",
      settings: effectDefaults,
      setKind: (kind) => set({ kind }),
      setBackdrop: (backdrop) => set({ backdrop }),
      update: (kind, patch) =>
        set((state) => ({ settings: { ...state.settings, [kind]: { ...state.settings[kind], ...patch } } })),
      reset: (kind) => set((state) => ({ settings: { ...state.settings, [kind]: effectDefaults[kind] } })),
    }),
    {
      name: "designhub:effects",
      version: 1,
      storage: createJSONStorage(() => indexedDbStorage),
      // New effects added later still get their defaults when older saved state is loaded.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<EffectsState>;
        return { ...current, ...saved, settings: { ...current.settings, ...saved.settings } };
      },
    },
  ),
);

/** Settings for one effect, typed by kind. */
export function useEffectSettings<K extends EffectKind>(kind: K): EffectSettingsMap[K] {
  return useEffectsStore((state) => state.settings[kind]);
}
