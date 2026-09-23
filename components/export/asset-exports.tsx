"use client";

import { Download } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { AssetCard } from "@/components/export/asset-card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { backgroundCss } from "@/lib/background/export";
import { renderBackgroundSvg } from "@/lib/background/registry";
import { downloadText } from "@/lib/download";
import { effectsBundle } from "@/lib/effects/bundle";
import { svgToDataUrl } from "@/lib/icons/svg";
import { useBackgroundStore } from "@/store/background-store";
import { useEffectsStore } from "@/store/effects-store";

/** Files from the other studios that don't fit the token model: backgrounds, effects… */
export function AssetExports() {
  const background = useBackgroundStore((state) => state.settings);
  const effects = useEffectsStore((state) => state.settings);

  const backgroundSvg = useMemo(() => renderBackgroundSvg(background), [background]);
  const backgroundStyles = useMemo(() => backgroundCss(background), [background]);
  const effectsCss = useMemo(() => effectsBundle(effects), [effects]);

  return (
    <section aria-labelledby="assets-title" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="assets-title" className="text-lg font-medium">
          Assets
        </h2>
        <p className="text-sm text-muted-foreground">Ready-made files from the other studios, always in sync.</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AssetCard
          title="Background"
          description={`${background.kind} · seed ${background.seed} · ${background.width}×${background.height}`}
          preview={
            // eslint-disable-next-line @next/next/no-img-element -- generated SVG data URL
            <img src={svgToDataUrl(backgroundSvg)} alt="" className="size-full object-cover" />
          }
          actions={
            <>
              <CopyButton value={backgroundStyles} variant="outline" size="sm" toastMessage="Background CSS copied">
                CSS
              </CopyButton>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadText(backgroundSvg, `background-${background.kind}.svg`)}
              >
                <Download /> SVG
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/backgrounds">Edit</Link>
              </Button>
            </>
          }
        />
        <AssetCard
          title="Effects"
          description="Glass, neumorphism, shadow, glow, border and grain as .fx-* classes."
          actions={
            <>
              <CopyButton value={effectsCss} variant="outline" size="sm" toastMessage="Effects CSS copied">
                CSS
              </CopyButton>
              <Button variant="outline" size="sm" onClick={() => downloadText(effectsCss, "effects.css")}>
                <Download /> effects.css
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/effects">Edit</Link>
              </Button>
            </>
          }
        />
      </ul>
    </section>
  );
}
