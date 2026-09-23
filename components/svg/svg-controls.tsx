"use client";

import { ElementInspector } from "@/components/svg/element-inspector";
import { ElementTree } from "@/components/svg/element-tree";
import { OptimizePanel } from "@/components/svg/optimize-panel";
import { SpritePanel } from "@/components/svg/sprite-panel";
import { SvgDocumentPanel } from "@/components/svg/svg-document-panel";
import { ViewBoxEditor } from "@/components/svg/viewbox-editor";
import { Panel } from "@/components/ui/panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SvgNode } from "@/types/svg";

export function SvgControls({ root }: { root: SvgNode | null }) {
  return (
    <Tabs defaultValue="document" className="gap-4">
      <TabsList aria-label="SVG tools" className="w-full">
        <TabsTrigger value="document">Document</TabsTrigger>
        <TabsTrigger value="layers" disabled={!root}>
          Layers
        </TabsTrigger>
        <TabsTrigger value="optimize" disabled={!root}>
          Optimize
        </TabsTrigger>
        <TabsTrigger value="sprite">Sprite</TabsTrigger>
      </TabsList>
      <TabsContent value="document" className="flex flex-col gap-4">
        <SvgDocumentPanel />
        {root ? <ViewBoxEditor root={root} /> : null}
      </TabsContent>
      <TabsContent value="layers">
        {root ? (
          <Panel title="Layers" description="Pick an element to inspect its paths, fill and stroke.">
            <ElementTree root={root} />
            <ElementInspector root={root} />
          </Panel>
        ) : null}
      </TabsContent>
      <TabsContent value="optimize">{root ? <OptimizePanel /> : null}</TabsContent>
      <TabsContent value="sprite">
        <SpritePanel />
      </TabsContent>
    </Tabs>
  );
}
