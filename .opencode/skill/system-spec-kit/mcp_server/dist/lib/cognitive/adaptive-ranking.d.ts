import type Database from 'better-sqlite3';
/**
 * Adaptive feedback channels that influence shadow ranking proposals.
 */
export type AdaptiveSignalType = 'access' | 'outcome' | 'correction';
/**
 * Stored adaptive feedback event for a single memory.
 */
export interface AdaptiveSignalEvent {
    memoryId: number;
    signalType: AdaptiveSignalType;
    signalValue?: number;
    query?: string | null;
    actor?: string | null;
    metadata?: Record<string, unknown>;
}
/**
 * Ranking deltas for one memory under production and shadow scoring.
 */
export interface AdaptiveShadowProposalRow {
    memoryId: number;
    productionScore: number;
    shadowScore: number;
    productionRank: number;
    shadowRank: number;
    scoreDelta: number;
}
/**
 * Bounded shadow-ranking proposal derived from accumulated adaptive signals.
 */
export interface AdaptiveShadowProposal {
    mode: 'shadow' | 'promoted';
    bounded: boolean;
    maxDeltaApplied: number;
    query: string;
    rows: AdaptiveShadowProposalRow[];
    promotedIds: number[];
    demotedIds: number[];
}
/** Immutable snapshot of bounded thresholds and signal weights governing adaptive ranking. */
export interface AdaptiveThresholdSnapshot {
    maxAdaptiveDelta: number;
    minSignalsForPromotion: number;
    signalWeights: Record<AdaptiveSignalType, number>;
}
/** Aggregate signal quality and rollout readiness metrics across stored adaptive events. */
export interface AdaptiveSignalQualitySummary {
    totalSignals: number;
    distinctMemories: number;
    promotionReadyMemories: number;
    shadowRunCount: number;
    latestShadowMode: 'shadow' | 'promoted' | null;
    weightedSignalScore: number;
    signalCounts: Record<AdaptiveSignalType, number>;
    signalTotals: Record<AdaptiveSignalType, number>;
}
/** Optional overrides for adaptive threshold tuning after evaluation. */
export interface AdaptiveThresholdOverrides {
    maxAdaptiveDelta?: number;
    minSignalsForPromotion?: number;
    signalWeights?: Partial<Record<AdaptiveSignalType, number>>;
}
/** Result of an adaptive threshold tuning pass with before/after snapshots. */
export interface AdaptiveThresholdTuningResult {
    summary: AdaptiveSignalQualitySummary;
    previous: AdaptiveThresholdSnapshot;
    next: AdaptiveThresholdSnapshot;
}
/**
 * Resolve whether adaptive ranking is disabled, shadow-only, or promoted.
 *
 * @returns The effective adaptive-ranking mode.
 */
export declare function getAdaptiveMode(): 'shadow' | 'promoted' | 'disabled';
/**
 * Ensure the adaptive signal and shadow-run tables exist before use.
 *
 * @param database - Database connection that stores adaptive state.
 */
export declare function ensureAdaptiveTables(database: Database.Database): void;
/**
 * Record an adaptive signal when the roadmap mode is enabled.
 *
 * @param database - Database connection that stores adaptive state.
 * @param event - Adaptive feedback event to persist.
 */
export declare function recordAdaptiveSignal(database: Database.Database, event: AdaptiveSignalEvent): void;
/**
 * Clear adaptive signal history and shadow-run snapshots for rollback drills.
 *
 * @param database - Database connection that stores adaptive state.
 * @returns Counts for deleted signal and shadow-run rows.
 */
export declare function resetAdaptiveState(database: Database.Database): {
    clearedSignals: number;
    clearedRuns: number;
};
/**
 * Apply resettable adaptive-threshold overrides after evaluation.
 *
 * @param overrides - Optional threshold and weight overrides to apply.
 * @returns Effective adaptive threshold snapshot after the update.
 */
export declare function setAdaptiveThresholdOverrides(overrides?: AdaptiveThresholdOverrides, database?: Database.Database): AdaptiveThresholdSnapshot;
/**
 * Clear adaptive-threshold tuning and restore the default bounded configuration.
 *
 * @returns Default adaptive threshold snapshot.
 */
export declare function resetAdaptiveThresholdOverrides(database?: Database.Database): AdaptiveThresholdSnapshot;
/**
 * Snapshot the bounded thresholds and signal weights that govern adaptive ranking.
 *
 * @returns Immutable adaptive threshold configuration for diagnostics.
 */
export declare function getAdaptiveThresholdSnapshot(database?: Database.Database): AdaptiveThresholdSnapshot;
/**
 * Summarize adaptive signal quality and rollout readiness across stored events.
 *
 * @param database - Database connection that stores adaptive state.
 * @returns Aggregate signal counts, totals, and shadow-run coverage.
 */
export declare function summarizeAdaptiveSignalQuality(database: Database.Database): AdaptiveSignalQualitySummary;
/**
 * Tune adaptive thresholds after reviewing the current shadow signal set.
 *
 * @param database - Database connection that stores adaptive state.
 * @returns Previous and next threshold snapshots plus the summary that drove the tuning.
 */
export declare function tuneAdaptiveThresholdsAfterEvaluation(database: Database.Database, gateResult?: {
    ready?: boolean;
    consecutiveWeeks?: number;
    recommendation?: string;
}): AdaptiveThresholdTuningResult;
/**
 * Build a bounded shadow-ranking proposal for a production result set.
 *
 * @param database - Database connection that stores adaptive state.
 * @param query - Query string associated with the evaluated result set.
 * @param results - Ranked production rows to evaluate in shadow mode.
 * @returns Shadow proposal when adaptive ranking is enabled; otherwise `null`.
 */
export declare function buildAdaptiveShadowProposal(database: Database.Database, query: string, results: Array<Record<string, unknown> & {
    id: number;
}>): AdaptiveShadowProposal | null;
//# sourceMappingURL=adaptive-ranking.d.ts.map