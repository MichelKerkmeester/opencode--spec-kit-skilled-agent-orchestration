// ───────────────────────────────────────────────────────────────
// MODULE: Fsrs Scheduler
// ───────────────────────────────────────────────────────────────
// Feature catalog: Classification-based decay
// CANONICAL FSRS CONSTANTS & ALGORITHM
// Free Spaced Repetition Scheduler v4 algorithm implementation
//
// TWO-DOMAIN DECAY MODEL (Single Source of Truth)
// Long-term memory (this file):
// FSRS v4 power-law: R(t) = (1 + FSRS_FACTOR * t/S)^FSRS_DECAY
// Timescale: days/weeks. Constants: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
// All long-term decay consumers MUST import constants from this file.
//
// Working memory (working-memory.ts — separate system, intentionally decoupled):
// Linear multiplicative: score * 0.95 per tick
// Timescale: minutes. Operates on session-scoped attention scores only.
//
// DECAY STRATEGY (ADR-004): This is the CANONICAL long-term decay
// Algorithm. All temporal decay for persistent memories should route
// Through calculateRetrievability(). Formula: R(t) = (1 + 19/81 * t/S)^(-0.5)
// Where t = elapsed days, S = stability (grows with successful reviews).
//
// Consumers: attention-decay.ts (facade), composite-scoring.ts (temporal
// Factor), tier-classifier.ts (state classification),
// Vector-index-impl.js (SQL search ranking).

import { LEGACY_CONTEXT_TYPE_ALIASES } from '@spec-kit/shared/context-types';

/* --- 1. CONSTANTS --- */

/** FSRS v4 algorithm constants */
const FSRS_FACTOR = 19 / 81;
const FSRS_DECAY = -0.5;

// Derived constant for half-life ↔ stability conversion.
// From R(h) = 0.5: S = (FSRS_FACTOR / 3) * h = (19/243) * h
const FSRS_HALF_LIFE_FACTOR = FSRS_FACTOR / 3; // 19/243 ≈ 0.07819

/** Grade constants for review scoring */
const GRADE_AGAIN = 1;
const GRADE_HARD = 2;
const GRADE_GOOD = 3;
const GRADE_EASY = 4;

/** Default initial parameters */
const DEFAULT_INITIAL_STABILITY = 1.0;
const DEFAULT_INITIAL_DIFFICULTY = 5.0;

/** Difficulty bounds */
const MIN_DIFFICULTY = 1.0;
const MAX_DIFFICULTY = 10.0;

/** Stability bounds */
const MIN_STABILITY = 0.1;

/* --- 2. INTERFACES --- */

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

/* --- 3. CORE FUNCTIONS --- */

/**
 * Calculate retrievability (probability of recall) using FSRS v4 formula.
 * R(t) = (1 + FACTOR * t / S)^DECAY
 */
function calculateRetrievability(stability: number, elapsedDays: number): number {
  if (stability <= 0 || elapsedDays < 0) {
    return 0;
  }

  const retrievability = Math.pow(
    1 + FSRS_FACTOR * (elapsedDays / stability),
    FSRS_DECAY
  );

  return Math.max(0, Math.min(1, retrievability));
}

/**
 * Update stability based on review grade.
 * Uses simplified FSRS v4 update rules.
 */
function updateStability(
  currentStability: number,
  difficulty: number,
  grade: number,
  retrievability: number
): number {
  const safeStability = Math.max(0, currentStability);
  const safeDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, difficulty));

  if (grade === GRADE_AGAIN) {
    // Lapse: stability decreases significantly
    return Math.max(MIN_STABILITY, safeStability * 0.2);
  }

  // Success: stability increases based on grade and difficulty
  const difficultyFactor = 1 + (11 - safeDifficulty) * 0.1;
  const gradeFactor = grade === GRADE_EASY ? 1.3 : grade === GRADE_GOOD ? 1.0 : 0.8;
  const retrievabilityBonus = 1 + (1 - retrievability) * 0.5;

  const newStability = safeStability * difficultyFactor * gradeFactor * retrievabilityBonus;

  return Math.max(MIN_STABILITY, newStability);
}

/**
 * Calculate optimal review interval from stability.
 * The interval where retrievability = 0.9 (desired retention).
 */
function calculateOptimalInterval(stability: number, desiredRetention: number = 0.9): number {
  const safeStability = Math.max(0, stability);

  if (safeStability <= 0 || desiredRetention <= 0 || desiredRetention >= 1) {
    return 0;
  }

  const interval = (safeStability / FSRS_FACTOR) * (Math.pow(desiredRetention, 1 / FSRS_DECAY) - 1);

  return Math.max(0, Math.round(Math.max(0, interval)));
}

/**
 * Update difficulty based on review grade.
 */
function updateDifficulty(currentDifficulty: number, grade: number): number {
  const safeDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, currentDifficulty));
  let newDifficulty: number;

  if (grade === GRADE_AGAIN) {
    newDifficulty = safeDifficulty + 1.0;
  } else if (grade === GRADE_HARD) {
    newDifficulty = safeDifficulty + 0.5;
  } else if (grade === GRADE_GOOD) {
    newDifficulty = safeDifficulty;
  } else {
    // EASY
    newDifficulty = safeDifficulty - 0.5;
  }

  return Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, newDifficulty));
}

/**
 * Calculate elapsed days since last review.
 */
function calculateElapsedDays(lastReview: string | null): number {
  if (!lastReview) {
    return 0;
  }

  const lastDate = new Date(lastReview);
  if (isNaN(lastDate.getTime())) return 0;
  const now = new Date();
  const diffMs = now.getTime() - lastDate.getTime();

  return Math.max(0, diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Get next review date based on stability and desired retention.
 */
function getNextReviewDate(stability: number, desiredRetention: number = 0.9): string {
  const intervalDays = calculateOptimalInterval(stability, desiredRetention);
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);

  return nextDate.toISOString();
}

/**
 * Create initial FSRS parameters for a new memory.
 */
function createInitialParams(): FsrsParams {
  return {
    stability: DEFAULT_INITIAL_STABILITY,
    difficulty: DEFAULT_INITIAL_DIFFICULTY,
    lastReview: null,
    reviewCount: 0,
  };
}

/**
 * Process a review and return updated parameters.
 */
function processReview(params: FsrsParams, grade: number): ReviewResult {
  const elapsedDays = calculateElapsedDays(params.lastReview);
  const retrievability = calculateRetrievability(params.stability, elapsedDays);

  const newStability = updateStability(params.stability, params.difficulty, grade, retrievability);
  const newDifficulty = updateDifficulty(params.difficulty, grade);
  const now = new Date().toISOString();
  const nextReviewDate = getNextReviewDate(newStability);

  return {
    stability: newStability,
    difficulty: newDifficulty,
    lastReview: now,
    reviewCount: params.reviewCount + 1,
    nextReviewDate,
    retrievability,
  };
}

/* --- 4. EXPORTS --- */

/** Bundled constants object for test/external consumption */
const FSRS_CONSTANTS = {
  FSRS_FACTOR,
  FSRS_DECAY,
  FSRS_HALF_LIFE_FACTOR, // T301: derived constant (19/243)
  GRADE_AGAIN,
  GRADE_HARD,
  GRADE_GOOD,
  GRADE_EASY,
  DEFAULT_STABILITY: DEFAULT_INITIAL_STABILITY,
  DEFAULT_DIFFICULTY: DEFAULT_INITIAL_DIFFICULTY,
  MIN_DIFFICULTY,
  MAX_DIFFICULTY,
  MIN_STABILITY,
} as const;

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
const TIER_MULTIPLIER: Readonly<Record<string, number>> = {
  constitutional: 0.1,
  critical: 0.3,
  important: 0.5,
  normal: 1.0,
  temporary: 2.0,
  scratch: 3.0,
} as const;

/* --- 4a. CLASSIFICATION-BASED DECAY (TM-03) ---
   Gated by SPECKIT_CLASSIFICATION_DECAY env var.
   Multiplies FSRS stability so that:
     - Infinity stability → R(t) = 1.0 always (no decay)
     - >1.0 stability multiplier → slower decay
     - <1.0 stability multiplier → faster decay */

/**
 * TM-03: Context-type stability multipliers.
 * Applied to the FSRS stability parameter before computing retrievability.
 * Infinity = no decay (retrievability always 1.0).
 * 2.0 = stability doubled → slower decay.
 * 1.0 = standard FSRS schedule.
 */
const CONTEXT_TYPE_STABILITY_MULTIPLIER: Record<string, number> = {
  planning: Infinity,    // no decay — planning/decisions are permanent
  research: 2.0,         // 2x stability — research context decays slower
  implementation: 1.0,   // standard decay
  general: 1.0,          // standard decay
  // P1-3: Legacy aliases inherit their canonical type's multiplier
  ...Object.fromEntries(
    Object.entries(LEGACY_CONTEXT_TYPE_ALIASES).map(
      ([legacy, canonical]) => [legacy, canonical === 'planning' ? Infinity : canonical === 'research' ? 2.0 : 1.0]
    )
  ),
};

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
const IMPORTANCE_TIER_STABILITY_MULTIPLIER: Record<string, number> = {
  constitutional: Infinity, // never decays
  critical: Infinity,       // never decays
  important: 1.5,           // slower decay
  normal: 1.0,              // standard
  temporary: 0.5,           // faster decay
  deprecated: 0.25,         // fastest decay
};

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
function getClassificationDecayMultiplier(contextType: string, importanceTier: string): number {
  const contextMult = CONTEXT_TYPE_STABILITY_MULTIPLIER[contextType] ?? 1.0;
  const tierMult = IMPORTANCE_TIER_STABILITY_MULTIPLIER[importanceTier] ?? 1.0;

  // Infinity * anything = Infinity (no-decay wins)
  if (!isFinite(contextMult) || !isFinite(tierMult)) {
    return Infinity;
  }

  return contextMult * tierMult;
}

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
function applyClassificationDecay(
  stability: number,
  contextType: string,
  importanceTier: string
): number {
  if (isHybridDecayPolicyEnabled() && HYBRID_NO_DECAY_CONTEXT_TYPES.has(contextType)) {
    return Infinity;
  }

  // Graduated: default-ON. Set SPECKIT_CLASSIFICATION_DECAY=false to disable.
  const flag = process.env.SPECKIT_CLASSIFICATION_DECAY?.toLowerCase();
  if (flag === 'false' || flag === '0') {
    return stability;
  }

  const multiplier = getClassificationDecayMultiplier(contextType, importanceTier);
  if (!isFinite(multiplier)) {
    return Infinity;
  }

  return stability * multiplier;
}

/* --- 4b. HYBRID DECAY POLICY (REQ-D4-002) ---
   Gated by SPECKIT_HYBRID_DECAY_POLICY env var (default OFF).
   Distinguishes two classes of memory:

   1. NO-DECAY documents — context_type in {decision, constitutional, critical}
      These represent permanent knowledge artifacts. Their stability is treated as
      Infinity so R(t) = 1.0 at all times.

   2. ENGAGEMENT-SENSITIVE documents — all other context_types (session, scratch,
      transient, implementation, discovery, research, general)
      Normal FSRS schedule applies without modification.

   This is intentionally SEPARATE from TM-03 (applyClassificationDecay) which
   uses a combined context_type × importance_tier multiplier and is default-ON.
   SPECKIT_HYBRID_DECAY_POLICY is default-OFF and must be opted into explicitly.
   DO NOT combine both policies on the same memory. */

/**
 * Context types that should never decay under the hybrid decay policy.
 * Classified as permanent knowledge artifacts.
 */
const HYBRID_NO_DECAY_CONTEXT_TYPES: ReadonlySet<string> = new Set([
  'planning',
  ...Object.keys(LEGACY_CONTEXT_TYPE_ALIASES).filter(k => LEGACY_CONTEXT_TYPE_ALIASES[k] === 'planning'),
  'constitutional',
  'critical',
]);
const HYBRID_FSRS_CONTEXT_TYPES: ReadonlySet<string> = new Set([
  'session',
  'scratch',
  'transient',
  'implementation',
  'discovery',
  'research',
  'general',
]);
const NO_DECAY = Infinity;

/**
 * REQ-D4-002: Check whether the hybrid decay policy feature flag is enabled.
 * Default: TRUE (graduated). Set SPECKIT_HYBRID_DECAY_POLICY=false to disable.
 */
function isHybridDecayPolicyEnabled(): boolean {
  const val = process.env.SPECKIT_HYBRID_DECAY_POLICY?.toLowerCase().trim();
  return val !== 'false' && val !== '0';
}

/**
 * REQ-D4-002: Classify a memory's decay behaviour under the hybrid policy.
 *
 * Returns:
 *   - 'no_decay'       for decision / constitutional / critical context types
 *   - 'fsrs_schedule'  for all engagement-sensitive types (session, scratch, etc.)
 */
type HybridDecayClass = 'no_decay' | 'fsrs_schedule';

function classifyHybridDecay(contextType: string): HybridDecayClass {
  if (HYBRID_NO_DECAY_CONTEXT_TYPES.has(contextType)) {
    return 'no_decay';
  }
  return 'fsrs_schedule';
}

function getHybridDecayMultiplier(contextType: string, _importanceTier?: string): number {
  if (!isHybridDecayPolicyEnabled()) {
    return 1;
  }
  return HYBRID_NO_DECAY_CONTEXT_TYPES.has(contextType) ? NO_DECAY : 1;
}

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
function applyHybridDecayPolicy(stability: number, contextType: string, importanceTier?: string): number {
  const multiplier = getHybridDecayMultiplier(contextType, importanceTier);
  return Number.isFinite(multiplier) ? stability * multiplier : NO_DECAY;
}

export {
  // Constants
  FSRS_FACTOR,
  FSRS_DECAY,
  FSRS_HALF_LIFE_FACTOR, // T301: derived constant for half-life ↔ stability
  GRADE_AGAIN,
  GRADE_HARD,
  GRADE_GOOD,
  GRADE_EASY,
  DEFAULT_INITIAL_STABILITY,
  DEFAULT_INITIAL_DIFFICULTY,
  MIN_DIFFICULTY,
  MAX_DIFFICULTY,
  MIN_STABILITY,
  FSRS_CONSTANTS,
  TIER_MULTIPLIER,

  // TM-03: Classification-based decay constants and functions
  CONTEXT_TYPE_STABILITY_MULTIPLIER,
  IMPORTANCE_TIER_STABILITY_MULTIPLIER,
  getClassificationDecayMultiplier,
  applyClassificationDecay,

  // REQ-D4-002: Hybrid decay policy
  NO_DECAY,
  HYBRID_FSRS_CONTEXT_TYPES,
  HYBRID_NO_DECAY_CONTEXT_TYPES,
  isHybridDecayPolicyEnabled,
  classifyHybridDecay,
  getHybridDecayMultiplier,
  applyHybridDecayPolicy,

  // Core functions
  calculateRetrievability,
  updateStability,
  calculateOptimalInterval,
  updateDifficulty,
  calculateElapsedDays,
  getNextReviewDate,
  createInitialParams,
  processReview,
};

export type {
  FsrsParams,
  ReviewResult,
  HybridDecayClass,
};
