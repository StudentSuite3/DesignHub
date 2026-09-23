"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { memo } from "react";

import { IconGlyph } from "@/components/icons/icon-image";
import { Button } from "@/components/ui/button";
import { useIconData } from "@/hooks/use-icon-data";
import { splitIconId } from "@/lib/icons/iconify";
import { defaultIconStyle } from "@/lib/icons/svg";
import { cn } from "@/lib/utils";
import { useIconStore } from "@/store/icon-store";
import type { IconData, IconId } from "@/types/icons";

type IconGridProps = {
  ids: IconId[];
  emptyMessage?: string;
};

const gridStyle = { ...defaultIconStyle, size: 32 };

export function IconsError({ onRetry, message }: { onRetry: () => void; message?: string }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
      <AlertTriangle className="size-5 text-warning" aria-hidden />
      <p className="max-w-sm text-sm text-muted-foreground">
        {message ??
          "Couldn't reach Iconify or its mirrors. Check your connection. Icons you opened before still work offline."}
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RotateCw /> Try again
      </Button>
    </div>
  );
}

export function IconGrid({ ids, emptyMessage = "No icons found." }: IconGridProps) {
  const { icons, failed, loading, error, retry } = useIconData(ids);
  const selected = useIconStore((state) => state.selected);
  const select = useIconStore((state) => state.select);

  if (error) return <IconsError onRetry={retry} />;
  // While loading, keep a tile for every id; afterwards drop names the API doesn't know.
  const visible = loading ? ids : ids.filter((id) => icons.has(id) || failed.has(id));
  if (visible.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="sr-only" aria-live="polite">
        {loading ? `Loading icons, ${icons.size} of ${ids.length} ready` : `${icons.size} icons loaded`}
      </p>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2" aria-busy={loading} aria-label="Icons">
        {visible.map((id) => (
          <IconTile
            key={id}
            id={id}
            icon={icons.get(id)}
            failed={failed.has(id)}
            active={id === selected}
            onSelect={select}
          />
        ))}
      </ul>
      {!loading && failed.size > 0 ? (
        <Button variant="outline" size="sm" className="self-center" onClick={retry}>
          <RotateCw /> Retry {failed.size} icons that failed to load
        </Button>
      ) : null}
    </div>
  );
}

type IconTileProps = {
  id: IconId;
  icon: IconData | undefined;
  failed: boolean;
  active: boolean;
  onSelect: (id: IconId) => void;
};

const IconTile = memo(function IconTile({ id, icon, failed, active, onSelect }: IconTileProps) {
  const { name } = splitIconId(id);
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(id)}
        aria-pressed={active}
        aria-label={id}
        title={failed ? `${id} (failed to load)` : id}
        className={cn(
          "flex aspect-square w-full items-center justify-center rounded-lg border bg-card text-foreground transition-[border-color,background-color] duration-150 hover:border-border-strong hover:bg-surface-raised",
          active && "border-brand/60 bg-surface-raised",
        )}
      >
        {icon ? (
          <IconGlyph icon={icon} style={gridStyle} alt="" className="size-7" />
        ) : failed ? (
          <AlertTriangle className="size-4 text-subtle-foreground" aria-hidden />
        ) : (
          <span className="size-6 animate-pulse rounded-md bg-muted" aria-hidden />
        )}
        <span className="sr-only">{name}</span>
      </button>
    </li>
  );
});
