"use client";

import { Braces, Combine, LayoutGrid, Ruler } from "lucide-react";
import type { ReactNode } from "react";

import { FontBrowser } from "@/components/typography/font-browser";
import { SpecimenControls } from "@/components/typography/specimen-controls";
import { SpecimenPreview } from "@/components/typography/specimen-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFontCatalog } from "@/hooks/use-font-catalog";
import { useTypographyStore, type TypographyTab } from "@/store/typography-store";

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
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <SpecimenPreview />
          <SpecimenControls />
        </div>
        <section aria-label="Google Fonts" className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">Google Fonts</h2>
          <FontBrowser fonts={fonts} loading={loading} />
        </section>
      </TabsContent>
      <TabsContent value="pair">
        <p className="text-sm text-muted-foreground">Font pairing</p>
      </TabsContent>
      <TabsContent value="scale">
        <p className="text-sm text-muted-foreground">Type scale</p>
      </TabsContent>
      <TabsContent value="export">
        <p className="text-sm text-muted-foreground">Export</p>
      </TabsContent>
    </Tabs>
  );
}
