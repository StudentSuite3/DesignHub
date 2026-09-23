"use client";

import { SearchX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { FontCard } from "@/components/typography/font-card";
import { FontFilters } from "@/components/typography/font-filters";
import { RecentFonts } from "@/components/typography/recent-fonts";
import { Button } from "@/components/ui/button";
import { useSelectFont } from "@/hooks/use-select-font";
import { filterFonts } from "@/lib/typography/filter";
import { cn } from "@/lib/utils";
import { useLibraryStore } from "@/store/library-store";
import { useTypographyStore } from "@/store/typography-store";
import type { FontFamily } from "@/types/typography";

const PAGE_SIZE = 40;

type FontBrowserProps = {
  fonts: FontFamily[];
  loading: boolean;
  className?: string;
};

/** Search and filters on top, a scrolling list below that loads more as you reach the end. */
export function FontBrowser({ fonts, loading, className }: FontBrowserProps) {
  const activeFont = useTypographyStore((state) => state.activeFont);
  const filters = useTypographyStore((state) => state.filters);
  const resetFilters = useTypographyStore((state) => state.resetFilters);
  const favorites = useLibraryStore((state) => state.favoriteFonts);
  const selectFont = useSelectFont();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const results = useMemo(() => filterFonts(fonts, filters, favorites), [fonts, filters, favorites]);
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // New filters start back at the top of the list.
  useEffect(() => {
    setVisible(PAGE_SIZE);
    listRef.current?.scrollTo({ top: 0 });
  }, [filters]);

  const hasMore = results.length > visible;
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setVisible((count) => count + PAGE_SIZE);
      },
      { root: listRef.current, rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, visible]);

  const shown = results.slice(0, visible);

  return (
    <section
      aria-labelledby="google-fonts-title"
      className={cn("relative flex min-h-0 flex-col overflow-hidden rounded-lg border bg-card", className)}
    >
      <div className="flex flex-col gap-3 border-b p-4">
        <h2 id="google-fonts-title" className="text-sm font-medium">
          Google Fonts
        </h2>
        <FontFilters resultCount={results.length} />
        <RecentFonts />
      </div>
      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-2 scrollbar-thin">
        {loading ? (
          <ul className="flex flex-col gap-1" aria-busy="true" aria-label="Loading fonts">
            {Array.from({ length: 10 }, (_, index) => (
              <li key={index} className="h-[54px] animate-pulse rounded-md bg-muted/40" />
            ))}
          </ul>
        ) : null}
        {!loading && results.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <SearchX className="size-6 text-subtle-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">No fonts match these filters.</p>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset filters
            </Button>
          </div>
        ) : null}
        <ul className="flex flex-col gap-0.5" aria-label="Fonts">
          {shown.map((font) => (
            <li key={font.family} className="flex">
              <FontCard font={font} active={font.family === activeFont} onSelect={selectFont} />
            </li>
          ))}
        </ul>
        {hasMore ? (
          <div ref={sentinelRef} className="flex justify-center py-3">
            <Button variant="ghost" size="sm" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
              Show more · {results.length - visible} remaining
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
