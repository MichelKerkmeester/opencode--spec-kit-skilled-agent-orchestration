import type { MemoryDbRow } from '@spec-kit/shared/types';
/**
 * Loose input type for scoring functions.
 * Accepts any partial DB row plus arbitrary extra fields (camelCase
 * fallbacks, search-enriched properties like similarity, etc.).
 */
export type ScoringInput = Partial<MemoryDbRow> & Record<string, unknown>;
export interface FiveFactorWeights {
    temporal: number;
    usage: number;
    importance: number;
    pattern: number;
    citation: number;
}
export interface LegacyWeights {
    similarity: number;
    importance: number;
    recency: number;
    popularity: number;
    tierBoost: number;
    retrievability: number;
}
export interface ScoringOptions {
    weights?: Partial<FiveFactorWeights> | Partial<LegacyWeights>;
    query?: string;
    anchors?: string | string[];
    use_five_factor_model?: boolean;
}
export interface FactorDetail {
    value: number;
    weight: number;
    contribution: number;
    description?: string;
}
export interface FiveFactorBreakdown {
    factors: {
        temporal: FactorDetail;
        usage: FactorDetail;
        importance: FactorDetail;
        pattern: FactorDetail;
        citation: FactorDetail;
    };
    total: number;
    model: '5-factor';
}
export interface LegacyScoreBreakdown {
    factors: {
        similarity: FactorDetail;
        importance: FactorDetail;
        recency: FactorDetail;
        popularity: FactorDetail;
        tierBoost: FactorDetail;
        retrievability: FactorDetail;
    };
    total: number;
    model: '6-factor-legacy';
}
export interface PatternAlignmentBonuses {
    exact_match: number;
    partial_match: number;
    semantic_threshold: number;
    anchor_match: number;
    type_match: number;
}
export declare const FIVE_FACTOR_WEIGHTS: FiveFactorWeights;
export declare const DEFAULT_WEIGHTS: LegacyWeights;
export declare const RECENCY_SCALE_DAYS: number;
export declare const FSRS_FACTOR: number;
export declare const FSRS_DECAY: number;
export declare const IMPORTANCE_MULTIPLIERS: Readonly<Record<string, number>>;
export declare const CITATION_DECAY_RATE: number;
export declare const CITATION_MAX_DAYS: number;
export declare const DOCUMENT_TYPE_MULTIPLIERS: Readonly<Record<string, number>>;
export declare const PATTERN_ALIGNMENT_BONUSES: PatternAlignmentBonuses;
export { INTERFERENCE_PENALTY_COEFFICIENT } from './interference-scoring.js';
/**
 * T032: Calculate temporal/retrievability score (REQ-017 Factor 1)
 * Uses FSRS v4 power-law formula: R = (1 + 0.235 * t/S)^-0.5
 */
export declare function calculateRetrievabilityScore(row: ScoringInput): number;
export declare const calculateTemporalScore: typeof calculateRetrievabilityScore;
/**
 * T032: Calculate usage score (REQ-017 Factor 2)
 * Formula: min(1.5, 1.0 + accessCount * 0.05)
 * Normalized to 0-1 range for composite scoring
 */
export declare function calculateUsageScore(accessCount: number): number;
/**
 * T032: Calculate importance score with multiplier (REQ-017 Factor 3)
 */
export declare function calculateImportanceScore(tier: string, baseWeight: number | undefined): number;
/**
 * T033: Calculate citation recency score (REQ-017 Factor 5)
 */
export declare function calculateCitationScore(row: ScoringInput): number;
/**
 * T034: Calculate pattern alignment score (REQ-017 Factor 4)
 */
export declare function calculatePatternScore(row: ScoringInput, options?: ScoringOptions): number;
/**
 * HIGH-003 FIX: Wrapper around unified compute_recency_score from folder-scoring.
 *
 * @param timestamp - ISO timestamp of last update
 * @param tier - Importance tier (defaults to 'normal')
 * @returns Recency score 0-1
 */
export declare function calculateRecencyScore(timestamp: string | undefined, tier?: string): number;
/**
 * BUG-013 FIX: Use centralized tier values from importance-tiers.js.
 *
 * @param tier - Importance tier string
 * @returns Boost value for the tier
 */
export declare function getTierBoost(tier: string): number;
/**
 * T032: Calculate 5-factor composite score (REQ-017)
 *
 * Returns a single 0-1 score combining five weighted factors:
 * temporal (FSRS retrievability), usage (access frequency),
 * importance (tier-based), pattern (query alignment), and citation (recency).
 *
 * @param row - Scoring input row with memory fields
 * @param options - Optional weights, query, anchors, model selection
 * @returns Composite score 0-1
 */
export declare function calculateFiveFactorScore(row: ScoringInput, options?: ScoringOptions): number;
/**
 * Legacy 6-factor composite score for backward compatibility.
 *
 * Returns a single 0-1 score combining six weighted factors:
 * similarity, importance, recency, popularity, tierBoost, and retrievability.
 * Set `options.use_five_factor_model = true` to use the newer 5-factor model instead.
 *
 * @param row - Scoring input row with memory fields
 * @param options - Optional weights, query, anchors, model selection
 * @returns Composite score 0-1
 */
export declare function calculateCompositeScore(row: ScoringInput, options?: ScoringOptions): number;
/**
 * T032: Apply 5-factor scoring to a batch of results.
 *
 * Each result is augmented with:
 * - `composite_score`: Five-factor composite (0-1) combining retrievability,
 *   usage, importance, pattern alignment, and citation recency scores.
 * - `_scoring`: Breakdown of individual factor values for diagnostics.
 *
 * Results are sorted descending by composite_score.
 *
 * @param results - Array of scoring input rows
 * @param options - Optional scoring configuration
 * @returns Scored and sorted results with composite_score and _scoring breakdown
 */
export declare function applyFiveFactorScoring(results: ScoringInput[], options?: ScoringOptions): (ScoringInput & {
    composite_score: number;
    _scoring: Record<string, number>;
})[];
/**
 * Legacy batch scoring for backward compatibility.
 *
 * Each result is augmented with:
 * - `composite_score`: Six-factor composite (0-1) combining similarity,
 *   importance, recency, popularity, tierBoost, and retrievability scores.
 * - `_scoring`: Breakdown of individual factor values for diagnostics.
 *
 * Results are sorted descending by composite_score.
 *
 * @param results - Array of scoring input rows
 * @param options - Optional scoring configuration
 * @returns Scored and sorted results with composite_score and _scoring breakdown
 */
export declare function applyCompositeScoring(results: ScoringInput[], options?: ScoringOptions): (ScoringInput & {
    composite_score: number;
    _scoring: Record<string, number>;
})[];
/**
 * T032: Get 5-factor score breakdown.
 *
 * @param row - Scoring input row with memory fields
 * @param options - Optional scoring configuration
 * @returns Detailed breakdown of each factor's value, weight, and contribution
 */
export declare function getFiveFactorBreakdown(row: ScoringInput, options?: ScoringOptions): FiveFactorBreakdown;
/**
 * Legacy score breakdown for backward compatibility.
 *
 * @param row - Scoring input row with memory fields
 * @param options - Optional scoring configuration
 * @returns Detailed breakdown of each factor (5-factor or 6-factor-legacy)
 */
export declare function getScoreBreakdown(row: ScoringInput, options?: ScoringOptions): FiveFactorBreakdown | LegacyScoreBreakdown;
/**
 * Check if composite score normalization is enabled.
 * Default: TRUE. Set SPECKIT_SCORE_NORMALIZATION=false to disable.
 *
 * @returns True if normalization is enabled (default: ON)
 */
export declare function isCompositeNormalizationEnabled(): boolean;
/**
 * Apply min-max normalization to composite scores, mapping to [0,1].
 * Gated behind SPECKIT_SCORE_NORMALIZATION env var — returns unchanged when disabled.
 *
 * - If all scores are equal, they normalize to 0.0 (no meaningful differentiation).
 * - If a single result, it normalizes to 0.0.
 * - Returns empty array when given empty array.
 *
 * @param scores - Array of raw composite scores
 * @returns Normalized scores mapped to [0, 1] (or unchanged when disabled)
 */
export declare function normalizeCompositeScores(scores: number[]): number[];
//# sourceMappingURL=composite-scoring.d.ts.map