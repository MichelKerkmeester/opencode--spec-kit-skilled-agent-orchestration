/* ───────────────────────────────────────────────────────────────
   2. MODULE STATE
----------------------------------------------------------------*/
let db = null;
let insertHistoryStatement = null;
let resolveSpecFolderStatement = null;
let resolveHistorySpecFolderStatement = null;
const specFolderCache = new Map();
const SPEC_FOLDER_CACHE_MAX = 5000;
/* ───────────────────────────────────────────────────────────────
   3. INITIALIZATION
----------------------------------------------------------------*/
/**
 * Provides the init helper.
 */
export function init(database) {
    db = database;
    database.exec(`
    CREATE TABLE IF NOT EXISTS memory_history (
      id TEXT PRIMARY KEY,
      memory_id INTEGER NOT NULL,
      spec_folder TEXT,
      prev_value TEXT,
      new_value TEXT,
      event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      is_deleted INTEGER DEFAULT 0,
      actor TEXT DEFAULT 'system'
    )
  `);
    // Migration: rebuild table when legacy constraints are detected.
    // Removes: CHECK(actor IN ...) that blocked mcp:* actors,
    // FOREIGN KEY that prevented DELETE history from surviving parent deletion.
    const tableInfo = database.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_history'").get();
    if (tableInfo?.sql && (tableInfo.sql.includes('CHECK(actor IN') || tableInfo.sql.includes('FOREIGN KEY'))) {
        const hasMemoryIndexTable = hasTable(database, 'memory_index');
        database.exec(`
      ALTER TABLE memory_history RENAME TO memory_history_old;
      CREATE TABLE memory_history (
        id TEXT PRIMARY KEY,
        memory_id INTEGER NOT NULL,
        spec_folder TEXT,
        prev_value TEXT,
        new_value TEXT,
        event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0,
        actor TEXT DEFAULT 'system'
      );
    `);
        if (hasMemoryIndexTable) {
            database.exec(`
        INSERT INTO memory_history (id, memory_id, spec_folder, prev_value, new_value, event, timestamp, is_deleted, actor)
        SELECT h.id, h.memory_id, m.spec_folder, h.prev_value, h.new_value, h.event, h.timestamp, h.is_deleted, h.actor
        FROM memory_history_old h
        LEFT JOIN memory_index m ON m.id = h.memory_id;
        DROP TABLE memory_history_old;
      `);
        }
        else {
            database.exec(`
        INSERT INTO memory_history (id, memory_id, spec_folder, prev_value, new_value, event, timestamp, is_deleted, actor)
        SELECT id, memory_id, NULL, prev_value, new_value, event, timestamp, is_deleted, actor
        FROM memory_history_old;
        DROP TABLE memory_history_old;
      `);
        }
    }
    if (!hasColumn(database, 'memory_history', 'spec_folder')) {
        database.exec('ALTER TABLE memory_history ADD COLUMN spec_folder TEXT');
    }
    if (hasTable(database, 'memory_index')) {
        database.exec(`
      UPDATE memory_history
      SET spec_folder = (
        SELECT m.spec_folder FROM memory_index m WHERE m.id = memory_history.memory_id
      )
      WHERE spec_folder IS NULL
        AND EXISTS (SELECT 1 FROM memory_index m WHERE m.id = memory_history.memory_id)
    `);
    }
    database.exec('CREATE INDEX IF NOT EXISTS idx_history_memory ON memory_history(memory_id, timestamp)');
    database.exec('CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)');
    database.exec('CREATE INDEX IF NOT EXISTS idx_history_spec_folder ON memory_history(spec_folder, event, timestamp DESC)');
    specFolderCache.clear();
    insertHistoryStatement = database.prepare(`
    INSERT INTO memory_history (id, memory_id, event, prev_value, new_value, actor, spec_folder)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
    resolveSpecFolderStatement = database.prepare('SELECT spec_folder FROM memory_index WHERE id = ? LIMIT 1');
    resolveHistorySpecFolderStatement = database.prepare(`
    SELECT spec_folder
    FROM memory_history
    WHERE memory_id = ?
      AND spec_folder IS NOT NULL
      AND trim(spec_folder) <> ''
    ORDER BY timestamp DESC, rowid DESC
    LIMIT 1
  `);
}
function hasTable(database, tableName) {
    const row = database.prepare("SELECT 1 as present FROM sqlite_master WHERE type='table' AND name = ? LIMIT 1").get(tableName);
    return row?.present === 1;
}
function hasColumn(database, tableName, columnName) {
    const columns = database.prepare(`PRAGMA table_info(${tableName})`).all();
    return columns.some((column) => column.name === columnName);
}
function normalizeHistoryValue(value) {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value === 'number'
        || typeof value === 'boolean'
        || typeof value === 'bigint') {
        return String(value);
    }
    try {
        return JSON.stringify(value);
    }
    catch (_error) {
        return String(value);
    }
}
function normalizeSpecFolder(specFolder) {
    if (typeof specFolder !== 'string') {
        return null;
    }
    const trimmed = specFolder.trim();
    return trimmed.length > 0 ? trimmed : null;
}
function setSpecFolderCache(memoryId, specFolder) {
    if (!Number.isInteger(memoryId) || memoryId <= 0) {
        return;
    }
    if (specFolderCache.size >= SPEC_FOLDER_CACHE_MAX) {
        const oldestKey = specFolderCache.keys().next().value;
        if (typeof oldestKey === 'number') {
            specFolderCache.delete(oldestKey);
        }
    }
    specFolderCache.set(memoryId, specFolder);
}
function resolveSpecFolder(memoryId, override) {
    const normalizedOverride = normalizeSpecFolder(override);
    if (normalizedOverride) {
        setSpecFolderCache(memoryId, normalizedOverride);
        return normalizedOverride;
    }
    const cached = specFolderCache.get(memoryId);
    if (cached !== undefined) {
        return cached;
    }
    if (!resolveSpecFolderStatement) {
        return null;
    }
    const row = resolveSpecFolderStatement.get(memoryId);
    const resolvedFromIndex = normalizeSpecFolder(row?.spec_folder ?? null);
    if (resolvedFromIndex) {
        setSpecFolderCache(memoryId, resolvedFromIndex);
        return resolvedFromIndex;
    }
    if (!resolveHistorySpecFolderStatement) {
        setSpecFolderCache(memoryId, null);
        return null;
    }
    const historyRow = resolveHistorySpecFolderStatement.get(memoryId);
    const resolved = normalizeSpecFolder(historyRow?.spec_folder ?? null);
    setSpecFolderCache(memoryId, resolved);
    return resolved;
}
function getDatabase() {
    if (!db)
        throw new Error('[history] Database not initialized. Call init(db) first.');
    return db;
}
/* ───────────────────────────────────────────────────────────────
   4. UUID GENERATION
----------------------------------------------------------------*/
/**
 * Provides the generateUuid helper.
 */
export function generateUuid() {
    // Generate a v4 UUID (xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
    const hex = '0123456789abcdef';
    const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    let uuid = '';
    for (let i = 0; i < template.length; i++) {
        const c = template[i];
        if (c === 'x') {
            uuid += hex[Math.floor(Math.random() * 16)];
        }
        else if (c === 'y') {
            // RFC 4122 variant: 8, 9, a, or b
            uuid += hex[(Math.floor(Math.random() * 4) + 8)];
        }
        else {
            uuid += c;
        }
    }
    return uuid;
}
/* ───────────────────────────────────────────────────────────────
   5. HISTORY OPERATIONS
----------------------------------------------------------------*/
/**
 * Provides the recordHistory helper.
 */
export function recordHistory(memoryId, event, prevValue, newValue, actor, specFolder) {
    const database = getDatabase();
    const id = generateUuid();
    const prevValueText = normalizeHistoryValue(prevValue);
    const newValueText = normalizeHistoryValue(newValue);
    const normalizedActor = actor.trim() || 'system';
    const resolvedSpecFolder = resolveSpecFolder(memoryId, specFolder);
    if (!insertHistoryStatement) {
        insertHistoryStatement = database.prepare(`
      INSERT INTO memory_history (id, memory_id, event, prev_value, new_value, actor, spec_folder)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    }
    insertHistoryStatement.run(id, memoryId, event, prevValueText, newValueText, normalizedActor, resolvedSpecFolder);
    return id;
}
/**
 * Provides the getHistory helper.
 */
export function getHistory(memoryId, limit) {
    const database = getDatabase();
    const sql = limit != null
        ? 'SELECT * FROM memory_history WHERE memory_id = ? ORDER BY timestamp DESC, rowid DESC LIMIT ?'
        : 'SELECT * FROM memory_history WHERE memory_id = ? ORDER BY timestamp DESC, rowid DESC';
    const params = limit != null ? [memoryId, limit] : [memoryId];
    return database.prepare(sql).all(...params);
}
/**
 * Returns chronological history events for lineage backfill/replay helpers.
 */
export function getHistoryEventsForLineage(memoryId, databaseOverride) {
    const database = databaseOverride ?? getDatabase();
    const rows = database.prepare(`
    SELECT id, memory_id, event, timestamp, actor, prev_value, new_value
    FROM memory_history
    WHERE memory_id = ?
    ORDER BY timestamp ASC, rowid ASC
  `).all(memoryId);
    return rows.map((row) => ({
        id: row.id,
        memoryId: row.memory_id,
        event: row.event,
        timestamp: row.timestamp,
        actor: row.actor,
        prevValue: row.prev_value,
        newValue: row.new_value,
    }));
}
/**
 * Returns the lightweight history facts used to bridge legacy history into
 * Lineage inspection and backfill metadata.
 */
export function getLineageTransitionAnchors(memoryId) {
    return getHistory(memoryId).map((entry) => ({
        memory_id: entry.memory_id,
        event: entry.event,
        timestamp: entry.timestamp,
        actor: entry.actor,
    }));
}
/**
 * Provides the getHistoryStats helper.
 */
export function getHistoryStats(specFolder) {
    const database = getDatabase();
    if (specFolder) {
        const row = database.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN h.event = 'ADD' THEN 1 ELSE 0 END) as adds,
        SUM(CASE WHEN h.event = 'UPDATE' THEN 1 ELSE 0 END) as updates,
        SUM(CASE WHEN h.event = 'DELETE' THEN 1 ELSE 0 END) as deletes
      FROM memory_history h
      WHERE h.spec_folder = ?
         OR (
           h.spec_folder IS NULL
           AND EXISTS (
             SELECT 1 FROM memory_index m
             WHERE m.id = h.memory_id
               AND m.spec_folder = ?
           )
         )
         OR (
           h.spec_folder IS NULL
           AND EXISTS (
             SELECT 1 FROM memory_history hx
             WHERE hx.memory_id = h.memory_id
               AND hx.spec_folder = ?
           )
         )
    `).get(specFolder, specFolder, specFolder);
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
  `).get();
    return {
        total: row.total ?? 0,
        adds: row.adds ?? 0,
        updates: row.updates ?? 0,
        deletes: row.deletes ?? 0,
    };
}
//# sourceMappingURL=history.js.map