/** Default web address derived from the brand name. */
export function brandDomain(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "") || "brand"}.com`;
}
