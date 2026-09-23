"use client";

import { useMemo } from "react";

import { BackgroundControls } from "@/components/backgrounds/background-controls";
import { BackgroundOutput } from "@/components/backgrounds/background-output";
import { StudioLayout } from "@/components/layout/studio-layout";
import { SvgPreviewCanvas } from "@/components/canvas/svg-preview-canvas";
import { renderBackgroundSvg } from "@/lib/background/registry";
import { useBackgroundStore } from "@/store/background-store";

export function BackgroundWorkspace() {
  const settings = useBackgroundStore((state) => state.settings);
  const svg = useMemo(() => renderBackgroundSvg(settings), [settings]);

  return (
    <StudioLayout
      id="backgrounds"
      controls={<BackgroundControls />}
      preview={<SvgPreviewCanvas svg={svg} label={`${settings.kind} background preview`} defaultBackdrop="dark" />}
      output={<BackgroundOutput svg={svg} />}
    />
  );
}
