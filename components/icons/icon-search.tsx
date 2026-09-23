"use client";

import { Search, X } from "lucide-react";
import { useRef } from "react";

import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { useHotkey } from "@/hooks/use-hotkeys";
import { useIconStore } from "@/store/icon-store";

export function IconSearch() {
  const query = useIconStore((state) => state.query);
  const setQuery = useIconStore((state) => state.setQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  useHotkey("f", () => inputRef.current?.focus());

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle-foreground"
        aria-hidden
      />
      <Input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setQuery("");
        }}
        placeholder="Search 200,000+ icons - try “arrow”, “cloud”, “github”"
        aria-label="Search icons"
        className="h-10 pr-10 pl-9 [&::-webkit-search-cancel-button]:hidden"
      />
      {query ? (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-subtle-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      ) : (
        <Kbd className="absolute top-1/2 right-2 -translate-y-1/2">F</Kbd>
      )}
    </div>
  );
}
