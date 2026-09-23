"use client";

import { useMemo } from "react";

import { ClampGenerator } from "@/components/typography/clamp-generator";
import { ScaleControls } from "@/components/typography/scale-controls";
import { ScaleTable } from "@/components/typography/scale-table";
import { useGoogleFonts } from "@/hooks/use-google-font";
import { generateScale } from "@/lib/typography/scale";
import { useTypographyStore } from "@/store/typography-store";
import type { FontFamily } from "@/types/typography";

export function TypeScaleStudio({ fonts }: { fonts: FontFamily[] }) {
  const scale = useTypographyStore((state) => state.scale);
  const headingFont = useTypographyStore((state) => state.headingFont);
  const bodyFont = useTypographyStore((state) => state.bodyFont);
  const steps = useMemo(() => generateScale(scale), [scale]);
  useGoogleFonts([fonts.find((font) => font.family === headingFont), fonts.find((font) => font.family === bodyFont)]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-w-0 flex-col gap-6">
        <ScaleTable steps={steps} headingFont={headingFont} bodyFont={bodyFont} />
      </div>
      <div className="flex flex-col gap-4">
        <ScaleControls />
        <ClampGenerator />
      </div>
    </div>
  );
}
