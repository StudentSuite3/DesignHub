"use client";

import { useMemo } from "react";

import { PREVIEW_SELECTOR } from "@/components/effects/effect-preview";
import { ExportPanel } from "@/components/export/export-panel";
import { effectStylesheet, tailwindClasses } from "@/lib/effects/css";
import type { EffectCss, EffectKind } from "@/types/effects";
import type { ExportFormat } from "@/types/export";

export function EffectOutput({ kind, effect }: { kind: EffectKind; effect: EffectCss | null }) {
  const formats = useMemo<ExportFormat[]>(() => {
    if (!effect) return [];
    const selector = `.${kind}`;
    const classes = tailwindClasses(effect.declarations);
    const note = effect.tailwindNote ? `\n\n<!-- ${effect.tailwindNote} -->` : "";
    return [
      { id: "css", label: "CSS", filename: `${kind}.css`, language: "css", code: effectStylesheet(effect, selector) },
      {
        id: "tailwind",
        label: "Tailwind",
        filename: `${kind}.html`,
        language: "html",
        code: `<div class="${classes}">\n  …\n</div>${note}\n`,
      },
    ];
  }, [effect, kind]);

  if (!effect) return <p className="text-sm text-muted-foreground">Pick an effect to generate code.</p>;
  return <ExportPanel key={kind} formats={formats} label="Effect code format" />;
}

