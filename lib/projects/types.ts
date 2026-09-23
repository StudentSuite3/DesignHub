import type { BrandSnapshot } from "@/lib/projects/snapshot";

/** The project's name is its brand name (snapshot.brand.profile.name), so it is never stored twice. */
export type BrandProject = {
  id: string;
  favorite: boolean;
  createdAt: number;
  updatedAt: number;
  lastOpenedAt: number;
  snapshot: BrandSnapshot;
};

export const projectName = (project: BrandProject) => project.snapshot.brand.profile.name.trim() || "Untitled brand";
