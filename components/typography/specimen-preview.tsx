"use client";

import type { CSSProperties } from "react";

import { useFontMeta } from "@/hooks/use-font-catalog";
import { useGoogleFont } from "@/hooks/use-google-font";
import { fontStack, fontVariationSettings, openTypeFeatureSettings } from "@/lib/typography/css";
import { cn } from "@/lib/utils";
import { useTypographyStore } from "@/store/typography-store";

/** Large, editable specimen for the active font. */
export function SpecimenPreview({ className }: { className?: string }) {
  const activeFont = useTypographyStore((state) => state.activeFont);
  const specimen = useTypographyStore((state) => state.specimen);
  const openType = useTypographyStore((state) => state.openType);
  const updateSpecimen = useTypographyStore((state) => state.updateSpecimen);
  const meta = useFontMeta(activeFont);
  useGoogleFont(meta);

  const style: CSSProperties = {
    fontFamily: fontStack(activeFont, meta?.category),
    fontSize: `${specimen.size}px`,
    fontWeight: specimen.weight,
    fontStyle: specimen.italic ? "italic" : "normal",
    letterSpacing: `${specimen.letterSpacing}em`,
    lineHeight: specimen.lineHeight,
    fontFeatureSettings: openTypeFeatureSettings(openType),
    fontVariationSettings: fontVariationSettings(specimen.axes),
  };

  return (
    <div className={cn("flex min-h-64 flex-col gap-4 rounded-lg border bg-card p-6 md:p-8", className)}>
      <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{activeFont}</span>
        <span className="font-mono tabular-nums">
          {specimen.size}px · {specimen.weight} · {specimen.lineHeight.toFixed(2)} / {specimen.letterSpacing.toFixed(2)}
          em
        </span>
      </div>
      <label htmlFor="specimen-text" className="sr-only">
        Preview text
      </label>
      <textarea
        id="specimen-text"
        value={specimen.text}
        onChange={(event) => updateSpecimen({ text: event.target.value })}
        spellCheck={false}
        rows={3}
        style={style}
        className="w-full flex-1 resize-none bg-transparent break-words outline-none [field-sizing:content]"
      />
    </div>
  );
}
