import type { Metadata } from "next";

import { BrandDnaWorkspace } from "@/components/brand-dna/brand-dna-workspace";
import { Workspace } from "@/components/layout/workspace";
import { PageHeader } from "@/components/ui/page-header";
import { getStudio } from "@/lib/navigation";

const studio = getStudio("brand-dna");

export const metadata: Metadata = { title: "Brand DNA", description: studio.description };

export default function BrandDnaPage() {
  return (
    <Workspace className="gap-6">
      <PageHeader eyebrow="Beta" title={studio.title} description={studio.description} />
      <BrandDnaWorkspace />
    </Workspace>
  );
}
