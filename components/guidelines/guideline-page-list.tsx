"use client";

import { Switch } from "@/components/ui/switch";
import { guidelinePages } from "@/lib/guidelines/registry";
import { cn } from "@/lib/utils";
import { useGuidelinesStore } from "@/store/guidelines-store";

export function GuidelinePageList() {
  const selected = useGuidelinesStore((state) => state.selected);
  const excluded = useGuidelinesStore((state) => state.excluded);
  const select = useGuidelinesStore((state) => state.select);
  const toggle = useGuidelinesStore((state) => state.toggle);
  let number = 0;

  return (
    <ol className="flex flex-col gap-1" aria-label="Pages">
      {guidelinePages.map((page) => {
        const included = !excluded.includes(page.id);
        if (included) number += 1;
        return (
          <li key={page.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => select(page.id)}
              aria-current={page.id === selected ? "page" : undefined}
              title={page.description}
              className={cn(
                "flex h-9 min-w-0 flex-1 items-center gap-2.5 rounded-md border border-transparent px-2.5 text-left text-sm text-muted-foreground transition-colors duration-150 hover:border-border hover:text-foreground",
                page.id === selected && "border-brand/60 bg-surface-raised text-foreground",
                !included && "opacity-50",
              )}
            >
              <span className="w-5 shrink-0 font-mono text-[11px] text-subtle-foreground">
                {included ? String(number).padStart(2, "0") : "--"}
              </span>
              <span className="truncate">{page.title}</span>
            </button>
            <Switch
              checked={included}
              onCheckedChange={() => toggle(page.id)}
              aria-label={`Include ${page.title}`}
              disabled={page.id === "cover"}
            />
          </li>
        );
      })}
    </ol>
  );
}
