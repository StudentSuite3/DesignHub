"use client";

import { Blend, Braces, Contrast, Layers, Palette } from "lucide-react";
import type { ReactNode } from "react";

import { HarmonyPanel } from "@/components/colors/harmony-panel";
import { OklchEditor } from "@/components/colors/oklch-editor";
import { FormatSwitcher } from "@/components/colors/format-switcher";
import { PaletteStrip } from "@/components/colors/palette-strip";
import { PaletteToolbar } from "@/components/colors/palette-toolbar";
import { SavedPalettes } from "@/components/colors/saved-palettes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHarmonyGenerator } from "@/hooks/use-harmony";
import { useColorStore, type ColorTab } from "@/store/color-store";

const tabs: { value: ColorTab; label: string; icon: ReactNode }[] = [
  { value: "palette", label: "Palette", icon: <Palette /> },
  { value: "shades", label: "Shades", icon: <Layers /> },
  { value: "gradient", label: "Gradient", icon: <Blend /> },
  { value: "contrast", label: "Contrast", icon: <Contrast /> },
  { value: "export", label: "Export", icon: <Braces /> },
];

const isTab = (value: string): value is ColorTab => tabs.some((tab) => tab.value === value);

export function ColorWorkspace() {
  const tab = useColorStore((state) => state.tab);
  const setTab = useColorStore((state) => state.setTab);
  const generate = useColorStore((state) => state.generate);
  const nextColors = useHarmonyGenerator();

  return (
    <Tabs value={tab} onValueChange={(value) => isTab(value) && setTab(value)} className="gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <TabsList aria-label="Color tools" className="w-full overflow-x-auto sm:w-fit">
          {tabs.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.icon}
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <FormatSwitcher />
      </div>

      <TabsContent value="palette" className="flex flex-col gap-6">
        <PaletteToolbar nextColors={nextColors} />
        <PaletteStrip />
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <HarmonyPanel onApply={() => generate(nextColors())} />
          <OklchEditor />
        </div>
        <SavedPalettes />
      </TabsContent>
      <TabsContent value="shades">
        <p className="text-sm text-muted-foreground">Shades</p>
      </TabsContent>
      <TabsContent value="gradient">
        <p className="text-sm text-muted-foreground">Gradient</p>
      </TabsContent>
      <TabsContent value="contrast">
        <p className="text-sm text-muted-foreground">Contrast</p>
      </TabsContent>
      <TabsContent value="export">
        <p className="text-sm text-muted-foreground">Export</p>
      </TabsContent>
    </Tabs>
  );
}
