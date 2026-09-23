let counter = 0;

/** Short unique id. Uses crypto when available, falls back to a counter. */
export function createId(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter}`;
}
