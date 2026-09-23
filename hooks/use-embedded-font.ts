"use client";

import { useEffect, useState } from "react";

import { useFontMeta } from "@/hooks/use-font-catalog";
import { embeddedFontCss } from "@/lib/brand/font-embed";

/** Inlined @font-face CSS for `family` covering the glyphs in `text` ("" until ready). */
export function useEmbeddedFont(family: string, weight: number, text: string): string {
  const font = useFontMeta(family);
  const [css, setCss] = useState("");
  useEffect(() => {
    let active = true;
    embeddedFontCss(font, weight, text).then((value) => active && setCss(value));
    return () => {
      active = false;
    };
  }, [font, weight, text]);
  return css;
}
