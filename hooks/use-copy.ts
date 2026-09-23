"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

/** Copies text to the clipboard with a toast. `copied` flips back after 1.5s. */
export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(async (text: string, label = "Copied to clipboard") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      toast.success(label);
      window.setTimeout(() => setCopied((current) => (current === text ? null : current)), 1500);
    } catch {
      toast.error("Clipboard unavailable", { description: "Your browser blocked clipboard access." });
    }
  }, []);

  return { copy, copied };
}
