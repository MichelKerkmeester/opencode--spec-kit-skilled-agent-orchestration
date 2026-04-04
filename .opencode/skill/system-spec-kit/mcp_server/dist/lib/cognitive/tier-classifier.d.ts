import type { MemoryDbRow } from '@spec-kit/shared/types';
/**
 * Loose input type for tier classification functions.
 * Accepts any partial DB row plus arbitrary extra fields (camelCase
 * fallbacks, search-enriched properties, etc.).
 */
type TierInput = Partial<MemoryDbRow> & Record<string, unknown>;
declare const STATE_THRESHOLDS: {
    readonly HOT: 0.8;
    readonly WARM: 0.25;
    readonly COLD: 0.05;
    readonly DORMANT: 0.02;
};
declare const ARCHIVED_DAYS_THRESHOLD = 90;
interface TierConfigType {
    hotThreshold: number;
    warmThreshold: number;
    coldThreshold: number;
    archivedDaysThreshold: number;
    maxHotMemories: number;
    maxWarmMemories: number;
    maxColdMemories: number;
    maxDormantMemories: number;
    maxArchivedMemories: number;
    summaryFallbackLength: number;
}
declare const TIER_CONFIG: TierConfigType;
type TierState = 'HOT' | 'WARM' | 'COLD' | 'DORMANT' | 'ARCHIVED';
interface StateContent {
    state: TierState;
    memories: TierInput[];
    count: number;
}
interface StateStats {
    HOT: number;
    WARM: number;
    COLD: number;
    DORMANT: number;
    ARCHIVED: number;
    total: number;
}
/**
 * Get effective half-life for a memory based on its type (REQ-002, CHK-017)
 * Priority: explicit half_life_days > memory_type lookup > default
 */
declare function getEffectiveHalfLife(memory: TierInput | null | undefined): number | null;
/**
 * Convert half-life in days to FSRS stability value.
 *
 * FSRS v4 retrievability: R(t) = (1 + FACTOR * t / S)^DECAY
 * where FACTOR = 19/81, DECAY = -0.5.
 *
 * Half-life means R(h) = 0.5:
 *   0.5 = (1 + (19/81) * h / S)^(-0.5)
 *   => S = FSRS_HALF_LIFE_FACTOR * h  (= 19/243 * h)
 *
 * NOTE: The old formula (h / ln(2)) assumed exponential decay R = e^(-t/S),
 * which yielded stability ~18.5x too high for the FSRS power-law model.
 */
declare function halfLifeToStability(halfLifeDays: number | null): number;
/**
 * Calculate retrievability using FSRS formula.
 * R = (1 + FACTOR * t / S)^DECAY
 */
declare function calculateRetrievability(stability: number, elapsedDays: number): number;
/**
 * Classify memory into 5-state model based on retrievability.
 *
 * Accepts either:
 *   - Two numbers: classifyState(retrievability, elapsedDays)
 *   - A memory object: classifyState(memoryOrObj) where R is extracted from
 *     retrievability, attentionScore, or defaults to 0
 *   - null/undefined: returns 'DORMANT'
 */
declare function classifyState(retrievabilityOrMemory: number | TierInput | null | undefined, elapsedDays?: number): TierState;
/**
 * Classify a memory's importance tier based on its properties.
 */
declare function classifyTier(memory: TierInput): {
    state: TierState;
    retrievability: number;
    effectiveHalfLife: number | null;
};
/**
 * Get memories filtered and classified by state.
 */
declare function getStateContent(memories: TierInput[], targetState: TierState, limit?: number): StateContent;
/**
 * T210: Per-tier limit map used by filterAndLimitByState.
 * When applyStateLimits is true, each tier is capped to its max count.
 * If a tier has fewer results than its limit, the surplus slots are
 * redistributed to other tiers that have overflow (in priority order).
 */
declare const PER_TIER_LIMITS: Record<TierState, number>;
/** Priority order for tier overflow redistribution (highest priority first) */
declare const TIER_PRIORITY: TierState[];
/**
 * Filter memories by state and apply limits.
 * Generic over any type assignable to TierInput so callers preserve their
 * concrete element type without double-casting.
 *
 * T210: When no targetState is specified, enforces per-tier quantity limits
 * (HOT: 5, WARM: 10, COLD: 3, DORMANT: 2, ARCHIVED: 1 by default).
 * If a tier has fewer results than its limit, surplus slots are redistributed
 * to other tiers in priority order to maximize total result count.
 */
declare function filterAndLimitByState<T extends TierInput>(memories: T[], targetState?: TierState | null, limit?: number): T[];
/**
 * Format state response for API output.
 */
declare function formatStateResponse(memories: TierInput[]): Array<{
    id: number;
    title: string;
    state: TierState;
    retrievability: number;
    specFolder: string;
    filePath: string;
}>;
/**
 * Get statistics for each state.
 * Accepts any array of TierInput-compatible objects.
 */
declare function getStateStats(memories: readonly TierInput[]): StateStats;
/**
 * Determine if a memory should be archived.
 */
declare function shouldArchive(memory: TierInput): boolean;
export { STATE_THRESHOLDS, ARCHIVED_DAYS_THRESHOLD, TIER_CONFIG, PER_TIER_LIMITS, TIER_PRIORITY, classifyState, calculateRetrievability, classifyTier, getEffectiveHalfLife, halfLifeToStability, getStateContent, filterAndLimitByState, formatStateResponse, getStateStats, shouldArchive, };
export type { TierState, TierInput, StateContent, StateStats, TierConfigType, };
//# sourceMappingURL=tier-classifier.d.ts.map