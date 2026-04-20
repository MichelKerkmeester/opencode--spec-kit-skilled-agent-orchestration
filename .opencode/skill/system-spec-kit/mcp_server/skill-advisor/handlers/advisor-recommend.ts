// ───────────────────────────────────────────────────────────────
// MODULE: advisor_recommend Handler
// ───────────────────────────────────────────────────────────────

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { advisorPromptCache } from '../lib/prompt-cache.js';
import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
import {
  AdvisorRecommendInputSchema,
  AdvisorRecommendOutputSchema,
  type AdvisorRecommendInput,
  type AdvisorRecommendOutput,
} from '../schemas/advisor-tool-schemas.js';
import { readAdvisorStatus } from './advisor-status.js';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

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

function cacheSourceSignature(status: ReturnType<typeof readAdvisorStatus>): string {
  return `${status.freshness}:${status.generation}:${status.lastGenerationBump ?? 'never'}`;
}

function recommendationLabels(output: AdvisorRecommendOutput): string[] {
  return output.recommendations.map((recommendation) => recommendation.skillId);
}

function disabledOutput(): AdvisorRecommendOutput {
  return AdvisorRecommendOutputSchema.parse({
    recommendations: [],
    ambiguous: false,
    freshness: 'unavailable',
    generatedAt: new Date().toISOString(),
    cache: {
      hit: false,
      sourceSignaturePresent: false,
    },
    warnings: ['ADVISOR_DISABLED'],
    abstainReasons: ['Skill advisor disabled by SPECKIT_SKILL_ADVISOR_HOOK_DISABLED.'],
  });
}

function computeRecommendationOutput(input: AdvisorRecommendInput): AdvisorRecommendOutput {
  const workspaceRoot = findWorkspaceRoot();
  const status = readAdvisorStatus({ workspaceRoot });
  const sourceSignature = cacheSourceSignature(status);
  advisorPromptCache.invalidateSourceSignatureChange(sourceSignature);
  const key = advisorPromptCache.makeKey({
    canonicalPrompt: input.prompt.trim(),
    sourceSignature,
    runtime: 'mcp',
    maxTokens: input.options?.topK,
  });
  const cached = advisorPromptCache.get(key);
  if (cached) {
    const cachedOutput = cached.value as AdvisorRecommendOutput;
    return AdvisorRecommendOutputSchema.parse({
      ...cachedOutput,
      cache: {
        ...cachedOutput.cache,
        hit: true,
      },
    });
  }

  const topK = input.options?.topK ?? 3;
  const result = scoreAdvisorPrompt(input.prompt, { workspaceRoot });
  const output: AdvisorRecommendOutput = {
    recommendations: result.recommendations.slice(0, topK).map((recommendation) => ({
      skillId: recommendation.skill,
      score: recommendation.score,
      confidence: recommendation.confidence,
      dominantLane: recommendation.dominantLane,
      ...(input.options?.includeAttribution ? {
        laneBreakdown: recommendation.laneContributions.map((lane) => ({
          ...lane,
          evidence: [...lane.evidence],
        })),
      } : {}),
      ...(recommendation.redirectFrom && recommendation.redirectFrom.length > 0 ? { redirectFrom: [...recommendation.redirectFrom] } : {}),
      ...(recommendation.redirectTo ? { redirectTo: recommendation.redirectTo } : {}),
      status: recommendation.lifecycleStatus,
    })),
    ambiguous: result.ambiguous,
    freshness: status.freshness,
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
  const data = process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1'
    ? disabledOutput()
    : computeRecommendationOutput(input);
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data }, null, 2),
    }],
  };
}

export const handle_advisor_recommend = handleAdvisorRecommend;
