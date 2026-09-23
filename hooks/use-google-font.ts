"use client";

import { useEffect } from "react";

import { googleFontsCssUrl, injectStylesheet } from "@/lib/typography/google-fonts";
import type { FontFamily } from "@/types/typography";

/** Loads the complete family (all weights, italics and variable axes). */
export function useGoogleFont(font: FontFamily | undefined): void {
  useEffect(() => {
    if (font) injectStylesheet(googleFontsCssUrl(font));
  }, [font]);
}

/** Loads the given families in one request. */
export function useGoogleFonts(fonts: (FontFamily | undefined)[]): void {
  const defined = fonts.filter((font): font is FontFamily => Boolean(font));
  const key = defined.map((font) => font.family).join("|");
  useEffect(() => {
    if (defined.length) injectStylesheet(googleFontsCssUrl(defined));
    // `key` captures the identity of the list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
