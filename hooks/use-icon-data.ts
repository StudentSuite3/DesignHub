"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchIcons } from "@/lib/icons/iconify";
import type { IconData, IconId } from "@/types/icons";

type LoadState = {
  key: string;
  icons: Map<IconId, IconData>;
  failed: Set<IconId>;
  error: boolean;
  done: boolean;
};

const empty: LoadState = { key: "", icons: new Map(), failed: new Set(), error: false, done: false };

/** Icon bodies for a list of ids, filled in progressively as each collection responds. */
export function useIconData(ids: IconId[]) {
  const key = ids.join(",");
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<LoadState>(empty);

  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    setState((current) => (current.key === key ? { ...current, error: false, done: false } : { ...empty, key }));
    fetchIcons(key.split(",") as IconId[], {
      signal: controller.signal,
      onProgress: (icons) => setState((current) => ({ ...current, key, icons })),
    })
      .then(({ icons, failed }) => setState({ key, icons, failed: new Set(failed), error: false, done: true }))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setState((current) => ({ ...current, key, error: true, done: true }));
      });
    return () => controller.abort();
  }, [key, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  const current = state.key === key;
  // A new id list counts as loading from the very first render.
  const loading = Boolean(key) && (!current || !state.done);

  return {
    icons: current ? state.icons : new Map<IconId, IconData>(),
    failed: current ? state.failed : new Set<IconId>(),
    loading,
    error: current && state.error,
    retry,
  };
}

export function useIcon(id: IconId): IconData | undefined {
  const { icons } = useIconData([id]);
  return icons.get(id);
}
