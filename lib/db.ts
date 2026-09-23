import Dexie, { type EntityTable } from "dexie";
import type { StateStorage } from "zustand/middleware";

type KeyValueRecord = {
  key: string;
  value: string;
  updatedAt: number;
};

export type CachedIconRecord = {
  id: string;
  body: string;
  width: number;
  height: number;
  left?: number;
  top?: number;
  cachedAt: number;
};

class DesignHubDatabase extends Dexie {
  kv!: EntityTable<KeyValueRecord, "key">;
  icons!: EntityTable<CachedIconRecord, "id">;

  constructor() {
    super("designhub");
    this.version(1).stores({ kv: "key, updatedAt" });
    // v2: offline cache for Iconify glyphs the user has already seen.
    this.version(2).stores({ kv: "key, updatedAt", icons: "id, cachedAt" });
    // An older tab must let go, or this tab's upgrade would block forever.
    this.on("versionchange", () => {
      this.close();
      return false;
    });
  }
}

let database: DesignHubDatabase | null = null;
/** Set once IndexedDB has failed (private mode, blocked upgrade…); the app then runs memory-only. */
let unavailable = false;

export function getDatabase(): DesignHubDatabase | null {
  if (unavailable || typeof indexedDB === "undefined") return null;
  try {
    database ??= new DesignHubDatabase();
  } catch {
    unavailable = true;
    return null;
  }
  return database;
}

const DB_TIMEOUT = 2000;

/**
 * Runs a Dexie operation that must never break the app: it resolves to `fallback`
 * on error or after a timeout, and disables IndexedDB for the session on failure.
 */
export async function safeDb<T>(operation: (db: DesignHubDatabase) => Promise<T>, fallback: T): Promise<T> {
  const db = getDatabase();
  if (!db) return fallback;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      unavailable = true;
      resolve(fallback);
    }, DB_TIMEOUT);
  });
  try {
    return await Promise.race([operation(db), timeout]);
  } catch {
    unavailable = true;
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Zustand `persist` storage backed by IndexedDB (via Dexie).
 * Falls back to memory-only (a no-op) on the server, without IndexedDB, or when it fails.
 */
export const indexedDbStorage: StateStorage = {
  async getItem(name) {
    const record = await safeDb((db) => db.kv.get(name), undefined);
    return record?.value ?? null;
  },
  async setItem(name, value) {
    await safeDb((db) => db.kv.put({ key: name, value, updatedAt: Date.now() }), undefined);
  },
  async removeItem(name) {
    await safeDb((db) => db.kv.delete(name), undefined);
  },
};

/** Removes every locally stored DesignHub record. */
export async function clearLocalData(): Promise<void> {
  await safeDb((db) => Promise.all([db.kv.clear(), db.icons.clear()]), undefined);
}
