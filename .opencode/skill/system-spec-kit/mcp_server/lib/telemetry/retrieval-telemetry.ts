// ───────────────────────────────────────────────────────────────
// MODULE: Retrieval Telemetry (C136-12)
// ───────────────────────────────────────────────────────────────
// Feature catalog: Scoring observability
// Captures latency, mode selection, fallback, and quality-proxy
// Dimensions for governance review and Wave 2 gate decisions.
// Feature flag: SPECKIT_EXTENDED_TELEMETRY (default false / disabled)
import {
  sanitizeRetrievalTracePayload,
} from './trace-schema.js';
import type {
  TelemetryTracePayload,
} from './trace-schema.js';
// F6.06 fix: Import canonical quality proxy from eval module
import { computeQualityProxy as computeQualityProxyCanonical } from '../eval/eval-quality-proxy.js';
import {
  getMemoryRoadmapDefaults,
} from '../config/capability-flags.js';
import type { SessionTransitionTrace } from '../search/session-transition.js';
import type {
  MemoryRoadmapCapabilityFlags,
  MemoryRoadmapPhase,
} from '../config/capability-flags.js';

/* ───────────────────────────────────────────────────────────────
   1. FEATURE FLAG
──────────────────────────────────────────────────────────────── */

/**
 * Extended telemetry controlled by env var (default: disabled for performance).
 * Set SPECKIT_EXTENDED_TELEMETRY=true to enable detailed retrieval metrics collection.
 */
function isExtendedTelemetryEnabled(): boolean {
  return process.env.SPECKIT_EXTENDED_TELEMETRY === 'true';
}

/* ───────────────────────────────────────────────────────────────
   1b. QUALITY PROXY CONSTANTS
──────────────────────────────────────────────────────────────── */

/** Maximum latency value (ms) for quality proxy normalization.
 *  Latencies at or above this ceiling map to a 0.0 quality score component. */
const QUALITY_PROXY_LATENCY_CEILING_MS = 5000;

/** Result count at which the count-saturation component reaches 1.0. */
const QUALITY_PROXY_COUNT_SATURATION_THRESHOLD = 10;

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

/** Latency breakdown by retrieval stage */
interface LatencyMetrics {
  totalLatencyMs: number;
  candidateLatencyMs: number;
  fusionLatencyMs: number;
  rerankLatencyMs: number;
  boostLatencyMs: number;
}

/** Mode selection telemetry */
interface ModeMetrics {
  selectedMode: string | null;
  modeOverrideApplied: boolean;
  pressureLevel: string | null;
  tokenUsageRatio?: number;
}

/** Fallback telemetry */
interface FallbackMetrics {
  fallbackTriggered: boolean;
  fallbackReason?: string;
  degradedModeActive: boolean;
}

/** Quality proxy telemetry */
interface QualityMetrics {
  resultCount: number;
  avgRelevanceScore: number;
  topResultScore: number;
  boostImpactDelta: number;
  extractionCountInSession: number;
  qualityProxyScore: number; // 0-1
}

/** Architecture rollout telemetry for phased memory-roadmap capabilities. */
interface ArchitectureMetrics {
  phase: MemoryRoadmapPhase;
  capabilities: MemoryRoadmapCapabilityFlags;
  scopeDimensionsTracked: number;
}

interface GraphHealthMetrics {
  killSwitchActive: boolean;
  causalBoosted: number;
  coActivationBoosted: number;
  communityInjected: number;
  graphSignalsBoosted: number;
  totalGraphInjected: number;
}

interface AdaptiveMetrics {
  mode: 'shadow' | 'promoted' | 'disabled';
  promotedCount: number;
  demotedCount: number;
  bounded: boolean;
  maxDeltaApplied: number;
}

interface GraphWalkDiagnostics {
  rolloutState: 'off' | 'trace_only' | 'bounded_runtime';
  rowsWithGraphContribution: number;
  rowsWithAppliedBonus: number;
  capAppliedCount: number;
  maxRaw: number;
  maxNormalized: number;
  maxAppliedBonus: number;
}

interface LifecycleForecastDiagnostics {
  state: string | null;
  progress: number;
  filesProcessed: number;
  filesTotal: number;
  etaSeconds: number | null;
  etaConfidence: number | null;
  failureRisk: number | null;
  riskSignals: string[];
  caveat?: string;
}

interface GraphHealthDashboardSummary {
  totalPayloads: number;
  payloadsWithGraphHealth: number;
  killSwitchActiveCount: number;
  averageGraphInjected: number;
  maxGraphInjected: number;
  causalBoostedTotal: number;
  coActivationBoostedTotal: number;
  communityInjectedTotal: number;
  graphSignalsBoostedTotal: number;
}

interface TraceSamplingOptions {
  limit?: number;
  minGraphInjected?: number;
  killSwitchOnly?: boolean;
}

interface SampledTracePayload {
  timestamp: string | null;
  graphHealth: GraphHealthMetrics;
  tracePayload: TelemetryTracePayload;
}

/** Full retrieval telemetry record */
interface RetrievalTelemetry {
  enabled: boolean;
  timestamp: string;
  latency: LatencyMetrics;
  mode: ModeMetrics;
  fallback: FallbackMetrics;
  quality: QualityMetrics;
  architecture: ArchitectureMetrics;
  graphHealth: GraphHealthMetrics;
  adaptive: AdaptiveMetrics;
  tracePayload?: TelemetryTracePayload;
  transitionDiagnostics?: SessionTransitionTrace;
  graphWalkDiagnostics?: GraphWalkDiagnostics;
  lifecycleForecastDiagnostics?: LifecycleForecastDiagnostics;
}

type LatencyStage = keyof Omit<LatencyMetrics, 'totalLatencyMs'>;

/* ───────────────────────────────────────────────────────────────
   3. FACTORY
──────────────────────────────────────────────────────────────── */

function createTelemetry(): RetrievalTelemetry {
  const roadmapDefaults = getMemoryRoadmapDefaults();

  return {
    enabled: isExtendedTelemetryEnabled(),
    timestamp: new Date().toISOString(),
    latency: {
      totalLatencyMs: 0,
      candidateLatencyMs: 0,
      fusionLatencyMs: 0,
      rerankLatencyMs: 0,
      boostLatencyMs: 0,
    },
    mode: {
      selectedMode: null,
      modeOverrideApplied: false,
      pressureLevel: null,
    },
    fallback: {
      fallbackTriggered: false,
      degradedModeActive: false,
    },
    quality: {
      resultCount: 0,
      avgRelevanceScore: 0,
      topResultScore: 0,
      boostImpactDelta: 0,
      extractionCountInSession: 0,
      qualityProxyScore: 0,
    },
    architecture: {
      phase: roadmapDefaults.phase,
      capabilities: { ...roadmapDefaults.capabilities },
      scopeDimensionsTracked: roadmapDefaults.scopeDimensionsTracked,
    },
    graphHealth: {
      killSwitchActive: false,
      causalBoosted: 0,
      coActivationBoosted: 0,
      communityInjected: 0,
      graphSignalsBoosted: 0,
      totalGraphInjected: 0,
    },
    adaptive: {
      mode: 'disabled',
      promotedCount: 0,
      demotedCount: 0,
      bounded: true,
      maxDeltaApplied: 0,
    },
  };
}

/* ───────────────────────────────────────────────────────────────
   4. RECORDING FUNCTIONS
──────────────────────────────────────────────────────────────── */

function recordLatency(t: RetrievalTelemetry, stage: LatencyStage, ms: number): void {
  if (!t.enabled) return;
  const clamped = Math.max(0, Number.isFinite(ms) ? ms : 0);
  t.latency[stage] = clamped;
  // Recompute total from components
  t.latency.totalLatencyMs =
    t.latency.candidateLatencyMs +
    t.latency.fusionLatencyMs +
    t.latency.rerankLatencyMs +
    t.latency.boostLatencyMs;
}

function recordMode(
  t: RetrievalTelemetry,
  mode: string,
  override: boolean,
  pressure: string | null,
  tokenUsageRatio?: number,
): void {
  if (!t.enabled) return;
  t.mode.selectedMode = mode;
  t.mode.modeOverrideApplied = override;
  t.mode.pressureLevel = pressure;
  if (typeof tokenUsageRatio === 'number' && Number.isFinite(tokenUsageRatio)) {
    t.mode.tokenUsageRatio = Math.max(0, Math.min(1, tokenUsageRatio));
  }
}

function recordFallback(t: RetrievalTelemetry, reason?: string): void {
  if (!t.enabled) return;
  t.fallback.fallbackTriggered = true;
  if (reason) {
    t.fallback.fallbackReason = reason;
  }
  t.fallback.degradedModeActive = true;
}

function recordQualityProxy(
  t: RetrievalTelemetry,
  results: Array<{ score?: number; similarity?: number }>,
  boostDelta: number,
  extractionCount: number,
): void {
  if (!t.enabled) return;

  const count = Array.isArray(results) ? results.length : 0;
  t.quality.resultCount = count;
  t.quality.extractionCountInSession = Math.max(0, extractionCount || 0);

  if (count > 0) {
    const scores = results.map((r) => {
      if (typeof r.score === 'number' && Number.isFinite(r.score)) return r.score;
      if (typeof r.similarity === 'number' && Number.isFinite(r.similarity)) return r.similarity / 100;
      return 0;
    });
    // Reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
    t.quality.topResultScore = scores.reduce((a, b) => Math.max(a, b), -Infinity);
    t.quality.avgRelevanceScore = scores.reduce((sum, s) => sum + s, 0) / count;
  }

  t.quality.boostImpactDelta = Number.isFinite(boostDelta) ? boostDelta : 0;
  t.quality.qualityProxyScore = computeQualityProxy(t);
}

function recordTracePayload(t: RetrievalTelemetry, payload: unknown): boolean {
  if (!t.enabled) return false;

  const sanitized = sanitizeRetrievalTracePayload(payload);
  if (!sanitized) {
    delete t.tracePayload;
    return false;
  }

  t.tracePayload = sanitized;
  return true;
}

function recordTransitionDiagnostics(
  t: RetrievalTelemetry,
  transition?: SessionTransitionTrace,
): void {
  if (!t.enabled) return;
  if (!transition) {
    delete t.transitionDiagnostics;
    return;
  }

  t.transitionDiagnostics = {
    previousState: transition.previousState,
    currentState: transition.currentState,
    confidence: Math.max(0, Math.min(1, transition.confidence)),
    signalSources: Array.isArray(transition.signalSources)
      ? transition.signalSources.filter((signal): signal is SessionTransitionTrace['signalSources'][number] => typeof signal === 'string')
      : [],
    reason: typeof transition.reason === 'string' && transition.reason.length > 0 ? transition.reason : null,
  };
}

function recordGraphWalkDiagnostics(
  t: RetrievalTelemetry,
  update: Partial<GraphWalkDiagnostics>,
): void {
  if (!t.enabled) return;
  const current: GraphWalkDiagnostics = t.graphWalkDiagnostics ?? {
    rolloutState: 'off',
    rowsWithGraphContribution: 0,
    rowsWithAppliedBonus: 0,
    capAppliedCount: 0,
    maxRaw: 0,
    maxNormalized: 0,
    maxAppliedBonus: 0,
  };

  t.graphWalkDiagnostics = {
    rolloutState: update.rolloutState ?? current.rolloutState,
    rowsWithGraphContribution: typeof update.rowsWithGraphContribution === 'number' && Number.isFinite(update.rowsWithGraphContribution)
      ? Math.max(0, Math.floor(update.rowsWithGraphContribution))
      : current.rowsWithGraphContribution,
    rowsWithAppliedBonus: typeof update.rowsWithAppliedBonus === 'number' && Number.isFinite(update.rowsWithAppliedBonus)
      ? Math.max(0, Math.floor(update.rowsWithAppliedBonus))
      : current.rowsWithAppliedBonus,
    capAppliedCount: typeof update.capAppliedCount === 'number' && Number.isFinite(update.capAppliedCount)
      ? Math.max(0, Math.floor(update.capAppliedCount))
      : current.capAppliedCount,
    maxRaw: typeof update.maxRaw === 'number' && Number.isFinite(update.maxRaw)
      ? Math.max(0, update.maxRaw)
      : current.maxRaw,
    maxNormalized: typeof update.maxNormalized === 'number' && Number.isFinite(update.maxNormalized)
      ? Math.max(0, update.maxNormalized)
      : current.maxNormalized,
    maxAppliedBonus: typeof update.maxAppliedBonus === 'number' && Number.isFinite(update.maxAppliedBonus)
      ? Math.max(0, update.maxAppliedBonus)
      : current.maxAppliedBonus,
  };
}

function recordLifecycleForecastDiagnostics(
  t: RetrievalTelemetry,
  forecast: Record<string, unknown> | null | undefined,
  context: {
    state?: string | null;
    progress?: number;
    filesProcessed?: number;
    filesTotal?: number;
  } = {},
): void {
  if (!t.enabled) return;

  const candidate = forecast && typeof forecast === 'object'
    ? forecast
    : {};
  const riskSignals = Array.isArray(candidate.riskSignals)
    ? candidate.riskSignals.filter((signal): signal is string => typeof signal === 'string')
    : [];

  t.lifecycleForecastDiagnostics = {
    state: typeof context.state === 'string' && context.state.length > 0 ? context.state : null,
    progress:
      typeof context.progress === 'number' && Number.isFinite(context.progress)
        ? Math.max(0, Math.min(100, context.progress))
        : 0,
    filesProcessed:
      typeof context.filesProcessed === 'number' && Number.isFinite(context.filesProcessed)
        ? Math.max(0, Math.trunc(context.filesProcessed))
        : 0,
    filesTotal:
      typeof context.filesTotal === 'number' && Number.isFinite(context.filesTotal)
        ? Math.max(0, Math.trunc(context.filesTotal))
        : 0,
    etaSeconds:
      typeof candidate.etaSeconds === 'number' && Number.isFinite(candidate.etaSeconds)
        ? Math.max(0, candidate.etaSeconds)
        : null,
    etaConfidence:
      typeof candidate.etaConfidence === 'number' && Number.isFinite(candidate.etaConfidence)
        ? Math.max(0, Math.min(1, candidate.etaConfidence))
        : null,
    failureRisk:
      typeof candidate.failureRisk === 'number' && Number.isFinite(candidate.failureRisk)
        ? Math.max(0, Math.min(1, candidate.failureRisk))
        : null,
    riskSignals,
    ...(typeof candidate.caveat === 'string' && candidate.caveat.length > 0
      ? { caveat: candidate.caveat }
      : {}),
  };
}

function recordArchitecturePhase(
  t: RetrievalTelemetry,
  update: {
    phase?: MemoryRoadmapPhase;
    capabilities?: Partial<MemoryRoadmapCapabilityFlags>;
    scopeDimensionsTracked?: number;
  }
): void {
  if (!t.enabled) return;

  if (update.phase) {
    t.architecture.phase = update.phase;
  }

  if (update.capabilities) {
    t.architecture.capabilities = {
      ...t.architecture.capabilities,
      ...update.capabilities,
    };
  }

  if (typeof update.scopeDimensionsTracked === 'number' && Number.isFinite(update.scopeDimensionsTracked)) {
    t.architecture.scopeDimensionsTracked = Math.max(0, Math.floor(update.scopeDimensionsTracked));
  }
}

function recordGraphHealth(
  t: RetrievalTelemetry,
  update: Partial<GraphHealthMetrics>,
): void {
  if (!t.enabled) return;
  t.graphHealth = {
    ...t.graphHealth,
    ...update,
  };
}

function recordAdaptiveEvaluation(
  t: RetrievalTelemetry,
  update: Partial<AdaptiveMetrics>,
): void {
  if (!t.enabled) return;
  t.adaptive = {
    ...t.adaptive,
    ...update,
  };
}

/* ───────────────────────────────────────────────────────────────
   5. QUALITY PROXY COMPUTATION
──────────────────────────────────────────────────────────────── */

/**
 * Compute a 0-1 quality proxy score from the telemetry record.
 *
 * F6.06 fix: Delegates to the canonical eval-quality-proxy implementation
 * so eval metrics and live telemetry use the same formula. Telemetry-specific
 * constants (latency ceiling, count saturation) are passed as parameters.
 */
function computeQualityProxy(t: RetrievalTelemetry): number {
  const result = computeQualityProxyCanonical({
    avgRelevance: Math.max(0, Math.min(1, t.quality.avgRelevanceScore)),
    topResultRelevance: Math.max(0, Math.min(1, t.quality.topResultScore)),
    resultCount: t.quality.resultCount,
    expectedCount: QUALITY_PROXY_COUNT_SATURATION_THRESHOLD,
    latencyMs: t.latency.totalLatencyMs,
    latencyTargetMs: QUALITY_PROXY_LATENCY_CEILING_MS,
  });
  return result.score;
}

/* ───────────────────────────────────────────────────────────────
   6. DASHBOARD HELPERS
──────────────────────────────────────────────────────────────── */

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toNonNegativeFiniteNumber(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return 0;
  }
  return value;
}

function normalizeGraphHealthMetrics(value: unknown): GraphHealthMetrics | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  return {
    killSwitchActive: value.killSwitchActive === true,
    causalBoosted: toNonNegativeFiniteNumber(value.causalBoosted),
    coActivationBoosted: toNonNegativeFiniteNumber(value.coActivationBoosted),
    communityInjected: toNonNegativeFiniteNumber(value.communityInjected),
    graphSignalsBoosted: toNonNegativeFiniteNumber(value.graphSignalsBoosted),
    totalGraphInjected: toNonNegativeFiniteNumber(value.totalGraphInjected),
  };
}

function summarizeGraphHealthDashboard(
  payloads: Array<RetrievalTelemetry | Record<string, unknown>>,
): GraphHealthDashboardSummary {
  let payloadsWithGraphHealth = 0;
  let killSwitchActiveCount = 0;
  let totalGraphInjected = 0;
  let maxGraphInjected = 0;
  let causalBoostedTotal = 0;
  let coActivationBoostedTotal = 0;
  let communityInjectedTotal = 0;
  let graphSignalsBoostedTotal = 0;

  for (const payload of payloads) {
    const graphHealth = normalizeGraphHealthMetrics(
      isObjectRecord(payload) ? payload.graphHealth : undefined,
    );
    if (!graphHealth) {
      continue;
    }

    payloadsWithGraphHealth += 1;
    if (graphHealth.killSwitchActive) {
      killSwitchActiveCount += 1;
    }

    totalGraphInjected += graphHealth.totalGraphInjected;
    maxGraphInjected = Math.max(maxGraphInjected, graphHealth.totalGraphInjected);
    causalBoostedTotal += graphHealth.causalBoosted;
    coActivationBoostedTotal += graphHealth.coActivationBoosted;
    communityInjectedTotal += graphHealth.communityInjected;
    graphSignalsBoostedTotal += graphHealth.graphSignalsBoosted;
  }

  return {
    totalPayloads: payloads.length,
    payloadsWithGraphHealth,
    killSwitchActiveCount,
    averageGraphInjected: payloadsWithGraphHealth > 0 ? totalGraphInjected / payloadsWithGraphHealth : 0,
    maxGraphInjected,
    causalBoostedTotal,
    coActivationBoostedTotal,
    communityInjectedTotal,
    graphSignalsBoostedTotal,
  };
}

function sampleTracePayloads(
  payloads: Array<RetrievalTelemetry | Record<string, unknown>>,
  options: TraceSamplingOptions = {},
): SampledTracePayload[] {
  const limit = typeof options.limit === 'number' && Number.isFinite(options.limit)
    ? Math.max(0, Math.floor(options.limit))
    : 5;
  const minGraphInjected = typeof options.minGraphInjected === 'number' && Number.isFinite(options.minGraphInjected)
    ? Math.max(0, options.minGraphInjected)
    : 1;
  const sampled: SampledTracePayload[] = [];

  if (limit === 0) {
    return sampled;
  }

  for (const payload of payloads) {
    const tracePayload = sanitizeRetrievalTracePayload(
      isObjectRecord(payload) ? payload.tracePayload : undefined,
    );
    const graphHealth = normalizeGraphHealthMetrics(
      isObjectRecord(payload) ? payload.graphHealth : undefined,
    );
    if (!tracePayload || !graphHealth) {
      continue;
    }
    if (graphHealth.totalGraphInjected < minGraphInjected) {
      continue;
    }
    if (options.killSwitchOnly === true && !graphHealth.killSwitchActive) {
      continue;
    }

    sampled.push({
      timestamp: typeof payload.timestamp === 'string' ? payload.timestamp : null,
      graphHealth,
      tracePayload,
    });
  }

  sampled.sort((left, right) => {
    if (right.graphHealth.totalGraphInjected !== left.graphHealth.totalGraphInjected) {
      return right.graphHealth.totalGraphInjected - left.graphHealth.totalGraphInjected;
    }
    const leftTime = left.timestamp ? Date.parse(left.timestamp) : 0;
    const rightTime = right.timestamp ? Date.parse(right.timestamp) : 0;
    return rightTime - leftTime;
  });

  return sampled.slice(0, limit);
}

/* ───────────────────────────────────────────────────────────────
   7. SERIALIZATION
──────────────────────────────────────────────────────────────── */

function toJSON(t: RetrievalTelemetry): Record<string, unknown> {
  if (!t.enabled) {
    return { enabled: false };
  }

  const tracePayload = sanitizeRetrievalTracePayload((t as { tracePayload?: unknown }).tracePayload);

  const modePayload: Record<string, unknown> = {
    selectedMode: t.mode.selectedMode,
    modeOverrideApplied: t.mode.modeOverrideApplied,
    pressureLevel: t.mode.pressureLevel,
  };
  if (typeof t.mode.tokenUsageRatio === 'number' && Number.isFinite(t.mode.tokenUsageRatio)) {
    modePayload.tokenUsageRatio = Math.max(0, Math.min(1, t.mode.tokenUsageRatio));
  }

  const fallbackPayload: Record<string, unknown> = {
    fallbackTriggered: t.fallback.fallbackTriggered,
    degradedModeActive: t.fallback.degradedModeActive,
  };
  if (typeof t.fallback.fallbackReason === 'string' && t.fallback.fallbackReason.length > 0) {
    fallbackPayload.fallbackReason = t.fallback.fallbackReason;
  }

  const payload: Record<string, unknown> = {
    enabled: t.enabled,
    timestamp: t.timestamp,
    latency: {
      totalLatencyMs: t.latency.totalLatencyMs,
      candidateLatencyMs: t.latency.candidateLatencyMs,
      fusionLatencyMs: t.latency.fusionLatencyMs,
      rerankLatencyMs: t.latency.rerankLatencyMs,
      boostLatencyMs: t.latency.boostLatencyMs,
    },
    mode: modePayload,
    fallback: fallbackPayload,
    quality: {
      resultCount: t.quality.resultCount,
      avgRelevanceScore: t.quality.avgRelevanceScore,
      topResultScore: t.quality.topResultScore,
      boostImpactDelta: t.quality.boostImpactDelta,
      extractionCountInSession: t.quality.extractionCountInSession,
      qualityProxyScore: t.quality.qualityProxyScore,
    },
    architecture: {
      phase: t.architecture.phase,
      capabilities: {
        lineageState: t.architecture.capabilities.lineageState,
        graphUnified: t.architecture.capabilities.graphUnified,
        adaptiveRanking: t.architecture.capabilities.adaptiveRanking,
        scopeEnforcement: t.architecture.capabilities.scopeEnforcement,
        governanceGuardrails: t.architecture.capabilities.governanceGuardrails,
        sharedMemory: t.architecture.capabilities.sharedMemory,
      },
      scopeDimensionsTracked: t.architecture.scopeDimensionsTracked,
    },
    graphHealth: {
      killSwitchActive: t.graphHealth.killSwitchActive,
      causalBoosted: t.graphHealth.causalBoosted,
      coActivationBoosted: t.graphHealth.coActivationBoosted,
      communityInjected: t.graphHealth.communityInjected,
      graphSignalsBoosted: t.graphHealth.graphSignalsBoosted,
      totalGraphInjected: t.graphHealth.totalGraphInjected,
    },
    adaptive: {
      mode: t.adaptive.mode,
      promotedCount: t.adaptive.promotedCount,
      demotedCount: t.adaptive.demotedCount,
      bounded: t.adaptive.bounded,
      maxDeltaApplied: t.adaptive.maxDeltaApplied,
    },
  };

  if (tracePayload) {
    payload.tracePayload = tracePayload;
  }

  if (t.transitionDiagnostics) {
    payload.transitionDiagnostics = {
      previousState: t.transitionDiagnostics.previousState,
      currentState: t.transitionDiagnostics.currentState,
      confidence: Math.max(0, Math.min(1, t.transitionDiagnostics.confidence)),
      signalSources: [...t.transitionDiagnostics.signalSources],
      ...(typeof t.transitionDiagnostics.reason === 'string' && t.transitionDiagnostics.reason.length > 0
        ? { reason: t.transitionDiagnostics.reason }
        : {}),
    };
  }

  if (t.graphWalkDiagnostics) {
    payload.graphWalkDiagnostics = {
      rolloutState: t.graphWalkDiagnostics.rolloutState,
      rowsWithGraphContribution: t.graphWalkDiagnostics.rowsWithGraphContribution,
      rowsWithAppliedBonus: t.graphWalkDiagnostics.rowsWithAppliedBonus,
      capAppliedCount: t.graphWalkDiagnostics.capAppliedCount,
      maxRaw: t.graphWalkDiagnostics.maxRaw,
      maxNormalized: t.graphWalkDiagnostics.maxNormalized,
      maxAppliedBonus: t.graphWalkDiagnostics.maxAppliedBonus,
    };
  }

  if (t.lifecycleForecastDiagnostics) {
    payload.lifecycleForecastDiagnostics = {
      state: t.lifecycleForecastDiagnostics.state,
      progress: t.lifecycleForecastDiagnostics.progress,
      filesProcessed: t.lifecycleForecastDiagnostics.filesProcessed,
      filesTotal: t.lifecycleForecastDiagnostics.filesTotal,
      etaSeconds: t.lifecycleForecastDiagnostics.etaSeconds,
      etaConfidence: t.lifecycleForecastDiagnostics.etaConfidence,
      failureRisk: t.lifecycleForecastDiagnostics.failureRisk,
      riskSignals: [...t.lifecycleForecastDiagnostics.riskSignals],
      ...(typeof t.lifecycleForecastDiagnostics.caveat === 'string' && t.lifecycleForecastDiagnostics.caveat.length > 0
        ? { caveat: t.lifecycleForecastDiagnostics.caveat }
        : {}),
    };
  }

  return payload;
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  isExtendedTelemetryEnabled,
  createTelemetry,
  recordLatency,
  recordMode,
  recordFallback,
  recordQualityProxy,
  recordTracePayload,
  recordTransitionDiagnostics,
  recordGraphWalkDiagnostics,
  recordLifecycleForecastDiagnostics,
  recordArchitecturePhase,
  recordGraphHealth,
  recordAdaptiveEvaluation,
  computeQualityProxy,
  summarizeGraphHealthDashboard,
  sampleTracePayloads,
  toJSON,
};

/**
 * Re-exports related public types.
 */
export type {
  RetrievalTelemetry,
  LatencyMetrics,
  ModeMetrics,
  FallbackMetrics,
  QualityMetrics,
  ArchitectureMetrics,
  GraphHealthMetrics,
  AdaptiveMetrics,
  GraphWalkDiagnostics,
  LifecycleForecastDiagnostics,
  GraphHealthDashboardSummary,
  TraceSamplingOptions,
  SampledTracePayload,
  LatencyStage,
};

// Self-governance: Opus-F agent, TCB=9, 3 findings addressed (A6-P2-2, A6-P2-3, A10-P2-3)
