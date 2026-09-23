"use client";

import { useEffect, useState } from "react";

import { getPaper, loadPaper } from "@/lib/background/paper";

/** Loads Paper.js when `enabled`; returns true once generators can use it. */
export function usePaper(enabled: boolean): boolean {
  const [ready, setReady] = useState(() => getPaper() !== null);

  useEffect(() => {
    if (!enabled || ready) return;
    let cancelled = false;
    loadPaper()
      .then(() => !cancelled && setReady(true))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [enabled, ready]);

  return ready;
}
