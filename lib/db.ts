import Dexie, { type EntityTable } from "dexie";
import type { StateStorage } from "zustand/middleware";

type KeyValueRecord = {
  key: string;
  value: string;
  updatedAt: number;
};

class DesignHubDatabase extends Dexie {
  kv!: EntityTable<KeyValueRecord, "key">;

  constructor() {
    super("designhub");
    this.version(1).stores({ kv: "key, updatedAt" });
  }
}

let database: DesignHubDatabase | null = null;

function getDatabase(): DesignHubDatabase | null {
  if (typeof indexedDB === "undefined") return null;
  database ??= new DesignHubDatabase();
  return database;
}

/**
 * Zustand `persist` storage backed by IndexedDB (via Dexie).
 * Falls back to a no-op on the server or in browsers without IndexedDB.
 */
export const indexedDbStorage: StateStorage = {
  async getItem(name) {
    const db = getDatabase();
    if (!db) return null;
    const record = await db.kv.get(name);
    return record?.value ?? null;
  },
  async setItem(name, value) {
    const db = getDatabase();
    if (!db) return;
    await db.kv.put({ key: name, value, updatedAt: Date.now() });
  },
  async removeItem(name) {
    const db = getDatabase();
    if (!db) return;
    await db.kv.delete(name);
  },
};

/** Removes every locally stored DesignHub record. */
export async function clearLocalData(): Promise<void> {
  const db = getDatabase();
  if (db) await db.kv.clear();
}
