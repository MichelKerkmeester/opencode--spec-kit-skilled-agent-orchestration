import type Database from 'better-sqlite3';
/** 5% sampling rate — logs ~1 in 20 scoring calls */
export declare const SAMPLING_RATE = 0.05;
/** Full observation record for a single scored memory */
export interface ScoringObservation {
    memoryId: number;
    queryId: string;
    timestamp: string;
    memoryAgeDays: number;
    interferenceApplied: boolean;
    interferenceScore: number;
    interferencePenalty: number;
    scoreBeforeBoosts: number;
    scoreAfterBoosts: number;
    scoreDelta: number;
}
/** Aggregate stats returned by getScoringStats() */
export interface ScoringStats {
    totalObservations: number;
    avgInterferencePenalty: number;
    pctWithInterferencePenalty: number;
    avgScoreDelta: number;
}
/**
 * Initialize the scoring observability system.
 * Creates the scoring_observations table if it does not exist.
 * Call once at startup (after DB is available).
 * Fail-safe: any error is caught and logged; never throws.
 */
export declare function initScoringObservability(db: Database.Database): void;
/**
 * Returns true approximately 5% of the time.
 * Uses Math.random() — no seeding, no state.
 */
export declare function shouldSample(): boolean;
/**
 * Persist a scoring observation to the DB.
 * Fail-safe: any error is logged via console.error (non-fatal).
 * Never modifies scoring behavior or return values.
 */
export declare function logScoringObservation(obs: ScoringObservation): void;
/**
 * Aggregate stats over all logged scoring observations.
 * Returns zeros if table is empty or DB is unavailable.
 * Fail-safe: any error returns zero-value stats.
 */
export declare function getScoringStats(): ScoringStats;
/** Return the current DB handle (may be null if not initialized). */
export declare function getDb(): Database.Database | null;
/** Reset the DB handle (for testing teardown). */
export declare function resetDb(): void;
//# sourceMappingURL=scoring-observability.d.ts.map