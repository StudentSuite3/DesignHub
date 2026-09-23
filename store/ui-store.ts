import { create } from "zustand";

type UiState = {
  commandOpen: boolean;
  commandQuery: string;
  shortcutsOpen: boolean;
  openCommand: (query?: string) => void;
  setCommandOpen: (open: boolean) => void;
  setCommandQuery: (query: string) => void;
  setShortcutsOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>()((set) => ({
  commandOpen: false,
  commandQuery: "",
  shortcutsOpen: false,
  openCommand: (query = "") => set({ commandOpen: true, commandQuery: query }),
  setCommandOpen: (open) => set(open ? { commandOpen: true } : { commandOpen: false, commandQuery: "" }),
  setCommandQuery: (query) => set({ commandQuery: query }),
  setShortcutsOpen: (open) => set({ shortcutsOpen: open }),
}));
