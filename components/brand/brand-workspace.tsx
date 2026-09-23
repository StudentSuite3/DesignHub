"use client";

import { BrandLinksPanel } from "@/components/brand/brand-links-panel";
import { BrandPreview } from "@/components/brand/brand-preview";
import { BrandSettingsPanel } from "@/components/brand/brand-settings-panel";
import { BrandTokensPanel } from "@/components/brand/brand-tokens-panel";
import { StudioLayout } from "@/components/layout/studio-layout";

export function BrandWorkspace() {
  return (
    <StudioLayout
      id="brand"
      controls={
        <>
          <BrandSettingsPanel />
          <BrandLinksPanel />
        </>
      }
      preview={<BrandPreview />}
      output={<BrandTokensPanel />}
    />
  );
}
