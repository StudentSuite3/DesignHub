"use client";

import { Braces, Globe, LayoutGrid } from "lucide-react";
import { useState } from "react";

import { FaviconGenerator } from "@/components/icons/favicon-generator";
import { IconControls } from "@/components/icons/icon-controls";
import { IconLibrary } from "@/components/icons/icon-library";
import { IconPreview } from "@/components/icons/icon-preview";
import { Panel } from "@/components/ui/panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type IconTab = "library" | "favicon" | "export";

export function IconWorkspace() {
  const [tab, setTab] = useState<IconTab>("library");

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <Tabs value={tab} onValueChange={(value) => setTab(value as IconTab)} className="min-w-0 gap-6">
        <TabsList aria-label="Icon tools" className="w-full overflow-x-auto sm:w-fit">
          <TabsTrigger value="library">
            <LayoutGrid /> Library
          </TabsTrigger>
          <TabsTrigger value="favicon">
            <Globe /> Favicon
          </TabsTrigger>
          <TabsTrigger value="export">
            <Braces /> Export
          </TabsTrigger>
        </TabsList>
        <TabsContent value="library">
          <IconLibrary />
        </TabsContent>
        <TabsContent value="favicon">
          <FaviconGenerator />
        </TabsContent>
        <TabsContent value="export">
          <p className="text-sm text-muted-foreground">Export</p>
        </TabsContent>
      </Tabs>
      <aside className="flex flex-col gap-4 scrollbar-thin lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pb-4">
        <Panel>
          <IconPreview />
        </Panel>
        <IconControls />
      </aside>
    </div>
  );
}
