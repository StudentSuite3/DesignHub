import * as React from "react";

import { cn } from "@/lib/utils";

type PanelProps = React.ComponentProps<"section"> & {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
};

/** A titled surface used to group controls inside a studio workspace. */
function Panel({ title, description, actions, className, children, ...props }: PanelProps) {
  const headingId = React.useId();
  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={cn("flex flex-col gap-4 rounded-lg border bg-card p-4", className)}
      {...props}
    >
      {title || actions ? (
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {title ? (
              <h2 id={headingId} className="text-sm font-medium">
                {title}
              </h2>
            ) : null}
            {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-1">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export { Panel };
