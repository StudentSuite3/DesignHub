import type { Metadata } from "next";

import { GuidelinesWorkspace } from "@/components/guidelines/guidelines-workspace";
import { Workspace } from "@/components/layout/workspace";
import { PageHeader } from "@/components/ui/page-header";
import { getStudio } from "@/lib/navigation";

const studio = getStudio("guidelines");

export const metadata: Metadata = { title: "Brand Guidelines", description: studio.description };

export default function GuidelinesPage() {
  return (
    <Workspace className="gap-6">
      <PageHeader eyebrow="Studio" title={studio.title} description={studio.description} />
      <GuidelinesWorkspace />
    </Workspace>
  );
}
