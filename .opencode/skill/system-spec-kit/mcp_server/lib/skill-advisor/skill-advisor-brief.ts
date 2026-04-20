// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Brief Producer
// ───────────────────────────────────────────────────────────────

import { performance } from 'node:perf_hooks';
import {
  createSharedPayloadEnvelope,
  type AdvisorEnvelopeFreshness,
  type AdvisorEnvelopeStatus,
  type SharedPayloadEnvelope,
  type SharedPayloadSection,
  type SharedPayloadSourceRef,
  type SharedPayloadTrustState,
} from '../context/shared-payload.js';
import {
  getAdvisorFreshness,
  type AdvisorFreshnessResult,
} from './freshness.js';
import {
  advisorPromptCache,
  type AdvisorPromptCache,
  type AdvisorThresholds,
} from './prompt-cache.js';
import { shouldFireAdvisor } from './prompt-policy.js';
import {
  runAdvisorSubprocess,
  type AdvisorRecommendation,
  type AdvisorSubprocessErrorCode,
} from './subprocess.js';
import {
  classifyAdvisorException,
  classifyAdvisorFailure,
  type AdvisorErrorClass,
} from './error-diagnostics.js';

export type AdvisorRuntime = 'claude' | 'gemini' | 'copilot' | 'codex';
export type AdvisorHookStatus = AdvisorEnvelopeStatus;
export type AdvisorHookFreshness = AdvisorEnvelopeFreshness;

export interface SkillAdvisorBriefOptions {
  readonly workspaceRoot: string;
  readonly runtime: AdvisorRuntime;
  readonly maxTokens?: number;
  readonly thresholdConfig?: AdvisorThresholds;
}

export interface AdvisorHookDiagnostics {
  readonly reason?: string;
  readonly errorCode?: AdvisorSubprocessErrorCode | 'UNCAUGHT_EXCEPTION' | 'ADVISOR_FRESHNESS_UNAVAILABLE';
  readonly errorClass?: AdvisorErrorClass;
  readonly errorMessage?: string;
  readonly policyReason?: string;
  readonly metalinguisticMention?: readonly string[];
  readonly skillNameSuppressions?: readonly string[];
  readonly staleReason?: string;
}

export interface AdvisorHookMetrics {
  readonly durationMs: number;
  readonly cacheHit: boolean;
  readonly subprocessInvoked: boolean;
  readonly retriesAttempted: number;
  readonly recommendationCount: number;
  readonly tokenCap: number;
}

export interface AdvisorHookResult {
  readonly status: AdvisorHookStatus;
  readonly freshness: AdvisorHookFreshness;
  readonly brief: string | null;
  readonly recommendations: AdvisorRecommendation[];
  readonly diagnostics: AdvisorHookDiagnostics | null;
  readonly metrics: AdvisorHookMetrics;
  readonly generatedAt: string;
  readonly sharedPayload: SharedPayloadEnvelope | null;
}

interface CachedAdvisorHookResult extends AdvisorHookResult {
  readonly status: 'ok';
  readonly brief: string;
}

const DEFAULT_TOKEN_CAP = 80;
const HARD_TOKEN_CAP = 120;
const DEFAULT_METRICS: AdvisorHookMetrics = {
  durationMs: 0,
  cacheHit: false,
  subprocessInvoked: false,
  retriesAttempted: 0,
  recommendationCount: 0,
  tokenCap: DEFAULT_TOKEN_CAP,
};

function clampTokenCap(maxTokens: number | undefined, ambiguous: boolean): number {
  const requested = maxTokens ?? (ambiguous ? HARD_TOKEN_CAP : DEFAULT_TOKEN_CAP);
  return Math.min(Math.max(1, Math.floor(requested)), HARD_TOKEN_CAP);
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function capTextByTokenEstimate(text: string, tokenCap: number): string {
  if (estimateTokens(text) <= tokenCap) {
    return text;
  }
  const words = text.split(/\s+/);
  const kept: string[] = [];
  for (const word of words) {
    const candidate = [...kept, word].join(' ');
    if (estimateTokens(`${candidate}...`) > tokenCap) {
      break;
    }
    kept.push(word);
  }
  return kept.length > 0 ? `${kept.join(' ')}...` : text.slice(0, Math.max(1, tokenCap * 4 - 3)).trimEnd() + '...';
}

function passingRecommendations(
  recommendations: readonly AdvisorRecommendation[],
  thresholdConfig: AdvisorThresholds | undefined,
): AdvisorRecommendation[] {
  const confidenceThreshold = thresholdConfig?.confidenceThreshold ?? 0.8;
  const uncertaintyThreshold = thresholdConfig?.uncertaintyThreshold ?? 0.35;
  return recommendations.filter((recommendation) => {
    if (recommendation.passes_threshold === true) {
      return true;
    }
    if (thresholdConfig?.confidenceOnly) {
      return recommendation.confidence >= confidenceThreshold;
    }
    return recommendation.confidence >= confidenceThreshold
      && recommendation.uncertainty <= uncertaintyThreshold;
  });
}

function hasAmbiguitySignal(recommendations: readonly AdvisorRecommendation[]): boolean {
  if (recommendations.length < 2) {
    return false;
  }
  const [first, second] = recommendations;
  if (!first || !second) {
    return false;
  }
  return Math.abs(first.confidence - second.confidence) <= 0.05;
}

function renderBrief(
  recommendations: readonly AdvisorRecommendation[],
  freshness: AdvisorHookFreshness,
  tokenCap: number,
): string | null {
  const top = recommendations[0];
  if (!top) {
    return null;
  }
  const prefix = freshness === 'stale' ? 'Advisor: stale - ' : 'Advisor: ';
  const brief = `${prefix}use ${top.skill} (confidence ${top.confidence.toFixed(2)}, uncertainty ${top.uncertainty.toFixed(2)}).`;
  return capTextByTokenEstimate(brief, tokenCap);
}

function freshnessTrustState(freshness: AdvisorHookFreshness): SharedPayloadTrustState {
  switch (freshness) {
    case 'live':
      return 'live';
    case 'stale':
      return 'stale';
    case 'absent':
      return 'absent';
    case 'unavailable':
      return 'unavailable';
    default:
      return 'unavailable';
  }
}

function sourceRefsForFreshness(freshness: AdvisorFreshnessResult): SharedPayloadSourceRef[] {
  const refs: SharedPayloadSourceRef[] = [
    { kind: 'advisor-runtime' as const, path: '.opencode/skill/skill-advisor/scripts/skill_advisor.py' },
  ];
  for (const skillLabel of [...freshness.skillFingerprints.keys()].sort().slice(0, 8)) {
    refs.push({ kind: 'skill-inventory' as const, path: `.opencode/skill/${skillLabel}/SKILL.md` });
  }
  return refs;
}

function buildSharedPayload(args: {
  status: AdvisorHookStatus;
  freshness: AdvisorHookFreshness;
  brief: string | null;
  recommendations: readonly AdvisorRecommendation[];
  freshnessResult: AdvisorFreshnessResult;
  generatedAt: string;
}): SharedPayloadEnvelope | null {
  const top = args.recommendations[0] ?? null;
  const sections: SharedPayloadSection[] = args.brief
    ? [{
      key: 'advisor-brief',
      title: 'Advisor Brief',
      content: args.brief,
      source: 'advisor-runtime',
    }]
    : [];
  return createSharedPayloadEnvelope({
    kind: 'resume',
    sections,
    summary: args.brief ?? `Advisor ${args.status} (${args.freshness})`,
    metadata: {
      freshness: args.freshness,
      confidence: top?.confidence ?? 0,
      uncertainty: top?.uncertainty ?? 1,
      skillLabel: top?.skill ?? null,
      status: args.status,
    },
    provenance: {
      producer: 'advisor',
      sourceSurface: 'user-prompt-submit',
      trustState: freshnessTrustState(args.freshness),
      generatedAt: args.generatedAt,
      lastUpdated: args.freshnessResult.probedAt,
      sourceRefs: sourceRefsForFreshness(args.freshnessResult),
    },
  });
}

function deletedCachedSkills(
  cachedSkillLabels: readonly string[],
  freshness: AdvisorFreshnessResult,
): string[] {
  return cachedSkillLabels.filter((skillLabel) => !freshness.skillFingerprints.has(skillLabel));
}

function result(args: {
  startedAt: number;
  status: AdvisorHookStatus;
  freshness: AdvisorHookFreshness;
  brief: string | null;
  recommendations?: AdvisorRecommendation[];
  diagnostics?: AdvisorHookDiagnostics | null;
  metrics?: Partial<AdvisorHookMetrics>;
  freshnessResult: AdvisorFreshnessResult | null;
}): AdvisorHookResult {
  const generatedAt = new Date().toISOString();
  const recommendations = args.recommendations ?? [];
  const tokenCap = args.metrics?.tokenCap ?? DEFAULT_TOKEN_CAP;
  const metrics: AdvisorHookMetrics = {
    ...DEFAULT_METRICS,
    ...args.metrics,
    durationMs: Number((performance.now() - args.startedAt).toFixed(3)),
    recommendationCount: recommendations.length,
    tokenCap,
  };
  const sharedPayload = args.freshnessResult
    ? buildSharedPayload({
      status: args.status,
      freshness: args.freshness,
      brief: args.brief,
      recommendations,
      freshnessResult: args.freshnessResult,
      generatedAt,
    })
    : null;
  return {
    status: args.status,
    freshness: args.freshness,
    brief: args.brief,
    recommendations,
    diagnostics: args.diagnostics ?? null,
    metrics,
    generatedAt,
    sharedPayload,
  };
}

function nonLiveResult(args: {
  startedAt: number;
  freshness: AdvisorFreshnessResult;
  diagnostics: AdvisorHookDiagnostics | null;
}): AdvisorHookResult | null {
  if (args.freshness.state === 'absent') {
    return result({
      startedAt: args.startedAt,
      status: 'skipped',
      freshness: 'absent',
      brief: null,
      diagnostics: args.diagnostics,
      freshnessResult: args.freshness,
    });
  }
  if (args.freshness.state === 'unavailable') {
    return result({
      startedAt: args.startedAt,
      status: 'degraded',
      freshness: 'unavailable',
      brief: null,
      diagnostics: {
        ...args.diagnostics,
        errorCode: 'ADVISOR_FRESHNESS_UNAVAILABLE',
      },
      freshnessResult: args.freshness,
    });
  }
  return null;
}

function isCacheable(resultValue: AdvisorHookResult): resultValue is CachedAdvisorHookResult {
  return resultValue.status === 'ok' && resultValue.brief !== null && resultValue.recommendations.length > 0;
}

function restampCachedSharedPayload(
  sharedPayload: SharedPayloadEnvelope | null,
  generatedAt: string,
): SharedPayloadEnvelope | null {
  if (!sharedPayload) {
    return null;
  }
  return {
    ...sharedPayload,
    provenance: {
      ...sharedPayload.provenance,
      generatedAt,
    },
  };
}

/** Clear memoized advisor briefs for deterministic tests and session reset hooks. */
export function clearAdvisorBriefCacheForTests(): void {
  (advisorPromptCache as AdvisorPromptCache<unknown>).clear();
}

/** Build the typed skill-advisor result consumed by all runtime hook renderers. */
export async function buildSkillAdvisorBrief(
  prompt: string,
  options: SkillAdvisorBriefOptions,
): Promise<AdvisorHookResult> {
  const startedAt = performance.now();
  try {
    const policy = shouldFireAdvisor(prompt);
    const baseDiagnostics: AdvisorHookDiagnostics | null = policy.metalinguisticMentions.length > 0
      ? {
        metalinguisticMention: policy.metalinguisticMentions,
        skillNameSuppressions: policy.metalinguisticMentions,
      }
      : null;

    if (!policy.fire) {
      return result({
        startedAt,
        status: 'skipped',
        freshness: 'unavailable',
        brief: null,
        diagnostics: {
          ...(baseDiagnostics ?? {}),
          policyReason: policy.reason,
        },
        freshnessResult: null,
      });
    }

    const freshness = getAdvisorFreshness(options.workspaceRoot);
    const nonLive = nonLiveResult({
      startedAt,
      freshness,
      diagnostics: baseDiagnostics
        ? {
          ...baseDiagnostics,
          staleReason: freshness.diagnostics?.reason,
          ...(freshness.diagnostics?.errorClass ? { errorClass: freshness.diagnostics.errorClass } : {}),
          ...(freshness.diagnostics?.errorMessage ? { errorMessage: freshness.diagnostics.errorMessage } : {}),
        }
        : freshness.diagnostics?.reason || freshness.diagnostics?.errorClass || freshness.diagnostics?.errorMessage
          ? {
            ...(freshness.diagnostics?.reason ? { staleReason: freshness.diagnostics.reason } : {}),
            ...(freshness.diagnostics?.errorClass ? { errorClass: freshness.diagnostics.errorClass } : {}),
            ...(freshness.diagnostics?.errorMessage ? { errorMessage: freshness.diagnostics.errorMessage } : {}),
          }
          : null,
    });
    if (nonLive) {
      return nonLive;
    }

    const cache = advisorPromptCache as AdvisorPromptCache<CachedAdvisorHookResult>;
    cache.invalidateSourceSignatureChange(freshness.sourceSignature);
    const cacheKey = cache.makeKey({
      canonicalPrompt: policy.canonicalPrompt,
      sourceSignature: freshness.sourceSignature,
      runtime: options.runtime,
      maxTokens: options.maxTokens,
      thresholdConfig: options.thresholdConfig,
    });
    const cached = cache.get(cacheKey);
    if (cached) {
      const deletedSkills = deletedCachedSkills(cached.skillLabels, freshness);
      if (deletedSkills.length === 0) {
        const generatedAt = new Date().toISOString();
        return {
          ...cached.value,
          metrics: {
            ...cached.value.metrics,
            durationMs: Number((performance.now() - startedAt).toFixed(3)),
            cacheHit: true,
            subprocessInvoked: false,
          },
          generatedAt,
          sharedPayload: restampCachedSharedPayload(cached.value.sharedPayload, generatedAt),
        };
      }
      cache.invalidate(cacheKey);
    }

    const subprocess = await runAdvisorSubprocess(policy.canonicalPrompt, {
      workspaceRoot: options.workspaceRoot,
      thresholdConfig: options.thresholdConfig,
    });
    if (!subprocess.ok) {
      const failureDiagnostics = classifyAdvisorFailure(subprocess.errorCode, subprocess.stderr);
      return result({
        startedAt,
        status: 'fail_open',
        freshness: 'unavailable',
        brief: null,
        diagnostics: {
          ...(baseDiagnostics ?? {}),
          errorCode: subprocess.errorCode ?? 'NON_ZERO_EXIT',
          ...(failureDiagnostics ?? {}),
        },
        metrics: {
          subprocessInvoked: true,
          retriesAttempted: subprocess.retriesAttempted,
        },
        freshnessResult: freshness,
      });
    }

    const recommendations = passingRecommendations(subprocess.recommendations, options.thresholdConfig);
    const tokenCap = clampTokenCap(options.maxTokens, hasAmbiguitySignal(recommendations));
    const brief = renderBrief(recommendations, freshness.state, tokenCap);
    const okResult = result({
      startedAt,
      status: brief ? 'ok' : 'skipped',
      freshness: freshness.state,
      brief,
      recommendations,
      diagnostics: freshness.state === 'stale' || baseDiagnostics
        ? {
          ...(baseDiagnostics ?? {}),
          ...(freshness.state === 'stale' ? { staleReason: freshness.diagnostics?.reason ?? 'STALE_ADVISOR_FRESHNESS' } : {}),
        }
        : null,
      metrics: {
        subprocessInvoked: true,
        retriesAttempted: subprocess.retriesAttempted,
        tokenCap,
      },
      freshnessResult: freshness,
    });

    if (isCacheable(okResult)) {
      cache.set({
        key: cacheKey,
        sourceSignature: freshness.sourceSignature,
        value: okResult,
        skillLabels: okResult.recommendations.map((recommendation) => recommendation.skill),
      });
    }

    return okResult;
  } catch (error: unknown) {
    return result({
      startedAt,
      status: 'fail_open',
      freshness: 'unavailable',
      brief: null,
      diagnostics: {
        errorCode: 'UNCAUGHT_EXCEPTION',
        ...classifyAdvisorException(error),
      },
      freshnessResult: null,
    });
  }
}
