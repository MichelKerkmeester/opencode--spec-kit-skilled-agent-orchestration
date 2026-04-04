/** The retrieval outcome state. */
export type RecoveryStatus = 'no_results' | 'low_confidence' | 'partial';
/** Root cause classification of the failure. */
export type RecoveryReason = 'spec_filter_too_narrow' | 'low_signal_query' | 'knowledge_gap';
/** Recommended next action for the calling agent. */
export type RecoveryAction = 'retry_broader' | 'switch_mode' | 'save_memory' | 'ask_user';
/** Structured recovery payload attached to search responses. */
export interface RecoveryPayload {
    status: RecoveryStatus;
    reason: RecoveryReason;
    suggestedQueries: string[];
    recommendedAction: RecoveryAction;
}
/** Input context used to build the recovery payload. */
export interface RecoveryContext {
    /** The original search query (may be null/empty if concepts were used). */
    query: string | null;
    /** Whether a specFolder filter was applied. */
    hasSpecFolderFilter: boolean;
    /** Whether upstream search logic detected an evidence gap for this result set. */
    evidenceGap?: boolean;
    /** How many results were returned (0 = no_results, 1–N = partial/low_confidence). */
    resultCount: number;
    /** Average confidence value across returned results (0–1). Only meaningful when resultCount > 0. */
    avgConfidence?: number;
    /** Low-confidence threshold — results below this trigger recovery. */
    lowConfidenceThreshold?: number;
}
import type Database from 'better-sqlite3';
/**
 * Phase B T017: Build graph-expanded fallback query terms on zero/weak results.
 *
 * When the search produces no results or low-confidence results, this function
 * queries the causal_edges table for nodes related to the matched concepts from
 * concept routing, returning up to 5 expanded query terms derived from neighbor
 * node titles.
 *
 * Feature-gated by SPECKIT_GRAPH_FALLBACK (default ON).
 * Fail-open: returns empty array on any error.
 *
 * @param ctx - Recovery context with query and result state.
 * @param db - SQLite database instance for graph lookups.
 * @returns Array of up to 5 expanded query terms from graph neighbors.
 */
export declare function buildGraphExpandedFallback(ctx: RecoveryContext, db: Database.Database): string[];
/**
 * Build a structured recovery payload for a failed or weak retrieval.
 *
 * Call this when:
 *  - No results are returned (resultCount === 0)
 *  - Results are returned but avgConfidence < threshold
 *  - Fewer than PARTIAL_RESULT_MIN results (partial match)
 *
 * @param ctx - Retrieval outcome context
 * @returns Structured recovery payload
 */
export declare function buildRecoveryPayload(ctx: RecoveryContext): RecoveryPayload;
/**
 * Determine whether a search result set warrants recovery.
 *
 * Returns true when:
 *  - No results returned, OR
 *  - Average confidence below threshold, OR
 *  - Fewer than PARTIAL_RESULT_MIN results and avgConfidence is below mid-range
 *
 * @param ctx - Retrieval outcome context
 */
export declare function shouldTriggerRecovery(ctx: RecoveryContext): boolean;
/**
 * Check whether the empty-result recovery feature flag is enabled.
 * Default: ON (graduated). Set SPECKIT_EMPTY_RESULT_RECOVERY_V1=false to disable.
 */
export { isEmptyResultRecoveryEnabled } from './search-flags.js';
//# sourceMappingURL=recovery-payload.d.ts.map