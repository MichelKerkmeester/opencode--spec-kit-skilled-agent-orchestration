/** Confidence label for a single result. */
export type ConfidenceLabel = 'high' | 'medium' | 'low';
/** Quality label at the request level (across all results). */
export type RequestQualityLabel = 'good' | 'weak' | 'gap';
/** Which factors drove the confidence score upward. */
export type ConfidenceDriver = 'large_margin' | 'multi_channel_agreement' | 'reranker_boost' | 'anchor_density';
/** Per-result confidence payload. */
export interface ResultConfidence {
    confidence: {
        label: ConfidenceLabel;
        value: number;
        drivers: ConfidenceDriver[];
    };
}
/** Request-level quality assessment (one per search call). */
export interface RequestQualityAssessment {
    requestQuality: {
        label: RequestQualityLabel;
    };
}
/**
 * Minimal result shape needed for confidence computation.
 * Uses `Record<string, unknown>` to stay compatible with both
 * `RawSearchResult` and `PipelineRow` without importing either.
 */
export interface ScoredResult extends Record<string, unknown> {
    id: number;
    /** Composite score (0–1). */
    score?: number;
    /** RRF fusion score (0–1). */
    rrfScore?: number;
    /** Intent-adjusted score (0–1). */
    intentAdjustedScore?: number;
    /** Raw cosine similarity (0–100 scale from sqlite-vec). */
    similarity?: number;
    /** Reranker cross-encoder score if available. */
    rerankerScore?: number;
    /** Explicit reranker application marker from the pipeline. */
    rerankerApplied?: boolean;
    /** Score origin metadata for distinguishing real reranks from fallbacks. */
    scoringMethod?: string;
    /** Anchor metadata array populated by Stage 2. */
    anchorMetadata?: Array<Record<string, unknown>>;
    /** Source channels that contributed this result. */
    sources?: string[];
    /** Single source channel string (legacy). */
    source?: string;
    /** Trace metadata containing channel attribution. */
    traceMetadata?: Record<string, unknown>;
}
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
export declare function computeResultConfidence(results: ScoredResult[]): ResultConfidence[];
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
export declare function assessRequestQuality(results: ScoredResult[], confidences: ResultConfidence[]): RequestQualityAssessment;
/**
 * Check whether the per-result confidence feature flag is enabled.
 * Default: ON (graduated). Set SPECKIT_RESULT_CONFIDENCE_V1=false to disable.
 */
export { isResultConfidenceEnabled } from './search-flags.js';
//# sourceMappingURL=confidence-scoring.d.ts.map