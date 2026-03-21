// ---------------------------------------------------------------
// MODULE: Fusion Lab
// ---------------------------------------------------------------
// Shadow infrastructure for multi-policy fusion comparison (REQ-D1-002).
// Runs RRF, minmax_linear, and zscore_linear in parallel on each query.
// Active policy result is returned; shadow results are telemetry-only.
//
// Feature flag: SPECKIT_FUSION_POLICY_SHADOW_V2 (default OFF)

// Local
import { fuseResultsMulti, clamp } from './rrf-fusion';

// Type-only
import type { RrfItem, FusionResult, RankedList, FuseMultiOptions } from './rrf-fusion';

/* --- 1. CONSTANTS --- */

/** Small epsilon used for stddev near-zero detection in z-score normalization. */
const ZSCORE_EPSILON = 1e-9;

/* --- 2. TYPES --- */

/**
 * Named fusion policy. Each policy normalizes and fuses channel results
 * into a single ranked list of scored candidates.
 */
type FusionPolicy = 'rrf' | 'minmax_linear' | 'zscore_linear';

/**
 * A channel's ranked results with their original retrieval scores.
 * Each item carries a `score` field alongside the standard RrfItem fields.
 */
interface ScoredChannelResult extends RrfItem {
  score: number;
}

/** A ranked list for fusion-lab policies, where each result has an explicit score. */
interface ScoredRankedList {
  source: string;
  results: ScoredChannelResult[];
  weight?: number;
}

/** A candidate with a fused score and provenance. */
interface FusedCandidate extends RrfItem {
  fusedScore: number;
  sources: string[];
}

/** Per-policy telemetry captured during a shadow run. */
interface PolicyTelemetry {
  policy: FusionPolicy;
  /** Normalized Discounted Cumulative Gain at cutoff 10. */
  ndcg10: number;
  /** Mean Reciprocal Rank at cutoff 5. */
  mrr5: number;
  /** Wall-clock execution time in milliseconds. */
  latencyMs: number;
}

/** Result of a shadow comparison run. */
interface ShadowRunResult {
  /** Result from the active policy — this is what callers receive. */
  activeResult: FusionResult[];
  /** Which policy produced the activeResult. */
  activePolicy: FusionPolicy;
  /** Telemetry for all 3 policies (fire-and-forget, does not affect output). */
  telemetry: PolicyTelemetry[];
}

/** Implementation signature for a fusion policy function. */
type PolicyFn = (channels: ScoredRankedList[], options?: FuseMultiOptions) => FusedCandidate[];

/* --- 3. FEATURE FLAG --- */

/**
 * Check if the Shadow Fusion Lab is enabled (REQ-D1-002).
 * When OFF (default), shadow comparison is skipped and only RRF runs.
 * @returns True when SPECKIT_FUSION_POLICY_SHADOW_V2 is set to 'true'.
 */
function isShadowFusionV2Enabled(): boolean {
  const val = process.env.SPECKIT_FUSION_POLICY_SHADOW_V2?.toLowerCase().trim();
  return val !== 'false' && val !== '0';
}

/* --- 4. NORMALIZATION UTILITIES --- */

/**
 * Min-max normalize a channel's scores to [0, 1].
 *
 * Edge cases:
 * - Single item: score = 1.0
 * - All scores equal (range = 0): all scores = 1.0
 * - Empty array: returned unchanged
 *
 * @param results - Channel results to normalize in place (mutates scores).
 * @returns The same array with normalized scores.
 */
function minMaxNormalize(results: ScoredChannelResult[]): ScoredChannelResult[] {
  if (results.length === 0) return results;
  if (results.length === 1) {
    results[0].score = 1.0;
    return results;
  }

  let min = Infinity;
  let max = -Infinity;
  for (const r of results) {
    if (r.score < min) min = r.score;
    if (r.score > max) max = r.score;
  }

  const range = max - min;
  if (range === 0) {
    // All scores identical — normalize to 1.0
    for (const r of results) {
      r.score = 1.0;
    }
    return results;
  }

  for (const r of results) {
    r.score = (r.score - min) / range;
  }
  return results;
}

/**
 * Z-score normalize a channel's scores and clamp to [0, 1].
 *
 * Edge cases:
 * - stdDev < epsilon: fall back to uniform scores (all 0.5, then clamped).
 * - Empty array: returned unchanged.
 *
 * @param results - Channel results to normalize in place (mutates scores).
 * @returns The same array with z-score-normalized and clamped scores.
 */
function zScoreNormalize(results: ScoredChannelResult[]): ScoredChannelResult[] {
  if (results.length === 0) return results;

  const n = results.length;
  let sum = 0;
  for (const r of results) {
    sum += r.score;
  }
  const mean = sum / n;

  let variance = 0;
  for (const r of results) {
    const diff = r.score - mean;
    variance += diff * diff;
  }
  const stdDev = Math.sqrt(variance / n);

  if (stdDev < ZSCORE_EPSILON) {
    // Degenerate distribution — fall back to uniform scores
    for (const r of results) {
      r.score = 1.0;
    }
    return results;
  }

  for (const r of results) {
    // AI-WHY: z-score maps to roughly [-3, 3]; shift by 0.5 and scale by 1/6
    // so that z=0 maps to 0.5 and the typical [mean-3σ, mean+3σ] range fits [0,1].
    const z = (r.score - mean) / stdDev;
    r.score = clamp(z / 6 + 0.5, 0, 1);
  }
  return results;
}

/* --- 5. POLICY IMPLEMENTATIONS --- */

/**
 * Fuse channel results using min-max linear combination.
 *
 * Each channel's scores are normalized to [0, 1] independently via min-max
 * scaling, then combined with a weighted linear sum across channels.
 *
 * @param channels - One or more scored ranked lists to fuse.
 * @returns Candidates sorted by descending fusedScore.
 */
function minmaxLinearFuse(channels: ScoredRankedList[]): FusedCandidate[] {
  const scoreMap = new Map<string, { candidate: FusedCandidate; weightedSum: number; totalWeight: number }>();

  for (const channel of channels) {
    // Normalize a copy so original data is not mutated
    const normalized = minMaxNormalize(channel.results.map(r => ({ ...r })));
    const weight = typeof channel.weight === 'number' && Number.isFinite(channel.weight) && channel.weight >= 0
      ? channel.weight
      : 1.0;

    for (const item of normalized) {
      const key = String(item.id);
      const existing = scoreMap.get(key);
      if (existing) {
        existing.weightedSum += item.score * weight;
        existing.totalWeight += weight;
        existing.candidate.sources.push(channel.source);
      } else {
        const { score: _score, ...rest } = item;
        scoreMap.set(key, {
          candidate: { ...rest, fusedScore: 0, sources: [channel.source] },
          weightedSum: item.score * weight,
          totalWeight: weight,
        });
      }
    }
  }

  const results: FusedCandidate[] = [];
  for (const entry of scoreMap.values()) {
    // AI-WHY: Divide by totalWeight rather than channel count so partial
    // coverage (candidate missing from some channels) is not unfairly penalized.
    entry.candidate.fusedScore = entry.totalWeight > 0
      ? entry.weightedSum / entry.totalWeight
      : 0;
    results.push(entry.candidate);
  }

  return results.sort((a, b) => b.fusedScore - a.fusedScore);
}

/**
 * Fuse channel results using z-score linear combination.
 *
 * Each channel's scores are z-score normalized and clamped to [0, 1],
 * then combined with a weighted linear sum across channels.
 * When a channel's score distribution is degenerate (stdDev < epsilon),
 * its scores fall back to uniform 1.0.
 *
 * @param channels - One or more scored ranked lists to fuse.
 * @returns Candidates sorted by descending fusedScore.
 */
function zscoreLinearFuse(channels: ScoredRankedList[]): FusedCandidate[] {
  const scoreMap = new Map<string, { candidate: FusedCandidate; weightedSum: number; totalWeight: number }>();

  for (const channel of channels) {
    // Normalize a copy so original data is not mutated
    const normalized = zScoreNormalize(channel.results.map(r => ({ ...r })));
    const weight = typeof channel.weight === 'number' && Number.isFinite(channel.weight) && channel.weight >= 0
      ? channel.weight
      : 1.0;

    for (const item of normalized) {
      const key = String(item.id);
      const existing = scoreMap.get(key);
      if (existing) {
        existing.weightedSum += item.score * weight;
        existing.totalWeight += weight;
        existing.candidate.sources.push(channel.source);
      } else {
        const { score: _score, ...rest } = item;
        scoreMap.set(key, {
          candidate: { ...rest, fusedScore: 0, sources: [channel.source] },
          weightedSum: item.score * weight,
          totalWeight: weight,
        });
      }
    }
  }

  const results: FusedCandidate[] = [];
  for (const entry of scoreMap.values()) {
    entry.candidate.fusedScore = entry.totalWeight > 0
      ? entry.weightedSum / entry.totalWeight
      : 0;
    results.push(entry.candidate);
  }

  return results.sort((a, b) => b.fusedScore - a.fusedScore);
}

/* --- 6. POLICY REGISTRY --- */

/**
 * Registry mapping each FusionPolicy name to its implementation function.
 * New policies can be registered here without modifying the shadow runner.
 */
const POLICY_REGISTRY: Record<FusionPolicy, PolicyFn> = {
  // AI-WHY: RRF is wrapped to accept ScoredRankedList and return FusedCandidate[].
  // It converts scored channels to RankedList (dropping per-item scores, which RRF
  // doesn't use) and re-wraps FusionResult as FusedCandidate.
  rrf: (channels: ScoredRankedList[], options?: FuseMultiOptions): FusedCandidate[] => {
    const lists: RankedList[] = channels.map(ch => ({
      source: ch.source,
      results: ch.results as RrfItem[],
      weight: ch.weight,
    }));
    const rrfResults = fuseResultsMulti(lists, options ?? {});
    return rrfResults.map(r => ({
      ...r,
      fusedScore: r.rrfScore,
      sources: r.sources,
    }));
  },
  minmax_linear: minmaxLinearFuse,
  zscore_linear: zscoreLinearFuse,
};

/* --- 7. TELEMETRY HELPERS --- */

/**
 * Compute NDCG@K for a ranked result list given an ideal order.
 *
 * Ideal relevance is derived from the sorted order of the input list itself:
 * position 0 has highest relevance (n), position n-1 has lowest (1).
 * This is a self-relative NDCG used for policy comparison, not absolute quality.
 *
 * @param results - Ranked candidates from a policy.
 * @param k - Cutoff rank (default 10).
 * @returns NDCG@k in [0, 1].
 */
function computeNdcgAtK(results: FusedCandidate[], k: number = 10): number {
  if (results.length === 0) return 0;

  const cutoff = Math.min(k, results.length);
  const n = results.length;

  // Assign ideal relevance: rank-0 item gets relevance n, rank-(n-1) gets 1
  const relevanceByKey = new Map<string, number>();
  for (let i = 0; i < n; i++) {
    relevanceByKey.set(String(results[i].id), n - i);
  }

  let dcg = 0;
  let idcg = 0;
  for (let i = 0; i < cutoff; i++) {
    const rel = relevanceByKey.get(String(results[i].id)) ?? 0;
    dcg += rel / Math.log2(i + 2); // log2(rank+1), rank is 1-indexed
    const idealRel = n - i; // perfect ordering
    idcg += idealRel / Math.log2(i + 2);
  }

  return idcg > 0 ? dcg / idcg : 0;
}

/**
 * Compute MRR@K for a ranked result list.
 *
 * The first item is considered the only relevant item (binary relevance).
 * This measures how early the most-relevant result appears.
 *
 * @param results - Ranked candidates from a policy.
 * @param k - Cutoff rank (default 5).
 * @returns MRR@k in [0, 1].
 */
function computeMrrAtK(results: FusedCandidate[], k: number = 5): number {
  if (results.length === 0) return 0;

  // Treat the top item from the reference (first result) as the relevant document
  const topId = String(results[0].id);
  const cutoff = Math.min(k, results.length);

  for (let i = 0; i < cutoff; i++) {
    if (String(results[i].id) === topId) {
      return 1 / (i + 1);
    }
  }
  return 0;
}

/* --- 8. SHADOW COMPARISON RUNNER --- */

/**
 * Run all 3 fusion policies in parallel on the given channel results.
 *
 * Shadow overhead target: ≤ 15ms p95 (parallel Promise.all, fire-and-forget telemetry).
 *
 * Behavior:
 * - When SPECKIT_FUSION_POLICY_SHADOW_V2 is OFF: runs only RRF, returns empty telemetry.
 * - When ON: runs all 3 policies in parallel via Promise.all.
 * - Active policy result is returned; shadow results are captured as telemetry only.
 * - If a non-active policy throws, its telemetry entry records latency with ndcg10=0, mrr5=0.
 * - If the active policy throws, the error propagates to the caller.
 *
 * @param channels - Scored channel results to fuse.
 * @param activePolicy - Which policy's result to return (default: 'rrf').
 * @param options - RRF fusion options (passed through to the rrf policy).
 * @returns Shadow run result with active policy output and per-policy telemetry.
 */
async function runShadowComparison(
  channels: ScoredRankedList[],
  activePolicy: FusionPolicy = 'rrf',
  options: FuseMultiOptions = {},
): Promise<ShadowRunResult> {
  const policies: FusionPolicy[] = ['rrf', 'minmax_linear', 'zscore_linear'];

  if (!isShadowFusionV2Enabled()) {
    // Shadow disabled — only run the active policy
    const t0 = performance.now();
    const policyFn = POLICY_REGISTRY[activePolicy];
    const activeResult = policyFn(channels, options) as FusedCandidate[];
    const latencyMs = performance.now() - t0;

    // Convert FusedCandidate[] to FusionResult[] for the active RRF path
    const fusionResult = toFusionResults(activeResult, activePolicy);

    return {
      activeResult: fusionResult,
      activePolicy,
      telemetry: [{
        policy: activePolicy,
        ndcg10: computeNdcgAtK(activeResult, 10),
        mrr5: computeMrrAtK(activeResult, 5),
        latencyMs,
      }],
    };
  }

  // Shadow enabled — run all 3 policies in parallel
  const policyResults = await Promise.all(
    policies.map(async (policy): Promise<{ policy: FusionPolicy; candidates: FusedCandidate[]; latencyMs: number; error?: unknown }> => {
      const t0 = performance.now();
      try {
        const policyFn = POLICY_REGISTRY[policy];
        const candidates = policyFn(channels, options) as FusedCandidate[];
        return { policy, candidates, latencyMs: performance.now() - t0 };
      } catch (err) {
        return { policy, candidates: [], latencyMs: performance.now() - t0, error: err };
      }
    })
  );

  // Find active policy result — propagate error if it failed
  const activePolicyResult = policyResults.find(r => r.policy === activePolicy);
  if (!activePolicyResult) {
    throw new Error(`[fusion-lab] Active policy '${activePolicy}' not found in results`);
  }
  if (activePolicyResult.error !== undefined) {
    throw activePolicyResult.error;
  }

  // Build telemetry (fire-and-forget: non-blocking, captured synchronously after Promise.all)
  const telemetry: PolicyTelemetry[] = policyResults.map(r => ({
    policy: r.policy,
    ndcg10: r.error !== undefined ? 0 : computeNdcgAtK(r.candidates, 10),
    mrr5: r.error !== undefined ? 0 : computeMrrAtK(r.candidates, 5),
    latencyMs: r.latencyMs,
  }));

  const fusionResult = toFusionResults(activePolicyResult.candidates, activePolicy);

  return {
    activeResult: fusionResult,
    activePolicy,
    telemetry,
  };
}

/* --- 9. CONVERSION HELPERS --- */

/**
 * Convert FusedCandidate[] to FusionResult[] for API compatibility.
 *
 * For non-RRF policies, fusedScore is placed in rrfScore for a consistent
 * downstream interface. convergenceBonus is 0 (no convergence concept in
 * linear policies).
 *
 * @param candidates - Fused candidates from any policy.
 * @param policy - Which policy produced these results (informational).
 * @returns FusionResult array with rrfScore populated from fusedScore.
 */
function toFusionResults(candidates: FusedCandidate[], policy: FusionPolicy): FusionResult[] {
  return candidates.map(c => ({
    ...c,
    rrfScore: c.fusedScore,
    sources: c.sources,
    sourceScores: {} as Record<string, number>,
    convergenceBonus: 0,
    _fusionPolicy: policy,
  }));
}

/* --- 10. EXPORTS --- */

export {
  isShadowFusionV2Enabled,
  minMaxNormalize,
  zScoreNormalize,
  minmaxLinearFuse,
  zscoreLinearFuse,
  runShadowComparison,
  computeNdcgAtK,
  computeMrrAtK,
  POLICY_REGISTRY,
  ZSCORE_EPSILON,
};

export type {
  FusionPolicy,
  ScoredChannelResult,
  ScoredRankedList,
  FusedCandidate,
  PolicyTelemetry,
  ShadowRunResult,
};
