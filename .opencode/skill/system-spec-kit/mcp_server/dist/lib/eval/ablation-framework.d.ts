import type { EvalResult } from './eval-metrics.js';
import type Database from 'better-sqlite3';
/**
 * Returns true only when SPECKIT_ABLATION=true (case-insensitive).
 * Anything else (undefined, "false", "1", ...) disables ablation studies.
 */
export declare function isAblationEnabled(): boolean;
/** Known search channels that can be ablated. */
export type AblationChannel = 'vector' | 'bm25' | 'fts5' | 'graph' | 'trigger';
/** All channels available for ablation. */
export declare const ALL_CHANNELS: AblationChannel[];
/** Configuration for an ablation study. */
export interface AblationConfig {
    /** Channels to ablate (one at a time). Defaults to ALL_CHANNELS. */
    channels: AblationChannel[];
    /** Subset of ground truth query IDs to use. Omit for all queries. */
    groundTruthQueryIds?: number[];
    /** Recall cutoff K. Defaults to 20. */
    recallK?: number;
    /** Optional active memory DB used to enforce ground-truth parent-memory alignment. */
    alignmentDb?: Database.Database;
    /** Optional DB path used in alignment error messaging. */
    alignmentDbPath?: string;
    /** Optional context label used in alignment error messaging. */
    alignmentContext?: string;
}
/** Summary of whether the static ground truth matches the active DB universe. */
export interface GroundTruthAlignmentSummary {
    totalQueries: number;
    totalRelevances: number;
    uniqueMemoryIds: number;
    parentRelevanceCount: number;
    chunkRelevanceCount: number;
    missingRelevanceCount: number;
    parentMemoryCount: number;
    chunkMemoryCount: number;
    missingMemoryCount: number;
    chunkExamples: Array<{
        memoryId: number;
        parentMemoryId: number;
    }>;
    missingExamples: number[];
}
/**
 * A search function that the ablation runner calls for each query.
 * The runner passes channel disable flags; the function must respect them.
 *
 * @param query - The search query text.
 * @param disabledChannels - Set of channel names to disable for this run.
 * @returns Array of EvalResult (memoryId, score, rank).
 */
export type AblationSearchFn = (query: string, disabledChannels: Set<AblationChannel>) => EvalResult[] | Promise<EvalResult[]>;
/** Result of ablating a single channel. */
export interface AblationResult {
    /** The channel that was disabled. */
    channel: AblationChannel;
    /** Recall@K with all channels enabled. */
    baselineRecall20: number;
    /** Recall@K with this channel disabled. */
    ablatedRecall20: number;
    /** ablatedRecall20 - baselineRecall20. Negative means channel contributes positively. */
    delta: number;
    /** Two-sided sign-test p-value for statistical significance (null if insufficient data). */
    pValue: number | null;
    /** Number of queries where removing this channel decreased recall (channel was helpful). */
    queriesChannelHelped: number;
    /** Number of queries where removing this channel increased recall (channel was harmful). */
    queriesChannelHurt: number;
    /** Number of queries unaffected by removing this channel. */
    queriesUnchanged: number;
    /** Total queries evaluated. */
    queryCount: number;
    /** Full multi-metric breakdown (9 metrics). */
    metrics?: AblationMetrics;
}
/** A single metric entry comparing baseline vs ablated. */
export interface AblationMetricEntry {
    baseline: number;
    ablated: number;
    delta: number;
}
/** All 9 metrics tracked per ablation channel. */
export interface AblationMetrics {
    'MRR@5': AblationMetricEntry;
    'precision@5': AblationMetricEntry;
    'recall@5': AblationMetricEntry;
    'NDCG@5': AblationMetricEntry;
    'MAP': AblationMetricEntry;
    'hit_rate': AblationMetricEntry;
    'latency_p50': AblationMetricEntry;
    'latency_p95': AblationMetricEntry;
    'token_usage': AblationMetricEntry;
}
/** Failure captured for a single channel ablation run. */
export interface AblationChannelFailure {
    /** Channel that failed during ablation. */
    channel: AblationChannel;
    /** Error message returned by the failing search call. */
    error: string;
    /** Query ID being processed when failure occurred (if known). */
    queryId?: number;
    /** Query text being processed when failure occurred (if known). */
    query?: string;
}
/** Full ablation study report. */
export interface AblationReport {
    /** ISO timestamp of the study. */
    timestamp: string;
    /** Unique run identifier. */
    runId: string;
    /** Configuration used. */
    config: AblationConfig;
    /** Per-channel ablation results. */
    results: AblationResult[];
    /** Channel ablations that failed while the overall run continued. */
    channelFailures?: AblationChannelFailure[];
    /** Baseline Recall@K across all queries (all channels enabled). */
    overallBaselineRecall: number;
    /** Total queries selected for the baseline computation. */
    queryCount?: number;
    /** Total queries actually evaluated (queries with ground truth). */
    evaluatedQueryCount?: number;
    /** Query IDs explicitly requested for this run (if any). */
    requestedQueryIds?: number[];
    /** Query IDs resolved from the static dataset. */
    resolvedQueryIds?: number[];
    /** Requested query IDs that were missing from the static dataset. */
    missingQueryIds?: number[];
    /** Total wall-clock duration in milliseconds. */
    durationMs: number;
}
/**
 * Inspect whether every ground-truth relevance ID resolves to a parent memory
 * in the active DB. Chunk-backed or missing IDs make Recall@K comparisons
 * against parent-memory outputs untrustworthy.
 */
export declare function inspectGroundTruthAlignment(database: Database.Database): GroundTruthAlignmentSummary;
/**
 * Reject the benchmark when the active DB and static ground truth do not share
 * the same parent-memory ID universe.
 */
export declare function assertGroundTruthAlignment(database: Database.Database, options?: {
    dbPath?: string;
    context?: string;
}): GroundTruthAlignmentSummary;
/**
 * Run a controlled ablation study over the ground truth query set.
 *
 * For each channel in config.channels:
 * 1. Run all queries with all channels enabled (baseline) — cached across channels
 * 2. Run all queries with that one channel disabled (ablated)
 * 3. Compute per-query Recall@K delta
 * 4. Aggregate mean delta and sign-test p-value
 *
 * The searchFn is called once per query per condition. It receives
 * the query text and a set of disabled channel names. When the set
 * is empty, all channels should be active (baseline condition).
 *
 * @param searchFn - Search function that respects channel disable flags.
 * @param config - Ablation configuration.
 * @returns AblationReport with per-channel results, or null if ablation is disabled.
 */
export declare function runAblation(searchFn: AblationSearchFn, config?: AblationConfig): Promise<AblationReport | null>;
/**
 * Store ablation results in the eval_metric_snapshots table.
 *
 * Inserts one row per channel with:
 * - metric_name: 'ablation_recall@20_delta'
 * - metric_value: the delta (negative = channel contributes positively)
 * - channel: the ablated channel name
 * - metadata: JSON with full AblationResult
 *
 * Also stores the baseline recall as a separate row.
 *
 * Fail-safe: never throws. Returns true if successfully stored.
 *
 * @param report - The AblationReport to persist.
 * @returns true if successfully stored.
 */
export declare function storeAblationResults(report: AblationReport): boolean;
/**
 * Format an ablation report as a human-readable markdown table.
 *
 * Sorts channels by absolute delta (largest contribution first).
 * Marks statistically significant results (p < 0.05) with an asterisk.
 *
 * @param report - The AblationReport to format.
 * @returns Formatted markdown string.
 */
export declare function formatAblationReport(report: AblationReport): string;
/**
 * Convert an AblationChannel set to HybridSearchOptions flags.
 *
 * Maps ablation channel names to the corresponding useXxx: false flags
 * expected by the hybridSearch / hybridSearchEnhanced functions.
 *
 * @param disabledChannels - Set of channels to disable.
 * @returns Object with useVector, useBm25, useFts, useGraph, useTrigger flags.
 */
export declare function toHybridSearchFlags(disabledChannels: Set<AblationChannel>): {
    useVector: boolean;
    useBm25: boolean;
    useFts: boolean;
    useGraph: boolean;
    useTrigger: boolean;
};
//# sourceMappingURL=ablation-framework.d.ts.map