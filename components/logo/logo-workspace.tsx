"use client";

import { SvgPreviewCanvas } from "@/components/canvas/svg-preview-canvas";
import { CodeBlock } from "@/components/export/code-block";
import { StudioLayout } from "@/components/layout/studio-layout";
import { LogoDocumentPanel } from "@/components/logo/logo-document-panel";
import { LogoEditorPanel } from "@/components/logo/logo-editor-panel";
import { useBrandTokens } from "@/hooks/use-brand";

export function LogoWorkspace() {
  const brand = useBrandTokens();
  return (
    <StudioLayout
      id="logo"
      controls={
        <>
          <LogoDocumentPanel />
          <LogoEditorPanel />
        </>
      }
      preview={<SvgPreviewCanvas svg={brand.logo.svg} label={`${brand.name} logo`} />}
      output={<CodeBlock code={brand.logo.svg} filename="logo.svg" />}
    />
  );
}
