import type { Metadata } from "next";

import { ExportEngine } from "@/components/export/export-engine";
import { Workspace } from "@/components/layout/workspace";
import { PageHeader } from "@/components/ui/page-header";
import { getStudio } from "@/lib/navigation";

const studio = getStudio("export");

export const metadata: Metadata = { title: "Export Engine", description: studio.description };

export default function ExportPage() {
  return (
    <Workspace>
      <PageHeader eyebrow="Studio" title={studio.title} description={studio.description} />
      <ExportEngine />
    </Workspace>
  );
}
