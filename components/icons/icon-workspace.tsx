"use client";

import { IconGrid } from "@/components/icons/icon-grid";
import { IconPreview } from "@/components/icons/icon-preview";
import { Panel } from "@/components/ui/panel";
import { featuredIcons } from "@/lib/icons/iconify";

export function IconWorkspace() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section aria-label="Icon library" className="flex min-w-0 flex-col gap-4">
        <h2 className="text-lg font-medium">Featured</h2>
        <IconGrid ids={featuredIcons} />
      </section>
      <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
        <Panel>
          <IconPreview />
        </Panel>
      </aside>
    </div>
  );
}
