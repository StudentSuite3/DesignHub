"use client";

import { useMemo } from "react";

import { BackgroundControls } from "@/components/backgrounds/background-controls";
import { BackgroundOutput } from "@/components/backgrounds/background-output";
import { StudioLayout } from "@/components/layout/studio-layout";
import { SvgPreviewCanvas } from "@/components/canvas/svg-preview-canvas";
import { usePaper } from "@/hooks/use-paper";
import { getGenerator, renderBackgroundSvg } from "@/lib/background/registry";
import { useBackgroundStore } from "@/store/background-store";

export function BackgroundWorkspace() {
  const settings = useBackgroundStore((state) => state.settings);
  const paperReady = usePaper(Boolean(getGenerator(settings.kind)?.usesPaper));
  // `paperReady` is a dependency on purpose: Paper-based generators re-render once it loads.
  const svg = useMemo(() => renderBackgroundSvg(settings), [settings, paperReady]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StudioLayout
      id="backgrounds"
      controls={<BackgroundControls />}
      preview={<SvgPreviewCanvas svg={svg} label={`${settings.kind} background preview`} defaultBackdrop="dark" />}
      output={<BackgroundOutput svg={svg} />}
    />
  );
}
