"use client";

import { useMemo } from "react";

import { SvgPreviewCanvas } from "@/components/canvas/svg-preview-canvas";
import { StudioLayout } from "@/components/layout/studio-layout";
import { SocialContentPanel } from "@/components/social/social-content-panel";
import { SocialExportPanel } from "@/components/social/social-export-panel";
import { SocialPicker } from "@/components/social/social-picker";
import { Panel } from "@/components/ui/panel";
import { useSocialContext } from "@/hooks/use-social-context";
import { withSafeArea } from "@/lib/social/overlay";
import { getSocialTemplate, socialTemplates } from "@/lib/social/registry";
import { useSocialStore } from "@/store/social-store";

export function SocialWorkspace() {
  const ctx = useSocialContext();
  const templateId = useSocialStore((state) => state.template);
  const safeArea = useSocialStore((state) => state.safeArea);
  const template = getSocialTemplate(templateId) ?? socialTemplates[0];
  const svg = useMemo(() => (template ? template.render(ctx) : ""), [template, ctx]);
  const preview = useMemo(
    () => (template && safeArea ? withSafeArea(svg, template) : svg),
    [svg, template, safeArea],
  );

  return (
    <StudioLayout
      id="social"
      controls={
        <>
          <Panel title="Template">
            <SocialPicker />
          </Panel>
          <SocialContentPanel />
        </>
      }
      preview={
        preview && template ? (
          <SvgPreviewCanvas
            svg={preview}
            label={`${template.platform} ${template.label}`}
            defaultBackdrop="checker"
          />
        ) : (
          <div className="flex min-h-80 flex-1 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Pick a template.
          </div>
        )
      }
      output={<SocialExportPanel svg={svg} name={ctx.brand.name} template={template} />}
    />
  );
}
