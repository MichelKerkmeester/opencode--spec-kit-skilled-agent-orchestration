// ---------------------------------------------------------------
// MODULE: History
// ---------------------------------------------------------------
// Tracks change history for memory entries (ADD, UPDATE, DELETE)
// ---------------------------------------------------------------

// External packages
import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. INTERFACES
----------------------------------------------------------------*/

/**
 * Describes the HistoryEntry shape.
 */
export interface HistoryEntry {
  id: string;
  memory_id: number;
  prev_value: string | null;
  new_value: string | null;
  event: 'ADD' | 'UPDATE' | 'DELETE';
  timestamp: string;
  is_deleted: number;
  actor: string;
}

/**
 * Describes the HistoryStats shape.
 */
export interface HistoryStats {
  total: number;
  adds: number;
  updates: number;
  deletes: number;
}

/* -------------------------------------------------------------
   2. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;

/* -------------------------------------------------------------
   3. INITIALIZATION
----------------------------------------------------------------*/

/**
 * Provides the init helper.
 */
export function init(database: Database.Database): void {
  db = database;

  database.exec(`
    CREATE TABLE IF NOT EXISTS memory_history (
      id TEXT PRIMARY KEY,
      memory_id INTEGER NOT NULL,
      prev_value TEXT,
      new_value TEXT,
      event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      is_deleted INTEGER DEFAULT 0,
      actor TEXT DEFAULT 'system' CHECK(actor IN ('user', 'system', 'hook', 'decay')),
      FOREIGN KEY (memory_id) REFERENCES memory_index(id)
    )
  `);
}

function getDatabase(): Database.Database {
  if (!db) throw new Error('[history] Database not initialized. Call init(db) first.');
  return db;
}

/* -------------------------------------------------------------
   4. UUID GENERATION
----------------------------------------------------------------*/

/**
 * Provides the generateUuid helper.
 */
export function generateUuid(): string {
  // Generate a v4 UUID (xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
  const hex = '0123456789abcdef';
  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  let uuid = '';
  for (let i = 0; i < template.length; i++) {
    const c = template[i];
    if (c === 'x') {
      uuid += hex[Math.floor(Math.random() * 16)];
    } else if (c === 'y') {
      // RFC 4122 variant: 8, 9, a, or b
      uuid += hex[(Math.floor(Math.random() * 4) + 8)];
    } else {
      uuid += c;
    }
  }
  return uuid;
}

/* -------------------------------------------------------------
   5. HISTORY OPERATIONS
----------------------------------------------------------------*/

/**
 * Provides the recordHistory helper.
 */
export function recordHistory(
  memoryId: number,
  event: 'ADD' | 'UPDATE' | 'DELETE',
  prevValue: string | null,
  newValue: string | null,
  actor: string
): string {
  const database = getDatabase();
  const id = generateUuid();

  database.prepare(`
    INSERT INTO memory_history (id, memory_id, event, prev_value, new_value, actor)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, memoryId, event, prevValue, newValue, actor);

  return id;
}

/**
 * Provides the getHistory helper.
 */
export function getHistory(memoryId: number, limit?: number): HistoryEntry[] {
  const database = getDatabase();

  const sql = limit != null
    ? 'SELECT * FROM memory_history WHERE memory_id = ? ORDER BY timestamp DESC, rowid DESC LIMIT ?'
    : 'SELECT * FROM memory_history WHERE memory_id = ? ORDER BY timestamp DESC, rowid DESC';

  const params: (number)[] = limit != null ? [memoryId, limit] : [memoryId];

  return database.prepare(sql).all(...params) as HistoryEntry[];
}

/**
 * Provides the getHistoryStats helper.
 */
export function getHistoryStats(specFolder?: string): HistoryStats {
  const database = getDatabase();

  if (specFolder) {
    const row = database.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN h.event = 'ADD' THEN 1 ELSE 0 END) as adds,
        SUM(CASE WHEN h.event = 'UPDATE' THEN 1 ELSE 0 END) as updates,
        SUM(CASE WHEN h.event = 'DELETE' THEN 1 ELSE 0 END) as deletes
      FROM memory_history h
      JOIN memory_index m ON h.memory_id = m.id
      WHERE m.spec_folder = ?
    `).get(specFolder) as Record<string, number>;

    return {
      total: row.total ?? 0,
      adds: row.adds ?? 0,
      updates: row.updates ?? 0,
      deletes: row.deletes ?? 0,
    };
  }

  const row = database.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN event = 'ADD' THEN 1 ELSE 0 END) as adds,
      SUM(CASE WHEN event = 'UPDATE' THEN 1 ELSE 0 END) as updates,
      SUM(CASE WHEN event = 'DELETE' THEN 1 ELSE 0 END) as deletes
    FROM memory_history
  `).get() as Record<string, number>;

  return {
    total: row.total ?? 0,
    adds: row.adds ?? 0,
    updates: row.updates ?? 0,
    deletes: row.deletes ?? 0,
  };
}
