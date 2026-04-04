/** FSRS v4 algorithm constants */
declare const FSRS_FACTOR: number;
declare const FSRS_DECAY = -0.5;
declare const FSRS_HALF_LIFE_FACTOR: number;
/** Grade constants for review scoring */
declare const GRADE_AGAIN = 1;
declare const GRADE_HARD = 2;
declare const GRADE_GOOD = 3;
declare const GRADE_EASY = 4;
/** Default initial parameters */
declare const DEFAULT_INITIAL_STABILITY = 1;
declare const DEFAULT_INITIAL_DIFFICULTY = 5;
/** Difficulty bounds */
declare const MIN_DIFFICULTY = 1;
declare const MAX_DIFFICULTY = 10;
/** Stability bounds */
declare const MIN_STABILITY = 0.1;
interface FsrsParams {
    stability: number;
    difficulty: number;
    lastReview: string | null;
    reviewCount: number;
}
interface ReviewResult {
    stability: number;
    difficulty: number;
    lastReview: string;
    reviewCount: number;
    nextReviewDate: string;
    retrievability: number;
}
/**
 * Calculate retrievability (probability of recall) using FSRS v4 formula.
 * R(t) = (1 + FACTOR * t / S)^DECAY
 */
declare function calculateRetrievability(stability: number, elapsedDays: number): number;
/**
 * Update stability based on review grade.
 * Uses simplified FSRS v4 update rules.
 */
declare function updateStability(currentStability: number, difficulty: number, grade: number, retrievability: number): number;
/**
 * Calculate optimal review interval from stability.
 * The interval where retrievability = 0.9 (desired retention).
 */
declare function calculateOptimalInterval(stability: number, desiredRetention?: number): number;
/**
 * Update difficulty based on review grade.
 */
declare function updateDifficulty(currentDifficulty: number, grade: number): number;
/**
 * Calculate elapsed days since last review.
 */
declare function calculateElapsedDays(lastReview: string | null): number;
/**
 * Get next review date based on stability and desired retention.
 */
declare function getNextReviewDate(stability: number, desiredRetention?: number): string;
/**
 * Create initial FSRS parameters for a new memory.
 */
declare function createInitialParams(): FsrsParams;
/**
 * Process a review and return updated parameters.
 */
declare function processReview(params: FsrsParams, grade: number): ReviewResult;
/** Bundled constants object for test/external consumption */
declare const FSRS_CONSTANTS: {
    readonly FSRS_FACTOR: number;
    readonly FSRS_DECAY: -0.5;
    readonly FSRS_HALF_LIFE_FACTOR: number;
    readonly GRADE_AGAIN: 1;
    readonly GRADE_HARD: 2;
    readonly GRADE_GOOD: 3;
    readonly GRADE_EASY: 4;
    readonly DEFAULT_STABILITY: 1;
    readonly DEFAULT_DIFFICULTY: 5;
    readonly MIN_DIFFICULTY: 1;
    readonly MAX_DIFFICULTY: 10;
    readonly MIN_STABILITY: 0.1;
};
/**
 * C138: Tier-based decay multipliers for long-term memory stability.
 * Each tier modifies how quickly memories decay relative to the base FSRS schedule.
 * constitutional = slowest decay (most persistent), scratch = fastest decay (ephemeral).
 *
 * NOTE (TM-03): This multiplier operates on elapsed-time in composite-scoring.ts
 * (lower value = slower perceived time = slower decay). It is a SEPARATE system from
 * IMPORTANCE_TIER_STABILITY_MULTIPLIER below, which operates on the FSRS stability
 * parameter directly. Do NOT apply both to the same memory — use one or the other:
 *   - TIER_MULTIPLIER → used by composite-scoring.ts (elapsed-time adjustment)
 *   - IMPORTANCE_TIER_STABILITY_MULTIPLIER → used by getClassificationDecayMultiplier()
 *     (stability adjustment, activated via SPECKIT_CLASSIFICATION_DECAY env var)
 */
declare const TIER_MULTIPLIER: Readonly<Record<string, number>>;
/**
 * TM-03: Context-type stability multipliers.
 * Applied to the FSRS stability parameter before computing retrievability.
 * Infinity = no decay (retrievability always 1.0).
 * 2.0 = stability doubled → slower decay.
 * 1.0 = standard FSRS schedule.
 */
declare const CONTEXT_TYPE_STABILITY_MULTIPLIER: Record<string, number>;
/**
 * TM-03: Importance-tier stability multipliers.
 * Parallel to TIER_MULTIPLIER but operates on stability (not elapsed time).
 * Used exclusively by getClassificationDecayMultiplier() when
 * SPECKIT_CLASSIFICATION_DECAY is enabled. Do NOT combine with TIER_MULTIPLIER.
 * constitutional/critical: Infinity = never decays.
 * important: 1.5x stability → slower decay.
 * normal: 1.0 → standard.
 * temporary: 0.5x → faster decay (2x relative speed).
 * deprecated: 0.25x → fastest decay (4x relative speed).
 */
declare const IMPORTANCE_TIER_STABILITY_MULTIPLIER: Record<string, number>;
/**
 * TM-03: Compute combined stability multiplier from context_type and importance_tier.
 *
 * Logic:
 *   - If either dimension resolves to Infinity, the combined result is Infinity
 *     (no-decay wins unconditionally).
 *   - Unknown context_type or importance_tier values default to 1.0 (standard).
 *   - Combined multiplier = contextMult * tierMult.
 *
 * When the result is Infinity, callers should treat stability as Infinity,
 * which makes R(t) = (1 + factor * t / Infinity)^decay = 1.0 for all t.
 *
 * @param contextType    Memory context_type field (e.g. "decision", "research")
 * @param importanceTier Memory importance_tier field (e.g. "constitutional", "normal")
 * @returns Combined stability multiplier (may be Infinity)
 */
declare function getClassificationDecayMultiplier(contextType: string, importanceTier: string): number;
/**
 * TM-03: Apply classification-based decay to a stability value.
 * Gated by SPECKIT_CLASSIFICATION_DECAY env var (must be "true" or "1").
 *
 * Returns stability unchanged when the feature flag is disabled.
 * Returns Infinity when the combined multiplier is Infinity (no-decay).
 *
 * @param stability      Base FSRS stability value
 * @param contextType    Memory context_type field
 * @param importanceTier Memory importance_tier field
 * @returns Adjusted stability value
 */
declare function applyClassificationDecay(stability: number, contextType: string, importanceTier: string): number;
/**
 * Context types that should never decay under the hybrid decay policy.
 * Classified as permanent knowledge artifacts.
 */
declare const HYBRID_NO_DECAY_CONTEXT_TYPES: ReadonlySet<string>;
declare const HYBRID_FSRS_CONTEXT_TYPES: ReadonlySet<string>;
declare const NO_DECAY: number;
/**
 * REQ-D4-002: Check whether the hybrid decay policy feature flag is enabled.
 * Default: TRUE (graduated). Set SPECKIT_HYBRID_DECAY_POLICY=false to disable.
 */
declare function isHybridDecayPolicyEnabled(): boolean;
/**
 * REQ-D4-002: Classify a memory's decay behaviour under the hybrid policy.
 *
 * Returns:
 *   - 'no_decay'       for decision / constitutional / critical context types
 *   - 'fsrs_schedule'  for all engagement-sensitive types (session, scratch, etc.)
 */
type HybridDecayClass = 'no_decay' | 'fsrs_schedule';
declare function classifyHybridDecay(contextType: string): HybridDecayClass;
declare function getHybridDecayMultiplier(contextType: string, _importanceTier?: string): number;
/**
 * REQ-D4-002: Apply the hybrid decay policy to a stability value.
 *
 * When SPECKIT_HYBRID_DECAY_POLICY is OFF (default), returns stability unchanged.
 * When ON:
 *   - decision / constitutional / critical → returns Infinity (no decay)
 *   - all others → returns stability unchanged (normal FSRS schedule)
 *
 * @param stability    Base FSRS stability value
 * @param contextType  Memory context_type field (classified at save time)
 * @returns Adjusted stability: Infinity for no-decay types, original otherwise
 */
declare function applyHybridDecayPolicy(stability: number, contextType: string, importanceTier?: string): number;
export { FSRS_FACTOR, FSRS_DECAY, FSRS_HALF_LIFE_FACTOR, // T301: derived constant for half-life ↔ stability
GRADE_AGAIN, GRADE_HARD, GRADE_GOOD, GRADE_EASY, DEFAULT_INITIAL_STABILITY, DEFAULT_INITIAL_DIFFICULTY, MIN_DIFFICULTY, MAX_DIFFICULTY, MIN_STABILITY, FSRS_CONSTANTS, TIER_MULTIPLIER, CONTEXT_TYPE_STABILITY_MULTIPLIER, IMPORTANCE_TIER_STABILITY_MULTIPLIER, getClassificationDecayMultiplier, applyClassificationDecay, NO_DECAY, HYBRID_FSRS_CONTEXT_TYPES, HYBRID_NO_DECAY_CONTEXT_TYPES, isHybridDecayPolicyEnabled, classifyHybridDecay, getHybridDecayMultiplier, applyHybridDecayPolicy, calculateRetrievability, updateStability, calculateOptimalInterval, updateDifficulty, calculateElapsedDays, getNextReviewDate, createInitialParams, processReview, };
export type { FsrsParams, ReviewResult, HybridDecayClass, };
//# sourceMappingURL=fsrs-scheduler.d.ts.map