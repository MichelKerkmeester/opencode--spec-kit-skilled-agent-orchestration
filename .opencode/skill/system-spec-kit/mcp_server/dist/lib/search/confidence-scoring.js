// ───────────────────────────────────────────────────────────────
// MODULE: Confidence Scoring
// ───────────────────────────────────────────────────────────────
// REQ-D5-004: Per-result calibrated confidence scoring
//
// PURPOSE: Combine margin, multi-channel agreement, reranker support,
// and anchor density into a single calibrated confidence score per
// result. V1 uses heuristic scoring only — no LLM calls in the hot path.
//
// FEATURE FLAG: SPECKIT_RESULT_CONFIDENCE_V1 (default ON, graduated)
//
// OUTPUT SHAPE (per result):
// {
//   "confidence": {
//     "label": "high" | "medium" | "low",
//     "value": 0.78,
//     "drivers": ["large_margin", "multi_channel_agreement"]
//   },
//   "requestQuality": {
//     "label": "good" | "weak" | "gap"
//   }
// }
import { resolveEffectiveScore } from './pipeline/types.js';
// -- Constants --
const HIGH_THRESHOLD = 0.7;
const LOW_THRESHOLD = 0.4;
// Weights for each confidence factor (must sum to 1.0)
const WEIGHT_MARGIN = 0.35;
const WEIGHT_CHANNEL_AGREEMENT = 0.30;
const WEIGHT_RERANKER = 0.20;
const WEIGHT_ANCHOR_DENSITY = 0.15;
// Margin thresholds (gap between top score and next score, 0–1 scale)
const LARGE_MARGIN_THRESHOLD = 0.15;
const SMALL_MARGIN_THRESHOLD = 0.05;
// Channel count thresholds
const STRONG_CHANNEL_AGREEMENT_MIN = 2;
// -- Internal helpers --
function resolveScore(result) {
    return resolveEffectiveScore(result);
}
/**
 * Count the number of unique channels that retrieved this result.
 * Inspects `sources`, `source`, and traceMetadata.attribution.
 */
function countChannels(result) {
    const channels = new Set();
    if (Array.isArray(result.sources)) {
        for (const s of result.sources) {
            if (typeof s === 'string' && s.trim().length > 0)
                channels.add(s.trim());
        }
    }
    if (typeof result.source === 'string' && result.source.trim().length > 0) {
        channels.add(result.source.trim());
    }
    // Check traceMetadata.attribution for richer channel data
    const numericId = typeof result.id === 'number' ? result.id : null;
    const attribution = result.traceMetadata?.attribution;
    if (attribution && typeof attribution === 'object' && numericId !== null) {
        for (const [channel, memoryIds] of Object.entries(attribution)) {
            if (!Array.isArray(memoryIds))
                continue;
            const matched = memoryIds.some((mid) => {
                const n = typeof mid === 'number' ? mid : typeof mid === 'string' ? Number(mid) : NaN;
                return Number.isFinite(n) && n === numericId;
            });
            if (matched && typeof channel === 'string' && channel.trim().length > 0) {
                channels.add(channel.trim());
            }
        }
    }
    return channels.size;
}
/**
 * Count anchors present in this result's anchorMetadata array.
 * A result with multiple named anchors is considered "dense" and
 * more likely to be a high-quality, well-structured memory.
 */
function countAnchors(result) {
    if (!Array.isArray(result.anchorMetadata))
        return 0;
    return result.anchorMetadata.length;
}
function hasRerankerSignal(result) {
    const hasFiniteRerankerScore = typeof result.rerankerScore === 'number' && Number.isFinite(result.rerankerScore);
    if (!hasFiniteRerankerScore)
        return false;
    if (result.scoringMethod === 'fallback')
        return false;
    if (result.rerankerApplied === true)
        return true;
    return typeof result.scoringMethod === 'string' && result.scoringMethod.trim().length > 0;
}
/**
 * Compute the score margin between result[i] and result[i+1].
 * Tail results have no successor, so they receive no synthetic margin boost.
 */
function computeMargin(score, nextScore) {
    if (nextScore === null)
        return 0;
    const gap = score - nextScore;
    return Math.max(0, gap);
}
/**
 * Map raw confidence value to a coarse label.
 */
function toConfidenceLabel(value) {
    if (value >= HIGH_THRESHOLD)
        return 'high';
    if (value >= LOW_THRESHOLD)
        return 'medium';
    return 'low';
}
// -- Public API --
/**
 * Compute per-result confidence for a ranked list of results.
 *
 * Each result receives a confidence object derived from:
 *   - Score margin to the next result (35% weight)
 *   - Number of channels that contributed this result (30%)
 *   - Presence of a reranker score (20%)
 *   - Anchor density in anchorMetadata (15%)
 *
 * @param results - Ranked results (highest score first). Ordering is assumed.
 * @returns Array of ResultConfidence objects, parallel to `results`.
 */
export function computeResultConfidence(results) {
    if (!Array.isArray(results) || results.length === 0)
        return [];
    const scores = results.map(resolveScore);
    return results.map((result, i) => {
        const score = scores[i] ?? 0;
        const nextScore = i + 1 < scores.length ? (scores[i + 1] ?? null) : null;
        const margin = computeMargin(score, nextScore);
        const channelCount = countChannels(result);
        const anchorCount = countAnchors(result);
        const hasReranker = hasRerankerSignal(result);
        // Factor scores (each 0–1)
        const marginFactor = margin >= LARGE_MARGIN_THRESHOLD
            ? 1.0
            : margin >= SMALL_MARGIN_THRESHOLD
                ? margin / LARGE_MARGIN_THRESHOLD
                : 0;
        const channelFactor = channelCount >= STRONG_CHANNEL_AGREEMENT_MIN
            ? 1.0
            : channelCount === 1
                ? 0.5
                : 0;
        const rerankerFactor = hasReranker ? 1.0 : 0;
        // Anchor density: 1 anchor → 0.3, 2 → 0.6, 3+ → 1.0
        const anchorFactor = Math.min(1, anchorCount * 0.33);
        const rawValue = WEIGHT_MARGIN * marginFactor +
            WEIGHT_CHANNEL_AGREEMENT * channelFactor +
            WEIGHT_RERANKER * rerankerFactor +
            WEIGHT_ANCHOR_DENSITY * anchorFactor;
        // Base score is a strong prior: if the score itself is very high, confidence
        // should reflect that even when heuristic signals are weak.
        const scorePrior = score * 0.4;
        const heuristicValue = rawValue * 0.6;
        const value = Math.max(0, Math.min(1, heuristicValue + scorePrior));
        const drivers = [];
        if (margin >= LARGE_MARGIN_THRESHOLD)
            drivers.push('large_margin');
        if (channelCount >= STRONG_CHANNEL_AGREEMENT_MIN)
            drivers.push('multi_channel_agreement');
        if (hasReranker)
            drivers.push('reranker_boost');
        if (anchorCount >= 2)
            drivers.push('anchor_density');
        return {
            confidence: {
                label: toConfidenceLabel(value),
                value: Math.round(value * 1000) / 1000,
                drivers,
            },
        };
    });
}
/**
 * Compute request-level quality assessment based on the overall result set.
 *
 * - "good":  most results have high/medium confidence and a healthy top score
 * - "weak":  results exist but signals are mixed or low
 * - "gap":   no results, or all results have low confidence
 *
 * @param results   - The scored results for the query.
 * @param confidences - Parallel confidence array from `computeResultConfidence`.
 */
export function assessRequestQuality(results, confidences) {
    if (!Array.isArray(results) || results.length === 0) {
        return { requestQuality: { label: 'gap' } };
    }
    const highOrMediumCount = confidences.filter((c) => c.confidence.label === 'high' || c.confidence.label === 'medium').length;
    const topScore = resolveScore(results[0]);
    const qualityRatio = highOrMediumCount / results.length;
    if (topScore >= HIGH_THRESHOLD && qualityRatio >= 0.6) {
        return { requestQuality: { label: 'good' } };
    }
    if (results.length > 0 && (topScore >= LOW_THRESHOLD || qualityRatio >= 0.3)) {
        return { requestQuality: { label: 'weak' } };
    }
    return { requestQuality: { label: 'gap' } };
}
/**
 * Check whether the per-result confidence feature flag is enabled.
 * Default: ON (graduated). Set SPECKIT_RESULT_CONFIDENCE_V1=false to disable.
 */
export { isResultConfidenceEnabled } from './search-flags.js';
//# sourceMappingURL=confidence-scoring.js.map