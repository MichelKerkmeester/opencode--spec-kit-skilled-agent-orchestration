// ---------------------------------------------------------------
// MODULE: Graph Calibration
// ---------------------------------------------------------------
// Feature catalog: Graph calibration profiles and community thresholds
//
// D3 Phase C --- Graph Calibration & Communities:
// - REQ-D3-005: Graph weight calibration --- ablation harness, weight
//   cap enforcement, and calibration profile presets.
// - REQ-D3-006: Community detection thresholds --- Louvain activation
//   gates (density + size), community score capping (secondary-only).
//
// All features gated behind SPECKIT_GRAPH_CALIBRATION_PROFILE (default ON, graduated; set false to disable).

/* ---------------------------------------------------------------
   1. IMPORTS
---------------------------------------------------------------- */

// Feature catalog: Graph calibration profiles and community thresholds

/* ---------------------------------------------------------------
   2. CONSTANTS
---------------------------------------------------------------- */

/** Maximum graph contribution allowed in Stage 2 scoring.
 *  Env-tunable via SPECKIT_GRAPH_WEIGHT_CAP (default 0.15).
 *  Note: per-mechanism inner caps (e.g. STAGE2_GRAPH_BONUS_CAP=0.03) are unchanged. */
export const GRAPH_WEIGHT_CAP = parseFloat(process.env.SPECKIT_GRAPH_WEIGHT_CAP || '') || 0.15;

/** Maximum community score boost --- secondary signal only. */
export const COMMUNITY_SCORE_CAP = 0.03;

/* ---------------------------------------------------------------
   3. TYPES
---------------------------------------------------------------- */

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
export type AblationSearchFn = (
  query: string,
  disabledFeatures: Set<string>,
) => AblationRankedItem[];

/** Intent-query pair for ablation evaluation. */
export interface IntentQuery {
  /** Intent label. */
  intent: string;
  /** Query text. */
  query: string;
  /** Ground-truth relevant item IDs. */
  relevantIds: number[];
}

/* ---------------------------------------------------------------
   4. CALIBRATION PROFILES
---------------------------------------------------------------- */

/** Default conservative profile --- all caps at baseline values. */
export const DEFAULT_PROFILE: CalibrationProfile = {
  graphWeightCap: GRAPH_WEIGHT_CAP,
  n2aCap: 0.10,
  n2bCap: 0.10,
  louvainMinDensity: 0.3,
  louvainMinSize: 10,
};

/** Aggressive profile --- tighter caps, stricter Louvain gates. */
export const AGGRESSIVE_PROFILE: CalibrationProfile = {
  graphWeightCap: 0.03,
  n2aCap: 0.07,
  n2bCap: 0.07,
  louvainMinDensity: 0.5,
  louvainMinSize: 20,
};

/* ---------------------------------------------------------------
   5. FEATURE FLAG
---------------------------------------------------------------- */

// Graph calibration gate — canonical implementation in search-flags.ts.
// Default: TRUE (graduated). Set SPECKIT_GRAPH_CALIBRATION_PROFILE=false to disable.
import { isGraphCalibrationProfileEnabled } from './search-flags.js';
export const isGraphCalibrationEnabled = isGraphCalibrationProfileEnabled;

/* ---------------------------------------------------------------
   6. METRIC COMPUTATION
---------------------------------------------------------------- */

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
export function computeMRR(
  rankedItems: AblationRankedItem[],
  relevantIds: Set<number>,
  k: number = 10,
): number {
  const cutoff = Math.min(k, rankedItems.length);
  for (let i = 0; i < cutoff; i++) {
    const item = rankedItems[i];
    if (item && relevantIds.has(item.id)) {
      return 1 / (i + 1);
    }
  }
  return 0;
}

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
export function computeNDCG(
  rankedItems: AblationRankedItem[],
  relevantIds: Set<number>,
  k: number = 10,
): number {
  if (relevantIds.size === 0 || rankedItems.length === 0) return 0;

  const cutoff = Math.min(k, rankedItems.length);

  // DCG@k
  let dcg = 0;
  for (let i = 0; i < cutoff; i++) {
    const item = rankedItems[i];
    if (item && relevantIds.has(item.id)) {
      dcg += 1 / Math.log2(i + 2); // i+2 because log2(1+1) for rank 1
    }
  }

  // IDCG@k --- ideal ranking places all relevant items first
  const idealCount = Math.min(relevantIds.size, cutoff);
  let idcg = 0;
  for (let i = 0; i < idealCount; i++) {
    idcg += 1 / Math.log2(i + 2);
  }

  if (idcg === 0) return 0;
  return dcg / idcg;
}

/* ---------------------------------------------------------------
   7. ABLATION HARNESS
---------------------------------------------------------------- */

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
export function runAblation(
  searchFn: AblationSearchFn,
  queries: IntentQuery[],
  toggles: FeatureToggle[],
  k: number = 10,
): AblationRunResult {
  // Baseline: all features enabled (no disabled features)
  const baseline = measureAllIntents(searchFn, queries, new Set(), k, 'baseline');

  // Per-feature ablation: disable one feature at a time
  const ablations: AblationResult[] = [];
  for (const toggle of toggles) {
    if (!toggle.enabled) continue; // Only ablate currently-enabled features
    const disabled = new Set<string>([toggle.name]);
    const result = measureAllIntents(searchFn, queries, disabled, k, toggle.name);
    ablations.push(result);
  }

  return { baseline, ablations };
}

/**
 * Measure per-intent metrics for a given set of disabled features.
 */
function measureAllIntents(
  searchFn: AblationSearchFn,
  queries: IntentQuery[],
  disabledFeatures: Set<string>,
  k: number,
  featureName: string,
): AblationResult {
  const intentMetrics: IntentMetrics[] = [];

  for (const query of queries) {
    const results = searchFn(query.query, disabledFeatures);
    const relevantSet = new Set(query.relevantIds);

    const mrr = computeMRR(results, relevantSet, k);
    const ndcg = computeNDCG(results, relevantSet, k);

    intentMetrics.push({ intent: query.intent, mrr, ndcg });
  }

  // Aggregate: mean across all intents
  const aggregateMrr = intentMetrics.length > 0
    ? intentMetrics.reduce((sum, m) => sum + m.mrr, 0) / intentMetrics.length
    : 0;
  const aggregateNdcg = intentMetrics.length > 0
    ? intentMetrics.reduce((sum, m) => sum + m.ndcg, 0) / intentMetrics.length
    : 0;

  return { featureName, intentMetrics, aggregateMrr, aggregateNdcg };
}

/* ---------------------------------------------------------------
   8. GRAPH WEIGHT CALIBRATION
---------------------------------------------------------------- */

/**
 * Clamp the graph weight contribution to the configured cap.
 * Ensures Stage 2 graph bonus never exceeds the profile's graphWeightCap.
 *
 * @param rawGraphWeight - Uncapped graph weight boost.
 * @param cap            - Maximum allowed value (defaults to GRAPH_WEIGHT_CAP).
 * @returns Clamped graph weight in [0, cap].
 */
export function applyGraphWeightCap(
  rawGraphWeight: number,
  cap: number = GRAPH_WEIGHT_CAP,
): number {
  if (!Number.isFinite(rawGraphWeight) || rawGraphWeight < 0) return 0;
  return Math.min(rawGraphWeight, cap);
}

/**
 * Calibrate the graph weight boost for a scoring context.
 * Applies the profile's graphWeightCap and N2a/N2b caps.
 *
 * @param context - Current scoring values to calibrate.
 * @param profile - Calibration profile to apply (defaults to DEFAULT_PROFILE).
 * @returns New scoring context with capped values.
 */
export function calibrateGraphWeight(
  context: ScoringContext,
  profile: CalibrationProfile = DEFAULT_PROFILE,
): ScoringContext {
  return {
    graphWeightBoost: applyGraphWeightCap(context.graphWeightBoost, profile.graphWeightCap),
    n2aScore: Math.min(Math.max(0, context.n2aScore), profile.n2aCap),
    n2bScore: Math.min(Math.max(0, context.n2bScore), profile.n2bCap),
    communityBoost: Math.min(Math.max(0, context.communityBoost), COMMUNITY_SCORE_CAP),
  };
}

/* ---------------------------------------------------------------
   9. CALIBRATION PROFILE LOADING
---------------------------------------------------------------- */

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
export function loadCalibrationProfile(): CalibrationProfile {
  const profileName = process.env.SPECKIT_CALIBRATION_PROFILE_NAME?.toLowerCase().trim();

  let base: CalibrationProfile;
  if (profileName === 'aggressive') {
    base = { ...AGGRESSIVE_PROFILE };
  } else {
    base = { ...DEFAULT_PROFILE };
  }

  // Individual env overrides
  const graphWeightCap = parseEnvFloat('SPECKIT_GRAPH_WEIGHT_CAP');
  if (graphWeightCap !== undefined) base.graphWeightCap = graphWeightCap;

  const n2aCap = parseEnvFloat('SPECKIT_N2A_CAP');
  if (n2aCap !== undefined) base.n2aCap = n2aCap;

  const n2bCap = parseEnvFloat('SPECKIT_N2B_CAP');
  if (n2bCap !== undefined) base.n2bCap = n2bCap;

  const louvainMinDensity = parseEnvFloat('SPECKIT_LOUVAIN_MIN_DENSITY');
  if (louvainMinDensity !== undefined) base.louvainMinDensity = louvainMinDensity;

  const louvainMinSize = parseEnvInt('SPECKIT_LOUVAIN_MIN_SIZE');
  if (louvainMinSize !== undefined) base.louvainMinSize = louvainMinSize;

  return base;
}

/**
 * Apply a calibration profile to a scoring context.
 * When the feature flag is OFF, returns the context unchanged.
 *
 * @param context - Current scoring values.
 * @param profile - Profile to apply (defaults to loaded profile).
 * @returns Calibrated scoring context (or unchanged if flag OFF).
 */
export function applyCalibrationProfile(
  context: ScoringContext,
  profile?: CalibrationProfile,
): ScoringContext {
  if (!isGraphCalibrationEnabled()) {
    return context;
  }

  const activeProfile = profile ?? loadCalibrationProfile();
  return calibrateGraphWeight(context, activeProfile);
}

/* ---------------------------------------------------------------
   10. LOUVAIN ACTIVATION THRESHOLDS
---------------------------------------------------------------- */

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
export function shouldActivateLouvain(
  graphDensity: number,
  componentSize: number,
  thresholds?: LouvainThresholds,
): LouvainActivationResult {
  if (!isGraphCalibrationEnabled()) {
    return { activate: false, reason: 'Graph calibration feature flag is OFF' };
  }

  const effectiveThresholds = thresholds ?? getLouvainThresholds();

  if (!Number.isFinite(graphDensity) || graphDensity < 0) {
    return { activate: false, reason: `Invalid graph density: ${graphDensity}` };
  }

  if (!Number.isFinite(componentSize) || componentSize < 0) {
    return { activate: false, reason: `Invalid component size: ${componentSize}` };
  }

  if (graphDensity < effectiveThresholds.minDensity) {
    return {
      activate: false,
      reason: `Graph density ${graphDensity.toFixed(3)} below threshold ${effectiveThresholds.minDensity}`,
    };
  }

  if (componentSize < effectiveThresholds.minSize) {
    return {
      activate: false,
      reason: `Component size ${componentSize} below threshold ${effectiveThresholds.minSize}`,
    };
  }

  return {
    activate: true,
    reason: `Density ${graphDensity.toFixed(3)} >= ${effectiveThresholds.minDensity} and size ${componentSize} >= ${effectiveThresholds.minSize}`,
  };
}

/**
 * Extract Louvain thresholds from the loaded calibration profile.
 */
function getLouvainThresholds(): LouvainThresholds {
  const profile = loadCalibrationProfile();
  return {
    minDensity: profile.louvainMinDensity,
    minSize: profile.louvainMinSize,
  };
}

/* ---------------------------------------------------------------
   11. COMMUNITY SCORE INTEGRATION
---------------------------------------------------------------- */

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
export function applyCommunityScoring(
  items: AblationRankedItem[],
  communityMap: Map<number, number>,
): { items: AblationRankedItem[]; appliedCount: number; maxBoost: number } {
  if (!isGraphCalibrationEnabled()) {
    return { items, appliedCount: 0, maxBoost: 0 };
  }

  let appliedCount = 0;
  let maxBoost = 0;

  const result = items.map((item) => {
    const rawCommunityScore = communityMap.get(item.id);
    if (rawCommunityScore === undefined || rawCommunityScore <= 0) {
      return item;
    }

    // Cap community contribution
    const cappedBoost = Math.min(rawCommunityScore, COMMUNITY_SCORE_CAP);
    // Ensure community score is purely additive and secondary
    const newScore = item.score + cappedBoost;

    appliedCount++;
    maxBoost = Math.max(maxBoost, cappedBoost);

    return {
      ...item,
      score: newScore,
    };
  });

  return { items: result, appliedCount, maxBoost };
}

/* ---------------------------------------------------------------
   12. INTERNAL HELPERS
---------------------------------------------------------------- */

/** Parse an environment variable as a finite float, returning undefined if invalid. */
function parseEnvFloat(envName: string): number | undefined {
  const raw = process.env[envName]?.trim();
  if (!raw) return undefined;
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Parse an environment variable as a finite integer, returning undefined if invalid. */
function parseEnvInt(envName: string): number | undefined {
  const raw = process.env[envName]?.trim();
  if (!raw) return undefined;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}
