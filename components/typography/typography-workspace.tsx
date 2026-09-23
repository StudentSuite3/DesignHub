"use client";

import dynamic from "next/dynamic";
import { Braces, Combine, LayoutGrid, Ruler } from "lucide-react";
import type { ReactNode } from "react";

import { FontBrowser } from "@/components/typography/font-browser";
import { OpenTypeControls } from "@/components/typography/opentype-controls";
import { SpecimenControls } from "@/components/typography/specimen-controls";
import { SpecimenPreview } from "@/components/typography/specimen-preview";
import { VariablePlayground } from "@/components/typography/variable-playground";
import { TabSkeleton } from "@/components/ui/tab-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFontCatalog } from "@/hooks/use-font-catalog";
import { useTypographyStore, type TypographyTab } from "@/store/typography-store";

// Secondary tabs are split out so the first tab paints fast.
const PairingStudio = dynamic(() => import("@/components/typography/pairing-studio").then((m) => m.PairingStudio), {
  loading: TabSkeleton,
});
const TypeScaleStudio = dynamic(
  () => import("@/components/typography/type-scale-studio").then((m) => m.TypeScaleStudio),
  { loading: TabSkeleton },
);
const TypographyExport = dynamic(
  () => import("@/components/typography/typography-export").then((m) => m.TypographyExport),
  { loading: TabSkeleton },
);
const FontInspector = dynamic(() => import("@/components/typography/font-inspector").then((m) => m.FontInspector), {
  loading: () => null,
});

const tabs: { value: TypographyTab; label: string; icon: ReactNode }[] = [
  { value: "browse", label: "Browse", icon: <LayoutGrid /> },
  { value: "pair", label: "Pairing", icon: <Combine /> },
  { value: "scale", label: "Type scale", icon: <Ruler /> },
  { value: "export", label: "Export", icon: <Braces /> },
];

function isTab(value: string): value is TypographyTab {
  return tabs.some((tab) => tab.value === value);
}

export function TypographyWorkspace() {
  const tab = useTypographyStore((state) => state.tab);
  const setTab = useTypographyStore((state) => state.setTab);
  const { fonts, loading } = useFontCatalog();

  return (
    <Tabs value={tab} onValueChange={(value) => isTab(value) && setTab(value)} className="gap-6">
      <TabsList aria-label="Typography tools" className="w-full overflow-x-auto sm:w-fit">
        {tabs.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            {item.icon}
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="browse" className="flex flex-col gap-8">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <SpecimenPreview />
          <div className="flex flex-col gap-4">
            <SpecimenControls />
            <VariablePlayground />
          </div>
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <OpenTypeControls />
          <FontInspector />
        </div>
        <section aria-label="Google Fonts" className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">Google Fonts</h2>
          <FontBrowser fonts={fonts} loading={loading} />
        </section>
      </TabsContent>
      <TabsContent value="pair">
        <PairingStudio fonts={fonts} />
      </TabsContent>
      <TabsContent value="scale">
        <TypeScaleStudio fonts={fonts} />
      </TabsContent>
      <TabsContent value="export">
        <TypographyExport fonts={fonts} />
      </TabsContent>
    </Tabs>
  );
}
