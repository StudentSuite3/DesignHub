import type { Metadata } from "next";

import { Workspace } from "@/components/layout/workspace";
import { TypographyWorkspace } from "@/components/typography/typography-workspace";
import { PageHeader } from "@/components/ui/page-header";
import { getStudio } from "@/lib/navigation";

const studio = getStudio("typography");

export const metadata: Metadata = { title: "Typography Studio", description: studio.description };

export default function TypographyPage() {
  return (
    <Workspace>
      <PageHeader eyebrow="Studio" title={studio.title} description={studio.description} />
      <TypographyWorkspace />
    </Workspace>
  );
}
