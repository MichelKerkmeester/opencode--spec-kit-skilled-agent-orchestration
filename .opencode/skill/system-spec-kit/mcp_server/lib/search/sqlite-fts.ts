// ───────────────────────────────────────────────────────────────
// MODULE: Sqlite Fts
// ───────────────────────────────────────────────────────────────
// Feature catalog: Semantic and lexical search (memory_search)
// Weighted BM25 scoring for FTS5 full-text search.
// Extracted from hybrid-search.ts ftsSearch() for independent
// Testing and future delegation.

import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
import type Database from 'better-sqlite3';

// ───────────────────────────────────────────────────────────────
// 2. INTERFACES

// ───────────────────────────────────────────────────────────────
interface FtsBm25Result {
  id: number;
  fts_score: number;
  [key: string]: unknown;
}

interface FtsBm25Options {
  limit?: number;
  specFolder?: string;
  includeArchived?: boolean;
}

type LexicalPath = 'fts5' | 'like' | 'unavailable';
type FallbackState =
  | 'ok'
  | 'compile_probe_miss'
  | 'missing_table'
  | 'no_such_module_fts5'
  | 'bm25_runtime_failure';

interface LexicalCapabilitySnapshot {
  lexicalPath: LexicalPath;
  fallbackState: FallbackState;
}

let lastLexicalCapabilitySnapshot: LexicalCapabilitySnapshot | null = null;

function cloneLexicalCapabilitySnapshot(
  snapshot: LexicalCapabilitySnapshot | null
): LexicalCapabilitySnapshot | null {
  return snapshot ? { ...snapshot } : null;
}

function setLastLexicalCapabilitySnapshot(snapshot: LexicalCapabilitySnapshot): void {
  lastLexicalCapabilitySnapshot = { ...snapshot };
}

function getLastLexicalCapabilitySnapshot(): LexicalCapabilitySnapshot | null {
  return cloneLexicalCapabilitySnapshot(lastLexicalCapabilitySnapshot);
}

function resetLastLexicalCapabilitySnapshot(): void {
  lastLexicalCapabilitySnapshot = null;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function readCompileOptionValue(row: unknown): string | null {
  if (typeof row === 'string') {
    return row;
  }
  if (!row || typeof row !== 'object') {
    return null;
  }

  const record = row as Record<string, unknown>;
  const direct = record.compile_options;
  if (typeof direct === 'string') {
    return direct;
  }

  const firstString = Object.values(record).find((value) => typeof value === 'string');
  return typeof firstString === 'string' ? firstString : null;
}

function isNoSuchModuleFts5Error(error: unknown): boolean {
  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
}

function isBm25RuntimeFailure(error: unknown): boolean {
  const message = toErrorMessage(error).toLowerCase();
  return message.includes('bm25');
}

function probeFts5Capability(db: Database.Database): LexicalCapabilitySnapshot {
  try {
    const compileRows = (db.prepare('PRAGMA compile_options') as Database.Statement).all() as unknown[];
    const hasFts5CompileFlag = compileRows
      .map(readCompileOptionValue)
      .some((value) => typeof value === 'string' && value.toUpperCase().includes('ENABLE_FTS5'));

    if (!hasFts5CompileFlag) {
      return {
        lexicalPath: 'unavailable',
        fallbackState: 'compile_probe_miss',
      };
    }
  } catch {
    return {
      lexicalPath: 'unavailable',
      fallbackState: 'compile_probe_miss',
    };
  }

  try {
    const result = (db.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
    ) as Database.Statement).get() as { name: string } | undefined;

    if (!result) {
      return {
        lexicalPath: 'unavailable',
        fallbackState: 'missing_table',
      };
    }
  } catch (error: unknown) {
    if (isNoSuchModuleFts5Error(error)) {
      return {
        lexicalPath: 'unavailable',
        fallbackState: 'no_such_module_fts5',
      };
    }
    return {
      lexicalPath: 'unavailable',
      fallbackState: 'missing_table',
    };
  }

  return {
    lexicalPath: 'fts5',
    fallbackState: 'ok',
  };
}

// ───────────────────────────────────────────────────────────────
// 3. CORE FUNCTION

// ───────────────────────────────────────────────────────────────
/**
 * Execute a weighted BM25 FTS5 search against memory_fts.
 *
 * Uses SQLite FTS5's built-in bm25() ranking function with
 * per-column weights instead of the default `rank` pseudo-column.
 * This gives title matches 10x weight, trigger_phrases 5x, etc.
 *
 * @param db - SQLite database connection
 * @param query - Raw search query (will be sanitized)
 * @param options - Search options (limit, specFolder, includeArchived)
 * @returns Array of results with BM25 scores (higher = better)
 * @example
 * ```ts
 * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
 * ```
 */
function fts5Bm25Search(
  db: Database.Database,
  query: string,
  options: FtsBm25Options = {}
): FtsBm25Result[] {
  const { limit = 20, specFolder, includeArchived = false } = options;

  // Sanitize via shared tokenizer, then wrap each token in quotes and join with OR for recall
  const tokens = normalizeLexicalQueryTokens(query).fts;
  const sanitized = tokens
    .map(t => (t.startsWith('"') && t.endsWith('"')) ? t : `"${t}"`)
    .join(' OR ');

  if (!sanitized) {
    setLastLexicalCapabilitySnapshot(probeFts5Capability(db));
    return [];
  }

  const folderFilter = specFolder
    ? 'AND (m.spec_folder = ? OR m.spec_folder LIKE ? || "/%")'
    : '';
  const deprecatedTierFilter =
    "AND (m.importance_tier IS NULL OR m.importance_tier != 'deprecated')";

  const params: (string | number)[] = specFolder
    ? [sanitized, specFolder, specFolder, limit]
    : [sanitized, limit];

  // Bm25() returns negative scores (lower = better), so we negate
  // To produce positive scores where higher = better match.
  const [w0, w1, w2, w3] = BM25_FTS5_WEIGHTS;
  const sql = `
    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
    FROM memory_fts
    JOIN memory_index m ON m.id = memory_fts.rowid
    WHERE memory_fts MATCH ?
      ${folderFilter}
      ${deprecatedTierFilter}
    ORDER BY fts_score DESC
    LIMIT ?
  `;

  const capability = probeFts5Capability(db);
  setLastLexicalCapabilitySnapshot(capability);
  if (capability.fallbackState !== 'ok') {
    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
    return [];
  }

  try {
    const rows = (db.prepare(sql) as Database.Statement).all(
      ...params
    ) as Array<Record<string, unknown>>;

    const normalizedRows = rows.map(row => ({
      ...row,
      id: row.id as number,
      fts_score: (row.fts_score as number) || 0,
    }));
    setLastLexicalCapabilitySnapshot({
      lexicalPath: 'fts5',
      fallbackState: 'ok',
    });
    return normalizedRows;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    const failureSnapshot: LexicalCapabilitySnapshot = isNoSuchModuleFts5Error(error)
      ? {
          lexicalPath: 'unavailable',
          fallbackState: 'no_such_module_fts5',
        }
      : isBm25RuntimeFailure(error)
        ? {
            lexicalPath: 'unavailable',
            fallbackState: 'bm25_runtime_failure',
          }
        : msg.toLowerCase().includes('no such table: memory_fts')
          ? {
              lexicalPath: 'unavailable',
              fallbackState: 'missing_table',
            }
          : {
              lexicalPath: 'unavailable',
              fallbackState: 'bm25_runtime_failure',
            };
    setLastLexicalCapabilitySnapshot(failureSnapshot);
    console.warn(`[sqlite-fts] BM25 FTS5 search failed: ${msg}`);
    return [];
  }
}

/**
 * Check if the memory_fts FTS5 virtual table exists in the database.
 *
 * Used as a feature-detect before calling fts5Bm25Search, since FTS5
 * may be absent on older SQLite builds or freshly-created databases.
 *
 * @param db - SQLite database connection to check
 * @returns true if memory_fts exists and is queryable
 * @example
 * ```ts
 * if (isFts5Available(db)) {
 *   fts5Bm25Search(db, 'memory');
 * }
 * ```
 */
function isFts5Available(db: Database.Database): boolean {
  return probeFts5Capability(db).fallbackState === 'ok';
}

// ───────────────────────────────────────────────────────────────
// 4. EXPORTS

// ───────────────────────────────────────────────────────────────
export {
  BM25_FTS5_WEIGHTS as FTS5_BM25_WEIGHTS,
  fts5Bm25Search,
  getLastLexicalCapabilitySnapshot,
  isFts5Available,
  probeFts5Capability,
  resetLastLexicalCapabilitySnapshot,
  setLastLexicalCapabilitySnapshot,
};

/**
 * BM25 FTS result and option types exposed by the SQLite FTS module.
 */
export type {
  FallbackState,
  FtsBm25Result,
  FtsBm25Options,
  LexicalCapabilitySnapshot,
  LexicalPath,
};
