"use client";

import { useRef } from "react";

import { AssetExports } from "@/components/export/asset-exports";
import { TokenOutput } from "@/components/export/token-output";
import { TokenPreview } from "@/components/export/token-preview";
import { TokenSettingsPanel } from "@/components/export/token-settings";
import { TokenSources } from "@/components/export/token-sources";
import { useDesignTokens } from "@/hooks/use-design-tokens";

export function ExportEngine() {
  const tokens = useDesignTokens();
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-6">
      <TokenSources tokens={tokens} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-label="Live preview" className="flex min-w-0 flex-col gap-3">
          <h2 className="text-sm font-medium">Live preview</h2>
          <TokenPreview ref={previewRef} tokens={tokens} />
        </section>
        <TokenSettingsPanel />
      </div>
      <TokenOutput tokens={tokens} previewRef={previewRef} />
      <AssetExports />
    </div>
  );
}
