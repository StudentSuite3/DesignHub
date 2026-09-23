"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { useHotkey } from "@/hooks/use-hotkeys";
import { useUiStore } from "@/store/ui-store";

// cmdk, Dexie and the font catalog are only needed once someone actually opens the palette.
const CommandPalette = dynamic(() => import("@/components/layout/command-palette").then((m) => m.CommandPalette), {
  ssr: false,
});
const ShortcutsDialog = dynamic(() => import("@/components/layout/shortcuts-dialog").then((m) => m.ShortcutsDialog), {
  ssr: false,
});

/** Registers the global hotkeys eagerly and mounts the heavy overlays on first use. */
export function LazyOverlays() {
  const commandOpen = useUiStore((state) => state.commandOpen);
  const shortcutsOpen = useUiStore((state) => state.shortcutsOpen);
  const openCommand = useUiStore((state) => state.openCommand);
  const setShortcutsOpen = useUiStore((state) => state.setShortcutsOpen);
  const [paletteReady, setPaletteReady] = useState(false);
  const [shortcutsReady, setShortcutsReady] = useState(false);

  const showPalette = paletteReady || commandOpen;
  const showShortcuts = shortcutsReady || shortcutsOpen;

  // Until the real components mount, these bootstrap hotkeys open them.
  useHotkey(
    "mod+k",
    () => {
      setPaletteReady(true);
      openCommand();
    },
    { allowInInputs: true, enabled: !showPalette },
  );
  useHotkey(
    "/",
    () => {
      setPaletteReady(true);
      openCommand();
    },
    { enabled: !showPalette },
  );
  useHotkey(
    "shift+?",
    () => {
      setShortcutsReady(true);
      setShortcutsOpen(true);
    },
    { enabled: !showShortcuts },
  );

  return (
    <>
      {showPalette ? <CommandPalette /> : null}
      {showShortcuts ? <ShortcutsDialog /> : null}
    </>
  );
}
