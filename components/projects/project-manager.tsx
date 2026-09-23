"use client";

import { Plus, Search, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProjects } from "@/hooks/use-projects";
import { createBlankProject, openProject, removeProject, renameProject, toggleFavorite } from "@/lib/projects/actions";
import { projectName, type BrandProject } from "@/lib/projects/types";
import { cn } from "@/lib/utils";

export function ProjectManager() {
  const router = useRouter();
  const { projects, activeId, persistent, run } = useProjects();
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [deleting, setDeleting] = useState<BrandProject | null>(null);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (projects ?? [])
      .filter((project) => (!favoritesOnly || project.favorite) && projectName(project).toLowerCase().includes(term))
      .sort(
        (a, b) =>
          Number(b.favorite) - Number(a.favorite) ||
          b.lastOpenedAt - a.lastOpenedAt ||
          b.updatedAt - a.updatedAt,
      );
  }, [projects, query, favoritesOnly]);

  async function open(project: BrandProject) {
    await run(() => openProject(project.id));
    toast.success(`Opened ${projectName(project)}`, {
      action: { label: "Brand Studio", onClick: () => router.push("/brand") },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects"
            aria-label="Search projects"
            className="h-9 pl-8"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          aria-pressed={favoritesOnly}
          onClick={() => setFavoritesOnly((value) => !value)}
          className={cn(favoritesOnly && "border-brand/60 text-foreground")}
        >
          <Star className={cn(favoritesOnly && "fill-warning text-warning")} /> Favorites
        </Button>
        <span className="flex-1" />
        <Button
          size="sm"
          onClick={() => {
            setNewName("");
            setCreating(true);
          }}
        >
          <Plus /> New project
        </Button>
      </div>

      {!persistent ? (
        <p role="status" className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
          This browser is blocking local storage, so projects only last until you close the tab. Export them as JSON
          to keep a copy.
        </p>
      ) : null}

      {projects === null ? (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading projects">
          {[0, 1, 2].map((i) => (
            <li key={i} className="h-60 animate-pulse rounded-xl border bg-surface-raised" />
          ))}
        </ul>
      ) : visible.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          {query || favoritesOnly ? "No projects match." : "No projects yet."}
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Brand projects">
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              active={project.id === activeId}
              onOpen={() => void open(project)}
              onRename={(name) => void run(() => renameProject(project.id, name))}
              onFavorite={() => void run(() => toggleFavorite(project.id))}
              onDelete={() => setDeleting(project)}
            />
          ))}
        </ul>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New brand project</DialogTitle>
            <DialogDescription>
              Starts from the default palette and fonts. Your current project is saved first.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              const name = newName.trim() || "Untitled brand";
              setCreating(false);
              void run(() => createBlankProject(name)).then(() => toast.success(`Created ${name}`));
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-project-name">Brand name</Label>
              <Input
                id="new-project-name"
                value={newName}
                maxLength={60}
                autoFocus
                onChange={(event) => setNewName(event.target.value)}
                placeholder="Untitled brand"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setCreating(false)}>
                Cancel
              </Button>
              <Button type="submit">Create and open</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleting ? projectName(deleting) : "project"}?</DialogTitle>
            <DialogDescription>This removes it from this browser. It cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                const target = deleting;
                setDeleting(null);
                if (target) void run(() => removeProject(target.id)).then(() => toast.success("Project deleted"));
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
