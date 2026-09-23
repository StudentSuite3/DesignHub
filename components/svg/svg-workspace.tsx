"use client";

import { useMemo } from "react";

import { SvgPreviewCanvas } from "@/components/canvas/svg-preview-canvas";
import { StudioLayout } from "@/components/layout/studio-layout";
import { SvgDocumentPanel } from "@/components/svg/svg-document-panel";
import { SvgOutput } from "@/components/svg/svg-output";
import { useParsedSvg } from "@/hooks/use-parsed-svg";
import { minify } from "@/lib/svg/serialize";

export function SvgWorkspace() {
  const parsed = useParsedSvg();
  const root = parsed.ok ? parsed.root : null;
  const previewSvg = useMemo(() => (root ? minify(root) : ""), [root]);

  return (
    <StudioLayout
      id="svg"
      controls={<SvgDocumentPanel />}
      preview={
        root ? (
          <SvgPreviewCanvas svg={previewSvg} label="SVG preview" />
        ) : (
          <div
            role="alert"
            className="flex min-h-80 flex-1 items-center justify-center rounded-lg border border-dashed p-6 text-sm text-muted-foreground"
          >
            {parsed.ok ? null : parsed.error}
          </div>
        )
      }
      output={<SvgOutput root={root} />}
    />
  );
}
