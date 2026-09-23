"use client";

import { useMemo } from "react";

import { SvgPreviewCanvas } from "@/components/canvas/svg-preview-canvas";
import { StudioLayout } from "@/components/layout/studio-layout";
import { SvgControls } from "@/components/svg/svg-controls";
import { SvgDropzone } from "@/components/svg/svg-dropzone";
import { SvgOutput } from "@/components/svg/svg-output";
import { useParsedSvg } from "@/hooks/use-parsed-svg";
import { minify } from "@/lib/svg/serialize";
import { withHighlight } from "@/lib/svg/tree";
import { useSvgStore } from "@/store/svg-store";

export function SvgWorkspace() {
  const parsed = useParsedSvg();
  const setDocument = useSvgStore((state) => state.setDocument);
  const root = parsed.ok ? parsed.root : null;
  const selected = useSvgStore((state) => state.selected);
  const previewSvg = useMemo(() => (root ? minify(withHighlight(root, selected)) : ""), [root, selected]);

  return (
    <StudioLayout
      id="svg"
      controls={<SvgControls root={root} />}
      preview={
        <SvgDropzone onLoad={setDocument}>
          {root ? (
            <SvgPreviewCanvas svg={previewSvg} label="SVG preview" />
          ) : (
            <div
              role="alert"
              className="flex min-h-80 flex-1 items-center justify-center rounded-lg border border-dashed p-6 text-sm text-muted-foreground"
            >
              {parsed.ok ? null : parsed.error}
            </div>
          )}
        </SvgDropzone>
      }
      output={<SvgOutput root={root} />}
    />
  );
}
