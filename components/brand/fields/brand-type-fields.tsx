"use client";

import { FontPicker } from "@/components/typography/font-picker";
import { Label } from "@/components/ui/label";
import { useFontCatalog } from "@/hooks/use-font-catalog";
import { useTypographyStore } from "@/store/typography-store";

export function BrandTypeFields() {
  const { fonts } = useFontCatalog();
  const headingFont = useTypographyStore((state) => state.headingFont);
  const bodyFont = useTypographyStore((state) => state.bodyFont);
  const setPair = useTypographyStore((state) => state.setPair);

  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="flex flex-col gap-1.5">
        <Label>Heading font</Label>
        <FontPicker
          label="Heading font"
          value={headingFont}
          fonts={fonts}
          onChange={(heading) => setPair({ heading })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Body font</Label>
        <FontPicker label="Body font" value={bodyFont} fonts={fonts} onChange={(body) => setPair({ body })} />
      </div>
    </div>
  );
}
