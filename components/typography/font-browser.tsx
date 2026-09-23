"use client";

import { useState } from "react";

import { FontCard } from "@/components/typography/font-card";
import { Button } from "@/components/ui/button";
import { useTypographyStore } from "@/store/typography-store";
import type { FontFamily } from "@/types/typography";

const PAGE_SIZE = 48;

type FontBrowserProps = {
  fonts: FontFamily[];
  loading: boolean;
};

export function FontBrowser({ fonts, loading }: FontBrowserProps) {
  const activeFont = useTypographyStore((state) => state.activeFont);
  const setActiveFont = useTypographyStore((state) => state.setActiveFont);
  const [visible, setVisible] = useState(PAGE_SIZE);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Loading fonts">
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-lg border bg-muted/40" />
        ))}
      </div>
    );
  }

  const shown = fonts.slice(0, visible);

  return (
    <div className="flex flex-col gap-4">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {shown.map((font) => (
          <li key={font.family} className="flex">
            <FontCard font={font} active={font.family === activeFont} onSelect={setActiveFont} />
          </li>
        ))}
      </ul>
      {fonts.length > visible ? (
        <Button variant="outline" className="self-center" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
          Show more · {fonts.length - visible} remaining
        </Button>
      ) : null}
    </div>
  );
}
