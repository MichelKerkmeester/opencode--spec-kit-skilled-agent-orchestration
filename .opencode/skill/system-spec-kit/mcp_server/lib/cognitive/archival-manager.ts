// ---------------------------------------------------------------
// MODULE: Archival Manager
// Background archival job for dormant/archived memories
// ---------------------------------------------------------------

import type Database from 'better-sqlite3';

/* -------------------------------------------------------------
   1. DEPENDENCIES (lazy-loaded)
----------------------------------------------------------------*/

// Lazy-load tier-classifier to avoid circular dependencies
let tierClassifierModule: Record<string, unknown> | null = null;

function getTierClassifier(): Record<string, unknown> | null {
  if (tierClassifierModule !== null) return tierClassifierModule;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    tierClassifierModule = require('./tier-classifier');
    return tierClassifierModule;
  } catch {
    return null;
  }
}

interface Bm25IndexModule {
  isBm25Enabled: () => boolean;
  getIndex: () => {
    removeDocument: (id: string) => boolean;
    addDocument: (id: string, text: string) => void;
  };
}

let bm25IndexModule: Bm25IndexModule | null = null;

function getBm25Index(): Bm25IndexModule | null {
  if (bm25IndexModule !== null) return bm25IndexModule;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    bm25IndexModule = require('../search/bm25-index') as Bm25IndexModule;
    return bm25IndexModule;
  } catch {
    try {
      // Support cache/cognitive symlink import path in some runtime setups.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      bm25IndexModule = require('../../search/bm25-index') as Bm25IndexModule;
      return bm25IndexModule;
    } catch {
      return null;
    }
  }
}

/* -------------------------------------------------------------
   2. CONFIGURATION
----------------------------------------------------------------*/

interface ArchivalConfigType {
  enabled: boolean;
  scanIntervalMs: number;
  batchSize: number;
  maxAgeDays: number;
  maxAccessCount: number;
  maxConfidence: number;
  protectedTiers: string[];
  backgroundJobIntervalMs: number;
}

const ARCHIVAL_CONFIG: ArchivalConfigType = {
  enabled: process.env.SPECKIT_ARCHIVAL !== 'false',
  scanIntervalMs: 3600000, // 1 hour
  batchSize: 50,
  maxAgeDays: 90,
  maxAccessCount: 2,
  maxConfidence: 0.4,
  protectedTiers: ['constitutional', 'critical'],
  backgroundJobIntervalMs: 7200000, // 2 hours
};

/* -------------------------------------------------------------
   3. INTERFACES
----------------------------------------------------------------*/

interface ArchivalCandidate {
  id: number;
  title: string | null;
  spec_folder: string;
  file_path: string;
  created_at: string;
  importance_tier: string;
  access_count: number;
  confidence: number;
  reason: string;
}

interface ArchivalStats {
  totalScanned: number;
  totalArchived: number;
  totalUnarchived: number;
  lastScanTime: string | null;
  errors: string[];
}

/* -------------------------------------------------------------
   4. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;
let backgroundJob: ReturnType<typeof setInterval> | null = null;

const archivalStats: ArchivalStats = {
  totalScanned: 0,
  totalArchived: 0,
  totalUnarchived: 0,
  lastScanTime: null,
  errors: [],
};

/* -------------------------------------------------------------
   5. INITIALIZATION
----------------------------------------------------------------*/

function init(database: Database.Database): void {
  db = database;
  ensureArchivedColumn();
  ensureArchivalStatsTable();
  loadArchivalStats();
}

function ensureArchivedColumn(): void {
  if (!db) return;

  try {
    const columns = (db.prepare('PRAGMA table_info(memory_index)') as Database.Statement).all() as Array<{ name: string }>;
    const hasArchived = columns.some(c => c.name === 'is_archived');

    if (!hasArchived) {
      db.exec('ALTER TABLE memory_index ADD COLUMN is_archived INTEGER DEFAULT 0');
      db.exec('CREATE INDEX IF NOT EXISTS idx_archived ON memory_index(is_archived)');
      console.error('[archival-manager] Added is_archived column');
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (!msg.includes('duplicate column')) {
      console.warn(`[archival-manager] ensureArchivedColumn error: ${msg}`);
    }
  }
}

/**
 * Ensure the archival_stats metadata table exists for persisting stats across restarts (P5-06).
 */
function ensureArchivalStatsTable(): void {
  if (!db) return;

  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS archival_stats (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[archival-manager] ensureArchivalStatsTable error: ${msg}`);
  }
}

/**
 * Load archival stats from the database on startup (P5-06).
 */
function loadArchivalStats(): void {
  if (!db) return;

  try {
    const rows = (db.prepare(
      'SELECT key, value FROM archival_stats'
    ) as Database.Statement).all() as Array<{ key: string; value: string }>;

    for (const row of rows) {
      switch (row.key) {
        case 'totalScanned':
          archivalStats.totalScanned = parseInt(row.value, 10) || 0;
          break;
        case 'totalArchived':
          archivalStats.totalArchived = parseInt(row.value, 10) || 0;
          break;
        case 'totalUnarchived':
          archivalStats.totalUnarchived = parseInt(row.value, 10) || 0;
          break;
        case 'lastScanTime':
          archivalStats.lastScanTime = row.value || null;
          break;
      }
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[archival-manager] loadArchivalStats error: ${msg}`);
  }
}

/**
 * Persist archival stats to the database (P5-06).
 */
function saveArchivalStats(): void {
  if (!db) return;

  try {
    const upsert = db.prepare(`
      INSERT INTO archival_stats (key, value, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `) as Database.Statement;

    const saveAll = db.transaction(() => {
      upsert.run('totalScanned', String(archivalStats.totalScanned));
      upsert.run('totalArchived', String(archivalStats.totalArchived));
      upsert.run('totalUnarchived', String(archivalStats.totalUnarchived));
      if (archivalStats.lastScanTime) {
        upsert.run('lastScanTime', archivalStats.lastScanTime);
      }
    });

    saveAll();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[archival-manager] saveArchivalStats error: ${msg}`);
  }
}

/* -------------------------------------------------------------
   6. ARCHIVAL FUNCTIONS
----------------------------------------------------------------*/

/**
 * Get archival candidates using SQL as a pre-filter, then FSRS tier classifier
 * as the authoritative decision.
 *
 * Strategy: SQL query fetches broad candidates (unarchived, not protected, not pinned).
 * The FSRS-based tier classifier then determines which should actually be archived.
 * This unifies the dual archival paths (P5-05) — FSRS is primary, SQL is pre-filter.
 */
function getArchivalCandidates(limit: number = ARCHIVAL_CONFIG.batchSize): ArchivalCandidate[] {
  if (!db) return [];

  try {
    const protectedList = ARCHIVAL_CONFIG.protectedTiers.map(() => '?').join(',');

    // Broad SQL pre-filter: get unarchived, non-protected, non-pinned memories
    const rows = (db.prepare(`
      SELECT *
      FROM memory_index
      WHERE (is_archived IS NULL OR is_archived = 0)
        AND importance_tier NOT IN (${protectedList})
        AND is_pinned = 0
      ORDER BY last_accessed ASC NULLS FIRST, access_count ASC
      LIMIT ?
    `) as Database.Statement).all(
      ...ARCHIVAL_CONFIG.protectedTiers,
      limit * 3  // Fetch extra since FSRS will filter further
    ) as Array<Record<string, unknown>>;

    // Use FSRS-based tier classifier as authoritative archival decision
    const classifier = getTierClassifier();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - ARCHIVAL_CONFIG.maxAgeDays);

    const candidates: ArchivalCandidate[] = [];

    for (const row of rows) {
      let shouldArchiveRow = false;

      if (classifier && typeof classifier.shouldArchive === 'function') {
        // Primary: FSRS-based decision
        shouldArchiveRow = classifier.shouldArchive(row) as boolean;
      } else {
        // Fallback: SQL-based criteria only when FSRS is unavailable
        shouldArchiveRow = (
          row.created_at != null &&
          new Date(row.created_at as string) < cutoffDate &&
          ((row.access_count as number) || 0) <= ARCHIVAL_CONFIG.maxAccessCount &&
          ((row.confidence as number) || 0.5) <= ARCHIVAL_CONFIG.maxConfidence
        );
      }

      if (shouldArchiveRow) {
        candidates.push({
          id: row.id as number,
          title: row.title as string | null,
          spec_folder: row.spec_folder as string,
          file_path: row.file_path as string,
          created_at: row.created_at as string,
          importance_tier: row.importance_tier as string,
          access_count: (row.access_count as number) || 0,
          confidence: (row.confidence as number) || 0.5,
          reason: determineArchivalReason(row, cutoffDate),
        });

        if (candidates.length >= limit) break;
      }
    }

    return candidates;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[archival-manager] getArchivalCandidates error: ${msg}`);
    return [];
  }
}

function determineArchivalReason(row: Record<string, unknown>, cutoffDate: Date): string {
  const reasons: string[] = [];
  if (row.created_at && new Date(row.created_at as string) < cutoffDate) {
    reasons.push('aged');
  }
  if ((row.access_count as number) <= ARCHIVAL_CONFIG.maxAccessCount) {
    reasons.push('low-access');
  }
  if ((row.confidence as number) <= ARCHIVAL_CONFIG.maxConfidence) {
    reasons.push('low-confidence');
  }
  return reasons.join(', ') || 'candidate';
}

function checkMemoryArchivalStatus(memoryId: number): {
  isArchived: boolean;
  shouldArchive: boolean;
} {
  if (!db) return { isArchived: false, shouldArchive: false };

  try {
    const memory = (db.prepare(
      'SELECT * FROM memory_index WHERE id = ?'
    ) as Database.Statement).get(memoryId) as Record<string, unknown> | undefined;

    if (!memory) return { isArchived: false, shouldArchive: false };

    const isArchived = (memory.is_archived as number) === 1;

    // Check with tier classifier if available
    const classifier = getTierClassifier();
    let shouldArchive = false;
    if (classifier && typeof classifier.shouldArchive === 'function') {
      shouldArchive = classifier.shouldArchive(memory) as boolean;
    }

    return { isArchived, shouldArchive };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[archival-manager] checkMemoryArchivalStatus error: ${msg}`);
    return { isArchived: false, shouldArchive: false };
  }
}

function getMemoryIndexColumns(): Set<string> {
  if (!db) return new Set();

  try {
    const columns = (db.prepare('PRAGMA table_info(memory_index)') as Database.Statement).all() as Array<{ name: string }>;
    return new Set(columns.map(column => column.name));
  } catch {
    return new Set();
  }
}

function syncBm25OnArchive(memoryId: number): void {
  const bm25 = getBm25Index();
  if (!db || !bm25 || !bm25.isBm25Enabled()) return;

  try {
    bm25.getIndex().removeDocument(String(memoryId));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[archival-manager] BM25 archive sync failed: ${msg}`);
  }
}

function syncBm25OnUnarchive(memoryId: number): void {
  const bm25 = getBm25Index();
  if (!db || !bm25 || !bm25.isBm25Enabled()) return;

  try {
    const columns = getMemoryIndexColumns();
    const searchableColumns = ['title', 'content_text', 'trigger_phrases', 'file_path']
      .filter(column => columns.has(column));

    if (searchableColumns.length === 0) return;

    const query = `SELECT ${searchableColumns.join(', ')} FROM memory_index WHERE id = ? AND is_archived = 0`;
    const row = (db.prepare(query) as Database.Statement).get(memoryId) as Record<string, unknown> | undefined;
    if (!row) return;

    const text = searchableColumns
      .map(column => {
        const value = row[column];
        return typeof value === 'string' ? value.trim() : '';
      })
      .filter(Boolean)
      .join(' ');

    if (!text) return;
    bm25.getIndex().addDocument(String(memoryId), text);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[archival-manager] BM25 unarchive sync failed: ${msg}`);
  }
}

function archiveMemory(memoryId: number): boolean {
  if (!db) return false;

  try {
    const result = (db.prepare(`
      UPDATE memory_index
      SET is_archived = 1,
          updated_at = datetime('now')
      WHERE id = ?
        AND (is_archived IS NULL OR is_archived = 0)
    `) as Database.Statement).run(memoryId);

    const success = (result as { changes: number }).changes > 0;
    if (success) {
      archivalStats.totalArchived++;
      syncBm25OnArchive(memoryId);
      saveArchivalStats();
    }
    return success;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    const MAX_ERROR_LOG = 100;
    archivalStats.errors.push(msg);
    if (archivalStats.errors.length > MAX_ERROR_LOG) {
      archivalStats.errors = archivalStats.errors.slice(-MAX_ERROR_LOG);
    }
    console.warn(`[archival-manager] archiveMemory error: ${msg}`);
    return false;
  }
}

function archiveBatch(memoryIds: number[]): { archived: number; failed: number } {
  let archived = 0;
  let failed = 0;

  for (const id of memoryIds) {
    if (archiveMemory(id)) {
      archived++;
    } else {
      failed++;
    }
  }

  return { archived, failed };
}

function unarchiveMemory(memoryId: number): boolean {
  if (!db) return false;

  try {
    const result = (db.prepare(`
      UPDATE memory_index
      SET is_archived = 0,
          updated_at = datetime('now')
      WHERE id = ? AND is_archived = 1
    `) as Database.Statement).run(memoryId);

    const success = (result as { changes: number }).changes > 0;
    if (success) {
      archivalStats.totalUnarchived++;
      syncBm25OnUnarchive(memoryId);
      saveArchivalStats();
    }
    return success;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[archival-manager] unarchiveMemory error: ${msg}`);
    return false;
  }
}

/* -------------------------------------------------------------
   7. SCANNING & BACKGROUND JOBS
----------------------------------------------------------------*/

function runArchivalScan(): { scanned: number; archived: number } {
  const candidates = getArchivalCandidates();
  archivalStats.totalScanned += candidates.length;
  archivalStats.lastScanTime = new Date().toISOString();

  const result = archiveBatch(candidates.map(c => c.id));

  // Persist updated stats (P5-06)
  saveArchivalStats();

  console.error(
    `[archival-manager] Scan complete: ${candidates.length} candidates, ${result.archived} archived`
  );

  return { scanned: candidates.length, archived: result.archived };
}

function startBackgroundJob(intervalMs: number = ARCHIVAL_CONFIG.backgroundJobIntervalMs): void {
  if (backgroundJob) {
    clearInterval(backgroundJob);
  }

  backgroundJob = setInterval(() => {
    try {
      runArchivalScan();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[archival-manager] Background job error: ${msg}`);
    }
  }, intervalMs);

  if (backgroundJob.unref) {
    backgroundJob.unref();
  }

  console.error(`[archival-manager] Background job started (interval: ${intervalMs / 1000}s)`);
}

function stopBackgroundJob(): void {
  if (backgroundJob) {
    clearInterval(backgroundJob);
    backgroundJob = null;
    console.error('[archival-manager] Background job stopped');
  }
}

function isBackgroundJobRunning(): boolean {
  return backgroundJob !== null;
}

/* -------------------------------------------------------------
   8. STATS & CLEANUP
----------------------------------------------------------------*/

function getStats(): ArchivalStats {
  return { ...archivalStats };
}

function getRecentErrors(limit: number = 10): string[] {
  return archivalStats.errors.slice(-limit);
}

function resetStats(): void {
  archivalStats.totalScanned = 0;
  archivalStats.totalArchived = 0;
  archivalStats.totalUnarchived = 0;
  archivalStats.lastScanTime = null;
  archivalStats.errors = [];
  saveArchivalStats();
}

function cleanup(): void {
  stopBackgroundJob();
  db = null;
}

/* -------------------------------------------------------------
   9. EXPORTS
----------------------------------------------------------------*/

export {
  ARCHIVAL_CONFIG,

  // Initialization
  init,
  ensureArchivedColumn,

  // Archival operations
  getArchivalCandidates,
  checkMemoryArchivalStatus,
  archiveMemory,
  archiveBatch,
  unarchiveMemory,

  // Scanning
  runArchivalScan,
  startBackgroundJob,
  stopBackgroundJob,
  isBackgroundJobRunning,

  // Stats
  getStats,
  getRecentErrors,
  resetStats,
  cleanup,
};

export type {
  ArchivalConfigType,
  ArchivalCandidate,
  ArchivalStats,
};
