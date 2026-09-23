"use client";

import { useState } from "react";

import { CollectionPicker } from "@/components/icons/collection-picker";
import { IconGrid } from "@/components/icons/icon-grid";
import { IconSearch } from "@/components/icons/icon-search";
import { Button } from "@/components/ui/button";
import { useIconResults } from "@/hooks/use-icon-results";
import { useIconStore } from "@/store/icon-store";

const PAGE = 240;

export function IconLibrary() {
  const query = useIconStore((state) => state.query);
  const prefix = useIconStore((state) => state.prefix);
  const setPrefix = useIconStore((state) => state.setPrefix);
  const favorites = useIconStore((state) => state.favorites);
  const results = useIconResults(query, prefix);
  const [limit, setLimit] = useState({ key: "", count: PAGE });

  // Reset pagination whenever the result set changes.
  const resultKey = `${results.mode}:${query}:${prefix}`;
  const count = limit.key === resultKey ? limit.count : PAGE;
  const shown = results.ids.slice(0, count);

  const heading =
    results.mode === "search"
      ? `${results.total.toLocaleString()} results for “${query.trim()}”`
      : results.mode === "collection"
        ? `${results.total.toLocaleString()} icons`
        : "Featured";

  return (
    <section aria-label="Icon library" className="flex min-w-0 flex-col gap-4">
      <IconSearch />
      <CollectionPicker value={prefix} onChange={setPrefix} />

      {results.mode === "featured" && favorites.length ? (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium">Favorites</h2>
          <IconGrid ids={favorites} />
        </div>
      ) : null}

      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-medium" aria-live="polite">
          {results.loading ? "Searching…" : heading}
        </h2>
        {results.mode === "search" && results.total >= 240 ? (
          <p className="text-xs text-subtle-foreground">Showing the top 240. Refine your search or pick a set.</p>
        ) : null}
      </div>
      {results.error ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Couldn’t reach Iconify. Check your connection — icons you’ve opened before still work offline.
        </p>
      ) : (
        <IconGrid ids={shown} emptyMessage="No icons match. Try a broader term or another set." />
      )}
      {results.ids.length > count ? (
        <Button
          variant="outline"
          className="self-center"
          onClick={() => setLimit({ key: resultKey, count: count + PAGE })}
        >
          Show more · {(results.ids.length - count).toLocaleString()} remaining
        </Button>
      ) : null}
    </section>
  );
}
