"use client";

import { Download, Plus, Trash2, Upload } from "lucide-react";
import { useMemo, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { downloadText } from "@/lib/download";
import { svgToDataUrl } from "@/lib/icons/svg";
import { readSvgFile } from "@/lib/svg/read-file";
import { buildSprite } from "@/lib/svg/sprite";
import { useSvgStore } from "@/store/svg-store";

const MAX_ITEMS = 100;

export function SpritePanel() {
  const sprite = useSvgStore((state) => state.sprite);
  const name = useSvgStore((state) => state.name);
  const source = useSvgStore((state) => state.source);
  const addToSprite = useSvgStore((state) => state.addToSprite);
  const renameSprite = useSvgStore((state) => state.renameSprite);
  const removeFromSprite = useSvgStore((state) => state.removeFromSprite);
  const clearSprite = useSvgStore((state) => state.clearSprite);
  const inputRef = useRef<HTMLInputElement>(null);
  const spriteSvg = useMemo(() => (sprite.length ? buildSprite(sprite) : ""), [sprite]);

  async function upload(files: FileList | null) {
    if (!files) return;
    let added = 0;
    for (const file of Array.from(files).slice(0, MAX_ITEMS - sprite.length)) {
      try {
        addToSprite(file.name, await readSvgFile(file));
        added += 1;
      } catch (error) {
        toast.error(`${file.name}: ${error instanceof Error ? error.message : "unreadable"}`);
      }
    }
    if (added) toast.success(`Added ${added} ${added === 1 ? "icon" : "icons"} to the sprite`);
  }

  return (
    <Panel title="Sprite" description="Combine SVGs into one <symbol> sprite. Internal ids are namespaced per symbol.">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addToSprite(name, source)}
          disabled={sprite.length >= MAX_ITEMS}
        >
          <Plus /> Add current
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={sprite.length >= MAX_ITEMS}
        >
          <Upload /> Add files
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".svg,image/svg+xml"
        className="sr-only"
        tabIndex={-1}
        aria-label="SVG files for the sprite"
        onChange={(event) => {
          void upload(event.target.files);
          event.target.value = "";
        }}
      />
      {sprite.length ? (
        <>
          <ul className="flex flex-col gap-1.5" aria-label="Sprite symbols">
            {sprite.map((item, index) => (
              <li key={`${item.id}-${index}`} className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG data URL preview */}
                <img
                  src={svgToDataUrl(item.source)}
                  alt=""
                  className="bg-checker size-8 shrink-0 rounded-md border object-contain p-1"
                />
                <Input
                  value={item.id}
                  onChange={(event) => renameSprite(index, event.target.value)}
                  aria-label={`Symbol id ${index + 1}`}
                  className="h-8 min-w-0 font-mono text-xs"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label={`Remove ${item.id}`}
                  onClick={() => removeFromSprite(index)}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => downloadText(spriteSvg, "sprite.svg")}>
              <Download /> sprite.svg
            </Button>
            <Button variant="ghost" size="sm" onClick={clearSprite}>
              Clear
            </Button>
          </div>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">No symbols yet. Add the current SVG or upload several files.</p>
      )}
    </Panel>
  );
}
