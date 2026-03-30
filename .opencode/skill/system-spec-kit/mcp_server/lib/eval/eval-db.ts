// ───────────────────────────────────────────────────────────────
// MODULE: Eval Db
// ───────────────────────────────────────────────────────────────
// Feature catalog: Evaluation database and schema
// Separate evaluation database with 5 tables for tracking
// Retrieval quality metrics, ground truth, and eval results.
// Node stdlib
import * as path from 'path';
import * as fs from 'fs';

// External packages
import Database from 'better-sqlite3';

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

// Follow same env-var precedence as main DB (vector-index-impl.ts)
// P1-05: SPEC_KIT_DB_DIR (canonical) > MEMORY_DB_DIR (legacy) > default
const DEFAULT_DB_DIR: string =
  process.env.SPEC_KIT_DB_DIR ||
  process.env.MEMORY_DB_DIR ||
  path.resolve(import.meta.dirname, '../../database');

const EVAL_DB_FILENAME = 'speckit-eval.db';

/* ───────────────────────────────────────────────────────────────
   2. MODULE STATE (singleton pattern matching main DB)
──────────────────────────────────────────────────────────────── */

let evalDb: Database.Database | null = null;
let evalDbPath: string | null = null;

/* ───────────────────────────────────────────────────────────────
   3. SCHEMA DDL
──────────────────────────────────────────────────────────────── */

const EVAL_SCHEMA_SQL = `
  -- Evaluation queries with metadata
  CREATE TABLE IF NOT EXISTS eval_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    intent TEXT,
    spec_folder TEXT,
    expected_memory_ids TEXT,
    difficulty TEXT DEFAULT 'medium',
    category TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Per-channel results for each query evaluation
  CREATE TABLE IF NOT EXISTS eval_channel_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eval_run_id INTEGER NOT NULL,
    query_id INTEGER NOT NULL,
    channel TEXT NOT NULL,
    result_memory_ids TEXT,
    scores TEXT,
    latency_ms REAL,
    hit_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Final fused results after RRF/fusion
  CREATE TABLE IF NOT EXISTS eval_final_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eval_run_id INTEGER NOT NULL,
    query_id INTEGER NOT NULL,
    result_memory_ids TEXT,
    scores TEXT,
    fusion_method TEXT DEFAULT 'rrf',
    latency_ms REAL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Ground truth relevance judgments
  CREATE TABLE IF NOT EXISTS eval_ground_truth (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query_id INTEGER NOT NULL,
    memory_id INTEGER NOT NULL,
    relevance INTEGER NOT NULL DEFAULT 0,
    annotator TEXT DEFAULT 'auto',
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(query_id, memory_id)
  );

  -- Metric snapshots for tracking over time
  CREATE TABLE IF NOT EXISTS eval_metric_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eval_run_id INTEGER NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    channel TEXT,
    query_count INTEGER,
    metadata TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_metric_snapshots_run
    ON eval_metric_snapshots (eval_run_id, metric_name, created_at);

  CREATE INDEX IF NOT EXISTS idx_channel_results_run
    ON eval_channel_results (eval_run_id, channel, query_id);

  CREATE INDEX IF NOT EXISTS idx_final_results_run
    ON eval_final_results (eval_run_id, query_id);
`;

/* ───────────────────────────────────────────────────────────────
   4. INITIALIZATION
──────────────────────────────────────────────────────────────── */

/**
 * Initialize the evaluation database.
 * Creates the DB file in dataDir (same directory as main DB) and
 * ensures all 5 eval tables exist. Safe to call multiple times (idempotent).
 *
 * @param dataDir - Directory where the DB file will be created.
 *                  Defaults to same dir as main DB.
 */
function initEvalDb(dataDir?: string): Database.Database {
  const resolvedDir = dataDir || DEFAULT_DB_DIR;
  const dbPath = path.join(resolvedDir, EVAL_DB_FILENAME);

  // Return singleton if already initialized to the same path
  if (evalDb && evalDbPath === dbPath) {
    return evalDb;
  }

  // Close previous handle if path changed
  if (evalDb) {
    try { evalDb.close(); } catch (err) { console.warn('[eval-db] initEvalDb close-before-switch warning:', err instanceof Error ? err.message : String(err)); }
    evalDb = null;
    evalDbPath = null;
  }

  // Ensure the directory exists
  if (!fs.existsSync(resolvedDir)) {
    fs.mkdirSync(resolvedDir, { recursive: true });
  }

  const db = new Database(dbPath);

  // Enable WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL');
  db.pragma('busy_timeout = 5000');
  db.pragma('foreign_keys = ON');

  // Create all 5 eval tables (idempotent via IF NOT EXISTS)
  db.exec(EVAL_SCHEMA_SQL);

  evalDb = db;
  evalDbPath = dbPath;

  return db;
}

/**
 * Get the singleton eval DB instance.
 * Throws if initEvalDb() has not been called.
 */
function getEvalDb(): Database.Database {
  if (!evalDb) {
    throw new Error('[eval-db] Eval database not initialized. Call initEvalDb() first.');
  }
  return evalDb;
}

/**
 * Get the path to the eval DB file.
 * Returns null if not yet initialized.
 */
function getEvalDbPath(): string | null {
  return evalDbPath;
}

/**
 * Close and reset the eval DB singleton (useful for tests).
 */
function closeEvalDb(): void {
  if (evalDb) {
    try {
      evalDb.close();
    } catch (err) {
      console.warn('[eval-db] closeEvalDb warning:', err instanceof Error ? err.message : String(err));
    }
    evalDb = null;
    evalDbPath = null;
  }
}

/* ───────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  initEvalDb,
  getEvalDb,
  getEvalDbPath,
  closeEvalDb,
  DEFAULT_DB_DIR,
  EVAL_DB_FILENAME,
};
