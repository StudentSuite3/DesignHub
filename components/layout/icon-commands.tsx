"use client";

import { useRouter } from "next/navigation";
import { Shapes } from "lucide-react";

import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useIconStore } from "@/store/icon-store";

/** Hands the palette query to Icon Studio's live Iconify search. */
export function IconCommands({ query, onDone }: { query: string; onDone: () => void }) {
  const router = useRouter();
  const setQuery = useIconStore((state) => state.setQuery);
  const term = query.trim();
  if (term.length < 2) return null;

  return (
    <CommandGroup heading="Icons">
      <CommandItem
        value={`icons search ${term}`}
        onSelect={() => {
          onDone();
          setQuery(term);
          router.push("/icons");
        }}
      >
        <Shapes />
        Search icons for “{term}”
      </CommandItem>
    </CommandGroup>
  );
}
