"use client";

import { SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import { FontCard } from "@/components/typography/font-card";
import { FontFilters } from "@/components/typography/font-filters";
import { RecentFonts } from "@/components/typography/recent-fonts";
import { Button } from "@/components/ui/button";
import { useSelectFont } from "@/hooks/use-select-font";
import { filterFonts } from "@/lib/typography/filter";
import { useLibraryStore } from "@/store/library-store";
import { useTypographyStore } from "@/store/typography-store";
import type { FontFamily } from "@/types/typography";

const PAGE_SIZE = 48;

type FontBrowserProps = {
  fonts: FontFamily[];
  loading: boolean;
};

export function FontBrowser({ fonts, loading }: FontBrowserProps) {
  const activeFont = useTypographyStore((state) => state.activeFont);
  const filters = useTypographyStore((state) => state.filters);
  const resetFilters = useTypographyStore((state) => state.resetFilters);
  const favorites = useLibraryStore((state) => state.favoriteFonts);
  const selectFont = useSelectFont();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const results = useMemo(() => filterFonts(fonts, filters, favorites), [fonts, filters, favorites]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Loading fonts">
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-lg border bg-muted/40" />
        ))}
      </div>
    );
  }

  const shown = results.slice(0, visible);

  return (
    <div className="flex flex-col gap-4">
      <FontFilters resultCount={results.length} />
      <RecentFonts />
      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <SearchX className="size-6 text-subtle-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">No fonts match these filters.</p>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Reset filters
          </Button>
        </div>
      ) : null}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {shown.map((font) => (
          <li key={font.family} className="flex">
            <FontCard font={font} active={font.family === activeFont} onSelect={selectFont} />
          </li>
        ))}
      </ul>
      {results.length > visible ? (
        <Button variant="outline" className="self-center" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
          Show more · {results.length - visible} remaining
        </Button>
      ) : null}
    </div>
  );
}
