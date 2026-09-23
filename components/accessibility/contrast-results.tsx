"use client";

import { Check, Wand2, X } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { contrastPairs } from "@/lib/a11y/contrast";
import { cn } from "@/lib/utils";
import { useA11yStore } from "@/store/a11y-store";

export function ContrastResults() {
  const colors = useA11yStore((state) => state.colors);
  const setColors = useA11yStore((state) => state.setColors);
  const pairs = useMemo(() => contrastPairs(colors), [colors]);

  return (
    <Panel title="WCAG contrast" description="WCAG 2.1 · 1.4.3 (AA), 1.4.6 (AAA), 1.4.11 (non-text).">
      <ul className="flex flex-col gap-2" aria-label="Contrast checks">
        {pairs.map((item) => {
          const pass = item.ratio >= item.required;
          return (
            <li
              key={item.id}
              className={cn(
                "flex flex-col gap-2 rounded-md border p-3",
                pass ? "border-success/30" : "border-destructive/40",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-md border text-xs font-semibold"
                  style={{ background: item.background, color: item.foreground }}
                  aria-hidden
                >
                  Aa
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">{item.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {item.ratioLabel} · needs {item.required}:1
                  </span>
                </div>
                {pass ? (
                  <Check className="size-4 text-success" aria-label="Pass" />
                ) : (
                  <X className="size-4 text-destructive" aria-label="Fail" />
                )}
              </div>
              {item.required === 4.5 ? (
                <div className="flex flex-wrap gap-1">
                  {(
                    [
                      ["AA", item.aa],
                      ["AA large", item.aaLarge],
                      ["AAA", item.aaa],
                      ["AAA large", item.aaaLarge],
                    ] as const
                  ).map(([label, ok]) => (
                    <Badge key={label} variant={ok ? "success" : "destructive"}>
                      {label}
                    </Badge>
                  ))}
                </div>
              ) : null}
              {!pass && item.suggestion ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={() => setColors({ [item.fixes]: item.suggestion })}
                >
                  <Wand2 /> Use {item.suggestion}
                </Button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
