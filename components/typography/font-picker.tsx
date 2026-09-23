"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { defaultFontFilters, filterFonts } from "@/lib/typography/filter";
import { fontCategoryLabels } from "@/lib/typography/catalog";
import { cn } from "@/lib/utils";
import type { FontFamily } from "@/types/typography";

type FontPickerProps = {
  label: string;
  value: string;
  fonts: FontFamily[];
  onChange: (family: string) => void;
  className?: string;
};

/** Searchable font combobox. Filtering is done up-front so large lists stay fast. */
export function FontPicker({ label, value, fonts, onChange, className }: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = useMemo(() => filterFonts(fonts, { ...defaultFontFilters, query }, []).slice(0, 60), [fonts, query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={`${label}: ${value}`}
          className={cn("w-full justify-between font-normal", className)}
        >
          <span className="truncate">{value}</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-64 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput value={query} onValueChange={setQuery} placeholder={`Search ${label.toLowerCase()}…`} />
          <CommandList className="max-h-72">
            <CommandEmpty>No fonts found.</CommandEmpty>
            {results.map((font) => (
              <CommandItem
                key={font.family}
                value={font.family}
                onSelect={() => {
                  onChange(font.family);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <Check className={cn("size-4", font.family === value ? "opacity-100" : "opacity-0")} />
                <span className="truncate">{font.family}</span>
                <span className="ml-auto text-xs text-subtle-foreground">{fontCategoryLabels[font.category]}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
