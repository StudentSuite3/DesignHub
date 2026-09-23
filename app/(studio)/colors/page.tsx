import type { Metadata } from "next";

import { Workspace } from "@/components/layout/workspace";
import { PageHeader } from "@/components/ui/page-header";
import { getStudio } from "@/lib/navigation";

const studio = getStudio("colors");

export const metadata: Metadata = { title: "Color Studio", description: studio.description };

export default function ColorsPage() {
  return (
    <Workspace>
      <PageHeader eyebrow="Studio" title={studio.title} description={studio.description} />
    </Workspace>
  );
}
