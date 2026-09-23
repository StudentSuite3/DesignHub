"use client";

import { Download, Heart } from "lucide-react";

import { IconGlyph } from "@/components/icons/icon-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { useIcon } from "@/hooks/use-icon-data";
import { downloadText } from "@/lib/download";
import { splitIconId } from "@/lib/icons/iconify";
import { buildIconSvg } from "@/lib/icons/svg";
import { cn } from "@/lib/utils";
import { useIconStore } from "@/store/icon-store";

export function IconPreview() {
  const selected = useIconStore((state) => state.selected);
  const style = useIconStore((state) => state.style);
  const favorite = useIconStore((state) => state.favorites.includes(state.selected));
  const toggleFavorite = useIconStore((state) => state.toggleFavorite);
  const icon = useIcon(selected);
  const { prefix, name } = splitIconId(selected);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-checker flex aspect-square items-center justify-center rounded-lg border">
        {icon ? (
          <IconGlyph icon={icon} style={style} alt={`${name} icon preview`} className="size-1/2 text-foreground" />
        ) : (
          <span className="size-24 animate-pulse rounded-xl bg-muted" aria-hidden />
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="truncate font-sans text-sm font-medium">{name}</h2>
          <Badge variant="outline" className="font-mono">
            {prefix}
          </Badge>
        </div>
        <div className="flex items-center">
          {icon ? (
            <>
              <CopyButton
                value={buildIconSvg(icon, style, { uniqueIds: true })}
                label="Copy SVG"
                toastMessage="SVG copied"
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Download SVG"
                onClick={() => downloadText(buildIconSvg(icon, style, { uniqueIds: true }), `${name}.svg`)}
              >
                <Download />
              </Button>
            </>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            aria-pressed={favorite}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            onClick={() => toggleFavorite(selected)}
          >
            <Heart className={cn(favorite && "fill-current text-destructive")} />
          </Button>
        </div>
      </div>
    </div>
  );
}
