import type Database from 'better-sqlite3';
/** Row shape returned by SQLite queries against memory_surrogates. */
export interface SurrogateRow {
    memory_id: number;
    aliases_json: string;
    headings_json: string;
    summary: string;
    questions_json: string;
    generated_at: number;
}
/**
 * Surrogate metadata shape expected by storage functions.
 * Structurally identical to SurrogateMetadata in query-surrogates.ts.
 */
export interface StorableSurrogateMetadata {
    aliases: string[];
    headings: string[];
    summary: string;
    surrogateQuestions: string[];
    generatedAt: number;
}
/**
 * Initialize the memory_surrogates table if it does not exist.
 *
 * Schema:
 *   memory_id      — FK to memory_index.id (unique)
 *   aliases_json   — JSON array of alias strings
 *   headings_json  — JSON array of heading strings
 *   summary        — extractive summary text
 *   questions_json — JSON array of surrogate question strings
 *   generated_at   — timestamp (epoch ms)
 *
 * @param db - SQLite database instance.
 */
export declare function initSurrogateTable(db: Database.Database): void;
/**
 * Store surrogate metadata for a memory document.
 *
 * Uses INSERT OR REPLACE to handle re-indexing gracefully.
 * NOTE: Feature flag guard is the caller's responsibility.
 *
 * @param db        - SQLite database instance.
 * @param memoryId  - ID of the memory document.
 * @param surrogates - Generated surrogate metadata.
 */
export declare function storeSurrogates(db: Database.Database, memoryId: number, surrogates: StorableSurrogateMetadata): void;
/**
 * Load surrogate metadata for a memory document.
 *
 * Returns null when surrogates are not found or the table does not exist.
 * Backward compatible: missing surrogates = no boost (no errors).
 *
 * @param db       - SQLite database instance.
 * @param memoryId - ID of the memory document.
 * @returns StorableSurrogateMetadata or null.
 */
export declare function loadSurrogates(db: Database.Database, memoryId: number): StorableSurrogateMetadata | null;
/**
 * Batch-load surrogate metadata for multiple memory documents.
 *
 * Efficient single-query approach for query-time matching across
 * a candidate set.
 *
 * @param db        - SQLite database instance.
 * @param memoryIds - Array of memory IDs to load surrogates for.
 * @returns Map of memoryId → StorableSurrogateMetadata.
 */
export declare function loadSurrogatesBatch(db: Database.Database, memoryIds: number[]): Map<number, StorableSurrogateMetadata>;
//# sourceMappingURL=surrogate-storage.d.ts.map