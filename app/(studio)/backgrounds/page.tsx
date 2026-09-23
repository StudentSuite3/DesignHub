import type { Metadata } from "next";

import { BackgroundWorkspace } from "@/components/backgrounds/background-workspace";
import { Workspace } from "@/components/layout/workspace";
import { PageHeader } from "@/components/ui/page-header";
import { getStudio } from "@/lib/navigation";

const studio = getStudio("backgrounds");

export const metadata: Metadata = { title: "Background Studio", description: studio.description };

export default function BackgroundsPage() {
  return (
    <Workspace className="gap-6">
      <PageHeader eyebrow="Studio" title={studio.title} description={studio.description} />
      <BackgroundWorkspace />
    </Workspace>
  );
}
