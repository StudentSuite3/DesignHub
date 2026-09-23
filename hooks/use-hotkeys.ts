"use client";

import { useEffect, useRef } from "react";

/** True when the keyboard event originates from a text-entry element. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  if (tag === "TEXTAREA" || tag === "SELECT") return true;
  if (tag !== "INPUT") return false;
  const type = (target as HTMLInputElement).type;
  return !["checkbox", "radio", "range", "button", "submit", "color"].includes(type);
}

const INTERACTIVE =
  "button, a[href], summary, [role=button], [role=checkbox], [role=switch], [role=tab], [role=radio], [role=option], [role=slider], [role=combobox], [role=menuitem]";

export type HotkeyHandler = (event: KeyboardEvent) => void;

type HotkeyOptions = {
  /** Fire even while the user is typing in a field. */
  allowInInputs?: boolean;
  enabled?: boolean;
};

/**
 * Minimal hotkey binding. `combo` accepts "mod+k", "shift+?", "space", or a plain key.
 * `mod` maps to ⌘ on macOS and Ctrl elsewhere.
 */
export function useHotkey(combo: string, handler: HotkeyHandler, options: HotkeyOptions = {}): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  const { allowInInputs = false, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;
    const parts = combo.toLowerCase().split("+");
    const key = parts[parts.length - 1] === "space" ? " " : parts[parts.length - 1];
    const needsMod = parts.includes("mod");
    const needsShift = parts.includes("shift");
    const needsAlt = parts.includes("alt");

    function onKeyDown(event: KeyboardEvent) {
      if (!allowInInputs && isTypingTarget(event.target)) return;
      // Space must keep activating focused buttons, links and toggles.
      if (key === " " && event.target instanceof HTMLElement && event.target.closest(INTERACTIVE)) return;
      const mod = event.metaKey || event.ctrlKey;
      if (needsMod !== mod) return;
      if (needsAlt !== event.altKey) return;
      if (needsShift && !event.shiftKey) return;
      // Option on macOS rewrites `event.key` (⌥T → "†"), so fall back to the physical key code.
      const matches =
        event.key.toLowerCase() === key || (/^[a-z]$/.test(key) && event.code === `Key${key.toUpperCase()}`);
      if (!matches) return;
      event.preventDefault();
      handlerRef.current(event);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [combo, allowInInputs, enabled]);
}
