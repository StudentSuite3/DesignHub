"use client";

import { memo, useMemo } from "react";

import { IconImage } from "@/components/icons/icon-image";
import { useIconData } from "@/hooks/use-icon-data";
import { useForegroundHex } from "@/hooks/use-theme-color";
import { defaultIconStyle } from "@/lib/icons/svg";
import { splitIconId } from "@/lib/icons/iconify";
import { cn } from "@/lib/utils";
import { useIconStore } from "@/store/icon-store";
import type { IconData, IconId } from "@/types/icons";

type IconGridProps = {
  ids: IconId[];
  emptyMessage?: string;
};

export function IconGrid({ ids, emptyMessage = "No icons found." }: IconGridProps) {
  const { icons, loading, error } = useIconData(ids);
  const selected = useIconStore((state) => state.selected);
  const select = useIconStore((state) => state.select);
  const color = useForegroundHex();
  const style = useMemo(() => ({ ...defaultIconStyle, size: 32, color }), [color]);

  if (error) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Couldn’t reach Iconify. Icons you have opened before still work offline.
      </p>
    );
  }
  // Once loaded, drop names the API doesn't know instead of showing empty tiles.
  const visible = loading ? ids : ids.filter((id) => icons.has(id));

  if (visible.length === 0 && !loading) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
    );
  }

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2" aria-busy={loading} aria-label="Icons">
      {visible.map((id) => (
        <IconTile key={id} id={id} icon={icons.get(id)} style={style} active={id === selected} onSelect={select} />
      ))}
    </ul>
  );
}

type IconTileProps = {
  id: IconId;
  icon: IconData | undefined;
  style: typeof defaultIconStyle;
  active: boolean;
  onSelect: (id: IconId) => void;
};

const IconTile = memo(function IconTile({ id, icon, style, active, onSelect }: IconTileProps) {
  const { name } = splitIconId(id);
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(id)}
        aria-pressed={active}
        aria-label={id}
        title={id}
        className={cn(
          "flex aspect-square w-full items-center justify-center rounded-lg border bg-card transition-[border-color,background-color] duration-150 hover:border-border-strong hover:bg-surface-raised",
          active && "border-brand/60 bg-surface-raised",
        )}
      >
        {icon ? (
          <IconImage icon={icon} style={style} alt="" className="size-7" />
        ) : (
          <span className="size-6 animate-pulse rounded-md bg-muted" aria-hidden />
        )}
        <span className="sr-only">{name}</span>
      </button>
    </li>
  );
});
