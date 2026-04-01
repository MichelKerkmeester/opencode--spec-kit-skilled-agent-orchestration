// ────────────────────────────────────────────────────────────────
// MODULE: Db State
// ────────────────────────────────────────────────────────────────

import fs from 'fs/promises';
import { resolveDatabasePaths, INDEX_SCAN_COOLDOWN } from './config.js';
import type { DatabaseExtended } from '@spec-kit/shared/types';
import type { GraphSearchFn } from '../lib/search/search-types.js';

// ────────────────────────────────────────────────────────────────
// 1. TYPES 

// ────────────────────────────────────────────────────────────────

/** Minimal vector index interface for database operations */
type VectorSearchFn = (
  embedding: Float32Array | number[],
  options: Record<string, unknown>
) => Array<Record<string, unknown>>;

export interface VectorIndexLike {
  initializeDb(): void;
  getDb(): DatabaseLike | null;
  closeDb?(): void;
  vectorSearch?: VectorSearchFn;
  onDatabaseConnectionChange?: (listener: (database: DatabaseLike) => void) => (() => void);
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
  init(database: DatabaseLike, vectorSearch: VectorSearchFn | undefined, graphSearch?: GraphSearchFn | null): void;
}

/** Session manager module interface */
export interface SessionManagerLike {
  init(database: DatabaseLike): { success: boolean; error?: string };
}

/** Incremental index module interface */
export interface IncrementalIndexLike {
  init(database: DatabaseLike): void;
}

/** Generic DB consumer interface for modules that cache DB handles internally. */
export interface DatabaseConsumerLike {
  init(database: DatabaseLike): unknown;
}

/** Dependencies for db-state initialization */
export interface DbStateDeps {
  vectorIndex?: VectorIndexLike;
  checkpoints?: CheckpointsLike;
  accessTracker?: AccessTrackerLike;
  hybridSearch?: HybridSearchLike;
  sessionManager?: SessionManagerLike;
  incrementalIndex?: IncrementalIndexLike;
  graphSearchFn?: GraphSearchFn | null;
  dbConsumers?: DatabaseConsumerLike[];
}

type DatabaseRebindListener = (database: DatabaseLike) => void;

// ────────────────────────────────────────────────────────────────
// 2. STATE VARIABLES 

// ────────────────────────────────────────────────────────────────

let lastDbCheck: number = 0;
let reinitializeMutex: Promise<void> | null = null;
let lastReinitializeSucceeded: boolean = true;
let embeddingModelReady: boolean = false;
let constitutionalCache: unknown = null;
let constitutionalCacheTime: number = 0;
let configTableCreated: boolean = false;
const CONFIG_KEY_LAST_INDEX_SCAN = 'last_index_scan';
const CONFIG_KEY_SCAN_STARTED_AT = 'scan_started_at';
const DEFAULT_SCAN_LEASE_EXPIRY_MS = INDEX_SCAN_COOLDOWN * 2;

// ────────────────────────────────────────────────────────────────
// 3. MODULE REFERENCES 

// ────────────────────────────────────────────────────────────────

let vectorIndex: VectorIndexLike | null = null;
let checkpoints: CheckpointsLike | null = null;
let accessTracker: AccessTrackerLike | null = null;
let hybridSearch: HybridSearchLike | null = null;
let sessionManagerRef: SessionManagerLike | null = null;
let incrementalIndexRef: IncrementalIndexLike | null = null;
let graphSearchFnRef: GraphSearchFn | null | undefined = undefined;
const dbConsumersRef: DatabaseConsumerLike[] = [];
let vectorIndexListenerCleanup: (() => void) | null = null;
let subscribedVectorIndex: VectorIndexLike | null = null;
let suppressVectorIndexListener = false;
const databaseRebindListeners = new Set<DatabaseRebindListener>();

export function registerDatabaseRebindListener(listener: DatabaseRebindListener): () => void {
  databaseRebindListeners.add(listener);
  return () => {
    databaseRebindListeners.delete(listener);
  };
}

function notifyDatabaseRebindListeners(database: DatabaseLike): void {
  for (const listener of databaseRebindListeners) {
    try {
      listener(database);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[db-state] Database rebind listener failed: ${message}`);
    }
  }
}

function registerVectorIndexListener(nextVectorIndex: VectorIndexLike): void {
  if (subscribedVectorIndex === nextVectorIndex) {
    return;
  }

  if (vectorIndexListenerCleanup) {
    vectorIndexListenerCleanup();
    vectorIndexListenerCleanup = null;
  }

  subscribedVectorIndex = nextVectorIndex;
  if (typeof nextVectorIndex.onDatabaseConnectionChange !== 'function') {
    return;
  }

  vectorIndexListenerCleanup = nextVectorIndex.onDatabaseConnectionChange((database: DatabaseLike) => {
    if (suppressVectorIndexListener) {
      return;
    }

    try {
      const rebound = rebindDatabaseConsumers(database);
      if (!rebound) {
        console.error('[db-state] Database consumer listener rebind returned false');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[db-state] Database consumer listener rebind failed: ${message}`);
    }
  });
}

function rebindDatabaseConsumers(database: DatabaseLike): boolean {
  if (checkpoints) checkpoints.init(database);
  if (accessTracker) accessTracker.init(database);
  if (hybridSearch) {
    if (!graphSearchFnRef && process.env.SPECKIT_GRAPH_UNIFIED !== 'false') {
      console.warn('[db-state] hybridSearch reinit missing graphSearchFn; graph retrieval channel is disabled');
    }
    hybridSearch.init(database, vectorIndex?.vectorSearch, graphSearchFnRef ?? null);
  }
  if (sessionManagerRef) {
    const sessionInitResult = sessionManagerRef.init(database);
    if (!sessionInitResult.success) {
      const errorSuffix = sessionInitResult.error ? `: ${sessionInitResult.error}` : '';
      console.error(`[db-state] Session manager rebind failed${errorSuffix}`);
      return false;
    }
  }
  if (incrementalIndexRef) incrementalIndexRef.init(database);
  for (const consumer of dbConsumersRef) {
    consumer.init(database);
  }
  notifyDatabaseRebindListeners(database);
  return true;
}

function getDbUpdatedFilePath(): string {
  return resolveDatabasePaths().dbUpdatedFile;
}

/** Initialize db-state with module dependencies for database lifecycle management. */
export function init(deps: DbStateDeps): void {
  if (deps.vectorIndex) {
    vectorIndex = deps.vectorIndex;
    registerVectorIndexListener(deps.vectorIndex);
    // The backing DB handle may differ across init calls; force config table re-check.
    configTableCreated = false;
  }
  if (deps.checkpoints) checkpoints = deps.checkpoints;
  if (deps.accessTracker) accessTracker = deps.accessTracker;
  if (deps.hybridSearch) hybridSearch = deps.hybridSearch;
  if (deps.sessionManager) sessionManagerRef = deps.sessionManager;
  if (deps.incrementalIndex) incrementalIndexRef = deps.incrementalIndex;
  if (deps.graphSearchFn !== undefined) graphSearchFnRef = deps.graphSearchFn;
  if (Array.isArray(deps.dbConsumers) && deps.dbConsumers.length > 0) {
    for (const consumer of deps.dbConsumers) {
      if (consumer && !dbConsumersRef.includes(consumer)) {
        dbConsumersRef.push(consumer);
      }
    }
  }
}

// ────────────────────────────────────────────────────────────────
// 4. DATABASE CHANGE NOTIFICATION 

// ────────────────────────────────────────────────────────────────

/** Check if the database was updated externally and reinitialize if needed. */
export async function checkDatabaseUpdated(): Promise<boolean> {
  try {
    const updateTimeRaw = await fs.readFile(getDbUpdatedFilePath(), 'utf8');
    const updateTime = Number.parseInt(updateTimeRaw, 10);
    if (!Number.isFinite(updateTime)) {
      return false;
    }

    if (updateTime > lastDbCheck) {
      console.error('[db-state] Database updated externally, reinitializing connection...');
      const rebindSucceeded = await reinitializeDatabase(updateTime);
      if (!rebindSucceeded) {
        console.error('[db-state] Reinitialization did not complete; preserving lastDbCheck for retry');
      }
      return rebindSucceeded;
    }
  } catch (e: unknown) {
    const code = e && typeof e === 'object' && 'code' in e ? (e as { code?: unknown }).code : undefined;
    if (code === 'ENOENT' || code === 'EACCES') {
      // Ignore missing marker or read errors.
      return false;
    }
    throw e;
  }
  return false;
}

/** Close and reinitialize the database connection, refreshing all dependent module handles. */
export async function reinitializeDatabase(updatedMarkerTime?: number): Promise<boolean> {
  if (!vectorIndex) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  // If reinitialization is already in progress, wait for it
  if (reinitializeMutex) {
    console.error('[db-state] Reinitialization already in progress, waiting...');
    await reinitializeMutex;
    return lastReinitializeSucceeded;
  }

  let resolveMutex: () => void;
  let rebindSucceeded = false;
  reinitializeMutex = new Promise<void>(resolve => {
    resolveMutex = resolve;
  });

  try {
    constitutionalCache = null;
    constitutionalCacheTime = 0;
    configTableCreated = false;

    suppressVectorIndexListener = true;
    try {
      if (typeof vectorIndex.closeDb === 'function') {
        vectorIndex.closeDb();
      }
      vectorIndex.initializeDb();
    } finally {
      suppressVectorIndexListener = false;
    }

    const database = vectorIndex.getDb();
    if (!database) {
      console.error('[db-state] Database handle unavailable after reinitialize; rebinding skipped');
      return false;
    }

    let memoryCount = 0;
    try {
      const row = database.prepare('SELECT COUNT(*) as cnt FROM memory_index').get() as { cnt?: number | bigint } | undefined;
      const rawCount = row?.cnt ?? 0;
      memoryCount = typeof rawCount === 'bigint' ? Number(rawCount) : Number(rawCount);
    } catch {
      memoryCount = 0;
    }

    if (memoryCount === 0) {
      try {
        const expectedDatabasePath = resolveDatabasePaths().databasePath;
        const databaseList = database.prepare('PRAGMA database_list').all() as Array<{ name?: string; file?: string }>;
        const mainDatabasePath = databaseList.find(row => row.name === 'main')?.file;
        if (mainDatabasePath && mainDatabasePath !== expectedDatabasePath) {
          console.error(`[db-state] Empty database path drift detected: expected ${expectedDatabasePath}, got ${mainDatabasePath}`);
        }
      } catch {
        // Ignore PRAGMA lookup failures; the empty-database guard below remains authoritative.
      }

      console.error('[db-state] WARNING: New database has 0 memories — refusing to rebind consumers to empty DB. This may indicate provider-specific DB path drift.');
      if (process.env.SPECKIT_FORCE_REBIND !== 'true') {
        return false;
      }
    }

    if (!rebindDatabaseConsumers(database)) {
      return false;
    }
    if (typeof updatedMarkerTime === 'number' && Number.isFinite(updatedMarkerTime)) {
      lastDbCheck = updatedMarkerTime;
    }
    rebindSucceeded = true;
    console.error('[db-state] Database connection reinitialized');
    return true;
  } finally {
    lastReinitializeSucceeded = rebindSucceeded;
    // P4-13 FIX: Resolve the mutex BEFORE clearing the reference.
    // If we set reinitializeMutex = null first, a concurrent caller could
    // See null and start a new reinitialization before resolve is called.
    // WHY non-null: resolveMutex is always assigned in the Promise constructor callback above (synchronous)
    resolveMutex!();
    reinitializeMutex = null;
  }
}

// ────────────────────────────────────────────────────────────────
// 5. PERSISTENT RATE LIMITING 

// ────────────────────────────────────────────────────────────────

/** Ensure the config table exists (idempotent, runs DDL at most once per process). */
function ensureConfigTable(db: DatabaseLike): void {
  if (configTableCreated) return;
  db.exec(`CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)`);
  configTableCreated = true;
}

function parseConfigTimestamp(value: unknown): number {
  if (typeof value !== 'string') {
    return 0;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function resolveScanLeaseExpiryMs(explicit?: number): number {
  if (typeof explicit === 'number' && Number.isFinite(explicit) && explicit > 0) {
    return explicit;
  }

  const envRaw = process.env.SPECKIT_INDEX_SCAN_LEASE_EXPIRY_MS;
  const envParsed = envRaw ? Number.parseInt(envRaw, 10) : Number.NaN;
  if (Number.isFinite(envParsed) && envParsed > 0) {
    return envParsed;
  }

  return DEFAULT_SCAN_LEASE_EXPIRY_MS;
}

function clearStaleScanLease(db: DatabaseLike, now: number, scanStartedAt: number, leaseExpiryMs: number): number {
  if (scanStartedAt <= 0 || now - scanStartedAt < leaseExpiryMs) {
    return scanStartedAt;
  }

  db.prepare('DELETE FROM config WHERE key = ?').run(CONFIG_KEY_SCAN_STARTED_AT);
  return 0;
}

export interface IndexScanLeaseResult {
  acquired: boolean;
  reason: 'ok' | 'cooldown' | 'lease_active';
  waitSeconds: number;
  lastIndexScan: number;
  scanStartedAt: number;
  leaseExpiryMs: number;
  cooldownMs: number;
}

/**
 * Acquire the index-scan lease atomically.
 *
 * The lease blocks overlapping scans via `scan_started_at` and preserves
 * cooldown via `last_index_scan`. Stale leases are automatically expired.
 */
export async function acquireIndexScanLease(options?: {
  now?: number;
  cooldownMs?: number;
  leaseExpiryMs?: number;
}): Promise<IndexScanLeaseResult> {
  if (!vectorIndex) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  const now = typeof options?.now === 'number' && Number.isFinite(options.now)
    ? options.now
    : Date.now();
  const cooldownMs = typeof options?.cooldownMs === 'number' && Number.isFinite(options.cooldownMs) && options.cooldownMs > 0
    ? options.cooldownMs
    : INDEX_SCAN_COOLDOWN;
  const leaseExpiryMs = resolveScanLeaseExpiryMs(options?.leaseExpiryMs);

  try {
    const db = vectorIndex.getDb();
    if (!db) {
      return {
        acquired: true,
        reason: 'ok',
        waitSeconds: 0,
        lastIndexScan: 0,
        scanStartedAt: 0,
        leaseExpiryMs,
        cooldownMs,
      };
    }

    ensureConfigTable(db);

    const reserveLeaseTx = db.transaction((): IndexScanLeaseResult => {
      const rows = db.prepare(`
        SELECT key, value
        FROM config
        WHERE key IN (?, ?)
      `).all(CONFIG_KEY_LAST_INDEX_SCAN, CONFIG_KEY_SCAN_STARTED_AT) as Array<{ key?: string; value?: string }>;

      let lastIndexScan = 0;
      let scanStartedAt = 0;

      for (const row of rows) {
        if (row.key === CONFIG_KEY_LAST_INDEX_SCAN) {
          lastIndexScan = parseConfigTimestamp(row.value);
        } else if (row.key === CONFIG_KEY_SCAN_STARTED_AT) {
          scanStartedAt = parseConfigTimestamp(row.value);
        }
      }

      scanStartedAt = clearStaleScanLease(db, now, scanStartedAt, leaseExpiryMs);

      if (scanStartedAt > 0 && now - scanStartedAt < leaseExpiryMs) {
        const waitSeconds = Math.ceil((leaseExpiryMs - (now - scanStartedAt)) / 1000);
        return {
          acquired: false,
          reason: 'lease_active',
          waitSeconds: Math.max(waitSeconds, 1),
          lastIndexScan,
          scanStartedAt,
          leaseExpiryMs,
          cooldownMs,
        };
      }

      if (lastIndexScan > 0 && now - lastIndexScan < cooldownMs) {
        const waitSeconds = Math.ceil((cooldownMs - (now - lastIndexScan)) / 1000);
        return {
          acquired: false,
          reason: 'cooldown',
          waitSeconds: Math.max(waitSeconds, 1),
          lastIndexScan,
          scanStartedAt,
          leaseExpiryMs,
          cooldownMs,
        };
      }

      db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)').run(
        CONFIG_KEY_SCAN_STARTED_AT,
        String(now),
      );

      return {
        acquired: true,
        reason: 'ok',
        waitSeconds: 0,
        lastIndexScan,
        scanStartedAt: now,
        leaseExpiryMs,
        cooldownMs,
      };
    });

    return reserveLeaseTx();
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[db-state] Error acquiring index scan lease:', message);
    return {
      acquired: true,
      reason: 'ok',
      waitSeconds: 0,
      lastIndexScan: 0,
      scanStartedAt: 0,
      leaseExpiryMs,
      cooldownMs,
    };
  }
}

/** Complete an index scan and convert active lease to last_index_scan timestamp. */
export async function completeIndexScanLease(time: number): Promise<void> {
  if (!vectorIndex) {
    throw new Error('db-state not initialized: vector_index is null');
  }

  try {
    const db = vectorIndex.getDb();
    if (!db) return;

    ensureConfigTable(db);
    const completeLeaseTx = db.transaction(() => {
      db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)').run(
        CONFIG_KEY_LAST_INDEX_SCAN,
        String(time),
      );
      db.prepare('DELETE FROM config WHERE key = ?').run(CONFIG_KEY_SCAN_STARTED_AT);
    });
    completeLeaseTx();
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[db-state] Error completing index scan lease:', message);
  }
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
    const row = db.prepare('SELECT value FROM config WHERE key = ?').get(CONFIG_KEY_LAST_INDEX_SCAN) as { value: string } | undefined;
    const parsed = row ? Number.parseInt(row.value, 10) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[db-state] Error getting last scan time:', message);
    return 0;
  }
}

/** Persist the timestamp of the last index scan to the config table. */
export async function setLastScanTime(time: number): Promise<void> {
  await completeIndexScanLease(time);
}

// ────────────────────────────────────────────────────────────────
// 6. EMBEDDING MODEL READINESS 

// ────────────────────────────────────────────────────────────────

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

// ────────────────────────────────────────────────────────────────
// 7. CONSTITUTIONAL CACHE ACCESSORS 

// ────────────────────────────────────────────────────────────────

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

/* ───────────────────────────────────────────────────────────────
   8. (ESM exports above — no CommonJS module.exports needed)
   ──────────────────────────────────────────────────────────────── */
