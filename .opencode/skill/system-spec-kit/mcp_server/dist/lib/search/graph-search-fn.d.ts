import type Database from 'better-sqlite3';
import type { GraphSearchFn } from './search-types.js';
/** Edge type weights for typed-degree computation (R4 5th RRF channel) */
declare const EDGE_TYPE_WEIGHTS: Record<string, number>;
/** Fallback maximum typed degree when no edges exist in the database */
declare const DEFAULT_MAX_TYPED_DEGREE = 15;
/** Hard cap on raw typed degree before normalization */
declare const MAX_TOTAL_DEGREE = 50;
/** Maximum normalized boost score */
declare const DEGREE_BOOST_CAP = 0.15;
/** Runtime fusion weight for the degree channel. Keep aligned with the boost cap. */
declare const DEGREE_CHANNEL_WEIGHT = 0.15;
/**
 * Compute the raw typed-weighted degree for a single memory node.
 *
 * Counts edges where the memory appears as source OR target,
 * weighting each edge by its relation type weight * edge strength.
 *
 * Formula: typed_degree(node) = SUM(weight_t * strength) for all connected edges
 */
declare function computeTypedDegree(database: Database.Database, memoryId: string | number): number;
/**
 * Normalize a raw typed degree into a bounded boost score.
 *
 * Uses logarithmic scaling: log(1 + raw) / log(1 + max)
 * Then caps at DEGREE_BOOST_CAP (0.15).
 *
 * @param rawDegree - The raw typed-weighted degree
 * @param maxDegree - The maximum observed typed degree (for normalization base)
 * @returns A score in [0, DEGREE_BOOST_CAP]
 */
declare function normalizeDegreeToBoostedScore(rawDegree: number, maxDegree: number): number;
/**
 * Compute the global maximum typed degree across all memories in the database.
 * Used as the normalization denominator.
 *
 * Falls back to DEFAULT_MAX_TYPED_DEGREE if no edges exist.
 */
declare function computeMaxTypedDegree(database: Database.Database): number;
/**
 * Batch compute degree boost scores for multiple memory IDs.
 *
 * - Excludes constitutional memories (returns 0 to prevent artificial inflation)
 * - Uses in-memory cache for repeated lookups
 * - Computes global max once per batch for normalization
 *
 * @param database  - An open better-sqlite3 Database instance
 * @param memoryIds - Array of memory IDs to compute scores for
 * @returns Map of memoryId (string) to normalized boost score in [0, 0.15]
 */
declare function computeDegreeScores(database: Database.Database, memoryIds: Array<string | number>): Map<string, number>;
/**
 * Clear the in-memory degree cache.
 * Call this on causal edge mutations (insert, update, delete)
 * to ensure stale scores are not served.
 */
declare function clearDegreeCache(): void;
/** Clear degree cache for a specific database instance. */
declare function clearDegreeCacheForDb(database: Database.Database): void;
/**
 * Creates a graph search function backed by causal_edges only.
 *
 * @param database  - An open better-sqlite3 Database instance
 * @returns A GraphSearchFn over causal edges
 */
declare function createUnifiedGraphSearchFn(database: Database.Database, _legacyArg?: string): GraphSearchFn;
export { createUnifiedGraphSearchFn, EDGE_TYPE_WEIGHTS, DEFAULT_MAX_TYPED_DEGREE, MAX_TOTAL_DEGREE, DEGREE_BOOST_CAP, DEGREE_CHANNEL_WEIGHT, computeTypedDegree, normalizeDegreeToBoostedScore, computeMaxTypedDegree, computeDegreeScores, clearDegreeCache, clearDegreeCacheForDb, };
//# sourceMappingURL=graph-search-fn.d.ts.map