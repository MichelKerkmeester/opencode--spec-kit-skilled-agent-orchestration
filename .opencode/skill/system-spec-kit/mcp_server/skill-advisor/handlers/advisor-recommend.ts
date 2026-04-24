// ───────────────────────────────────────────────────────────────
// MODULE: advisor_recommend Handler
// ───────────────────────────────────────────────────────────────

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { advisorPromptCache } from '../lib/prompt-cache.js';
import {
  resolveAdvisorThresholdConfig,
} from '../lib/skill-advisor-brief.js';
import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
import { sanitizeSkillLabel } from '../lib/render.js';
import {
  AdvisorRecommendInputSchema,
  AdvisorRecommendOutputSchema,
  type AdvisorRecommendInput,
  type AdvisorRecommendOutput,
} from '../schemas/advisor-tool-schemas.js';
import { readAdvisorStatus } from './advisor-status.js';

type HandlerResponse = { content: Array<{ type: string; text: string }> };
type AdvisorStatus = ReturnType<typeof readAdvisorStatus>;
type ScoredRecommendation = ReturnType<typeof scoreAdvisorPrompt>['recommendations'][number];
type PublicRecommendationStatus = NonNullable<AdvisorRecommendOutput['recommendations'][number]['status']>;
type PublicThresholds = AdvisorRecommendOutput['effectiveThresholds'];

function findWorkspaceRoot(start = process.cwd()): string {
  let current = resolve(start);
  for (let index = 0; index < 12; index += 1) {
    if (existsSync(`${current}/.opencode/skill`)) return current;
    const parent = resolve(current, '..');
    if (parent === current) break;
    current = parent;
  }
  return resolve(start);
}

function cacheSourceSignature(status: AdvisorStatus): string {
  return `${status.freshness}:${status.generation}:${status.lastGenerationBump ?? 'never'}`;
}

function recommendationLabels(output: AdvisorRecommendOutput): string[] {
  return output.recommendations.map((recommendation) => recommendation.skillId);
}

function unavailableTrustState(reason: string): AdvisorRecommendOutput['trustState'] {
  return {
    state: 'unavailable',
    reason,
    generation: 0,
    checkedAt: new Date().toISOString(),
    lastLiveAt: null,
  };
}

function publicThresholds(args: {
  confidenceThreshold?: number;
  uncertaintyThreshold?: number;
}): PublicThresholds {
  const resolved = resolveAdvisorThresholdConfig(args);
  return {
    confidenceThreshold: resolved.confidenceThreshold,
    uncertaintyThreshold: resolved.uncertaintyThreshold,
    confidenceOnly: resolved.confidenceOnly,
  };
}

function emptyOutput(args: {
  workspaceRoot: string;
  effectiveThresholds: AdvisorRecommendOutput['effectiveThresholds'];
  freshness: AdvisorRecommendOutput['freshness'];
  trustState: AdvisorRecommendOutput['trustState'];
  warnings?: readonly string[];
  abstainReasons?: readonly string[];
}): AdvisorRecommendOutput {
  return AdvisorRecommendOutputSchema.parse({
    workspaceRoot: args.workspaceRoot,
    effectiveThresholds: args.effectiveThresholds,
    recommendations: [],
    ambiguous: false,
    freshness: args.freshness,
    trustState: args.trustState,
    generatedAt: new Date().toISOString(),
    cache: {
      hit: false,
      sourceSignaturePresent: false,
    },
    ...(args.warnings && args.warnings.length > 0 ? { warnings: [...args.warnings] } : {}),
    ...(args.abstainReasons && args.abstainReasons.length > 0 ? { abstainReasons: [...args.abstainReasons] } : {}),
  });
}

function disabledOutput(
  workspaceRoot: string,
  effectiveThresholds: PublicThresholds,
): AdvisorRecommendOutput {
  return emptyOutput({
    workspaceRoot,
    effectiveThresholds,
    freshness: 'unavailable',
    trustState: unavailableTrustState('ADVISOR_DISABLED'),
    warnings: ['ADVISOR_DISABLED'],
    abstainReasons: ['Skill advisor disabled by SPECKIT_SKILL_ADVISOR_HOOK_DISABLED.'],
  });
}

function absentOutput(
  status: AdvisorStatus,
  workspaceRoot: string,
  effectiveThresholds: AdvisorRecommendOutput['effectiveThresholds'],
): AdvisorRecommendOutput {
  return emptyOutput({
    workspaceRoot,
    effectiveThresholds,
    freshness: 'absent',
    trustState: status.trustState,
    warnings: [status.trustState.reason ?? 'ADVISOR_FRESHNESS_ABSENT'],
    abstainReasons: ['Skill advisor freshness is absent; returning fail-open empty recommendations.'],
  });
}

function safeMany(values: readonly string[] | undefined): string[] {
  return (values ?? [])
    .map((value) => sanitizeSkillLabel(value))
    .filter((value): value is string => Boolean(value));
}

function publicRecommendation(recommendation: ScoredRecommendation, includeAttribution: boolean) {
  const skillId = sanitizeSkillLabel(recommendation.skill);
  if (!skillId) return null;
  const redirectFrom = safeMany(recommendation.redirectFrom);
  const redirectTo = sanitizeSkillLabel(recommendation.redirectTo ?? '');
  const sanitizedStatus = sanitizeSkillLabel(recommendation.lifecycleStatus);
  const status: PublicRecommendationStatus | undefined = sanitizedStatus === 'active'
    || sanitizedStatus === 'deprecated'
    || sanitizedStatus === 'archived'
    || sanitizedStatus === 'future'
    ? sanitizedStatus as PublicRecommendationStatus
    : undefined;
  return {
    skillId,
    score: recommendation.score,
    confidence: recommendation.confidence,
    uncertainty: recommendation.uncertainty,
    dominantLane: recommendation.dominantLane,
    ...(includeAttribution ? {
      laneBreakdown: recommendation.laneContributions.map((lane) => ({
        lane: lane.lane,
        rawScore: lane.rawScore,
        weightedScore: lane.weightedScore,
        weight: lane.weight,
        shadowOnly: lane.shadowOnly,
      })),
    } : {}),
    ...(redirectFrom.length > 0 ? { redirectFrom } : {}),
    ...(redirectTo ? { redirectTo } : {}),
    ...(status ? { status } : {}),
  };
}

function computeRecommendationOutput(input: AdvisorRecommendInput): AdvisorRecommendOutput {
  const workspaceRoot = input.workspaceRoot ? resolve(input.workspaceRoot) : findWorkspaceRoot();
  const effectiveThresholds = publicThresholds({
    confidenceThreshold: input.options?.confidenceThreshold,
    uncertaintyThreshold: input.options?.uncertaintyThreshold,
  });
  const status = readAdvisorStatus({ workspaceRoot });
  if (status.freshness === 'absent') {
    return absentOutput(status, workspaceRoot, effectiveThresholds);
  }
  const sourceSignature = cacheSourceSignature(status);
  advisorPromptCache.invalidateSourceSignatureChange(sourceSignature);
  const key = advisorPromptCache.makeKey({
    canonicalPrompt: input.prompt.trim(),
    sourceSignature,
    workspaceRoot,
    runtime: 'mcp',
    maxTokens: input.options?.topK,
    thresholdConfig: {
      confidenceThreshold: input.options?.confidenceThreshold,
      uncertaintyThreshold: input.options?.uncertaintyThreshold,
      includeAttribution: input.options?.includeAttribution,
      includeAbstainReasons: input.options?.includeAbstainReasons,
    },
  });
  const cached = advisorPromptCache.get(key);
  if (cached) {
    const cachedOutput = cached.value as AdvisorRecommendOutput;
    return AdvisorRecommendOutputSchema.parse({
      ...cachedOutput,
      workspaceRoot,
      effectiveThresholds,
      cache: {
        ...cachedOutput.cache,
        hit: true,
      },
    });
  }

  const topK = input.options?.topK ?? 3;
  const result = scoreAdvisorPrompt(input.prompt, {
    workspaceRoot,
    confidenceThreshold: input.options?.confidenceThreshold,
    uncertaintyThreshold: input.options?.uncertaintyThreshold,
  });
  const recommendations = result.recommendations
    .map((recommendation) => publicRecommendation(recommendation, Boolean(input.options?.includeAttribution)))
    .filter((recommendation): recommendation is NonNullable<typeof recommendation> => Boolean(recommendation))
    .slice(0, topK);
  const output: AdvisorRecommendOutput = {
    workspaceRoot,
    effectiveThresholds,
    recommendations,
    ambiguous: result.ambiguous,
    freshness: status.freshness,
    trustState: status.trustState,
    generatedAt: new Date().toISOString(),
    cache: {
      hit: false,
      sourceSignaturePresent: status.generation > 0 || status.lastGenerationBump !== null,
    },
    ...(status.freshness === 'stale' ? { warnings: [status.trustState.reason ?? 'STALE_ADVISOR_FRESHNESS'] } : {}),
    ...(input.options?.includeAbstainReasons && result.unknown
      ? { abstainReasons: ['No recommendation passed confidence and uncertainty thresholds.'] }
      : {}),
  };
  const parsed = AdvisorRecommendOutputSchema.parse(output);
  advisorPromptCache.set({
    key,
    sourceSignature,
    value: parsed,
    skillLabels: recommendationLabels(parsed),
  });
  return parsed;
}

export async function handleAdvisorRecommend(args: unknown): Promise<HandlerResponse> {
  const input = AdvisorRecommendInputSchema.parse(args);
  const workspaceRoot = input.workspaceRoot ? resolve(input.workspaceRoot) : findWorkspaceRoot();
  const effectiveThresholds = publicThresholds({
    confidenceThreshold: input.options?.confidenceThreshold,
    uncertaintyThreshold: input.options?.uncertaintyThreshold,
  });
  const data = process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1'
    ? disabledOutput(workspaceRoot, effectiveThresholds)
    : computeRecommendationOutput(input);
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data }, null, 2),
    }],
  };
}

export const handle_advisor_recommend = handleAdvisorRecommend;
