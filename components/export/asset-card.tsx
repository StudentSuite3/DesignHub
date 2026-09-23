import type { ReactNode } from "react";

type AssetCardProps = {
  title: string;
  description: string;
  preview?: ReactNode;
  actions: ReactNode;
};

export function AssetCard({ title, description, preview, actions }: AssetCardProps) {
  return (
    <li className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      {preview ? <div className="h-24 overflow-hidden rounded-md border">{preview}</div> : null}
      <div className="flex flex-col gap-1">
        <h3 className="font-sans text-sm font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="mt-auto flex flex-wrap gap-2">{actions}</div>
    </li>
  );
}
