"use client";

import { useMemo } from "react";

import { SvgPreviewCanvas } from "@/components/canvas/svg-preview-canvas";
import { StudioLayout } from "@/components/layout/studio-layout";
import { OptimizePanel } from "@/components/svg/optimize-panel";
import { SvgDocumentPanel } from "@/components/svg/svg-document-panel";
import { SvgDropzone } from "@/components/svg/svg-dropzone";
import { SvgOutput } from "@/components/svg/svg-output";
import { ViewBoxEditor } from "@/components/svg/viewbox-editor";
import { useParsedSvg } from "@/hooks/use-parsed-svg";
import { minify } from "@/lib/svg/serialize";
import { useSvgStore } from "@/store/svg-store";

export function SvgWorkspace() {
  const parsed = useParsedSvg();
  const setDocument = useSvgStore((state) => state.setDocument);
  const root = parsed.ok ? parsed.root : null;
  const previewSvg = useMemo(() => (root ? minify(root) : ""), [root]);

  return (
    <StudioLayout
      id="svg"
      controls={
        <>
          <SvgDocumentPanel />
          {root ? <ViewBoxEditor root={root} /> : null}
          {root ? <OptimizePanel /> : null}
        </>
      }
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
