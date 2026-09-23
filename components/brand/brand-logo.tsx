import { svgToDataUrl } from "@/lib/icons/svg";
import { cn } from "@/lib/utils";

/** Renders the (sanitized or generated) logo through an image, never as live markup. */
export function BrandLogo({ svg, className, alt = "" }: { svg: string; className?: string; alt?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- SVG data URL
  return <img src={svgToDataUrl(svg)} alt={alt} className={cn("object-contain", className)} draggable={false} />;
}
