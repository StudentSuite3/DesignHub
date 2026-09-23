"use client";

import { BrandLinksPanel } from "@/components/brand/brand-links-panel";
import { BrandSettingsPanel } from "@/components/brand/brand-settings-panel";
import { BrandTokensPanel } from "@/components/brand/brand-tokens-panel";
import { TokenPreview } from "@/components/export/token-preview";
import { StudioLayout } from "@/components/layout/studio-layout";
import { useDesignTokens } from "@/hooks/use-design-tokens";

export function BrandWorkspace() {
  const tokens = useDesignTokens();
  return (
    <StudioLayout
      id="brand"
      controls={
        <>
          <BrandSettingsPanel />
          <BrandLinksPanel />
        </>
      }
      preview={<TokenPreview tokens={tokens} />}
      output={<BrandTokensPanel />}
    />
  );
}
