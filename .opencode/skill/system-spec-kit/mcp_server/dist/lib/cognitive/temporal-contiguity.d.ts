import type Database from 'better-sqlite3';
export declare const DEFAULT_WINDOW = 3600;
export declare const MAX_WINDOW = 86400;
export declare function init(database: Database.Database): void;
/**
 * Apply temporal-contiguity boost to vector search results.
 *
 * For every pair of results whose timestamps fall within `windowSeconds`
 * of each other, each member of the pair receives a similarity boost
 * proportional to how close they are:
 *
 *   boost = (1 - timeDelta / windowSeconds) * BOOST_FACTOR
 *   similarity *= (1 + boost)
 *
 * Null input returns null; empty array returns []; single item is
 * returned as-is (no pairs to evaluate).
 */
export declare function vectorSearchWithContiguity(results: Array<{
    id: number;
    similarity: number;
    created_at: string;
}> | null, windowSeconds: number): Array<{
    id: number;
    similarity: number;
    created_at: string;
}> | null;
/**
 * Find memories whose `created_at` falls within `windowSeconds` of the
 * given memory. Results are ordered by `time_delta_seconds ASC`.
 */
export declare function getTemporalNeighbors(memoryId: number, windowSeconds: number): Array<{
    time_delta_seconds: number;
    [key: string]: unknown;
}>;
/**
 * Build a timeline of memories ordered by `created_at DESC`.
 * Optionally filtered to a single `specFolder`.
 */
export declare function buildTimeline(specFolder: string | null, limit: number): Array<{
    created_at: string;
    [key: string]: unknown;
}>;
//# sourceMappingURL=temporal-contiguity.d.ts.map