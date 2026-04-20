// ───────────────────────────────────────────────────────────────
// MODULE: Promotion Shadow Cycle
// ───────────────────────────────────────────────────────────────

import { scoreAdvisorPrompt } from '../scorer/fusion.js';
import { DEFAULT_SCORER_WEIGHTS, SCORER_LANES } from '../scorer/weights-config.js';
import type {
  AdvisorProjection,
  AdvisorScoredRecommendation,
  AdvisorScoringResult,
  LaneContribution,
  ScorerLane,
} from '../scorer/types.js';
import type {
  PromotionCorpusCase,
  PromotionLane,
  PromotionWeights,
  ShadowCycleResult,
} from '../../schemas/promotion-cycle.js';

export const DEFAULT_PROMOTION_WEIGHTS: PromotionWeights = {
  ...DEFAULT_SCORER_WEIGHTS,
  learned_adaptive: 0,
};

export interface ShadowCycleSideEffectAudit {
  readonly sqliteWrite?: () => void;
  readonly generationBump?: () => void;
  readonly cacheInvalidation?: () => void;
}

interface CandidateScore {
  readonly topSkill: string | null;
  readonly unknown: boolean;
  readonly dominantLane: PromotionLane | null;
}

export interface ShadowCycleOptions {
  readonly cycleId: string;
  readonly cases: readonly PromotionCorpusCase[];
  readonly workspaceRoot: string;
  readonly projection?: AdvisorProjection;
  readonly liveWeights?: PromotionWeights;
  readonly candidateWeights?: PromotionWeights;
  readonly minimumAccuracy?: number;
  readonly maximumGoldNoneFalseFire?: number;
  readonly sideEffectAudit?: ShadowCycleSideEffectAudit;
}

function approxEqual(left: number, right: number): boolean {
  return Math.abs(left - right) <= 0.000001;
}

function weightsEqual(left: PromotionWeights, right: PromotionWeights): boolean {
  return Object.keys(DEFAULT_PROMOTION_WEIGHTS).every((key) => {
    const lane = key as keyof PromotionWeights;
    return approxEqual(left[lane], right[lane]);
  });
}

function normalizeWeights(input: PromotionWeights | undefined): PromotionWeights {
  return { ...DEFAULT_PROMOTION_WEIGHTS, ...(input ?? {}) };
}

function weightedScore(contribution: LaneContribution, weights: PromotionWeights): number {
  return contribution.rawScore * (weights[contribution.lane] ?? 0);
}

function dominantWeightedLane(
  contributions: readonly LaneContribution[],
  weights: PromotionWeights,
): PromotionLane | null {
  const ranked = contributions
    .map((contribution) => ({
      lane: contribution.lane,
      score: weightedScore(contribution, weights),
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || left.lane.localeCompare(right.lane));
  return ranked[0]?.lane ?? null;
}

function scoreWithCandidateWeights(
  base: AdvisorScoringResult,
  candidateWeights: PromotionWeights,
): CandidateScore {
  const totalLiveWeight = SCORER_LANES.reduce((total, lane) => total + (candidateWeights[lane] ?? 0), 0);
  const ranked = [...base.recommendations]
    .map((recommendation) => {
      const score = recommendation.laneContributions
        .reduce((total, contribution) => total + weightedScore(contribution, candidateWeights), 0);
      const normalized = totalLiveWeight > 0 ? score / totalLiveWeight : 0;
      const confidence = 0.52 + Math.min(1, normalized * 1.25) * 0.43;
      return {
        recommendation,
        score,
        confidence,
      };
    })
    .filter((item) => item.score > 0 && item.confidence >= 0.8)
    .sort((left, right) => right.score - left.score || right.confidence - left.confidence || left.recommendation.skill.localeCompare(right.recommendation.skill));

  const top = ranked[0]?.recommendation ?? null;
  return {
    topSkill: top?.skill ?? null,
    unknown: !top,
    dominantLane: top ? dominantWeightedLane(top.laneContributions, candidateWeights) : null,
  };
}

function baselineCandidateScore(result: AdvisorScoringResult): CandidateScore {
  const top = result.recommendations[0] as AdvisorScoredRecommendation | undefined;
  return {
    topSkill: result.topSkill,
    unknown: result.unknown,
    dominantLane: top?.dominantLane ?? null,
  };
}

function matched(topSkill: string | null, expectedSkill: string | null): boolean {
  return topSkill === expectedSkill;
}

function delta(candidateMatched: boolean, liveMatched: boolean): -1 | 0 | 1 {
  if (candidateMatched === liveMatched) return 0;
  return candidateMatched ? 1 : -1;
}

function emptyBreakdown(): Record<PromotionLane, number> {
  return {
    explicit_author: 0,
    lexical: 0,
    graph_causal: 0,
    derived_generated: 0,
    semantic_shadow: 0,
    learned_adaptive: 0,
  };
}

export function runShadowCycle(options: ShadowCycleOptions): ShadowCycleResult {
  const liveWeights = normalizeWeights(options.liveWeights);
  const candidateWeights = normalizeWeights(options.candidateWeights);
  const candidateIsLive = weightsEqual(candidateWeights, liveWeights);
  const laneAttributionBreakdown = emptyBreakdown();
  const perPromptMatches = options.cases.map((item) => {
    const liveResult = scoreAdvisorPrompt(item.prompt, {
      workspaceRoot: options.workspaceRoot,
      projection: options.projection,
    });
    const allCandidates = scoreAdvisorPrompt(item.prompt, {
      workspaceRoot: options.workspaceRoot,
      projection: options.projection,
      includeAllCandidates: true,
    });
    const candidate = candidateIsLive
      ? baselineCandidateScore(liveResult)
      : scoreWithCandidateWeights(allCandidates, candidateWeights);
    if (candidate.dominantLane) laneAttributionBreakdown[candidate.dominantLane] += 1;
    const liveMatched = matched(liveResult.topSkill, item.expectedSkill);
    const candidateMatched = matched(candidate.topSkill, item.expectedSkill);
    return {
      id: item.id,
      expectedSkill: item.expectedSkill,
      liveTopSkill: liveResult.topSkill,
      candidateTopSkill: candidate.topSkill,
      liveMatched,
      candidateMatched,
      deltaVsLive: delta(candidateMatched, liveMatched),
      dominantLane: candidate.dominantLane,
    };
  });

  const correctPrompts = perPromptMatches.filter((item) => item.candidateMatched).length;
  const liveCorrectPrompts = perPromptMatches.filter((item) => item.liveMatched).length;
  const unknownCount = perPromptMatches.filter((item) => item.candidateTopSkill === null).length;
  const goldNoneFalseFire = perPromptMatches
    .filter((item) => item.expectedSkill === null && item.candidateTopSkill !== null)
    .length;
  const totalPrompts = options.cases.length;
  const candidateAccuracy = totalPrompts > 0 ? Number((correctPrompts / totalPrompts).toFixed(4)) : 0;
  const liveAccuracy = totalPrompts > 0 ? Number((liveCorrectPrompts / totalPrompts).toFixed(4)) : 0;
  const passesShadowGate = candidateAccuracy >= (options.minimumAccuracy ?? liveAccuracy)
    && goldNoneFalseFire <= (options.maximumGoldNoneFalseFire ?? Number.POSITIVE_INFINITY);

  return {
    cycleId: options.cycleId,
    candidateAccuracy,
    liveAccuracy,
    deltaVsLive: Number((candidateAccuracy - liveAccuracy).toFixed(4)),
    totalPrompts,
    correctPrompts,
    liveCorrectPrompts,
    unknownCount,
    goldNoneFalseFire,
    perPromptMatches,
    laneAttributionBreakdown,
    passesShadowGate,
    sideEffectFree: true,
  };
}

export { SCORER_LANES };
export type { ScorerLane };
