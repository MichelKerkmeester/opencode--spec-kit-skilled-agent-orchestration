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
};
/* ───────────────────────────────────────────────────────────────
   3. INTERNAL HELPERS
──────────────────────────────────────────────────────────────── */
/**
 * Clamp a value to [min, max].
 */
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
/**
 * Compute the count saturation component.
 * Returns min(1, resultCount / expectedCount).
 * When expectedCount ≤ 0 it is treated as 1 to avoid division by zero.
 */
function computeCountSaturation(resultCount, expectedCount) {
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
function computeLatencyScore(latencyMs, latencyTargetMs) {
    const safeTarget = latencyTargetMs > 0 ? latencyTargetMs : DEFAULT_LATENCY_TARGET_MS;
    return Math.max(0, 1 - latencyMs / safeTarget);
}
/**
 * Map a composite score to an interpretation label.
 *   ≥ 0.8  → 'excellent'
 *   ≥ 0.6  → 'good'
 *   ≥ 0.4  → 'acceptable'
 *   <  0.4 → 'poor'
 */
function interpretScore(score) {
    if (score >= 0.8)
        return 'excellent';
    if (score >= 0.6)
        return 'good';
    if (score >= 0.4)
        return 'acceptable';
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
export function computeQualityProxy(input) {
    const { avgRelevance, topResultRelevance, resultCount, expectedCount, latencyMs, latencyTargetMs = DEFAULT_LATENCY_TARGET_MS, } = input;
    // Clamp raw inputs to [0, 1] — guard against out-of-range values
    const clampedAvgRelevance = clamp(avgRelevance, 0, 1);
    const clampedTopResult = clamp(topResultRelevance, 0, 1);
    // Compute raw (unweighted) component values in [0, 1]
    const rawCountSaturation = computeCountSaturation(resultCount, expectedCount);
    const rawLatencyScore = computeLatencyScore(latencyMs, latencyTargetMs);
    // Apply weights to produce each component's contribution
    const components = {
        avgRelevance: clampedAvgRelevance * WEIGHTS.avgRelevance,
        topResult: clampedTopResult * WEIGHTS.topResult,
        countSaturation: rawCountSaturation * WEIGHTS.countSaturation,
        latencyPenalty: rawLatencyScore * WEIGHTS.latencyPenalty,
    };
    // Sum all weighted components and clamp to [0, 1]
    const rawScore = components.avgRelevance +
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
//# sourceMappingURL=eval-quality-proxy.js.map