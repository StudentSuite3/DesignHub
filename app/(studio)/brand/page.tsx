import type { Metadata } from "next";

import { BrandWorkspace } from "@/components/brand/brand-workspace";
import { Workspace } from "@/components/layout/workspace";
import { PageHeader } from "@/components/ui/page-header";
import { getStudio } from "@/lib/navigation";

const studio = getStudio("brand");

export const metadata: Metadata = { title: "Brand Studio", description: studio.description };

export default function BrandPage() {
  return (
    <Workspace className="gap-6">
      <PageHeader eyebrow="Studio" title={studio.title} description={studio.description} />
      <BrandWorkspace />
    </Workspace>
  );
}
