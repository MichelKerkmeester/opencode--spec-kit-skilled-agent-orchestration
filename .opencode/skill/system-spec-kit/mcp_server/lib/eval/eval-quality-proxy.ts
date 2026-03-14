// ───────────────────────────────────────────────────────────────
// MODULE: Eval Quality Proxy (T006G)
// ───────────────────────────────────────────────────────────────
// Feature catalog: Quality proxy formula
// Automated quality proxy metric that correlates with manual
// Quality assessment. Pure function, no DB access, no side effects.
//
// Formula:
// QualityProxy = avgRelevance * 0.40 + topResult * 0.25
// + countSaturation * 0.20 + latencyPenalty * 0.15
//
// All components normalised to [0, 1]. Output range: [0, 1].
/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
──────────────────────────────────────────────────────────────── */

/** Default latency target in milliseconds. */
const DEFAULT_LATENCY_TARGET_MS = 500;

/** Weights for each component — must sum to 1.0. */
const WEIGHTS = {
  avgRelevance: 0.4,
  topResult: 0.25,
  countSaturation: 0.2,
  latencyPenalty: 0.15,
} as const;

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

/** Input parameters for the quality proxy computation. */
export interface QualityProxyInput {
  /**
   * Average relevance score of returned results.
   * Should be normalised to [0, 1] — typically avgRelevance / 3
   * when raw relevance is on a 0-3 scale.
   */
  avgRelevance: number;

  /**
   * Relevance of the top result (rank 1).
   * Should be normalised to [0, 1] — typically relevance / 3
   * when raw relevance is on a 0-3 scale.
   */
  topResultRelevance: number;

  /** Number of results actually returned by the search. */
  resultCount: number;

  /**
   * Expected / desired number of results (e.g. the limit parameter
   * passed to the search call).
   * Must be > 0 to avoid division by zero; defaults to 1 when ≤ 0.
   */
  expectedCount: number;

  /** Actual search latency in milliseconds. */
  latencyMs: number;

  /**
   * Target latency in milliseconds.
   * Defaults to 500 ms when omitted or ≤ 0.
   */
  latencyTargetMs?: number;
}

/** Breakdown of each component's weighted contribution. */
export interface QualityProxyComponents {
  /** avgRelevance × 0.40 */
  avgRelevance: number;
  /** topResultRelevance × 0.25 */
  topResult: number;
  /** countSaturation × 0.20 */
  countSaturation: number;
  /** latencyScore × 0.15 */
  latencyPenalty: number;
}

/** Result of the quality proxy computation. */
export interface QualityProxyResult {
  /** Composite quality score in [0, 1]. */
  score: number;
  /** Weighted contribution of each individual component. */
  components: QualityProxyComponents;
  /** Human-readable quality tier: 'excellent' | 'good' | 'acceptable' | 'poor'. */
  interpretation: 'excellent' | 'good' | 'acceptable' | 'poor';
}

/* ───────────────────────────────────────────────────────────────
   3. INTERNAL HELPERS
──────────────────────────────────────────────────────────────── */

/**
 * Clamp a value to [min, max].
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Compute the count saturation component.
 * Returns min(1, resultCount / expectedCount).
 * When expectedCount ≤ 0 it is treated as 1 to avoid division by zero.
 */
function computeCountSaturation(
  resultCount: number,
  expectedCount: number,
): number {
  const safeExpected = expectedCount > 0 ? expectedCount : 1;
  return Math.min(1, resultCount / safeExpected);
}

/**
 * Compute the latency penalty component.
 * Returns max(0, 1 − latencyMs / latencyTargetMs).
 *   - 1.0 at latencyMs = 0 (perfect — full credit)
 *   - 0.0 at latencyMs ≥ latencyTargetMs (at or over target)
 * When latencyTargetMs ≤ 0 it is treated as DEFAULT_LATENCY_TARGET_MS.
 */
function computeLatencyScore(
  latencyMs: number,
  latencyTargetMs: number,
): number {
  const safeTarget =
    latencyTargetMs > 0 ? latencyTargetMs : DEFAULT_LATENCY_TARGET_MS;
  return Math.max(0, 1 - latencyMs / safeTarget);
}

/**
 * Map a composite score to an interpretation label.
 *   ≥ 0.8  → 'excellent'
 *   ≥ 0.6  → 'good'
 *   ≥ 0.4  → 'acceptable'
 *   <  0.4 → 'poor'
 */
function interpretScore(
  score: number,
): 'excellent' | 'good' | 'acceptable' | 'poor' {
  if (score >= 0.8) return 'excellent';
  if (score >= 0.6) return 'good';
  if (score >= 0.4) return 'acceptable';
  return 'poor';
}

/* ───────────────────────────────────────────────────────────────
   4. CORE FUNCTION
──────────────────────────────────────────────────────────────── */

/**
 * Compute the quality proxy score for a single search result set.
 *
 * All four components are normalised to [0, 1] before weighting:
 *
 *   avgRelevance    — direct pass-through (caller normalises to [0,1])
 *   topResult       — direct pass-through (caller normalises to [0,1])
 *   countSaturation — min(1, resultCount / expectedCount)
 *   latencyPenalty  — max(0, 1 − latencyMs / latencyTargetMs)
 *
 * The final score is clamped to [0, 1] to guard against floating-point
 * rounding errors.
 *
 * @returns QualityProxyResult with composite score, per-component
 *          weighted contributions, and a human-readable interpretation.
 */
export function computeQualityProxy(
  input: QualityProxyInput,
): QualityProxyResult {
  const {
    avgRelevance,
    topResultRelevance,
    resultCount,
    expectedCount,
    latencyMs,
    latencyTargetMs = DEFAULT_LATENCY_TARGET_MS,
  } = input;

  // Clamp raw inputs to [0, 1] — guard against out-of-range values
  const clampedAvgRelevance = clamp(avgRelevance, 0, 1);
  const clampedTopResult = clamp(topResultRelevance, 0, 1);

  // Compute raw (unweighted) component values in [0, 1]
  const rawCountSaturation = computeCountSaturation(resultCount, expectedCount);
  const rawLatencyScore = computeLatencyScore(latencyMs, latencyTargetMs);

  // Apply weights to produce each component's contribution
  const components: QualityProxyComponents = {
    avgRelevance: clampedAvgRelevance * WEIGHTS.avgRelevance,
    topResult: clampedTopResult * WEIGHTS.topResult,
    countSaturation: rawCountSaturation * WEIGHTS.countSaturation,
    latencyPenalty: rawLatencyScore * WEIGHTS.latencyPenalty,
  };

  // Sum all weighted components and clamp to [0, 1]
  const rawScore =
    components.avgRelevance +
    components.topResult +
    components.countSaturation +
    components.latencyPenalty;

  const score = clamp(rawScore, 0, 1);

  return {
    score,
    components,
    interpretation: interpretScore(score),
  };
}

/* ───────────────────────────────────────────────────────────────
   5. EXPORTS (re-export constants for test convenience)
──────────────────────────────────────────────────────────────── */

export { WEIGHTS, DEFAULT_LATENCY_TARGET_MS };
