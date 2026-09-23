"use client";

import { useMemo } from "react";

import { BackgroundControls } from "@/components/backgrounds/background-controls";
import { BackgroundOutput } from "@/components/backgrounds/background-output";
import { StudioLayout } from "@/components/layout/studio-layout";
import { svgToDataUrl } from "@/lib/icons/svg";
import { renderBackgroundSvg } from "@/lib/background/registry";
import { useBackgroundStore } from "@/store/background-store";

export function BackgroundWorkspace() {
  const settings = useBackgroundStore((state) => state.settings);
  const svg = useMemo(() => renderBackgroundSvg(settings), [settings]);

  return (
    <StudioLayout
      id="backgrounds"
      controls={<BackgroundControls />}
      preview={
        // eslint-disable-next-line @next/next/no-img-element -- generated SVG data URL
        <img
          src={svgToDataUrl(svg)}
          alt={`${settings.kind} background preview`}
          className="w-full rounded-lg border object-cover"
          style={{ aspectRatio: `${settings.width} / ${settings.height}` }}
        />
      }
      output={<BackgroundOutput svg={svg} />}
    />
  );
}
