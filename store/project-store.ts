import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { indexedDbStorage } from "@/lib/db";

/** Which local project the live stores belong to. The projects themselves live in Dexie. */
type ProjectState = {
  activeId: string | null;
  setActive: (activeId: string | null) => void;
};

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      activeId: null,
      setActive: (activeId) => set({ activeId }),
    }),
    { name: "designhub:project", version: 1, storage: createJSONStorage(() => indexedDbStorage) },
  ),
);
