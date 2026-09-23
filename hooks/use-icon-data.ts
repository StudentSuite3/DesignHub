"use client";

import { useEffect, useState } from "react";

import { fetchIcons } from "@/lib/icons/iconify";
import type { IconData, IconId } from "@/types/icons";

type LoadState = { key: string; icons: Map<IconId, IconData>; error: boolean };

/** Batched, cached icon bodies for a list of ids. */
export function useIconData(ids: IconId[]) {
  const key = ids.join(",");
  const [state, setState] = useState<LoadState>({ key: "", icons: new Map(), error: false });

  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    fetchIcons(key.split(",") as IconId[], controller.signal)
      .then((icons) => setState({ key, icons, error: false }))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setState((current) => ({ ...current, key, error: true }));
      });
    return () => controller.abort();
  }, [key]);

  // Derived rather than stored, so a new id list is "loading" on the very first render.
  const loading = Boolean(key) && state.key !== key;
  return { icons: state.icons, loading, error: !loading && state.error };
}

export function useIcon(id: IconId): IconData | undefined {
  const { icons } = useIconData([id]);
  return icons.get(id);
}
