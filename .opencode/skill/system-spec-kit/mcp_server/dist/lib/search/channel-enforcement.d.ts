/** A fused result item returned from the search pipeline. */
interface FusedResult {
    id: number | string;
    score: number;
    source: string;
    sources?: string[];
    [key: string]: unknown;
}
/** A raw result from a single retrieval channel. */
interface ChannelResult {
    id: number | string;
    score: number;
    [key: string]: unknown;
}
/** Metadata describing what enforcement did (or did not do). */
interface EnforcementMetadata {
    /** True when the feature flag was enabled and enforcement was evaluated. */
    applied: boolean;
    /** Number of results promoted from under-represented channels. */
    promotedCount: number;
    /** Channel names that had results but were missing from the top-k window. */
    underRepresentedChannels: string[];
    /** Per-channel item count in the final result set. */
    channelCounts: Record<string, number>;
}
/** Return value of enforceChannelRepresentation(). */
export interface EnforcementResult {
    results: Array<FusedResult>;
    enforcement: EnforcementMetadata;
}
/**
 * Apply channel min-representation enforcement to a set of fused search results.
 *
 * Behaviour:
 *  - When the feature flag (SPECKIT_CHANNEL_MIN_REP) is disabled, passes
 *    results through unchanged with `enforcement.applied = false`.
 *  - When enabled, inspects the top `topK` results (defaulting to all
 *    results when topK is omitted) and promotes the best-qualifying result
 *    from any channel that returned results but is absent from that window.
 *  - Promoted items are appended, their raw per-channel scores are normalized
 *    into the existing fused score range, and the full result list is then
 *    re-sorted by score (descending) so callers always receive a score-ordered list.
 *  - Only results with score >= QUALITY_FLOOR (0.005) are eligible for
 *    promotion; channels whose best result is below the floor are noted
 *    in `underRepresentedChannels` but no item is injected.
 *
 * @param fusedResults      - Post-fusion results, ordered by score descending.
 * @param channelResultSets - Map of channel name → raw results from that channel.
 * @param topK              - Window size to inspect. When omitted, defaults to
 *                            fusedResults.length (i.e. the entire result list is
 *                            used as the inspection window).
 * @returns EnforcementResult with the (potentially extended) result list and metadata.
 */
export declare function enforceChannelRepresentation(fusedResults: Array<FusedResult>, channelResultSets: Map<string, Array<ChannelResult>>, topK?: number): EnforcementResult;
export {};
//# sourceMappingURL=channel-enforcement.d.ts.map