"use client";

import { useEffect, useState } from "react";

import { fetchIcons } from "@/lib/icons/iconify";
import type { IconData, IconId } from "@/types/icons";

/** Batched, cached icon bodies for a list of ids. */
export function useIconData(ids: IconId[]) {
  const [icons, setIcons] = useState<Map<IconId, IconData>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const key = ids.join(",");

  useEffect(() => {
    if (!key) {
      setIcons(new Map());
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetchIcons(key.split(",") as IconId[], controller.signal)
      .then((result) => setIcons(result))
      .catch((reason: unknown) => {
        if (!(reason instanceof DOMException && reason.name === "AbortError")) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [key]);

  return { icons, loading, error };
}

export function useIcon(id: IconId): IconData | undefined {
  const { icons } = useIconData([id]);
  return icons.get(id);
}
