"use client";

import { useMemo } from "react";

import { ExportPanel } from "@/components/export/export-panel";
import { useDesignTokens } from "@/hooks/use-design-tokens";
import { tokenFormats } from "@/lib/tokens/formats";

/** The same tokens the Export Engine ships, live for the current brand. */
export function BrandTokensPanel() {
  const tokens = useDesignTokens();
  const formats = useMemo(() => tokenFormats(tokens), [tokens]);

  return (
    <>
      <h2 className="text-sm font-medium">Design tokens</h2>
      <ExportPanel formats={formats} label="Brand token format" />
    </>
  );
}
