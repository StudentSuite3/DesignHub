import type { Metadata } from "next";

import { Workspace } from "@/components/layout/workspace";
import { ProjectManager } from "@/components/projects/project-manager";
import { PageHeader } from "@/components/ui/page-header";
import { getStudio } from "@/lib/navigation";

const studio = getStudio("projects");

export const metadata: Metadata = { title: "Brand Projects", description: studio.description };

export default function ProjectsPage() {
  return (
    <Workspace className="gap-6">
      <PageHeader eyebrow="Library" title={studio.title} description={studio.description} />
      <ProjectManager />
    </Workspace>
  );
}
