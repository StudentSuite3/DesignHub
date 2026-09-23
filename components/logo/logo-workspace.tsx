"use client";

import { useMemo } from "react";

import { SvgPreviewCanvas } from "@/components/canvas/svg-preview-canvas";
import { CodeBlock } from "@/components/export/code-block";
import { StudioLayout } from "@/components/layout/studio-layout";
import { LogoDocumentPanel } from "@/components/logo/logo-document-panel";
import { LogoEditorPanel } from "@/components/logo/logo-editor-panel";
import { LogoGuidesPanel } from "@/components/logo/logo-guides-panel";
import { useBrandTokens } from "@/hooks/use-brand";
import { brandSurface } from "@/lib/brand/theme";
import { composeLogoWithGuides } from "@/lib/logo/compose";
import { useLogoStore } from "@/store/logo-store";

export function LogoWorkspace() {
  const brand = useBrandTokens();
  const guides = useLogoStore((state) => state.guides);
  const clearSpace = useLogoStore((state) => state.clearSpace);
  const backdrop = useLogoStore((state) => state.backdrop);

  const composed = useMemo(() => {
    const background =
      backdrop === "light"
        ? brandSurface(brand, "light").background
        : backdrop === "dark"
          ? brandSurface(brand, "dark").background
          : backdrop === "brand"
            ? (brand.colors.primary[0] ?? null)
            : null;
    return composeLogoWithGuides(brand.logo.svg, { ...guides, clearSpaceRatio: clearSpace, background });
  }, [brand, guides, clearSpace, backdrop]);

  return (
    <StudioLayout
      id="logo"
      controls={
        <>
          <LogoDocumentPanel />
          <LogoGuidesPanel />
          <LogoEditorPanel />
        </>
      }
      preview={<SvgPreviewCanvas svg={composed} label={`${brand.name} logo with guides`} />}
      output={<CodeBlock code={brand.logo.svg} filename="logo.svg" />}
    />
  );
}
