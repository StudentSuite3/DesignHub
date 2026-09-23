"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { isTypingTarget } from "@/hooks/use-hotkeys";
import { studios } from "@/lib/navigation";

const SEQUENCE_TIMEOUT = 1000;

/** Linear-style "g then letter" navigation: g h → home, g t → typography, … */
export function useGoShortcuts(): void {
  const router = useRouter();

  useEffect(() => {
    let armedAt = 0;

    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      const key = event.key.toLowerCase();

      if (armedAt && Date.now() - armedAt < SEQUENCE_TIMEOUT) {
        armedAt = 0;
        if (key === "h") {
          event.preventDefault();
          router.push("/");
          return;
        }
        const studio = studios.find((item) => item.shortcut === key);
        if (studio) {
          event.preventDefault();
          router.push(studio.href);
        }
        return;
      }

      armedAt = key === "g" ? Date.now() : 0;
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);
}
