"use client";

import { memo, useEffect } from "react";

import { FavoriteFontButton } from "@/components/typography/favorite-button";
import { Badge } from "@/components/ui/badge";
import { useInView } from "@/hooks/use-in-view";
import { fontCategoryLabels, isVariableFont } from "@/lib/typography/catalog";
import { fontStack } from "@/lib/typography/css";
import { googleFontsCssUrl, injectStylesheet } from "@/lib/typography/google-fonts";
import { cn } from "@/lib/utils";
import type { FontFamily } from "@/types/typography";

type FontCardProps = {
  font: FontFamily;
  active: boolean;
  onSelect: (family: string) => void;
};

const PREVIEW = "Aa";

export const FontCard = memo(function FontCard({ font, active, onSelect }: FontCardProps) {
  const { ref, inView } = useInView<HTMLButtonElement>();

  useEffect(() => {
    // Only the glyphs we render are downloaded, so hundreds of previews stay cheap.
    if (inView) injectStylesheet(googleFontsCssUrl(font, { text: `${PREVIEW}${font.family}`, weight: 400 }));
  }, [inView, font]);

  return (
    <div className="relative flex w-full">
      <button
        ref={ref}
        type="button"
        onClick={() => onSelect(font.family)}
        aria-pressed={active}
        className={cn(
          "group flex w-full flex-col gap-4 rounded-lg border bg-card p-4 text-left transition-[border-color,background-color] duration-150 hover:border-border-strong hover:bg-surface-raised",
          active && "border-brand/60 bg-surface-raised",
        )}
      >
        <span
          aria-hidden
          className="text-5xl leading-none"
          style={{ fontFamily: fontStack(font.family, font.category) }}
        >
          {PREVIEW}
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-sm font-medium" style={{ fontFamily: fontStack(font.family, font.category) }}>
            {font.family}
          </span>
          <span className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {fontCategoryLabels[font.category]} · {font.weights.length}{" "}
            {font.weights.length === 1 ? "style" : "weights"}
            {isVariableFont(font) ? <Badge variant="brand">Variable</Badge> : null}
          </span>
        </span>
      </button>
      <FavoriteFontButton family={font.family} className="absolute top-2 right-2" />
    </div>
  );
});
