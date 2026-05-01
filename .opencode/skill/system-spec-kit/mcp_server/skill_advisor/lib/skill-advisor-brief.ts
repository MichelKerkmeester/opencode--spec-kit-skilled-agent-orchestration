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
} from '../../lib/context/shared-payload.js';
import {
  getAdvisorFreshness,
  type AdvisorFreshnessResult,
} from './freshness.js';
import {
  advisorPromptCache,
  type AdvisorPromptCache,
  type AdvisorThresholds,
} from './prompt-cache.js';
import { onCacheInvalidation } from './freshness/cache-invalidation.js';
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
import {
  renderAdvisorBrief,
  type AdvisorBriefRenderableResult,
} from './render.js';

// Wire prompt-cache invalidation to graph generation bumps (F81/F77/F78).
// Module-init scope: registers exactly once per host process at first import.
onCacheInvalidation(() => {
  advisorPromptCache.clear();
});

// F-018-D3-03: AdvisorRuntime now derives from the canonical tuple in
// advisor-runtime-values.ts. The local re-export keeps every existing
// consumer importing from this module path unchanged; the local import
// keeps the type usable inside this file's own interfaces.
import {
  ADVISOR_RUNTIME_VALUES,
  isAdvisorRuntime,
  type AdvisorRuntime,
} from './advisor-runtime-values.js';
export {
  ADVISOR_RUNTIME_VALUES,
  isAdvisorRuntime,
  type AdvisorRuntime,
};
export type AdvisorHookStatus = AdvisorEnvelopeStatus;
export type AdvisorHookFreshness = AdvisorEnvelopeFreshness;

export interface SkillAdvisorBriefOptions {
  readonly workspaceRoot: string;
  readonly runtime: AdvisorRuntime;
  readonly maxTokens?: number;
  readonly thresholdConfig?: AdvisorThresholds;
  readonly subprocessTimeoutMs?: number;
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
export const DEFAULT_ADVISOR_CONFIDENCE_THRESHOLD = 0.8;
export const DEFAULT_ADVISOR_UNCERTAINTY_THRESHOLD = 0.35;
const DEFAULT_METRICS: AdvisorHookMetrics = {
  durationMs: 0,
  cacheHit: false,
  subprocessInvoked: false,
  retriesAttempted: 0,
  recommendationCount: 0,
  tokenCap: DEFAULT_TOKEN_CAP,
};

export interface ResolvedAdvisorThresholdConfig {
  readonly confidenceThreshold: number;
  readonly uncertaintyThreshold: number;
  readonly confidenceOnly: boolean;
  readonly showRejections: boolean;
  readonly includeAttribution: boolean;
  readonly includeAbstainReasons: boolean;
}

function clampTokenCap(maxTokens: number | undefined, ambiguous: boolean): number {
  const requested = maxTokens ?? (ambiguous ? HARD_TOKEN_CAP : DEFAULT_TOKEN_CAP);
  return Math.min(Math.max(1, Math.floor(requested)), HARD_TOKEN_CAP);
}

export function resolveAdvisorThresholdConfig(
  thresholdConfig: AdvisorThresholds | undefined,
): ResolvedAdvisorThresholdConfig {
  return {
    confidenceThreshold: thresholdConfig?.confidenceThreshold ?? DEFAULT_ADVISOR_CONFIDENCE_THRESHOLD,
    uncertaintyThreshold: thresholdConfig?.uncertaintyThreshold ?? DEFAULT_ADVISOR_UNCERTAINTY_THRESHOLD,
    confidenceOnly: thresholdConfig?.confidenceOnly ?? false,
    showRejections: thresholdConfig?.showRejections ?? false,
    includeAttribution: thresholdConfig?.includeAttribution ?? false,
    includeAbstainReasons: thresholdConfig?.includeAbstainReasons ?? false,
  };
}

export function passingRecommendations(
  recommendations: readonly AdvisorRecommendation[],
  thresholdConfig: AdvisorThresholds | undefined,
): AdvisorRecommendation[] {
  const resolvedThresholds = resolveAdvisorThresholdConfig(thresholdConfig);
  return recommendations.filter((recommendation) => {
    if (recommendation.passes_threshold === true) {
      return true;
    }
    if (resolvedThresholds.confidenceOnly) {
      return recommendation.confidence >= resolvedThresholds.confidenceThreshold;
    }
    return recommendation.confidence >= resolvedThresholds.confidenceThreshold
      && recommendation.uncertainty <= resolvedThresholds.uncertaintyThreshold;
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

function renderSharedBrief(
  recommendations: readonly AdvisorRecommendation[],
  freshness: AdvisorHookFreshness,
  tokenCap: number,
  thresholdConfig: AdvisorThresholds | undefined,
): string | null {
  const renderableResult: AdvisorBriefRenderableResult = {
    status: 'ok',
    freshness,
    recommendations,
    metrics: { tokenCap },
    sharedPayload: null,
  };
  return renderAdvisorBrief(renderableResult, {
    tokenCap,
    thresholdConfig,
  });
}

export function buildAdvisorHookResultFromRecommendations(args: {
  readonly startedAt?: number;
  readonly freshnessResult: AdvisorFreshnessResult;
  readonly recommendations: readonly AdvisorRecommendation[];
  readonly thresholdConfig?: AdvisorThresholds;
  readonly maxTokens?: number;
  readonly diagnostics?: AdvisorHookDiagnostics | null;
  readonly metrics?: Partial<AdvisorHookMetrics>;
}): AdvisorHookResult {
  const freshness = args.freshnessResult.state;
  if (freshness !== 'live' && freshness !== 'stale') {
    return result({
      startedAt: args.startedAt ?? performance.now(),
      status: freshness === 'absent' ? 'skipped' : 'degraded',
      freshness,
      brief: null,
      diagnostics: args.diagnostics ?? null,
      metrics: args.metrics,
      freshnessResult: args.freshnessResult,
    });
  }

  const filteredRecommendations = passingRecommendations(args.recommendations, args.thresholdConfig);
  const tokenCap = clampTokenCap(args.maxTokens, hasAmbiguitySignal(filteredRecommendations));
  const brief = renderSharedBrief(
    filteredRecommendations,
    freshness,
    tokenCap,
    args.thresholdConfig,
  );
  return result({
    startedAt: args.startedAt ?? performance.now(),
    status: brief ? 'ok' : 'skipped',
    freshness,
    brief,
    recommendations: filteredRecommendations,
    diagnostics: args.diagnostics ?? null,
    metrics: {
      ...args.metrics,
      tokenCap,
    },
    freshnessResult: args.freshnessResult,
  });
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
    { kind: 'advisor-runtime' as const, path: '.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py' },
  ];
  for (const skillLabel of [...freshness.skillFingerprints.keys()].sort().slice(0, 8)) {
    refs.push({ kind: 'skill-inventory' as const, path: `.opencode/skill/${skillLabel}/SKILL.md` });
  }
  return refs;
}

function buildSharedPayload(args: {
  status: AdvisorHookStatus;
  freshness: AdvisorHookFreshness;
  renderedBrief: string | null;
  recommendations: readonly AdvisorRecommendation[];
  freshnessResult: AdvisorFreshnessResult;
  generatedAt: string;
}): SharedPayloadEnvelope | null {
  const top = args.recommendations[0] ?? null;
  const sections: SharedPayloadSection[] = args.renderedBrief
    ? [{
      key: 'advisor-brief',
      title: 'Advisor Brief',
      content: args.renderedBrief,
      source: 'advisor-runtime',
    }]
    : [];
  return createSharedPayloadEnvelope({
    kind: 'resume',
    sections,
    summary: args.renderedBrief ?? `Advisor ${args.status} (${args.freshness})`,
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
      renderedBrief: args.brief,
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
      timeoutMs: options.subprocessTimeoutMs,
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
    const brief = renderSharedBrief(
      recommendations,
      freshness.state,
      tokenCap,
      options.thresholdConfig,
    );
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
