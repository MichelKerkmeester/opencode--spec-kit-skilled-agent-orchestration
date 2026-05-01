// ───────────────────────────────────────────────────────────────
// MODULE: Advisor 5-Lane Fusion
// ───────────────────────────────────────────────────────────────

import { applyAmbiguity, isAmbiguousTopTwo } from './ambiguity.js';
import { attributionReason, dominantLane, isDerivedDominant } from './attribution.js';
import {
  ADVISOR_HOOK_FRESHNESS_VALUES,
  ADVISOR_RUNTIME_VALUES,
  isSpeckitMetricsEnabled,
  speckitMetrics,
} from '../metrics.js';
import { normalize } from '../affordance-normalizer.js';
import { scoreDerivedLane } from './lanes/derived.js';
import { scoreExplicitLane } from './lanes/explicit.js';
import { scoreGraphCausalLane } from './lanes/graph-causal.js';
import { scoreLexicalLane } from './lanes/lexical.js';
import { scoreSemanticShadowLane } from './lanes/semantic-shadow.js';
import { loadAdvisorProjection } from './projection.js';
import { SCORING_CALIBRATION } from './scoring-constants.js';
import { isReadOnlyExplainer, matchesPhraseBoundary } from './text.js';
import {
  DEFAULT_SCORER_WEIGHTS,
  SCORER_LANES,
  liveWeightTotal,
  parseScorerWeights,
} from './weights-config.js';
import { isLiveScorerLane } from './lane-registry.js';
import type {
  AdvisorProjection,
  AdvisorScoredRecommendation,
  AdvisorScoringOptions,
  AdvisorScoringResult,
  LaneContribution,
  LaneMatch,
  LaneScores,
  ScorerLane,
  SkillProjection,
} from './types.js';
import type { NormalizedAffordance } from '../affordance-normalizer.js';

const DEFAULT_CONFIDENCE_THRESHOLD = 0.8;
const DEFAULT_UNCERTAINTY_THRESHOLD = 0.35;
const TASK_INTENT = /\b(add|append|build|change|configure|create|edit|fix|generate|implement|modify|move|patch|refactor|rename|replace|run|start|sweep|update|write)\b/;
const DEEP_RESEARCH_CYCLE = /\b(automated research cycle|looped investigation|continue iteration|resume iteration|overnight run|overnight research run|packet-local iteration|delta record|canonical jsonl|same lineage)\b/;

type MutableLaneScores = {
  -readonly [K in keyof LaneScores]: LaneMatch[];
};

type AdvisorRuntimeLabel = (typeof ADVISOR_RUNTIME_VALUES)[number];
type AdvisorFreshnessLabel = (typeof ADVISOR_HOOK_FRESHNESS_VALUES)[number];

function emptyLaneScores(): MutableLaneScores {
  return Object.fromEntries(SCORER_LANES.map((lane) => [lane, []])) as unknown as MutableLaneScores;
}

function normalizeRuntimeLabel(value: string | undefined): AdvisorRuntimeLabel | null {
  if (value === undefined) {
    return null;
  }
  return ADVISOR_RUNTIME_VALUES.includes(value as AdvisorRuntimeLabel) ? value as AdvisorRuntimeLabel : null;
}

function normalizeFreshnessLabel(value: string | undefined): AdvisorFreshnessLabel | null {
  if (value === undefined) {
    return 'unavailable';
  }
  return ADVISOR_HOOK_FRESHNESS_VALUES.includes(value as AdvisorFreshnessLabel) ? value as AdvisorFreshnessLabel : null;
}

function laneRawScore(matches: readonly LaneMatch[], skillId: string): number {
  return Math.max(0, ...matches.filter((match) => match.skillId === skillId).map((match) => match.score));
}

function laneEvidence(matches: readonly LaneMatch[], skillId: string): string[] {
  return matches
    .filter((match) => match.skillId === skillId)
    .flatMap((match) => [...match.evidence])
    .slice(0, 6);
}

function promptMentionsSkill(promptLower: string, skill: SkillProjection): boolean {
  return [skill.id, skill.name, skill.id.replace(/-/g, ' ')].some((phrase) => matchesPhraseBoundary(promptLower, phrase.toLowerCase()));
}

function isDefaultRoutable(promptLower: string, skill: SkillProjection): boolean {
  if (skill.lifecycleStatus === 'archived' || skill.lifecycleStatus === 'future') return false;
  if (skill.lifecycleStatus === 'deprecated') return promptMentionsSkill(promptLower, skill);
  return true;
}

function confidenceFor(args: {
  liveNormalized: number;
  directScore: number;
  readOnlyExplainer: boolean;
  hasExplicitWorkflowSignal: boolean;
  hasTaskIntent: boolean;
  hasDeepResearchCycleIntent: boolean;
  readOnlyRouteAllowed: boolean;
  derivedDominant: boolean;
  skillId: string;
}): number {
  const C = SCORING_CALIBRATION.confidence;
  if (args.readOnlyExplainer && args.skillId === 'skill-advisor') return C.readOnlyExplainerFloor;
  const base = C.baseConstant
    + Math.min(1, args.liveNormalized * C.liveNormalizedRampGain) * C.liveNormalizedRampCoefficient;
  if (args.readOnlyExplainer && !args.readOnlyRouteAllowed) return C.readOnlyExplainerFloor;
  if (args.readOnlyRouteAllowed) {
    return Number(Math.max(base, C.readOnlyRouteAllowedFloor).toFixed(4));
  }
  if (args.derivedDominant && args.directScore < C.derivedDominantDirectScoreCeiling) {
    return C.derivedDominantConfidence;
  }
  if (args.hasDeepResearchCycleIntent
    && args.skillId === 'sk-deep-research'
    && args.liveNormalized >= C.deepResearchCycleLiveNormalizedFloor) {
    return C.deepResearchCycleSkillConfidence;
  }
  if (args.hasTaskIntent
    && (args.directScore >= C.taskIntentDirectScoreFloor
      || args.liveNormalized >= C.taskIntentLiveNormalizedFloor)) {
    // F-012-C2-03: Token-stuffing dispersion guard. Without this, a prompt
    // with task-intent + many weak signals (saturating liveNormalized) but
    // no strong direct anchor would force confidence to taskIntentFloor for
    // many unrelated skills. The guard fires when liveNormalized is near-
    // saturated AND directScore is below the directScoreLiftThreshold —
    // the precise signature of a token-stuffed prompt. Legitimate task-intent
    // prompts have at least one strong direct hit and pass via directScore;
    // they don't hit this branch. When the guard fires we fall through to
    // the standard `base + directBonus` math below.
    const dispersionGuardTripped = args.liveNormalized >= 0.95
      && args.directScore < C.directScoreLiftThreshold;
    if (!dispersionGuardTripped) {
      return Number(Math.max(base, C.taskIntentFloor).toFixed(4));
    }
  }
  if (args.directScore >= C.directScoreLiftThreshold) {
    return Number(Math.max(base, C.directScoreFloor).toFixed(4));
  }
  const directBonus = args.directScore >= C.directScoreBonusThreshold ? C.directScoreBonus : 0;
  return Number(Math.max(0, Math.min(C.hardCeiling, base + directBonus)).toFixed(4));
}

function uncertaintyFor(contributions: readonly LaneContribution[], confidence: number, ambiguousPressure: number): number {
  const U = SCORING_CALIBRATION.uncertainty;
  const evidenceCount = contributions.reduce((total, contribution) => total + contribution.evidence.length, 0);
  const direct = contributions
    .filter((contribution) => contribution.lane === 'explicit_author' || contribution.lane === 'lexical')
    .reduce((max, contribution) => Math.max(max, contribution.rawScore), 0);
  let uncertainty = U.noEvidenceDefault;
  if (evidenceCount >= U.highEvidenceCount) uncertainty = U.lowFloor;
  else if (evidenceCount >= U.mediumEvidenceCount) uncertainty = U.mediumFloor;
  else if (evidenceCount >= U.someEvidenceCount) uncertainty = U.elevatedFloor;
  if (direct >= U.directEvidenceDiscountThreshold) uncertainty -= U.directEvidenceDiscount;
  if (confidence < U.lowConfidencePenaltyThreshold) uncertainty += U.lowConfidencePenalty;
  uncertainty += ambiguousPressure;
  return Number(Math.max(U.hardFloor, Math.min(U.hardCeiling, uncertainty)).toFixed(2));
}

function buildLaneScores(
  prompt: string,
  projection: AdvisorProjection,
  disabled: Set<ScorerLane>,
  affordances: readonly NormalizedAffordance[],
): LaneScores {
  const scores = emptyLaneScores();
  if (!disabled.has('explicit_author')) scores.explicit_author = scoreExplicitLane(prompt, projection);
  if (!disabled.has('lexical')) scores.lexical = scoreLexicalLane(prompt, projection);
  if (!disabled.has('derived_generated')) scores.derived_generated = scoreDerivedLane(prompt, projection, new Date(), affordances);
  if (!disabled.has('semantic_shadow')) scores.semantic_shadow = scoreSemanticShadowLane(prompt, projection);
  if (!disabled.has('graph_causal')) {
    scores.graph_causal = scoreGraphCausalLane([
      ...scores.explicit_author,
      ...scores.lexical,
      ...scores.derived_generated,
    ], projection, {}, affordances);
  }
  return scores;
}

function hasExplicitWorkflowSignal(contributions: readonly LaneContribution[], skillId: string): boolean {
  const explicit = contributions.find((contribution) => contribution.lane === 'explicit_author');
  if (!explicit || explicit.rawScore < 0.55) return false;
  return explicit.evidence.some((entry) => (
    entry.startsWith('phrase:')
    || entry.startsWith('explicit:')
    || entry.startsWith('author:')
    || entry.includes(skillId)
    || entry.includes('loop')
    || entry.includes('write-')
  ));
}

function readOnlyRouteAllowed(promptLower: string, skillId: string): boolean {
  if (/\b(no edits?|without making changes|do not (change|edit|modify|touch)|read-only only|no edits yet|only; do not|just show|just list)\b/.test(promptLower)) {
    return false;
  }
  if (skillId === 'sk-code-review' && /\b(compare|audit|review)\b/.test(promptLower)
    && /\b(classifier|vocabulary|prose|implementation|agents\.md|drift|mismatch)\b/.test(promptLower)) {
    return true;
  }
  if (skillId === 'system-spec-kit' && /\b(memory_save|resume_write|routing taxonomy|corpus|source-type|routing bucket)\b/.test(promptLower)) {
    return true;
  }
  if (skillId === 'system-spec-kit' && /\b(packet|spec folder|save memory|phase|continuation prompts|resume handling)\b/.test(promptLower)) {
    return true;
  }
  if (skillId === 'sk-deep-research' && /\b(deep-loop prompts|ordinary file-write prompts|research cycle|same corpus)\b/.test(promptLower)) {
    return true;
  }
  if (skillId === 'mcp-chrome-devtools' && /\b(\.codex\/agents|state log|predictions schema|current labels|gate-3-classifier\.ts)\b/.test(promptLower)) {
    return true;
  }
  if (skillId === 'cli-codex' && /\b\.codex\/agents\b/.test(promptLower)) {
    return true;
  }
  if (skillId === 'sk-code-opencode' && /\bgate-3-classifier\.ts\b/.test(promptLower)) {
    return true;
  }
  return false;
}

function primaryIntentBonus(promptLower: string, recommendation: AdvisorScoredRecommendation): number {
  const R = SCORING_CALIBRATION.routing;
  if (/\bsemantic (code )?search\b/.test(promptLower)) {
    const activeDeepResearch = /\/spec_kit:deep-research|\b(resume|continue|run|launch|start|iteration|convergence)\b.*\bdeep[- ]research\b/.test(promptLower);
    if (recommendation.skill === 'mcp-coco-index') return R.semanticSearchCocoIndexBonus;
    if (!activeDeepResearch && recommendation.skill === 'sk-deep-research') return R.semanticSearchDeepResearchPenalty;
  }
  if (/\bdeep[- ]review\b/.test(promptLower)) {
    if (recommendation.skill === 'sk-deep-review') return R.deepReviewSkDeepReviewBonus;
    if (recommendation.skill === 'sk-code-review') return R.deepReviewSkCodeReviewPenalty;
  }
  if (/\bdeep[- ]research\b/.test(promptLower)) {
    if (recommendation.skill === 'sk-deep-research') return R.deepResearchSkDeepResearchBonus;
    if (recommendation.skill === 'system-spec-kit' || recommendation.skill === 'sk-code-review') return R.deepResearchOtherSkillsPenalty;
  }
  if (DEEP_RESEARCH_CYCLE.test(promptLower)) {
    if (recommendation.skill === 'sk-deep-research') return R.deepResearchCycleSkDeepResearchBonus;
    if (recommendation.skill === 'system-spec-kit' || recommendation.skill === 'sk-code-review' || recommendation.skill === 'sk-code-opencode') return R.deepResearchCycleOtherSkillsPenalty;
  }
  if (/\b(compare|audit|review)\b/.test(promptLower) && /\b(classifier|vocabulary|prose|implementation|agents\.md|drift|mismatch)\b/.test(promptLower)) {
    if (recommendation.skill === 'sk-code-review') return R.compareAuditCodeReviewBonus;
    if (recommendation.skill === 'sk-code-opencode') return R.compareAuditCodeOpenCodePenalty;
  }
  if (/\b(corpus ids?|first-100 predictions|continuation prompts|routing study config|confusion matrix|source-mix note|prompt template|packet-local)\b/.test(promptLower)) {
    if (recommendation.skill === 'system-spec-kit') return R.corpusStudySpecKitBonus;
    if (recommendation.skill === 'sk-improve-prompt' || recommendation.skill === 'mcp-chrome-devtools' || recommendation.skill === 'sk-doc') return R.corpusStudyOtherSkillsPenalty;
  }
  if (promptLower.includes('/spec_kit:deep-research') && recommendation.skill === 'sk-deep-research') return R.slashCommandDeepResearchBonus;
  if (promptLower.includes('/spec_kit:deep-review') && recommendation.skill === 'sk-deep-review') return R.slashCommandDeepReviewBonus;
  if (/\bphase folder\b/.test(promptLower)) {
    if (recommendation.skill === 'system-spec-kit') return R.phaseFolderSpecKitBonus;
    if (recommendation.skill === 'sk-deep-research') return R.phaseFolderDeepResearchPenalty;
  }
  return 0;
}

export function scoreAdvisorPrompt(prompt: string, options: AdvisorScoringOptions): AdvisorScoringResult {
  const projection = options.projection ?? loadAdvisorProjection(options.workspaceRoot);
  const weights = parseScorerWeights(DEFAULT_SCORER_WEIGHTS);
  const disabled = new Set(options.disabledLanes ?? []);
  const affordances = normalize(options.affordances ?? []);
  const laneScores = buildLaneScores(prompt, projection, disabled, affordances);
  const liveTotal = SCORER_LANES
    .filter((lane) => !disabled.has(lane))
    .reduce((total, lane) => isLiveScorerLane(lane) ? total + weights[lane] : total, 0) || liveWeightTotal(weights);
  if (isSpeckitMetricsEnabled() && liveTotal > 0) {
    for (const lane of SCORER_LANES) {
      if (!isLiveScorerLane(lane) || disabled.has(lane)) continue;
      speckitMetrics.setGauge('spec_kit.scorer.fusion_live_weight_share', weights[lane] / liveTotal, { lane });
    }
  }
  const promptLower = prompt.toLowerCase();
  const readOnlyExplainer = isReadOnlyExplainer(promptLower);
  const hasTaskIntent = TASK_INTENT.test(promptLower);
  const hasDeepResearchCycleIntent = DEEP_RESEARCH_CYCLE.test(promptLower);
  const recommendations: AdvisorScoredRecommendation[] = [];

  for (const skill of projection.skills) {
    if (!isDefaultRoutable(promptLower, skill)) continue;
    const contributions: LaneContribution[] = SCORER_LANES.map((lane) => {
      const rawScore = laneRawScore(laneScores[lane], skill.id);
      const shadowOnly = !isLiveScorerLane(lane);
      return {
        lane,
        rawScore,
        weightedScore: shadowOnly || disabled.has(lane) ? 0 : rawScore * weights[lane],
        weight: disabled.has(lane) ? 0 : weights[lane],
        evidence: laneEvidence(laneScores[lane], skill.id),
        shadowOnly,
      };
    });
    const score = contributions.reduce((total, contribution) => total + contribution.weightedScore, 0);
    if (score <= 0 && contributions.every((contribution) => contribution.rawScore <= 0)) continue;
    if (isSpeckitMetricsEnabled()) {
      for (const contribution of contributions) {
        if (contribution.weightedScore !== 0) {
          speckitMetrics.setGauge('spec_kit.scorer.lane_contribution', contribution.weightedScore, { lane: contribution.lane, skill_id: skill.id });
        }
      }
    }

    const directScore = Math.max(
      contributions.find((contribution) => contribution.lane === 'explicit_author')?.rawScore ?? 0,
      contributions.find((contribution) => contribution.lane === 'lexical')?.rawScore ?? 0,
    );
    const derivedDominant = isDerivedDominant(contributions);
    const explicitSignal = hasExplicitWorkflowSignal(contributions, skill.id);
    const liveNormalized = score / liveTotal;
    const confidence = confidenceFor({
      liveNormalized,
      directScore,
      readOnlyExplainer,
      hasExplicitWorkflowSignal: explicitSignal,
      hasTaskIntent,
      hasDeepResearchCycleIntent,
      readOnlyRouteAllowed: readOnlyRouteAllowed(promptLower, skill.id),
      derivedDominant,
      skillId: skill.id,
    });
    recommendations.push({
      skill: skill.id,
      kind: skill.kind,
      confidence,
      uncertainty: uncertaintyFor(contributions, confidence, 0),
      passes_threshold: false,
      reason: attributionReason(contributions),
      score: Number(score.toFixed(6)),
      laneContributions: contributions,
      dominantLane: dominantLane(contributions),
      redirectTo: skill.redirectTo ?? undefined,
      redirectFrom: skill.redirectFrom,
      lifecycleStatus: skill.lifecycleStatus,
    });
  }

  if (isSpeckitMetricsEnabled()) {
    for (const recommendation of recommendations) {
      if (primaryIntentBonus(promptLower, recommendation) !== 0) {
        speckitMetrics.incrementCounter('spec_kit.scorer.primary_intent_bonus_applied_total', { skill_id: recommendation.skill });
      }
    }
  }
  let ranked = recommendations.sort((left, right) => {
    const leftCommandBonus = left.kind === 'command' && !promptLower.includes('/') ? -0.08 : 0;
    const rightCommandBonus = right.kind === 'command' && !promptLower.includes('/') ? -0.08 : 0;
    const leftIntent = primaryIntentBonus(promptLower, left);
    const rightIntent = primaryIntentBonus(promptLower, right);
    return (right.score + rightCommandBonus + rightIntent) - (left.score + leftCommandBonus + leftIntent)
      || right.confidence - left.confidence
      || left.skill.localeCompare(right.skill);
  });

  ranked = ranked.map((recommendation, index) => {
    const next = ranked[index + 1];
    const ambiguityPressure = next && Math.abs(recommendation.confidence - next.confidence) <= 0.05 ? 0.04 : 0;
    const uncertainty = uncertaintyFor(recommendation.laneContributions, recommendation.confidence, ambiguityPressure);
    return {
      ...recommendation,
      uncertainty,
      passes_threshold: recommendation.confidence >= (options.confidenceThreshold ?? DEFAULT_CONFIDENCE_THRESHOLD)
        && uncertainty <= (options.uncertaintyThreshold ?? DEFAULT_UNCERTAINTY_THRESHOLD),
    };
  });
  ranked = applyAmbiguity(ranked);

  const passing = ranked.filter((recommendation) => recommendation.passes_threshold);
  const visible = options.includeAllCandidates ? ranked : passing;
  const top = passing[0] ?? null;
  if (isSpeckitMetricsEnabled() && top) {
    const runtimeLabel = normalizeRuntimeLabel(process.env.SPECKIT_RUNTIME);
    const freshnessLabel = normalizeFreshnessLabel(process.env.SPECKIT_ADVISOR_FRESHNESS);
    if (runtimeLabel && freshnessLabel) {
      speckitMetrics.incrementCounter('spec_kit.advisor.recommendation_emitted_total', { runtime: runtimeLabel, freshness_state: freshnessLabel });
    }
    speckitMetrics.recordConfidenceBracket(top.confidence);
  }
  return {
    recommendations: visible,
    topSkill: top?.skill ?? null,
    unknown: !top,
    ambiguous: isAmbiguousTopTwo(ranked),
    metrics: {
      candidateCount: ranked.length,
      liveLaneCount: SCORER_LANES.filter((lane) => isLiveScorerLane(lane) && !disabled.has(lane)).length,
    },
  };
}
