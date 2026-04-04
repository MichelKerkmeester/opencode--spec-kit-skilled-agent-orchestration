/** Maximum graph contribution allowed in Stage 2 scoring.
 *  Env-tunable via SPECKIT_GRAPH_WEIGHT_CAP (default 0.15).
 *  Note: per-mechanism inner caps (e.g. STAGE2_GRAPH_BONUS_CAP=0.03) are unchanged. */
export declare const GRAPH_WEIGHT_CAP: number;
/** Maximum community score boost --- secondary signal only. */
export declare const COMMUNITY_SCORE_CAP = 0.03;
/** Named calibration profile controlling graph and community parameters. */
export interface CalibrationProfile {
    /** Maximum graph weight contribution in Stage 2. */
    graphWeightCap: number;
    /** N2a cap for RRF fusion overflow prevention. */
    n2aCap: number;
    /** N2b cap for RRF fusion overflow prevention. */
    n2bCap: number;
    /** Minimum graph density required to activate Louvain. */
    louvainMinDensity: number;
    /** Minimum component size required to activate Louvain. */
    louvainMinSize: number;
}
/** Louvain activation threshold configuration. */
export interface LouvainThresholds {
    /** Minimum graph density to activate community detection. */
    minDensity: number;
    /** Minimum component node count to activate community detection. */
    minSize: number;
}
/** Result of shouldActivateLouvain check. */
export interface LouvainActivationResult {
    /** Whether Louvain community detection should run. */
    activate: boolean;
    /** Human-readable reason for the decision. */
    reason: string;
}
/** A single ranked item used in ablation measurement. */
export interface AblationRankedItem {
    /** Unique memory ID. */
    id: number;
    /** Ranking score. */
    score: number;
    /** Whether this item is relevant (ground truth). */
    relevant?: boolean;
}
/** Per-intent ablation metrics. */
export interface IntentMetrics {
    /** Intent label (e.g. 'fix_bug', 'understand'). */
    intent: string;
    /** Mean Reciprocal Rank at k. */
    mrr: number;
    /** Normalized Discounted Cumulative Gain at k. */
    ndcg: number;
}
/** Feature toggle for ablation. */
export interface FeatureToggle {
    /** Feature name. */
    name: string;
    /** Whether the feature is currently enabled. */
    enabled: boolean;
}
/** Ablation run result for a single feature toggle. */
export interface AblationResult {
    /** Feature that was toggled off (or 'baseline' for full-features run). */
    featureName: string;
    /** Per-intent metrics with this feature disabled. */
    intentMetrics: IntentMetrics[];
    /** Aggregate MRR across all intents. */
    aggregateMrr: number;
    /** Aggregate NDCG across all intents. */
    aggregateNdcg: number;
}
/** Full ablation run output. */
export interface AblationRunResult {
    /** Baseline metrics (all features on). */
    baseline: AblationResult;
    /** Per-feature ablation results. */
    ablations: AblationResult[];
}
/** Scoring context that a calibration profile can be applied to. */
export interface ScoringContext {
    /** Current graph weight boost value. */
    graphWeightBoost: number;
    /** Current N2a fusion score. */
    n2aScore: number;
    /** Current N2b fusion score. */
    n2bScore: number;
    /** Current community boost value. */
    communityBoost: number;
}
/** Search function signature for ablation harness. */
export type AblationSearchFn = (query: string, disabledFeatures: Set<string>) => AblationRankedItem[];
/** Intent-query pair for ablation evaluation. */
export interface IntentQuery {
    /** Intent label. */
    intent: string;
    /** Query text. */
    query: string;
    /** Ground-truth relevant item IDs. */
    relevantIds: number[];
}
/** Default conservative profile --- all caps at baseline values. */
export declare const DEFAULT_PROFILE: CalibrationProfile;
/** Aggressive profile --- tighter caps, stricter Louvain gates. */
export declare const AGGRESSIVE_PROFILE: CalibrationProfile;
import { isGraphCalibrationProfileEnabled } from './search-flags.js';
export declare const isGraphCalibrationEnabled: typeof isGraphCalibrationProfileEnabled;
/**
 * Compute Mean Reciprocal Rank at k.
 *
 * MRR@k = 1 / rank_of_first_relevant_item (within top k).
 * Returns 0 if no relevant item appears in the top k.
 *
 * @param rankedItems - Items in ranked order (index 0 = rank 1).
 * @param relevantIds - Set of relevant item IDs (ground truth).
 * @param k           - Cutoff depth (default 10).
 */
export declare function computeMRR(rankedItems: AblationRankedItem[], relevantIds: Set<number>, k?: number): number;
/**
 * Compute Normalized Discounted Cumulative Gain at k.
 *
 * NDCG@k = DCG@k / IDCG@k where:
 *   DCG@k  = sum_{i=1}^{k} rel(i) / log2(i + 1)
 *   IDCG@k = DCG of the ideal ranking (all relevant items first).
 *
 * Returns 0 if there are no relevant items or the ranked list is empty.
 *
 * @param rankedItems - Items in ranked order (index 0 = rank 1).
 * @param relevantIds - Set of relevant item IDs (ground truth).
 * @param k           - Cutoff depth (default 10).
 */
export declare function computeNDCG(rankedItems: AblationRankedItem[], relevantIds: Set<number>, k?: number): number;
/**
 * Run an ablation study: measure per-intent MRR@k and NDCG@k with
 * all features enabled (baseline), then with each feature toggled off
 * one at a time.
 *
 * @param searchFn   - Search function accepting disabled feature set.
 * @param queries    - Intent-query pairs with ground truth.
 * @param toggles    - Feature toggles to ablate.
 * @param k          - Metric cutoff depth (default 10).
 */
export declare function runAblation(searchFn: AblationSearchFn, queries: IntentQuery[], toggles: FeatureToggle[], k?: number): AblationRunResult;
/**
 * Clamp the graph weight contribution to the configured cap.
 * Ensures Stage 2 graph bonus never exceeds the profile's graphWeightCap.
 *
 * @param rawGraphWeight - Uncapped graph weight boost.
 * @param cap            - Maximum allowed value (defaults to GRAPH_WEIGHT_CAP).
 * @returns Clamped graph weight in [0, cap].
 */
export declare function applyGraphWeightCap(rawGraphWeight: number, cap?: number): number;
/**
 * Calibrate the graph weight boost for a scoring context.
 * Applies the profile's graphWeightCap and N2a/N2b caps.
 *
 * @param context - Current scoring values to calibrate.
 * @param profile - Calibration profile to apply (defaults to DEFAULT_PROFILE).
 * @returns New scoring context with capped values.
 */
export declare function calibrateGraphWeight(context: ScoringContext, profile?: CalibrationProfile): ScoringContext;
/**
 * Load the active calibration profile from environment or use default.
 *
 * Environment variable: SPECKIT_CALIBRATION_PROFILE_NAME
 * - 'aggressive' -> AGGRESSIVE_PROFILE
 * - 'default' or unset -> DEFAULT_PROFILE
 *
 * Individual overrides via env:
 * - SPECKIT_GRAPH_WEIGHT_CAP
 * - SPECKIT_N2A_CAP
 * - SPECKIT_N2B_CAP
 * - SPECKIT_LOUVAIN_MIN_DENSITY
 * - SPECKIT_LOUVAIN_MIN_SIZE
 */
export declare function loadCalibrationProfile(): CalibrationProfile;
/**
 * Apply a calibration profile to a scoring context.
 * When the feature flag is OFF, returns the context unchanged.
 *
 * @param context - Current scoring values.
 * @param profile - Profile to apply (defaults to loaded profile).
 * @returns Calibrated scoring context (or unchanged if flag OFF).
 */
export declare function applyCalibrationProfile(context: ScoringContext, profile?: CalibrationProfile): ScoringContext;
/**
 * Determine whether Louvain community detection should activate.
 *
 * Both density and size thresholds must be met for activation.
 * When the feature flag is OFF, always returns { activate: false }.
 *
 * @param graphDensity   - Current graph density (edges / totalMemories).
 * @param componentSize  - Number of nodes in the component.
 * @param thresholds     - Activation thresholds (defaults from loaded profile).
 */
export declare function shouldActivateLouvain(graphDensity: number, componentSize: number, thresholds?: LouvainThresholds): LouvainActivationResult;
/**
 * Apply community scoring as a secondary-only signal.
 *
 * Community boost is capped at COMMUNITY_SCORE_CAP and never
 * promotes a result above its base score + cap. Community scores
 * are purely additive and secondary --- they cannot override base
 * ranking.
 *
 * When the feature flag is OFF, returns the items unchanged.
 *
 * @param items        - Ranked items with base scores.
 * @param communityMap - Map of item ID to raw community score.
 * @returns Items with community boost applied (capped).
 */
export declare function applyCommunityScoring(items: AblationRankedItem[], communityMap: Map<number, number>): {
    items: AblationRankedItem[];
    appliedCount: number;
    maxBoost: number;
};
//# sourceMappingURL=graph-calibration.d.ts.map