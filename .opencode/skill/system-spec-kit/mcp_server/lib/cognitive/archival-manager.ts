// ───────────────────────────────────────────────────────────────
// MODULE: Archival Manager
// ───────────────────────────────────────────────────────────────
// Feature catalog: Automatic archival subsystem
// Background archival job for dormant/archived memories
import type Database from 'better-sqlite3';

/* ───────────────────────────────────────────────────────────────
   1. DEPENDENCIES (lazy-loaded)
----------------------------------------------------------------*/

interface EmbeddingModule {
  generateDocumentEmbedding: (content: string) => Promise<Float32Array | null>;
}

function __setEmbeddingsModuleForTests(module: EmbeddingModule | null): void {
  void module;
}

/* ───────────────────────────────────────────────────────────────
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

/* ───────────────────────────────────────────────────────────────
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

/* ───────────────────────────────────────────────────────────────
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

/* ───────────────────────────────────────────────────────────────
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
    const hasArchived = columns.some(c => c.name === 'is_archived'); // DEPRECATED legacy schema ballast

    if (!hasArchived) {
      db.exec('ALTER TABLE memory_index ADD COLUMN is_archived INTEGER DEFAULT 0'); // DEPRECATED legacy schema ballast
      db.exec('CREATE INDEX IF NOT EXISTS idx_archived ON memory_index(is_archived)'); // DEPRECATED legacy schema ballast
      console.error('[archival-manager] Added is_archived column'); // DEPRECATED legacy schema ballast
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
          archivalStats.lastScanTime = row.value === '' ? null : row.value || null;
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
      upsert.run('lastScanTime', archivalStats.lastScanTime ?? '');
    });

    saveAll();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[archival-manager] saveArchivalStats error: ${msg}`);
  }
}

/* ───────────────────────────────────────────────────────────────
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
  void limit;
  return [];
}

function checkMemoryArchivalStatus(memoryId: number): {
  isArchived: boolean;
  shouldArchive: boolean;
} {
  void memoryId;
  return { isArchived: false, shouldArchive: false };
}


function archiveMemory(memoryId: number): boolean {
  void memoryId;
  return false;
}

function archiveBatch(memoryIds: number[]): { archived: number; failed: number } {
  return { archived: 0, failed: memoryIds.length };
}

function unarchiveMemory(memoryId: number): boolean {
  void memoryId;
  return false;
}

/* ───────────────────────────────────────────────────────────────
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
  if (!ARCHIVAL_CONFIG.enabled) {
    return;
  }

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

/* ───────────────────────────────────────────────────────────────
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

/* ───────────────────────────────────────────────────────────────
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

  // Tests
  __setEmbeddingsModuleForTests,
};

export type {
  ArchivalConfigType,
  ArchivalCandidate,
  ArchivalStats,
};
