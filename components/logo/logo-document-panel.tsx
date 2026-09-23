"use client";

import { BrandLogoField } from "@/components/brand/fields/brand-logo-field";
import { Panel } from "@/components/ui/panel";

export function LogoDocumentPanel() {
  return (
    <Panel title="Logo" description="Shared with Brand Studio. Upload an SVG or keep the generated mark.">
      <BrandLogoField />
    </Panel>
  );
}
