"use client";

import { Maximize2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/ui/panel";
import { formatViewBox, readViewBox, setRootAttributes, type ViewBox } from "@/lib/svg/edit";
import { prettyPrint } from "@/lib/svg/serialize";
import { useSvgStore } from "@/store/svg-store";
import type { SvgNode } from "@/types/svg";

const fields: { key: keyof ViewBox; label: string }[] = [
  { key: "x", label: "Min X" },
  { key: "y", label: "Min Y" },
  { key: "width", label: "Width" },
  { key: "height", label: "Height" },
];

export function ViewBoxEditor({ root }: { root: SvgNode }) {
  const setSource = useSvgStore((state) => state.setSource);
  const box = readViewBox(root);
  const apply = (patch: Record<string, string | null>) => setSource(prettyPrint(setRootAttributes(root, patch)));

  return (
    <Panel title="viewBox" description="The coordinate system the drawing lives in.">
      {box ? (
        <div className="grid grid-cols-2 gap-3">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <Label htmlFor={`vb-${field.key}`}>{field.label}</Label>
              <Input
                id={`vb-${field.key}`}
                type="number"
                value={box[field.key]}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  if (Number.isFinite(value)) apply({ viewBox: formatViewBox({ ...box, [field.key]: value }) });
                }}
                className="h-8 font-mono text-xs"
              />
            </div>
          ))}
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const width = Number.parseFloat(root.attributes.width ?? "100") || 100;
            const height = Number.parseFloat(root.attributes.height ?? "100") || 100;
            apply({ viewBox: formatViewBox({ x: 0, y: 0, width, height }) });
          }}
        >
          Add viewBox from width/height
        </Button>
      )}
      <div className="grid grid-cols-2 gap-3">
        {(["width", "height"] as const).map((attribute) => (
          <div key={attribute} className="flex flex-col gap-1.5">
            <Label htmlFor={`svg-${attribute}`}>Intrinsic {attribute}</Label>
            <Input
              id={`svg-${attribute}`}
              value={root.attributes[attribute] ?? ""}
              placeholder="auto"
              onChange={(event) => apply({ [attribute]: event.target.value.trim() || null })}
              className="h-8 font-mono text-xs"
            />
          </div>
        ))}
      </div>
      {root.attributes.width || root.attributes.height ? (
        <Button variant="outline" size="sm" onClick={() => apply({ width: null, height: null })}>
          <Maximize2 /> Make responsive (remove width/height)
        </Button>
      ) : null}
    </Panel>
  );
}
