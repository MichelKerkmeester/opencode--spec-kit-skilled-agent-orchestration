import type Database from 'better-sqlite3';
type GraphWalkRolloutState = 'off' | 'trace_only' | 'bounded_runtime';
interface GraphWalkMetrics {
    raw: number;
    normalized: number;
}
/**
 * Clear both session-scoped caches. Call at session boundaries or when
 * the causal graph has been mutated.
 */
export declare function clearGraphSignalsCache(): void;
/**
 * Record the current degree count for every memory node that participates
 * in at least one causal edge. Writes into the `degree_snapshots` table
 * with today's date, using INSERT OR REPLACE to allow idempotent re-runs.
 *
 * @returns The number of nodes snapshotted.
 */
export declare function snapshotDegrees(db: Database.Database): {
    snapshotted: number;
};
/**
 * Get the current degree of a memory node (total edges where node appears
 * as source or target in causal_edges).
 */
declare function getCurrentDegree(db: Database.Database, memoryId: number): number;
/**
 * Get the degree of a memory node from 7 days ago, as recorded in the
 * degree_snapshots table.
 */
declare function getPastDegree(db: Database.Database, memoryId: number): number | null;
/**
 * Compute momentum for a single memory node.
 * Momentum = current degree - degree 7 days ago.
 * A positive value means the node is gaining connections; negative means losing them.
 * Returns 0 if no historical data is available.
 */
export declare function computeMomentum(db: Database.Database, memoryId: number): number;
/**
 * Batch-compute momentum scores for a set of memory IDs.
 * Uses the session cache to avoid redundant DB queries within a session.
 */
export declare function computeMomentumScores(db: Database.Database, memoryIds: number[]): Map<number, number>;
/**
 * Build the full adjacency list from causal_edges, keyed by node ID (as number).
 * Returns forward adjacency, the full node set, and in-degree counts.
 */
declare function buildAdjacencyList(db: Database.Database): {
    adjacency: Map<number, number[]>;
    allNodes: Set<number>;
    inDegree: Map<number, number>;
};
declare function buildUndirectedAdjacency(adjacency: Map<number, number[]>): Map<number, Set<number>>;
declare function computeGraphWalkMetrics(db: Database.Database, memoryIds: number[]): Map<number, GraphWalkMetrics>;
declare function computeGraphWalkScores(db: Database.Database, memoryIds: number[]): Map<number, number>;
/**
 * Batch-compute causal depth scores for a set of memory IDs.
 * Uses the session cache to avoid redundant graph traversals within a session.
 *
 * Optimisation: when multiple IDs are requested, we build the adjacency list
 * and compute component depths once, then cache all results.
 *
 * Shortcut edges should not collapse deeper causal chains to the nearest-root
 * distance. We therefore compute longest-path depth on the DAG of strongly
 * connected components, which also keeps cyclic subgraphs bounded.
 */
export declare function computeCausalDepthScores(db: Database.Database, memoryIds: number[]): Map<number, number>;
/**
 * Clamp a value to [min, max].
 */
declare function clamp(value: number, min: number, max: number): number;
/**
 * Apply graph signal adjustments to scored search result rows.
 *
 * For each row:
 * - Momentum bonus: clamp(momentum * 0.01, 0, 0.05) — rewards nodes gaining connections
 * - Depth bonus: normalizedDepth * 0.05 — rewards structurally deep nodes
 *
 * Both bonuses are additive to the existing score.
 *
 * @param rows - Array of result rows with at least `id` and optional `score`.
 * @param db   - Database instance for graph queries.
 * @returns The same rows with adjusted scores.
 */
export declare function applyGraphSignals(rows: Array<{
    id: number;
    score?: number;
    [key: string]: unknown;
}>, db: Database.Database, options?: {
    rolloutState?: GraphWalkRolloutState;
}): Array<{
    id: number;
    score?: number;
    [key: string]: unknown;
}>;
/**
 * Internal functions exposed for unit testing.
 * These are NOT part of the public API and may change without notice.
 * Access only from `*.test.ts` / `*.vitest.ts` files.
 *
 * @internal
 */
export declare const __testables: {
    getCurrentDegree: typeof getCurrentDegree;
    getPastDegree: typeof getPastDegree;
    buildAdjacencyList: typeof buildAdjacencyList;
    buildUndirectedAdjacency: typeof buildUndirectedAdjacency;
    computeGraphWalkMetrics: typeof computeGraphWalkMetrics;
    computeGraphWalkScores: typeof computeGraphWalkScores;
    clamp: typeof clamp;
    momentumCache: Map<number, number>;
    depthCache: Map<number, number>;
};
export {};
//# sourceMappingURL=graph-signals.d.ts.map