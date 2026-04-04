import { BM25_FTS5_WEIGHTS } from './bm25-index.js';
import type Database from 'better-sqlite3';
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
declare function fts5Bm25Search(db: Database.Database, query: string, options?: FtsBm25Options): FtsBm25Result[];
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
declare function isFts5Available(db: Database.Database): boolean;
export { BM25_FTS5_WEIGHTS as FTS5_BM25_WEIGHTS, fts5Bm25Search, isFts5Available, };
/**
 * BM25 FTS result and option types exposed by the SQLite FTS module.
 */
export type { FtsBm25Result, FtsBm25Options, };
//# sourceMappingURL=sqlite-fts.d.ts.map