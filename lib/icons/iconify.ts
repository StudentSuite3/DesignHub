import type { IconifyJSON } from "@iconify/types";
import { getIconData } from "@iconify/utils";

import { getDatabase } from "@/lib/db";
import type { IconCollection, IconData, IconId } from "@/types/icons";

const API = "https://api.iconify.design";
const memory = new Map<string, IconData>();

export function splitIconId(id: string): { prefix: string; name: string } {
  const index = id.indexOf(":");
  return { prefix: id.slice(0, index), name: id.slice(index + 1) };
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Iconify request failed: ${response.status}`);
  return (await response.json()) as T;
}

export type SearchResult = { icons: IconId[]; total: number };

export async function searchIcons(
  query: string,
  options: { prefix?: string; limit?: number; signal?: AbortSignal } = {},
): Promise<SearchResult> {
  const params = new URLSearchParams({ query, limit: String(options.limit ?? 120) });
  if (options.prefix) params.set("prefixes", options.prefix);
  const result = await getJson<{ icons: string[]; total: number }>(`${API}/search?${params}`, options.signal);
  return { icons: result.icons as IconId[], total: result.total };
}

let collectionsCache: Promise<Record<string, IconCollection>> | null = null;

export function fetchCollections(): Promise<Record<string, IconCollection>> {
  collectionsCache ??= getJson<Record<string, Omit<IconCollection, "prefix">>>(`${API}/collections`)
    .then((data) => Object.fromEntries(Object.entries(data).map(([prefix, info]) => [prefix, { ...info, prefix }])))
    .catch((error: unknown) => {
      collectionsCache = null;
      throw error;
    });
  return collectionsCache;
}

type CollectionListing = { uncategorized?: string[]; categories?: Record<string, string[]>; hidden?: string[] };

export async function fetchCollectionIcons(prefix: string, signal?: AbortSignal): Promise<IconId[]> {
  const data = await getJson<CollectionListing>(`${API}/collection?prefix=${encodeURIComponent(prefix)}`, signal);
  const names = new Set<string>([...(data.uncategorized ?? []), ...Object.values(data.categories ?? {}).flat()]);
  return [...names].map((name) => `${prefix}:${name}` as IconId);
}

/**
 * Resolves icon bodies: memory → IndexedDB → network (batched per collection).
 * Missing icons are simply absent from the result.
 */
export async function fetchIcons(ids: IconId[], signal?: AbortSignal): Promise<Map<IconId, IconData>> {
  const result = new Map<IconId, IconData>();
  let pending = ids.filter((id) => {
    const cached = memory.get(id);
    if (cached) result.set(id, cached);
    return !cached;
  });

  const db = getDatabase();
  if (db && pending.length) {
    const rows = await db.icons.bulkGet(pending);
    rows.forEach((row) => {
      if (!row) return;
      const data: IconData = { body: row.body, width: row.width, height: row.height, left: row.left, top: row.top };
      memory.set(row.id, data);
      result.set(row.id as IconId, data);
    });
    pending = pending.filter((id) => !result.has(id));
  }

  const byPrefix = new Map<string, string[]>();
  pending.forEach((id) => {
    const { prefix, name } = splitIconId(id);
    byPrefix.set(prefix, [...(byPrefix.get(prefix) ?? []), name]);
  });

  await Promise.all(
    [...byPrefix].map(async ([prefix, names]) => {
      const json = await getJson<IconifyJSON>(`${API}/${prefix}.json?icons=${names.join(",")}`, signal);
      const records = names.flatMap((name) => {
        const icon = getIconData(json, name);
        if (!icon) return [];
        const data: IconData = {
          body: icon.body,
          width: icon.width ?? 16,
          height: icon.height ?? 16,
          left: icon.left,
          top: icon.top,
        };
        const id = `${prefix}:${name}` as IconId;
        memory.set(id, data);
        result.set(id, data);
        return [{ id, ...data, cachedAt: Date.now() }];
      });
      if (db && records.length) await db.icons.bulkPut(records).catch(() => undefined);
    }),
  );

  return result;
}

/** Popular, well-drawn icons shown before the user searches. */
export const featuredIcons: IconId[] = [
  "lucide:house",
  "lucide:search",
  "lucide:heart",
  "lucide:star",
  "lucide:settings",
  "lucide:bell",
  "lucide:user",
  "lucide:mail",
  "lucide:camera",
  "lucide:calendar",
  "lucide:cloud",
  "lucide:zap",
  "tabler:brand-github",
  "tabler:palette",
  "tabler:typography",
  "tabler:vector-bezier",
  "tabler:rocket",
  "tabler:bolt",
  "ph:sparkle",
  "ph:paint-brush",
  "ph:compass",
  "ph:lightbulb",
  "ph:leaf",
  "ph:planet",
  "mdi:language-typescript",
  "mdi:react",
  "ri:figma-line",
  "mdi:language-css3",
  "solar:magic-stick-3-linear",
  "solar:pallete-2-linear",
  "solar:layers-linear",
  "solar:crown-linear",
  "iconoir:design-pencil",
  "iconoir:color-filter",
  "iconoir:frame-tool",
  "iconoir:sparks",
  "heroicons:swatch",
  "heroicons:cube",
  "heroicons:command-line",
  "heroicons:photo",
  "fluent:design-ideas-24-regular",
  "fluent:color-24-regular",
  "fluent:text-font-24-regular",
  "fluent:shapes-24-regular",
  "material-symbols:brush-outline",
  "material-symbols:grid-view-outline",
  "material-symbols:format-shapes-outline",
  "material-symbols:auto-awesome-outline",
];
