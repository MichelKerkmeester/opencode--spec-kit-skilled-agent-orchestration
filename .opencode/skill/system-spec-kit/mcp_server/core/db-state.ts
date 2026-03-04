// ---------------------------------------------------------------
// MODULE: Database State
// ---------------------------------------------------------------

import fs from 'fs/promises';
import { DB_UPDATED_FILE } from './config';
import type { DatabaseExtended } from '@spec-kit/shared/types';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Minimal vector index interface for database operations */
export interface VectorIndexLike {
  initializeDb(): void;
  getDb(): DatabaseLike | null;
  closeDb?(): void;
  vectorSearch?: unknown;
}

/** Canonical DB type shared across MCP runtime modules */
export type DatabaseLike = DatabaseExtended;

/** Checkpoints module interface */
export interface CheckpointsLike {
  init(database: DatabaseLike): void;
}

/** Access tracker module interface */
export interface AccessTrackerLike {
  init(database: DatabaseLike): void;
}

/** Hybrid search module interface */
export interface HybridSearchLike {
  init(database: DatabaseLike, vectorSearch: unknown, graphSearch?: unknown): void;
}

/** Session manager module interface */
export interface SessionManagerLike {
  init(database: DatabaseLike): { success: boolean; error?: string };
}

/** Incremental index module interface */
export interface IncrementalIndexLike {
  init(database: DatabaseLike): void;
}

/** Dependencies for db-state initialization */
export interface DbStateDeps {
  vectorIndex?: VectorIndexLike;
  checkpoints?: CheckpointsLike;
  accessTracker?: AccessTrackerLike;
  hybridSearch?: HybridSearchLike;
  sessionManager?: SessionManagerLike;
  incrementalIndex?: IncrementalIndexLike;
  graphSearchFn?: unknown;
}

/* ---------------------------------------------------------------
   2. STATE VARIABLES
   --------------------------------------------------------------- */

let lastDbCheck: number = 0;
let reinitializeMutex: Promise<void> | null = null;
let embeddingModelReady: boolean = false;
let constitutionalCache: unknown = null;
let constitutionalCacheTime: number = 0;
let configTableCreated: boolean = false;

/* ---------------------------------------------------------------
   3. MODULE REFERENCES
   --------------------------------------------------------------- */

let vectorIndex: VectorIndexLike | null = null;
let checkpoints: CheckpointsLike | null = null;
let accessTracker: AccessTrackerLike | null = null;
let hybridSearch: HybridSearchLike | null = null;
let sessionManagerRef: SessionManagerLike | null = null;
let incrementalIndexRef: IncrementalIndexLike | null = null;
let graphSearchFnRef: unknown = undefined;

/** Initialize db-state with module dependencies for database lifecycle management. */
export function init(deps: DbStateDeps): void {
  if (deps.vectorIndex) {
    vectorIndex = deps.vectorIndex;
    // The backing DB handle may differ across init calls; force config table re-check.
    configTableCreated = false;
  }
  if (deps.checkpoints) checkpoints = deps.checkpoints;
  if (deps.accessTracker) accessTracker = deps.accessTracker;
  if (deps.hybridSearch) hybridSearch = deps.hybridSearch;
  if (deps.sessionManager) sessionManagerRef = deps.sessionManager;
  if (deps.incrementalIndex) incrementalIndexRef = deps.incrementalIndex;
  if (deps.graphSearchFn !== undefined) graphSearchFnRef = deps.graphSearchFn;
}

/* ---------------------------------------------------------------
   4. DATABASE CHANGE NOTIFICATION
   --------------------------------------------------------------- */

/** Check if the database was updated externally and reinitialize if needed. */
export async function checkDatabaseUpdated(): Promise<boolean> {
  try {
    const updateTimeRaw = await fs.readFile(DB_UPDATED_FILE, 'utf8');
    const updateTime = Number.parseInt(updateTimeRaw, 10);
    if (!Number.isFinite(updateTime)) {
      return false;
    }

    if (updateTime > lastDbCheck) {
      console.error('[db-state] Database updated externally, reinitializing connection...');
      lastDbCheck = updateTime;
      await reinitializeDatabase();
      return true;
    }
  } catch {
    // Ignore missing marker or read errors.
  }
  return false;
}

/** Close and reinitialize the database connection, refreshing all dependent module handles. */
export async function reinitializeDatabase(): Promise<void> {
  if (!vectorIndex) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  // If reinitialization is already in progress, wait for it
  if (reinitializeMutex) {
    console.error('[db-state] Reinitialization already in progress, waiting...');
    await reinitializeMutex;
    return;
  }

  let resolveMutex: () => void;
  reinitializeMutex = new Promise<void>(resolve => {
    resolveMutex = resolve;
  });

  try {
    constitutionalCache = null;
    constitutionalCacheTime = 0;
    configTableCreated = false;

    if (typeof vectorIndex.closeDb === 'function') {
      vectorIndex.closeDb();
    }
    vectorIndex.initializeDb();

    const database = vectorIndex.getDb();
    if (database) {
      if (checkpoints) checkpoints.init(database);
      if (accessTracker) accessTracker.init(database);
      if (hybridSearch) hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFnRef);
      // P4-12, P4-19 FIX: Refresh stale DB handles in session-manager and incremental-index
      if (sessionManagerRef) sessionManagerRef.init(database as DatabaseLike);
      if (incrementalIndexRef) incrementalIndexRef.init(database as DatabaseLike);
    }
    console.error('[db-state] Database connection reinitialized');
  } finally {
    // P4-13 FIX: Resolve the mutex BEFORE clearing the reference.
    // If we set reinitializeMutex = null first, a concurrent caller could
    // see null and start a new reinitialization before resolve is called.
    // WHY non-null: resolveMutex is always assigned in the Promise constructor callback above (synchronous)
    resolveMutex!();
    reinitializeMutex = null;
  }
}

/* ---------------------------------------------------------------
   5. PERSISTENT RATE LIMITING
   --------------------------------------------------------------- */

/** Ensure the config table exists (idempotent, runs DDL at most once per process). */
function ensureConfigTable(db: DatabaseLike): void {
  if (configTableCreated) return;
  db.exec(`CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)`);
  configTableCreated = true;
}

/** Retrieve the timestamp of the last index scan from the config table. */
export async function getLastScanTime(): Promise<number> {
  if (!vectorIndex) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  try {
    const db = vectorIndex.getDb();
    if (!db) return 0;

    ensureConfigTable(db);
    const row = db.prepare('SELECT value FROM config WHERE key = ?').get('last_index_scan') as { value: string } | undefined;
    return row ? parseInt(row.value, 10) : 0;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[db-state] Error getting last scan time:', message);
    return 0;
  }
}

/** Persist the timestamp of the last index scan to the config table. */
export async function setLastScanTime(time: number): Promise<void> {
  if (!vectorIndex) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  try {
    const db = vectorIndex.getDb();
    if (!db) return;

    ensureConfigTable(db);
    db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)').run('last_index_scan', time.toString());
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[db-state] Error setting last scan time:', message);
  }
}

/* ---------------------------------------------------------------
   6. EMBEDDING MODEL READINESS
   --------------------------------------------------------------- */

/** Return whether the embedding model has been marked as ready. */
export function isEmbeddingModelReady(): boolean {
  return embeddingModelReady;
}

/** Set the embedding model readiness flag. */
export function setEmbeddingModelReady(ready: boolean): void {
  embeddingModelReady = ready;
}

/** Poll until the embedding model is ready, returning false on timeout. */
export async function waitForEmbeddingModel(timeoutMs: number = 30000): Promise<boolean> {
  const startTime = Date.now();
  const checkInterval = 500;

  while (!embeddingModelReady) {
    if (Date.now() - startTime > timeoutMs) {
      console.error('[db-state] Embedding model warmup timeout');
      return false;
    }
    await new Promise<void>(resolve => setTimeout(resolve, checkInterval));
  }
  return true;
}

/* ---------------------------------------------------------------
   7. CONSTITUTIONAL CACHE ACCESSORS
   --------------------------------------------------------------- */

/** Return the cached constitutional memory entries, or null if not cached. */
export function getConstitutionalCache(): unknown {
  return constitutionalCache;
}

/** Update the constitutional memory cache and record the current timestamp. */
export function setConstitutionalCache(cache: unknown): void {
  constitutionalCache = cache;
  constitutionalCacheTime = Date.now();
}

/** Return the timestamp when the constitutional cache was last populated. */
export function getConstitutionalCacheTime(): number {
  return constitutionalCacheTime;
}

/** Invalidate the constitutional cache, forcing a fresh fetch on next access. */
export function clearConstitutionalCache(): void {
  constitutionalCache = null;
  constitutionalCacheTime = 0;
}

/* ---------------------------------------------------------------
   8. (ESM exports above — no CommonJS module.exports needed)
   --------------------------------------------------------------- */
