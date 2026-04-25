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
import { scoreDerivedLane } from './lanes/derived.js';
import { scoreExplicitLane } from './lanes/explicit.js';
import { scoreGraphCausalLane } from './lanes/graph-causal.js';
import { scoreLexicalLane } from './lanes/lexical.js';
import { scoreSemanticShadowLane } from './lanes/semantic-shadow.js';
import { loadAdvisorProjection } from './projection.js';
import { isReadOnlyExplainer, matchesPhraseBoundary } from './text.js';
import {
  DEFAULT_SCORER_WEIGHTS,
  SCORER_LANES,
  liveWeightTotal,
  parseScorerWeights,
} from './weights-config.js';
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
  return {
    explicit_author: [],
    lexical: [],
    graph_causal: [],
    derived_generated: [],
    semantic_shadow: [],
  };
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
  if (args.readOnlyExplainer && args.skillId === 'skill-advisor') return 0.25;
  const base = 0.52 + Math.min(1, args.liveNormalized * 1.25) * 0.43;
  if (args.readOnlyExplainer && !args.readOnlyRouteAllowed) return 0.25;
  if (args.readOnlyRouteAllowed) {
    return Number(Math.max(base, 0.82).toFixed(4));
  }
  if (args.derivedDominant && args.directScore < 0.2) return 0.72;
  if (args.hasDeepResearchCycleIntent && args.skillId === 'sk-deep-research' && args.liveNormalized >= 0.12) return 0.84;
  if (args.hasTaskIntent && (args.directScore >= 0.18 || args.liveNormalized >= 0.2)) {
    return Number(Math.max(base, 0.82).toFixed(4));
  }
  if (args.directScore >= 0.65) return Number(Math.max(base, 0.82).toFixed(4));
  const directBonus = args.directScore >= 0.85 ? 0.04 : 0;
  return Number(Math.max(0, Math.min(0.95, base + directBonus)).toFixed(4));
}

function uncertaintyFor(contributions: readonly LaneContribution[], confidence: number, ambiguousPressure: number): number {
  const evidenceCount = contributions.reduce((total, contribution) => total + contribution.evidence.length, 0);
  const direct = contributions
    .filter((contribution) => contribution.lane === 'explicit_author' || contribution.lane === 'lexical')
    .reduce((max, contribution) => Math.max(max, contribution.rawScore), 0);
  let uncertainty = 0.42;
  if (evidenceCount >= 5) uncertainty = 0.18;
  else if (evidenceCount >= 3) uncertainty = 0.22;
  else if (evidenceCount >= 1) uncertainty = 0.30;
  if (direct >= 0.75) uncertainty -= 0.06;
  if (confidence < 0.8) uncertainty += 0.08;
  uncertainty += ambiguousPressure;
  return Number(Math.max(0.08, Math.min(0.95, uncertainty)).toFixed(2));
}

function buildLaneScores(prompt: string, projection: AdvisorProjection, disabled: Set<ScorerLane>): LaneScores {
  const scores = emptyLaneScores();
  if (!disabled.has('explicit_author')) scores.explicit_author = scoreExplicitLane(prompt, projection);
  if (!disabled.has('lexical')) scores.lexical = scoreLexicalLane(prompt, projection);
  if (!disabled.has('derived_generated')) scores.derived_generated = scoreDerivedLane(prompt, projection);
  if (!disabled.has('semantic_shadow')) scores.semantic_shadow = scoreSemanticShadowLane(prompt, projection);
  if (!disabled.has('graph_causal')) {
    scores.graph_causal = scoreGraphCausalLane([
      ...scores.explicit_author,
      ...scores.lexical,
      ...scores.derived_generated,
    ], projection);
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
  if (/\bsemantic (code )?search\b/.test(promptLower)) {
    const activeDeepResearch = /\/spec_kit:deep-research|\b(resume|continue|run|launch|start|iteration|convergence)\b.*\bdeep[- ]research\b/.test(promptLower);
    if (recommendation.skill === 'mcp-coco-index') return 0.5;
    if (!activeDeepResearch && recommendation.skill === 'sk-deep-research') return -0.2;
  }
  if (/\bdeep[- ]review\b/.test(promptLower)) {
    if (recommendation.skill === 'sk-deep-review') return 0.35;
    if (recommendation.skill === 'sk-code-review') return -0.25;
  }
  if (/\bdeep[- ]research\b/.test(promptLower)) {
    if (recommendation.skill === 'sk-deep-research') return 0.35;
    if (recommendation.skill === 'system-spec-kit' || recommendation.skill === 'sk-code-review') return -0.18;
  }
  if (DEEP_RESEARCH_CYCLE.test(promptLower)) {
    if (recommendation.skill === 'sk-deep-research') return 0.45;
    if (recommendation.skill === 'system-spec-kit' || recommendation.skill === 'sk-code-review' || recommendation.skill === 'sk-code-opencode') return -0.18;
  }
  if (/\b(compare|audit|review)\b/.test(promptLower) && /\b(classifier|vocabulary|prose|implementation|agents\.md|drift|mismatch)\b/.test(promptLower)) {
    if (recommendation.skill === 'sk-code-review') return 0.35;
    if (recommendation.skill === 'sk-code-opencode') return -0.18;
  }
  if (/\b(corpus ids?|first-100 predictions|continuation prompts|routing study config|confusion matrix|source-mix note|prompt template|packet-local)\b/.test(promptLower)) {
    if (recommendation.skill === 'system-spec-kit') return 0.35;
    if (recommendation.skill === 'sk-improve-prompt' || recommendation.skill === 'mcp-chrome-devtools' || recommendation.skill === 'sk-doc') return -0.16;
  }
  if (promptLower.includes('/spec_kit:deep-research') && recommendation.skill === 'sk-deep-research') return 0.45;
  if (promptLower.includes('/spec_kit:deep-review') && recommendation.skill === 'sk-deep-review') return 0.45;
  if (/\bphase folder\b/.test(promptLower)) {
    if (recommendation.skill === 'system-spec-kit') return 0.35;
    if (recommendation.skill === 'sk-deep-research') return -0.25;
  }
  return 0;
}

export function scoreAdvisorPrompt(prompt: string, options: AdvisorScoringOptions): AdvisorScoringResult {
  const projection = options.projection ?? loadAdvisorProjection(options.workspaceRoot);
  const weights = parseScorerWeights(DEFAULT_SCORER_WEIGHTS);
  const disabled = new Set(options.disabledLanes ?? []);
  const laneScores = buildLaneScores(prompt, projection, disabled);
  const liveTotal = SCORER_LANES
    .filter((lane) => !disabled.has(lane))
    .reduce((total, lane) => lane === 'semantic_shadow' ? total : total + weights[lane], 0) || liveWeightTotal(weights);
  if (isSpeckitMetricsEnabled() && liveTotal > 0) {
    for (const lane of SCORER_LANES) {
      if (lane === 'semantic_shadow' || disabled.has(lane)) continue;
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
      const shadowOnly = lane === 'semantic_shadow';
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
      liveLaneCount: SCORER_LANES.filter((lane) => lane !== 'semantic_shadow' && !disabled.has(lane)).length,
    },
  };
}
