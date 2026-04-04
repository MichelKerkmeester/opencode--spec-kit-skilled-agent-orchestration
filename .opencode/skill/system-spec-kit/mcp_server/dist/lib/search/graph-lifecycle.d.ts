import type Database from 'better-sqlite3';
import type { DeterministicEdge, WriteEdgePayload } from './deterministic-extractor.js';
export { extractHeadings, extractAliases, extractRelationPhrases, extractCodeFenceTechnologies, EXPLICIT_ONLY_EVIDENCE } from './deterministic-extractor.js';
export type { DeterministicEdgeType, DeterministicEdge, WriteEdgePayload } from './deterministic-extractor.js';
/** Backward-compatible wrapper for createTypedEdges that auto-binds onWrite. */
export declare function createTypedEdges(db: Database.Database, memoryId: number, edges: DeterministicEdge[]): number;
/**
 * REQ-D3-003: Graph refresh mode.
 * Controls when dirty-node recomputation is triggered after write operations.
 *
 * Values:
 *   off          — No graph refresh.
 *   write_local  — Synchronous local recompute for small dirty components.
 *   scheduled    — Schedule a background global refresh for larger components.
 */
export type GraphRefreshMode = 'off' | 'write_local' | 'scheduled';
/**
 * Resolve the SPECKIT_GRAPH_REFRESH_MODE environment variable.
 * Falls back to 'write_local' for any unrecognised value (graduated default ON).
 */
export declare function resolveGraphRefreshMode(): GraphRefreshMode;
/** Whether graph refresh is active (any non-off mode). */
export declare function isGraphRefreshEnabled(): boolean;
import { isLlmGraphBackfillEnabled } from './search-flags.js';
export { isLlmGraphBackfillEnabled };
/** Nodes whose edges have changed and require graph recomputation. */
export interface DirtyNodeSet {
    nodeIds: Set<string>;
    markedAt: number;
}
/** Result returned by onWrite(). */
export interface GraphRefreshResult {
    mode: GraphRefreshMode;
    dirtyNodes: number;
    localRecomputed: boolean;
    scheduledRefresh: boolean;
    componentSize: number;
    skipped: boolean;
}
/** Result returned by onIndex(). */
export interface OnIndexResult {
    edgesCreated: number;
    llmBackfillScheduled: boolean;
    skipped: boolean;
}
/**
 * Mark a set of node IDs as dirty.
 * Safe to call in all modes; becomes a no-op when graph refresh is off.
 *
 * @param nodeIds - String node identifiers whose edges have changed.
 * @returns Number of newly dirtied nodes added to the dirty set.
 */
export declare function markDirty(nodeIds: string[]): number;
/** Return a snapshot of the current dirty-node set (read-only). */
export declare function getDirtyNodes(): Readonly<DirtyNodeSet>;
/** Clear the dirty-node set (called after a successful global refresh). */
export declare function clearDirtyNodes(): void;
/**
 * Parse the local-recompute threshold from the environment.
 * Falls back to DEFAULT_LOCAL_RECOMPUTE_THRESHOLD for invalid values.
 */
declare function resolveLocalThreshold(): number;
/**
 * Estimate the connected component size for a set of dirty nodes.
 *
 * Performs a BFS expansion up to LOCAL_RECOMPUTE_EDGE_LIMIT edges to bound
 * the query cost.  Returns the total number of distinct nodes reachable
 * from the dirty set within that edge budget.
 *
 * @param db      - SQLite database instance.
 * @param nodeIds - Seed dirty-node IDs.
 * @returns Estimated component size (>= nodeIds.length).
 */
export declare function estimateComponentSize(db: Database.Database, nodeIds: string[]): number;
/**
 * Recompute graph scores for a small dirty component in place.
 *
 * Currently updates the `strength` column for edges touching dirty nodes
 * using a normalized degree score (in-degree / max-degree within the
 * component).  This is the local, synchronous variant — only called when
 * component.size < threshold.
 *
 * @param db      - SQLite database instance.
 * @param nodeIds - Dirty node IDs to recompute.
 * @returns Number of edge rows updated.
 */
export declare function recomputeLocal(db: Database.Database, nodeIds: string[]): number;
/**
 * Schedule a global graph refresh to run after a debounce delay.
 *
 * Multiple calls within the debounce window are coalesced — only the last
 * call triggers execution.  The actual refresh callback (`_globalRefreshFn`)
 * is set via `registerGlobalRefreshFn()` and defaults to a no-op.
 *
 * @param delayMs - Debounce window in milliseconds (default 5 s).
 */
export declare function scheduleGlobalRefresh(delayMs?: number): void;
/**
 * Cancel any pending scheduled global refresh without executing it.
 * Intended for test teardown and graceful shutdown.
 */
export declare function cancelScheduledRefresh(): void;
/** Returns true when a scheduled refresh is pending. */
export declare function isScheduledRefreshPending(): boolean;
/**
 * Register a global-refresh callback.
 * Called by the application bootstrap to wire in the actual refresh
 * implementation (e.g., re-running entity linking over the full graph).
 *
 * @param fn - Synchronous or fire-and-forget async callback.
 */
export declare function registerGlobalRefreshFn(fn: () => void): void;
/**
 * REQ-D3-003: Hook called after a write operation that modifies edges.
 *
 * Pipeline:
 *   1. markDirty(edges.nodes)
 *   2. estimateComponentSize()
 *   3. if component.size < threshold → recomputeLocal() (write_local mode)
 *   4. scheduleGlobalRefresh() (scheduled mode)
 *
 * Returns a summary result; never throws (fail-open to protect save pipeline).
 *
 * @param db      - SQLite database instance.
 * @param payload - Node IDs affected by the write.
 * @returns GraphRefreshResult describing what was done.
 */
export declare function onWrite(db: Database.Database, payload: WriteEdgePayload): GraphRefreshResult;
/**
 * REQ-D3-004: Deterministic save-time enrichment hook.
 *
 * Called at index time after a memory is persisted.  Extracts entities and
 * relations from the document using rule-based (deterministic) extraction and
 * creates typed edges with evidence='explicit_only'.
 *
 * Also schedules async LLM backfill when SPECKIT_LLM_GRAPH_BACKFILL=true
 * and the document is considered "high-value" (qualityScore >= threshold).
 *
 * @param db         - SQLite database instance.
 * @param memoryId   - The newly indexed memory row ID.
 * @param content    - Raw text content of the memory document.
 * @param options    - Optional override for quality threshold.
 * @returns OnIndexResult describing what was done.
 */
export declare function onIndex(db: Database.Database, memoryId: number, content: string, options?: {
    qualityScore?: number;
    llmBackfillThreshold?: number;
}): OnIndexResult;
/**
 * Register the async LLM backfill callback.
 *
 * @param fn - Called with the memory ID when a high-value doc needs backfill.
 */
export declare function registerLlmBackfillFn(fn: (memoryId: number) => void): void;
/**
 * Schedule LLM backfill for a memory document (fire-and-forget).
 * Uses setImmediate to defer work out of the current synchronous call stack.
 *
 * @param memoryId - The memory row to enrich.
 * @returns True when backfill was scheduled, false when no callback registered.
 */
declare function _scheduleLlmBackfill(memoryId: number): boolean;
/**
 * Internal functions and constants exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export declare const __testables: {
    DEFAULT_LOCAL_RECOMPUTE_THRESHOLD: number;
    LOCAL_RECOMPUTE_EDGE_LIMIT: number;
    DEFAULT_SCHEDULE_DELAY_MS: number;
    resolveLocalThreshold: typeof resolveLocalThreshold;
    getDirtyNodes: typeof getDirtyNodes;
    clearDirtyNodes: typeof clearDirtyNodes;
    markDirty: typeof markDirty;
    estimateComponentSize: typeof estimateComponentSize;
    recomputeLocal: typeof recomputeLocal;
    isScheduledRefreshPending: typeof isScheduledRefreshPending;
    cancelScheduledRefresh: typeof cancelScheduledRefresh;
    registerGlobalRefreshFn: typeof registerGlobalRefreshFn;
    registerLlmBackfillFn: typeof registerLlmBackfillFn;
    _scheduleLlmBackfill: typeof _scheduleLlmBackfill;
};
//# sourceMappingURL=graph-lifecycle.d.ts.map