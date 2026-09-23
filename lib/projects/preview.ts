import { buildBrandTokens } from "@/lib/brand/tokens";
import type { BrandSnapshot } from "@/lib/projects/snapshot";
import type { BrandTokens } from "@/types/brand";

/** Brand tokens for a stored project, for thumbnails. Fonts resolve by name only. */
export function snapshotTokens(snapshot: BrandSnapshot): BrandTokens {
  return buildBrandTokens({
    profile: snapshot.brand.profile,
    swatches: snapshot.colors.swatches,
    gradient: snapshot.colors.gradient,
    headingFont: snapshot.typography.headingFont,
    bodyFont: snapshot.typography.bodyFont,
    catalog: [],
    rhythm: snapshot.typography.rhythm,
    scale: snapshot.typography.scale,
    radiusBase: snapshot.tokens.settings.radiusBase,
    spacingBase: snapshot.tokens.settings.spacingBase,
    shadowLayers: snapshot.effects.settings.shadow.layers,
  });
}
