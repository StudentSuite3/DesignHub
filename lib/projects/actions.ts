import {
  applySnapshot,
  captureSnapshot,
  defaultSnapshot,
  snapshotStoresHydrated,
  whenSnapshotStoresHydrated,
  type BrandSnapshot,
} from "@/lib/projects/snapshot";
import { deleteProject, getProject, listProjects, newProjectId, saveProject, updateProject } from "@/lib/projects/repository";
import type { BrandProject } from "@/lib/projects/types";
import { useBrandStore } from "@/store/brand-store";
import { useProjectStore } from "@/store/project-store";

function whenProjectStoreHydrated(): Promise<void> {
  return new Promise((resolve) => {
    if (useProjectStore.persist.hasHydrated()) resolve();
    else {
      const off = useProjectStore.persist.onFinishHydration(() => {
        off();
        resolve();
      });
    }
  });
}

export async function ready(): Promise<void> {
  await Promise.all([whenSnapshotStoresHydrated(), whenProjectStoreHydrated()]);
}

/** Writes the live stores into the active project. */
export async function saveActiveProject(): Promise<void> {
  const { activeId } = useProjectStore.getState();
  if (!activeId || !snapshotStoresHydrated() || !useProjectStore.persist.hasHydrated()) return;
  await updateProject(activeId, { snapshot: captureSnapshot(), updatedAt: Date.now() });
}

export async function createProject(snapshot: BrandSnapshot, options: { open?: boolean } = {}): Promise<BrandProject> {
  const now = Date.now();
  const project: BrandProject = {
    id: newProjectId(),
    favorite: false,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: options.open ? now : 0,
    snapshot: structuredClone(snapshot),
  };
  await saveProject(project);
  if (options.open) await openProject(project.id);
  return project;
}

export async function createBlankProject(name: string): Promise<BrandProject> {
  return createProject(defaultSnapshot(name), { open: true });
}

/** Saves the current project, then loads another into the live stores. */
export async function openProject(id: string): Promise<void> {
  await ready();
  const target = await getProject(id);
  if (!target) return;
  const { activeId, setActive } = useProjectStore.getState();
  if (activeId && activeId !== id) await saveActiveProject();
  // Switch first, so any pending autosave lands in the project being opened.
  setActive(id);
  if (activeId !== id) applySnapshot(target.snapshot);
  await updateProject(id, { lastOpenedAt: Date.now() });
}

/** Renames a project. The name lives in the brand profile, live or in the snapshot. */
export async function renameProject(id: string, name: string): Promise<void> {
  const clean = name.trim().slice(0, 60);
  if (!clean) return;
  if (useProjectStore.getState().activeId === id) {
    useBrandStore.getState().updateProfile({ name: clean });
    await saveActiveProject();
    return;
  }
  const project = await getProject(id);
  if (!project) return;
  const snapshot = structuredClone(project.snapshot);
  snapshot.brand.profile.name = clean;
  await updateProject(id, { snapshot, updatedAt: Date.now() });
}

export async function toggleFavorite(id: string): Promise<void> {
  const project = await getProject(id);
  if (project) await updateProject(id, { favorite: !project.favorite });
}

/** Deletes a project. Deleting the open one switches to the most recent other project. */
export async function removeProject(id: string): Promise<void> {
  await deleteProject(id);
  const { activeId, setActive } = useProjectStore.getState();
  if (activeId !== id) return;
  const rest = (await listProjects()).sort((a, b) => b.lastOpenedAt - a.lastOpenedAt);
  setActive(null);
  if (rest[0]) await openProject(rest[0].id);
}

/** On first use, the brand already in the studios becomes the first project. */
export async function ensureInitialProject(): Promise<void> {
  await ready();
  const projects = await listProjects();
  const { activeId, setActive } = useProjectStore.getState();
  if (activeId && projects.some((project) => project.id === activeId)) return;
  if (projects.length === 0) {
    const project = await createProject(captureSnapshot());
    setActive(project.id);
    await updateProject(project.id, { lastOpenedAt: Date.now() });
    return;
  }
  // The active project was deleted elsewhere: adopt the live state as a new project.
  const project = await createProject(captureSnapshot());
  setActive(project.id);
}
