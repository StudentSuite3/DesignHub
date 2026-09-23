"use client";

import { ArrowUpDown, Check, Wand2, X } from "lucide-react";

import { ColorWell } from "@/components/colors/color-well";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { contrastRatio, toHex } from "@/lib/color/color";
import { formatRatio, ratingLabel, suggestForeground, wcagChecks } from "@/lib/color/contrast";
import { cn } from "@/lib/utils";
import { useColorStore } from "@/store/color-store";

export function ContrastChecker() {
  const { fg, bg } = useColorStore((state) => state.contrast);
  const setContrast = useColorStore((state) => state.setContrast);

  const ratio = contrastRatio(fg, bg);
  const checks = wcagChecks(ratio);
  const rating = ratingLabel(ratio);
  const fixes = [
    { label: "AA", color: suggestForeground(fg, bg, 4.5) },
    { label: "AAA", color: suggestForeground(fg, bg, 7) },
  ].filter((fix) => fix.color);

  const fgHex = toHex(fg);
  const bgHex = toHex(bg);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-6 rounded-xl border p-6 md:p-10" style={{ background: bgHex, color: fgHex }}>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="font-display text-6xl font-medium tabular-nums md:text-7xl" aria-live="polite">
              {formatRatio(ratio)}
            </p>
            <span className="rounded-full border border-current px-3 py-1 text-sm font-medium">{rating}</span>
          </div>
          <p className="font-display text-3xl font-semibold">Large text reads at 24px, or 18.66px bold.</p>
          <p className="max-w-prose text-base">
            Normal text needs a contrast ratio of at least 4.5:1 for AA and 7:1 for AAA. This paragraph shows how your
            pair performs for body copy at 16px.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md px-4 py-2 text-sm font-medium" style={{ background: fgHex, color: bgHex }}>
              Primary button
            </span>
            <span className="rounded-md border-2 border-current px-4 py-2 text-sm">Outline button</span>
            <span className="text-sm underline underline-offset-4">Text link</span>
          </div>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3" aria-label="WCAG results">
          {checks.map((check) => (
            <li
              key={check.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border p-3 text-sm",
                check.pass ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5",
              )}
            >
              {check.pass ? (
                <Check className="size-4 text-success" aria-hidden />
              ) : (
                <X className="size-4 text-destructive" aria-hidden />
              )}
              <span className="flex flex-col">
                <span className="font-medium">{check.label}</span>
                <span className="text-xs text-muted-foreground">
                  {check.pass ? "Pass" : "Fail"} · needs {check.threshold}:1
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Panel title="Colors">
        <ColorWell id="contrast-fg" label="Text" color={fg} onChange={(color) => setContrast({ fg: color })} />
        <Button variant="outline" size="sm" onClick={() => setContrast({ fg: bg, bg: fg })} className="self-start">
          <ArrowUpDown /> Swap
        </Button>
        <ColorWell id="contrast-bg" label="Background" color={bg} onChange={(color) => setContrast({ bg: color })} />
        {fixes.length ? (
          <div className="flex flex-col gap-2 border-t pt-4">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Wand2 className="size-3.5" aria-hidden /> Closest passing text color
            </p>
            {fixes.map((fix) =>
              fix.color ? (
                <button
                  key={fix.label}
                  type="button"
                  onClick={() => fix.color && setContrast({ fg: fix.color })}
                  className="flex items-center gap-2 rounded-md border p-2 text-left text-sm transition-colors duration-150 hover:border-border-strong"
                >
                  <span className="size-6 rounded-sm border" style={{ background: toHex(fix.color) }} />
                  <span className="font-mono text-xs uppercase">{toHex(fix.color)}</span>
                  <Badge variant="outline" className="ml-auto">
                    {fix.label} · {formatRatio(contrastRatio(fix.color, bg))}
                  </Badge>
                </button>
              ) : null,
            )}
          </div>
        ) : null}
      </Panel>
    </div>
  );
}
