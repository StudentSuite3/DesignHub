"use client";

import { IconControls } from "@/components/icons/icon-controls";
import { IconLibrary } from "@/components/icons/icon-library";
import { IconPreview } from "@/components/icons/icon-preview";
import { Panel } from "@/components/ui/panel";

export function IconWorkspace() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <IconLibrary />
      <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pb-4 scrollbar-thin">
        <Panel>
          <IconPreview />
        </Panel>
        <IconControls />
      </aside>
    </div>
  );
}
