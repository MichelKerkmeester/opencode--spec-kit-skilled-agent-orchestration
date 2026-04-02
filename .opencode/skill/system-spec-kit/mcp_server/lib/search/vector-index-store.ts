// ───────────────────────────────────────────────────────────────
// MODULE: Vector Index Store
// ───────────────────────────────────────────────────────────────
// Feature catalog: Hybrid search pipeline
// SEARCH: VECTOR INDEX
// TypeScript port of the vector index implementation.
// DECAY STRATEGY (ADR-004): Search-time temporal decay uses an
// FSRS-preferred strategy. Memories with FSRS review data (last_review
// IS NOT NULL, review_count > 0) use the FSRS v4 power-law formula:
// R(t) = (1 + 0.2346 * t / S)^(-0.5)
// Memories without review data fall back to half-life exponential:
// Weight * 0.5^(days / half_life_days)
// This ensures backward compatibility while aligning reviewed
// Memories with the canonical FSRS algorithm.

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';

import { getStartupEmbeddingDimension } from '@spec-kit/shared/embeddings/factory';

import { DATABASE_PATH, SERVER_DIR } from '../../core/config.js';
import { IVectorStore } from '../interfaces/vector-store.js';
import { computeInterferenceScoresBatch } from '../scoring/interference-scoring.js';
import { validateFilePath } from '../utils/path-security.js';
import {
  get_error_code,
  get_error_message,
  parse_trigger_phrases,
  VectorIndexError,
  VectorIndexErrorCode,
} from './vector-index-types.js';
import {
  create_schema,
  ensure_schema_version,
} from './vector-index-schema.js';
import type {
  EmbeddingInput,
  EnrichedSearchResult,
  IndexMemoryParams,
  MemoryRow,
  VectorSearchOptions,
} from './vector-index-types.js';

type SearchWeightsConfig = {
  maxTriggersPerMemory?: number;
  smartRanking?: {
    recencyWeight?: number;
    accessWeight?: number;
    relevanceWeight?: number;
  };
};

function loadSearchWeights(): SearchWeightsConfig {
  // SERVER_DIR points to dist/ at runtime; configs/ lives at the package root (dist/..)
  const candidates = [
    path.join(SERVER_DIR, 'configs', 'search-weights.json'),
    path.join(SERVER_DIR, '..', 'configs', 'search-weights.json'),
  ];
  for (const candidate of candidates) {
    try {
      return JSON.parse(fs.readFileSync(candidate, 'utf-8')) as SearchWeightsConfig;
    } catch {
      // Try next candidate
    }
  }
  return {};
}

let _search_weights: SearchWeightsConfig | null = null;

function getSearchWeights(): SearchWeightsConfig {
  if (_search_weights === null) {
    _search_weights = loadSearchWeights();
  }
  return _search_weights;
}

/** Loaded search weight configuration for vector-index ranking (lazy-loaded). */
export const search_weights: SearchWeightsConfig = {
  get maxTriggersPerMemory() {
    return getSearchWeights().maxTriggersPerMemory;
  },
  get smartRanking() {
    return getSearchWeights().smartRanking;
  },
};

type EnhancedSearchOptions = {
  specFolder?: string | null;
  minSimilarity?: number;
  diversityFactor?: number;
  noDiversity?: boolean;
};
type JsonObject = Record<string, unknown>;

let _cached_queries: Awaited<typeof import('./vector-index-queries.js')> | null = null;
let _cached_mutations: Awaited<typeof import('./vector-index-mutations.js')> | null = null;
let _cached_aliases: Awaited<typeof import('./vector-index-aliases.js')> | null = null;

async function getQueriesModule() {
  return _cached_queries ??= await import('./vector-index-queries.js');
}

async function getMutationsModule() {
  return _cached_mutations ??= await import('./vector-index-mutations.js');
}

async function getAliasesModule() {
  return _cached_aliases ??= await import('./vector-index-aliases.js');
}

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION — Embedding Dimension
----------------------------------------------------------------*/

/** Default embedding dimension used by the vector index. */
export const EMBEDDING_DIM = 768;

/**
 * Gets the active embedding dimension for the current provider.
 * @returns The embedding dimension.
 */
export function get_embedding_dim(): number {
  return getStartupEmbeddingDimension();
}

/**
 * Waits for the embedding provider to report a stable dimension.
 * @param timeout_ms - The maximum time to wait in milliseconds.
 * @returns A promise that resolves to the confirmed embedding dimension.
 */
export async function get_confirmed_embedding_dimension(timeout_ms = 5000): Promise<number> {
  const start = Date.now();
  while (Date.now() - start < timeout_ms) {
    const dim = get_embedding_dim();
    if (dim !== 768 || process.env.EMBEDDING_DIM === '768') {
      return dim;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  console.warn('[vector-index] Using default dimension 768 after timeout');
  return 768;
}

type EmbeddingDimensionValidation = {
  valid: boolean;
  stored: number | null;
  current: number | null;
  reason?: string;
  warning?: string;
};

type StoredEmbeddingDimension = {
  existing_db: boolean;
  stored_dim: number | null;
  source: 'vec_metadata' | 'vec_memories' | null;
  reason?: string;
};

function get_existing_embedding_dimension(
  database: Database.Database,
): StoredEmbeddingDimension {
  const schema_row = database.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='memory_index'
  `).get();

  if (!schema_row) {
    return {
      existing_db: false,
      stored_dim: null,
      source: null,
      reason: 'No existing schema',
    };
  }

  const metadata_table = database.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='vec_metadata'
  `).get();

  if (metadata_table) {
    const stored_row = database.prepare(`
      SELECT value FROM vec_metadata WHERE key = 'embedding_dim'
    `).get() as { value: string } | undefined;

    if (stored_row) {
      const stored_dim = parseInt(stored_row.value, 10);
      if (Number.isFinite(stored_dim) && stored_dim > 0) {
        return {
          existing_db: true,
          stored_dim,
          source: 'vec_metadata',
        };
      }
    }
  }

  const vec_table = database.prepare(`
    SELECT sql FROM sqlite_master WHERE name='vec_memories'
  `).get() as { sql: string | null } | undefined;
  const vec_sql = typeof vec_table?.sql === 'string' ? vec_table.sql : null;
  const match = vec_sql?.match(/FLOAT\[(\d+)\]/i);

  if (match) {
    const stored_dim = parseInt(match[1], 10);
    if (Number.isFinite(stored_dim) && stored_dim > 0) {
      return {
        existing_db: true,
        stored_dim,
        source: 'vec_memories',
      };
    }
  }

  return {
    existing_db: true,
    stored_dim: null,
    source: null,
    reason: 'No stored vector dimension found for existing schema',
  };
}

function validate_embedding_dimension_for_connection(
  database: Database.Database | null,
  _sqlite_vec_available: boolean,
): EmbeddingDimensionValidation {
  if (!database) {
    return { valid: true, stored: null, current: null, reason: 'No database' };
  }

  try {
    const current_dim = get_embedding_dim();
    const existing = get_existing_embedding_dimension(database);

    if (!existing.existing_db) {
      return { valid: true, stored: null, current: current_dim, reason: existing.reason };
    }

    if (existing.stored_dim == null) {
      return { valid: true, stored: null, current: current_dim, reason: existing.reason || 'No stored dimension' };
    }

    if (existing.stored_dim !== current_dim) {
      const source_label = existing.source === 'vec_metadata' ? 'vec_metadata' : 'vec_memories schema';
      const warning = `EMBEDDING DIMENSION MISMATCH: Existing database stores ${existing.stored_dim}-dim vectors (${source_label}), ` +
        `but the active embedding configuration resolves to ${current_dim}. Refusing to bootstrap because vector search would fail. ` +
        `Solutions: 1) Delete database and re-index, 2) Set EMBEDDINGS_PROVIDER to match original, ` +
        `3) Use MEMORY_DB_PATH for provider-specific databases.`;
      console.error(`[vector-index] WARNING: ${warning}`);
      return { valid: false, stored: existing.stored_dim, current: current_dim, warning };
    }

    return { valid: true, stored: existing.stored_dim, current: current_dim };
  } catch (e: unknown) {
    console.warn('[vector-index] Dimension validation error:', get_error_message(e));
    return { valid: true, stored: null, current: get_embedding_dim(), reason: get_error_message(e) };
  }
}

/**
 * Validates that stored vector dimensions match the provider.
 * @returns The validation result.
 */
export function validate_embedding_dimension(): { valid: boolean; stored: number | null; current: number | null; reason?: string; warning?: string } {
  return validate_embedding_dimension_for_connection(db, sqlite_vec_available_flag);
}

/* ───────────────────────────────────────────────────────────────
   2. DATABASE PATH AND SECURITY
----------------------------------------------------------------*/

// F4.04/F8.02 fix: Use centralized DB path from core/config.ts.
// Legacy env vars MEMORY_DB_DIR and MEMORY_DB_PATH remain supported for backward compatibility.
const DEFAULT_DB_DIR = process.env.MEMORY_DB_DIR
  ? path.resolve(process.env.MEMORY_DB_DIR)
  : path.dirname(DATABASE_PATH);
/** Default path for the vector-index database file. */
export const DEFAULT_DB_PATH = process.env.MEMORY_DB_PATH
  || path.join(DEFAULT_DB_DIR, path.basename(DATABASE_PATH));
const DB_PERMISSIONS = 0o600;

function resolve_database_path() {
  return process.env.MEMORY_DB_PATH || DEFAULT_DB_PATH;
}

// P1-06 FIX: Unified allowed paths
const ALLOWED_BASE_PATHS = [
  path.join(process.cwd(), 'specs'),
  path.join(process.cwd(), '.opencode'),
  path.join(os.homedir(), '.claude'),
  process.cwd(),
  ...(process.env.MEMORY_ALLOWED_PATHS ? process.env.MEMORY_ALLOWED_PATHS.split(path.delimiter) : [])
].filter(Boolean).map(p => path.resolve(p));

/**
 * Validates a file path against allowed local base paths.
 * @param file_path - The file path to validate.
 * @returns The validated file path, if allowed.
 */
export function validate_file_path_local(file_path: unknown): string | null {
  if (typeof file_path !== 'string') {
    return null;
  }

  return validateFilePath(file_path, ALLOWED_BASE_PATHS);
}

// HIGH-004 FIX: Async version for non-blocking concurrent file reads
/**
 * Reads a file asynchronously after validating the path.
 * @param file_path - The file path to read.
 * @returns A promise that resolves to the file contents or an empty string.
 */
export async function safe_read_file_async(file_path: unknown): Promise<string> {
  const valid_path = validate_file_path_local(file_path);
  if (!valid_path) {
    return '';
  }

  try {
    return await fs.promises.readFile(valid_path, 'utf-8');
  } catch (err: unknown) {
    if (!(err instanceof Error && 'code' in err && get_error_code(err) === 'ENOENT')) {
      console.warn(`[vector-index] Could not read file ${valid_path}: ${get_error_message(err)}`);
    }
    return '';
  }
}

// Safely parse JSON with validation (CWE-502: Deserialization mitigation)
/**
 * Parses JSON with prototype-pollution safeguards.
 * @param json_string - The JSON string to parse.
 * @param default_value - The fallback value to return on failure.
 * @returns The parsed JSON value or the fallback.
 */
export function safe_parse_json(json_string: unknown, default_value = []): unknown {
  if (!json_string || typeof json_string !== 'string') {
    return default_value;
  }

  try {
    const parsed = JSON.parse(json_string);

    if (Array.isArray(parsed)) {
      return parsed.filter(item =>
        item && typeof item === 'object' &&
        !Array.isArray(item) &&
        !('__proto__' in item) &&
        !('constructor' in item) &&
        !('prototype' in item)
      );
    }

    if (typeof parsed === 'object' && parsed !== null) {
      if ('__proto__' in parsed || 'constructor' in parsed || 'prototype' in parsed) {
        console.warn('[vector-index] Blocked potential prototype pollution in JSON');
        return default_value;
      }
    }

    return parsed;
  } catch (err: unknown) {
    console.warn(`[vector-index] JSON parse error: ${get_error_message(err)}`);
    return default_value;
  }
}

/* ───────────────────────────────────────────────────────────────
   3. DATABASE SINGLETON
----------------------------------------------------------------*/

let db: Database.Database | null = null;
let db_path = DEFAULT_DB_PATH;
let sqlite_vec_available_flag = true;
// C1 FIX: Key connections by resolved DB path to prevent cross-store data corruption
const db_connections = new Map<string, Database.Database>();
type DatabaseConnectionListener = (
  database: Database.Database,
  change: {
    previousDb: Database.Database | null;
    previousPath: string;
    nextPath: string;
  },
) => void;
const database_connection_listeners = new Set<DatabaseConnectionListener>();

function set_active_database_connection(
  connection: Database.Database,
  target_path: string,
  vec_available: boolean,
): void {
  const previousDb = db;
  const previousPath = db_path;
  db = connection;
  db_path = target_path;
  sqlite_vec_available_flag = vec_available;

  if (previousDb !== connection || previousPath !== target_path) {
    clear_constitutional_cache();

    for (const listener of database_connection_listeners) {
      try {
        listener(connection, {
          previousDb,
          previousPath,
          nextPath: target_path,
        });
      } catch (error: unknown) {
        console.warn(`[vector-index] Database connection listener failed: ${get_error_message(error)}`);
      }
    }
  }

  if (target_path === ':memory:') {
    return;
  }

  try {
    fs.chmodSync(target_path, DB_PERMISSIONS);
  } catch (err: unknown) {
    console.warn(`[vector-index] Could not set permissions on ${target_path}: ${get_error_message(err)}`);
  }
}

/** Accessor for sqlite_vec_available (used by other modules) */
export function sqlite_vec_available(): boolean {
  return sqlite_vec_available_flag;
}

export function on_database_connection_change(listener: DatabaseConnectionListener): () => void {
  database_connection_listeners.add(listener);
  return () => {
    database_connection_listeners.delete(listener);
  };
}

const constitutional_cache = new Map<string, { data: MemoryRow[]; timestamp: number }>();
const CONSTITUTIONAL_CACHE_TTL = 300000;
const CONSTITUTIONAL_CACHE_MAX_KEYS = 50;

// BUG-012 FIX: Track which cache keys are currently being loaded
const constitutional_cache_loading = new Map<string, boolean>();

let last_db_mod_time = 0;
let last_constitutional_cache_db_path: string | null = null;

function get_constitutional_cache_db_scope(): string {
  if (db_path === ':memory:') {
    return db_path;
  }

  return path.resolve(db_path);
}

function build_constitutional_cache_key(
  spec_folder: string | null,
  includeArchived: boolean,
): string {
  const db_scope = get_constitutional_cache_db_scope();
  return `${db_scope}::${spec_folder || 'global'}:${includeArchived ? 'arch' : 'noarch'}`;
}

function refresh_constitutional_cache_db_state(): void {
  const current_db_path = get_constitutional_cache_db_scope();
  last_constitutional_cache_db_path = current_db_path;

  if (current_db_path === ':memory:' || !fs.existsSync(current_db_path)) {
    last_db_mod_time = 0;
    return;
  }

  last_db_mod_time = fs.statSync(current_db_path).mtimeMs;
}

function is_constitutional_cache_valid() {
  if (constitutional_cache.size === 0) return false;

  try {
    const current_db_path = get_constitutional_cache_db_scope();
    if (
      last_constitutional_cache_db_path &&
      last_constitutional_cache_db_path !== current_db_path
    ) {
      return false;
    }

    if (current_db_path !== ':memory:' && fs.existsSync(current_db_path)) {
      const stats = fs.statSync(current_db_path);
      if (stats.mtimeMs > last_db_mod_time) {
        last_db_mod_time = stats.mtimeMs;
        return false;
      }
    }
  } catch (e: unknown) {
    console.warn('[vector-index] Cache validation error:', get_error_message(e));
  }

  return true;
}

/* ───────────────────────────────────────────────────────────────
   4. PREPARED STATEMENT CACHING
----------------------------------------------------------------*/

type PreparedStatements = {
  count_all: Database.Statement<[], { count: number }>;
  count_by_folder: Database.Statement<[string], { count: number }>;
  get_by_id: Database.Statement<[number], MemoryRow | undefined>;
  get_by_path: Database.Statement<[string], MemoryRow | undefined>;
  get_by_folder_and_path: Database.Statement<[string, string, string, string | null, string | null], { id: number } | undefined>;
  get_stats: Database.Statement<[], { total: number; complete: number; pending: number; failed: number }>;
  list_base: Database.Statement<[number, number], MemoryRow[]>;
};
// F-09 — Scope prepared statements per Database instance via WeakMap.
// The old global singleton would return stale statements from a prior DB connection
// When called with a different database, executing queries against the wrong connection.
const prepared_statements_cache = new WeakMap<Database.Database, PreparedStatements>();

/**
 * Initializes cached prepared statements for common queries.
 * @param database - The database connection to prepare against.
 * @returns The prepared statements cache.
 */
export function init_prepared_statements(database: Database.Database): PreparedStatements {
  const cached = prepared_statements_cache.get(database);
  if (cached) return cached;

  const prepared_statements: PreparedStatements = {
    count_all: database.prepare(`
      SELECT COUNT(*) as count
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
    `),
    count_by_folder: database.prepare(`
      SELECT COUNT(*) as count
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
      WHERE m.spec_folder = ?
    `),
    get_by_id: database.prepare('SELECT * FROM memory_index WHERE id = ?'),
    get_by_path: database.prepare(`
      SELECT m.*
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
      WHERE m.file_path = ?
    `),
    get_by_folder_and_path: database.prepare(`
      SELECT m.id
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
      WHERE m.spec_folder = ?
        AND (m.canonical_file_path = ? OR m.file_path = ?)
        AND (m.anchor_id = ? OR (m.anchor_id IS NULL AND ? IS NULL))
      ORDER BY m.id DESC
      LIMIT 1
    `),
    get_stats: database.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) as complete,
        SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
    `),
    list_base: database.prepare(`
      SELECT m.*
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `)
  };

  prepared_statements_cache.set(database, prepared_statements);
  return prepared_statements;
}

/**
 * Clears cached prepared statements for a specific database or all databases.
 * @param database - Optional: clear only for this database. If omitted, the
 *   WeakMap self-cleans when the Database object is GC'd, so this is a no-op.
 * @returns Nothing.
 */
export function clear_prepared_statements(database?: Database.Database): void {
  if (database) {
    prepared_statements_cache.delete(database);
  }
  // WeakMap entries are automatically cleared when the Database key is GC'd.
}

/* ───────────────────────────────────────────────────────────────
   5. CONSTITUTIONAL MEMORIES CACHE
----------------------------------------------------------------*/

// BUG-004 FIX: Checks external DB modifications before using cache
// BUG-012 FIX: Prevent thundering herd when cache expires
/**
 * Gets cached constitutional memories from the index.
 * @param database - The database connection to query.
 * @param spec_folder - The optional spec folder filter.
 * @param includeArchived - Whether archived memories should be included.
 * @returns The constitutional memory rows.
 */
export function get_constitutional_memories(
  database: Database.Database,
  spec_folder: string | null = null,
  includeArchived = false
): MemoryRow[] {
  // Scope cache entries to the active DB path as well as the archived filter.
  const cache_key = build_constitutional_cache_key(spec_folder, includeArchived);
  const now = Date.now();
  const cached = constitutional_cache.get(cache_key);

  if (cached && (now - cached.timestamp) < CONSTITUTIONAL_CACHE_TTL && is_constitutional_cache_valid()) {
    return cached.data;
  }

  if (constitutional_cache_loading.get(cache_key) && cached) {
    return cached.data;
  }

  constitutional_cache_loading.set(cache_key, true);

  try {
    const constitutional_sql = `
      SELECT m.*, 100.0 as similarity, 1.0 as effective_importance,
             'constitutional' as source_type
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
      WHERE m.importance_tier = 'constitutional'
        AND m.embedding_status = 'success'
        ${!includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : ''}
        ${spec_folder ? 'AND m.spec_folder = ?' : ''}
      ORDER BY m.importance_weight DESC, m.created_at DESC
    `;

    const params = spec_folder ? [spec_folder] : [];
    let results = database.prepare(constitutional_sql).all(...params) as MemoryRow[];

    const MAX_CONSTITUTIONAL_TOKENS = 2000;
    const TOKENS_PER_MEMORY = 100;
    const max_constitutional_count = Math.floor(MAX_CONSTITUTIONAL_TOKENS / TOKENS_PER_MEMORY);
    results = results.slice(0, max_constitutional_count);

    results = results.map((row: MemoryRow) => {
      row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
      row.isConstitutional = true;
      return row;
    });

    if (constitutional_cache.size >= CONSTITUTIONAL_CACHE_MAX_KEYS) {
      const oldestKey = constitutional_cache.keys().next().value;
      if (oldestKey !== undefined) {
        constitutional_cache.delete(oldestKey);
      }
    }

    refresh_constitutional_cache_db_state();
    constitutional_cache.set(cache_key, { data: results, timestamp: now });

    return results;
  } finally {
    constitutional_cache_loading.delete(cache_key);
  }
}

/**
 * Clears cached constitutional memories.
 * @param spec_folder - The optional spec folder cache key to clear.
 * @returns Nothing.
 */
export function clear_constitutional_cache(spec_folder: string | null = null): void {
  if (spec_folder) {
    const scoped_suffix_archived = `::${spec_folder}:arch`;
    const scoped_suffix_live = `::${spec_folder}:noarch`;
    for (const key of [...constitutional_cache.keys()]) {
      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
        constitutional_cache.delete(key);
      }
    }
    for (const key of [...constitutional_cache_loading.keys()]) {
      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
        constitutional_cache_loading.delete(key);
      }
    }
  } else {
    constitutional_cache.clear();
    constitutional_cache_loading.clear();
    last_db_mod_time = 0;
    last_constitutional_cache_db_path = null;
  }
}

/**
 * Refreshes interference scores for memories in a folder.
 * @param database - The database connection to update.
 * @param specFolder - The spec folder whose scores should be refreshed.
 * @returns Nothing.
 */
export function refresh_interference_scores_for_folder(database: Database.Database, specFolder: string): void {
  if (!specFolder) return;

  try {
    const rows = database.prepare(
      `SELECT m.id
       FROM memory_index m
       JOIN active_memory_projection p ON p.active_memory_id = m.id
       WHERE m.spec_folder = ?
         AND m.parent_id IS NULL
         AND COALESCE(m.is_archived, 0) = 0
         AND COALESCE(m.importance_tier, 'normal') != 'deprecated'`
    ).all(specFolder) as Array<{ id: number }>;

    if (rows.length === 0) return;

    const memoryIds = rows.map(r => r.id);
    const scores = computeInterferenceScoresBatch(database, memoryIds);
    const updateStmt = database.prepare('UPDATE memory_index SET interference_score = ? WHERE id = ?');
    for (const id of memoryIds) {
      updateStmt.run(scores.get(id) ?? 0, id);
    }
  } catch (error: unknown) {
    console.warn(`[vector-index] interference score refresh failed for '${specFolder}': ${get_error_message(error)}`);
  }
}

/* ───────────────────────────────────────────────────────────────
   6. DATABASE INITIALIZATION
----------------------------------------------------------------*/

/**
 * Initializes the vector-index database connection.
 * @param custom_path - An optional database path override.
 * @returns The initialized database connection.
 * @throws {VectorIndexError} When database integrity validation fails during initialization.
 * @example
 * ```ts
 * const database = initialize_db();
 * ```
 */
export function initialize_db(custom_path: string | null = null): Database.Database {
  if (db && !custom_path) {
    return db;
  }

  const target_path = custom_path || resolve_database_path();

  // C1 FIX: Check connection map for existing connection to this path
  const resolved_target = path.resolve(target_path);
  const cached_conn = db_connections.get(resolved_target);
  if (cached_conn) {
    set_active_database_connection(cached_conn, target_path, sqlite_vec_available_flag);
    return cached_conn;
  }

  const dir = path.dirname(target_path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  let new_db: Database.Database;
  try {
    new_db = new Database(target_path);
  } catch (db_error: unknown) {
    const errMsg = get_error_message(db_error);
    const errCode = get_error_code(db_error);
    if (errCode === 'ERR_DLOPEN_FAILED' || errMsg.includes('NODE_MODULE_VERSION') || errMsg.includes('was compiled against a different Node.js version')) {
      console.error('[vector-index] FATAL: better-sqlite3 native module failed to load');
      console.error(`[vector-index] ${errMsg}`);
      console.error(`[vector-index] Running: Node ${process.version} (MODULE_VERSION ${process.versions.modules})`);
      try {
        const marker_path = path.resolve(import.meta.dirname, '../../../.node-version-marker');
        if (fs.existsSync(marker_path)) {
          const marker = JSON.parse(fs.readFileSync(marker_path, 'utf8'));
          console.error(`[vector-index] Marker recorded: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion})`);
        }
      } catch (_: unknown) {
        // IGNORE MARKER READ ERRORS BECAUSE THE DIAGNOSTIC FILE IS OPTIONAL.
      }
      console.error('[vector-index] This usually means Node.js was updated without rebuilding native modules.');
      console.error('[vector-index] Fix: Run \'bash scripts/setup/rebuild-native-modules.sh\' from the spec-kit root');
      console.error('[vector-index] Or manually: npm rebuild better-sqlite3');
    }
    throw db_error;
  }

  let vec_available = true;
  try {
    sqliteVec.load(new_db);
  } catch (vec_error: unknown) {
    vec_available = false;
    console.warn(`[vector-index] sqlite-vec extension not available: ${get_error_message(vec_error)}`);
    console.warn('[vector-index] Falling back to anchor-only mode (no vector search)');
    console.warn('[vector-index] Install sqlite-vec: brew install sqlite-vec (macOS)');
  }

  new_db.pragma('journal_mode = WAL');
  new_db.pragma('busy_timeout = 10000');
  new_db.pragma('foreign_keys = ON');
  new_db.pragma('cache_size = -64000');
  new_db.pragma('mmap_size = 268435456');
  new_db.pragma('synchronous = NORMAL');
  new_db.pragma('temp_store = MEMORY');

  const preBootstrapDimCheck = validate_embedding_dimension_for_connection(new_db, vec_available);
  if (!preBootstrapDimCheck.valid && preBootstrapDimCheck.stored != null) {
    const msg = preBootstrapDimCheck.warning ||
      `Embedding dimension mismatch: DB=${preBootstrapDimCheck.stored}, provider=${preBootstrapDimCheck.current}`;
    console.error(`[vector-index] FATAL: ${msg}`);
    try { new_db.close(); } catch (_: unknown) { /* best-effort */ }
    throw new VectorIndexError(msg, VectorIndexErrorCode.INTEGRITY_ERROR);
  }

  create_schema(new_db, { sqlite_vec_available: vec_available, get_embedding_dim });
  ensure_schema_version(new_db);

  const dimCheck = validate_embedding_dimension_for_connection(new_db, vec_available);
  if (!dimCheck.valid && dimCheck.stored != null) {
    const msg = dimCheck.warning || `Dimension mismatch: DB=${dimCheck.stored}, provider=${dimCheck.current}`;
    console.error(`[vector-index] FATAL: ${msg}`);
    try { new_db.close(); } catch (_: unknown) { /* best-effort */ }
    throw new VectorIndexError(msg, VectorIndexErrorCode.INTEGRITY_ERROR);
  }

  set_active_database_connection(new_db, target_path, vec_available);

  // C1 FIX: Only cache in connection map after all validation passes
  db_connections.set(resolved_target, new_db);

  return new_db;
}

/* ───────────────────────────────────────────────────────────────
   7. DATABASE UTILITIES
----------------------------------------------------------------*/

/**
 * Closes the shared vector-index database connection.
 * @returns Nothing.
 */
export function close_db(): void {
  clear_prepared_statements();
  // C1 FIX: Close all tracked connections
  for (const [, conn] of db_connections) {
    try { if (conn !== db) conn.close(); } catch (_: unknown) { /* ignore close errors */ }
  }
  db_connections.clear();
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Gets the active vector-index database path.
 * @returns The database path.
 */
export function get_db_path(): string {
  return db_path;
}

/**
 * Gets the shared vector-index database connection.
 * @returns The database connection.
 */
export function get_db(): Database.Database {
  return initialize_db();
}

// Check if vector search is available (sqlite-vec loaded)
/**
 * Reports whether sqlite-vec vector search is available.
 * @returns True when vector search is available.
 */
export function is_vector_search_available(): boolean {
  return sqlite_vec_available_flag;
}

/* ───────────────────────────────────────────────────────────────
   8. IVECTORSTORE IMPLEMENTATION
----------------------------------------------------------------*/

/** Implements the vector-store interface on top of SQLite. */
export class SQLiteVectorStore extends IVectorStore {
  dbPath: string | null;
  _initialized: boolean;

  constructor(options: { dbPath?: string } = {}) {
    super();
    this.dbPath = options.dbPath || null;
    this._initialized = false;
  }

  _ensureInitialized(): void {
    if (!this._initialized) {
      this._getDatabase();
      this._initialized = true;
    }
  }

  _getDatabase(): Database.Database {
    return initialize_db(this.dbPath);
  }

  /**
   * Searches indexed memories by embedding similarity.
   * @param embedding - The query embedding to search with.
   * @param topK - The maximum number of matches to return.
   * @param options - Optional ranking and filtering controls.
   * @returns Matching memory rows ordered by similarity.
   * @throws {VectorIndexError} When the embedding dimension is invalid or the store cannot initialize.
   * @example
   * ```ts
   * const rows = await store.search(queryEmbedding, 10, { specFolder: 'specs/001-demo' });
   * ```
   */
  async search(embedding: EmbeddingInput, topK: number, options: VectorSearchOptions = {}): Promise<MemoryRow[]> {
    this._ensureInitialized();
    const database = this._getDatabase();

    const expected_dim = get_embedding_dim();
    if (!embedding || embedding.length !== expected_dim) {
      throw new VectorIndexError(
        `Invalid embedding dimension: expected ${expected_dim}, got ${embedding?.length}`,
        VectorIndexErrorCode.EMBEDDING_VALIDATION,
      );
    }

    const search_options = {
      limit: topK,
      specFolder: options.specFolder,
      minSimilarity: options.minSimilarity || 0,
      useDecay: options.useDecay !== false,
      tier: options.tier,
      contextType: options.contextType,
      includeConstitutional: options.includeConstitutional !== false,
      includeArchived: options.includeArchived === true
    };

    const { vector_search } = await getQueriesModule();
    return vector_search(embedding, search_options, database);
  }

  /**
   * Inserts or updates a memory row and its embedding metadata.
   * @param _id - Legacy identifier input retained for interface compatibility.
   * @param embedding - The embedding to persist.
   * @param metadata - Store metadata containing the spec folder and file path.
   * @returns The stored memory identifier.
   * @throws {VectorIndexError} When embedding validation fails or required metadata is missing.
   * @example
   * ```ts
   * const id = await store.upsert('ignored', embedding, { spec_folder: 'specs/001-demo', file_path: 'spec.md' });
   * ```
   */
  async upsert(_id: string, embedding: EmbeddingInput, metadata: JsonObject): Promise<number> {
    this._ensureInitialized();
    const database = this._getDatabase();

    const expected_dim = get_embedding_dim();
    if (!embedding || embedding.length !== expected_dim) {
      throw new VectorIndexError(
        `Embedding dimension mismatch: expected ${expected_dim}, got ${embedding?.length}`,
        VectorIndexErrorCode.EMBEDDING_VALIDATION,
      );
    }

    const metadata_alias = metadata as JsonObject & {
      spec_folder?: string;
      specFolder?: string;
      file_path?: string;
      filePath?: string;
      anchor_id?: string;
      anchorId?: string;
      title?: string;
      trigger_phrases?: string[];
      triggerPhrases?: string[];
      importance_weight?: number;
      importanceWeight?: number;
    };

    const params: IndexMemoryParams = {
      specFolder: metadata_alias.spec_folder || metadata_alias.specFolder || '',
      filePath: metadata_alias.file_path || metadata_alias.filePath || '',
      anchorId: metadata_alias.anchor_id || metadata_alias.anchorId || null,
      title: metadata_alias.title || null,
      triggerPhrases: metadata_alias.trigger_phrases || metadata_alias.triggerPhrases || [],
      importanceWeight: metadata_alias.importance_weight ?? metadata_alias.importanceWeight ?? 0.5,
      embedding: embedding
    };

    if (!params.specFolder || !params.filePath) {
      throw new VectorIndexError(
        'metadata must include spec_folder and file_path',
        VectorIndexErrorCode.STORE_ERROR,
      );
    }

    const { index_memory } = await getMutationsModule();
    return index_memory(params, database);
  }

  /**
   * Deletes a memory by identifier.
   * @param id - The memory identifier.
   * @returns True when a memory was deleted.
   * @throws {VectorIndexError} Propagates underlying delete failures from the mutation layer.
   * @example
   * ```ts
   * const deleted = await store.delete(42);
   * ```
   */
  async delete(id: number): Promise<boolean> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { delete_memory } = await getMutationsModule();
    return delete_memory(id, database);
  }

  /**
   * Retrieves a memory by identifier.
   * @param id - The memory identifier.
   * @returns The stored memory row, if found.
   * @throws {VectorIndexError} Propagates underlying store initialization failures.
   * @example
   * ```ts
   * const memory = await store.get(42);
   * ```
   */
  async get(id: number): Promise<MemoryRow | null> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { get_memory } = await getQueriesModule();
    return get_memory(id, database);
  }

  async getStats(): Promise<{ total: number; pending: number; success: number; failed: number; retry: number }> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { get_stats } = await getQueriesModule();
    return get_stats(database);
  }

  isAvailable(): boolean {
    return sqlite_vec_available_flag;
  }

  getEmbeddingDimension(): number {
    return get_embedding_dim();
  }

  async close(): Promise<void> {
    if (this._initialized) {
      close_db();
      this._initialized = false;
    }
  }

  async deleteByPath(specFolder: string, filePath: string, anchorId: string | null = null): Promise<boolean> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { delete_memory_by_path } = await getMutationsModule();
    return delete_memory_by_path(specFolder, filePath, anchorId, database);
  }

  async getByFolder(specFolder: string): Promise<MemoryRow[]> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { get_memories_by_folder } = await getQueriesModule();
    return get_memories_by_folder(specFolder, database);
  }

  async searchEnriched(
    embedding: string,
    options: { specFolder?: string | null; minSimilarity?: number } = {},
  ): Promise<EnrichedSearchResult[]> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { vector_search_enriched } = await getQueriesModule();
    return vector_search_enriched(embedding, undefined, options, database);
  }

  async enhancedSearch(embedding: string, options: EnhancedSearchOptions = {}): Promise<EnrichedSearchResult[]> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { enhanced_search } = await getAliasesModule();
    return enhanced_search(embedding, undefined, options, database);
  }

  async getConstitutionalMemories(
    options: { specFolder?: string | null; maxTokens?: number; includeArchived?: boolean } = {},
  ): Promise<MemoryRow[]> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { get_constitutional_memories_public } = await getQueriesModule();
    return get_constitutional_memories_public(options, database);
  }

  async verifyIntegrity(
    options: { autoClean?: boolean } = {},
  ): Promise<{
    totalMemories: number;
    totalVectors: number;
    orphanedVectors: number;
    missingVectors: number;
    orphanedFiles: Array<{ id: number; file_path: string; reason: string }>;
    orphanedChunks: number;
    isConsistent: boolean;
    cleaned?: { vectors: number; chunks: number };
  }> {
    this._ensureInitialized();
    const database = this._getDatabase();
    const { verify_integrity } = await getQueriesModule();
    return verify_integrity(options, database);
  }
}

/* ───────────────────────────────────────────────────────────────
   9. CAMELCASE ALIASES
----------------------------------------------------------------*/

// CamelCase aliases for backward compatibility (functions already exported above)
export { initialize_db as initializeDb };
export { close_db as closeDb };
export { get_db as getDb };
export { get_db_path as getDbPath };
export { get_confirmed_embedding_dimension as getConfirmedEmbeddingDimension };
export { get_embedding_dim as getEmbeddingDim };
export { validate_embedding_dimension as validateEmbeddingDimension };
export { validate_file_path_local as validateFilePath };
export { clear_constitutional_cache as clearConstitutionalCache };
export { is_vector_search_available as isVectorSearchAvailable };
export { on_database_connection_change as onDatabaseConnectionChange };
