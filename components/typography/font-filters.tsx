"use client";

import { Heart, Search, X } from "lucide-react";
import { useRef } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Kbd } from "@/components/ui/kbd";
import { useHotkey } from "@/hooks/use-hotkeys";
import { fontCategories, fontCategoryLabels } from "@/lib/typography/catalog";
import type { FontSort } from "@/lib/typography/filter";
import { useTypographyStore } from "@/store/typography-store";
import type { FontCategory } from "@/types/typography";

const sorts: { value: FontSort; label: string }[] = [
  { value: "popular", label: "Most popular" },
  { value: "alphabetical", label: "A → Z" },
  { value: "weights", label: "Most weights" },
];

export function FontFilters({ resultCount }: { resultCount: number }) {
  const filters = useTypographyStore((state) => state.filters);
  const setFilters = useTypographyStore((state) => state.setFilters);
  const inputRef = useRef<HTMLInputElement>(null);
  useHotkey("f", () => inputRef.current?.focus());

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle-foreground"
            aria-hidden
          />
          <Input
            ref={inputRef}
            type="search"
            value={filters.query}
            onChange={(event) => setFilters({ query: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setFilters({ query: "" });
                event.currentTarget.blur();
              }
            }}
            placeholder="Search 500 Google Fonts…"
            aria-label="Search fonts"
            className="pr-16 pl-9 [&::-webkit-search-cancel-button]:hidden"
          />
          {filters.query ? (
            <button
              type="button"
              onClick={() => setFilters({ query: "" })}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-subtle-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <Kbd className="absolute top-1/2 right-2 -translate-y-1/2">F</Kbd>
          )}
        </div>
        <Select value={filters.sort} onValueChange={(value) => setFilters({ sort: value as FontSort })}>
          <SelectTrigger className="md:w-44" aria-label="Sort fonts">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sorts.map((sort) => (
              <SelectItem key={sort.value} value={sort.value}>
                {sort.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <ToggleGroup
          type="single"
          value={filters.category}
          onValueChange={(value) => value && setFilters({ category: value as FontCategory | "all" })}
          aria-label="Category"
          className="flex-wrap"
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          {fontCategories.map((category) => (
            <ToggleGroupItem key={category} value={category}>
              {fontCategoryLabels[category]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex items-center gap-2">
          <Switch
            id="variable-only"
            checked={filters.variableOnly}
            onCheckedChange={(variableOnly) => setFilters({ variableOnly })}
          />
          <Label htmlFor="variable-only">Variable only</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="favorites-only"
            checked={filters.favoritesOnly}
            onCheckedChange={(favoritesOnly) => setFilters({ favoritesOnly })}
          />
          <Label htmlFor="favorites-only">
            <Heart className="size-3" aria-hidden /> Favorites
          </Label>
        </div>
        <p className="text-xs text-subtle-foreground md:ml-auto" aria-live="polite">
          {resultCount} {resultCount === 1 ? "family" : "families"}
        </p>
      </div>
    </div>
  );
}
