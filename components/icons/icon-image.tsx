import { buildIconSvg, svgToDataUrl } from "@/lib/icons/svg";
import type { IconData, IconStyle } from "@/types/icons";

type IconImageProps = {
  icon: IconData;
  style: IconStyle;
  alt: string;
  className?: string;
};

/**
 * Renders icon SVG through an <img> data URL. Third-party markup never
 * touches the DOM, so there is nothing to sanitise.
 */
export function IconImage({ icon, style, alt, className }: IconImageProps) {
  // eslint-disable-next-line @next/next/no-img-element -- data URL, nothing for next/image to optimise
  return <img src={svgToDataUrl(buildIconSvg(icon, style))} alt={alt} className={className} draggable={false} />;
}
