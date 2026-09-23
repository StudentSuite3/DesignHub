import Link from "next/link";
import { Braces, Palette, Ruler, Type } from "lucide-react";

import { toHex } from "@/lib/color/color";
import type { DesignTokens } from "@/types/tokens";

/** What the engine is reading from each studio, with a way back to edit it. */
export function TokenSources({ tokens }: { tokens: DesignTokens }) {
  const count =
    tokens.colors.reduce((sum, color) => sum + 1 + color.shades.length, 0) +
    tokens.semantic.length +
    (tokens.gradient ? 1 : 0) +
    (tokens.typography ? tokens.typography.steps.length + 8 : 0) +
    tokens.spacing.length +
    tokens.radius.length;

  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Token sources">
      <li className="flex flex-col gap-2 rounded-lg border bg-card p-4">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Braces className="size-3.5" aria-hidden /> Tokens
        </span>
        <span className="font-display text-2xl font-medium tabular-nums">{count}</span>
      </li>
      <li>
        <Link
          href="/colors"
          className="flex h-full flex-col gap-2 rounded-lg border bg-card p-4 hover:border-border-strong"
        >
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Palette className="size-3.5" aria-hidden /> Colors
          </span>
          <span className="flex h-6 overflow-hidden rounded-sm">
            {tokens.colors.map((color) => (
              <span key={color.name} className="flex-1" style={{ background: toHex(color.value) }} />
            ))}
          </span>
        </Link>
      </li>
      <li>
        <Link
          href="/typography"
          className="flex h-full flex-col gap-2 rounded-lg border bg-card p-4 hover:border-border-strong"
        >
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Type className="size-3.5" aria-hidden /> Typography
          </span>
          <span className="truncate text-sm">
            {tokens.typography
              ? `${tokens.typography.heading.family} + ${tokens.typography.body.family}`
              : "Not included"}
          </span>
        </Link>
      </li>
      <li className="flex flex-col gap-2 rounded-lg border bg-card p-4">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Ruler className="size-3.5" aria-hidden /> Spacing · Radius
        </span>
        <span className="text-sm">
          {tokens.spacing.length} steps · {tokens.radius.length} radii
        </span>
      </li>
    </ul>
  );
}
