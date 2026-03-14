// ───────────────────────────────────────────────────────────────
// 1. RETRIEVAL TELEMETRY (C136-12)
// ───────────────────────────────────────────────────────────────
// Captures latency, mode selection, fallback, and quality-proxy
// Dimensions for governance review and Wave 2 gate decisions.
// Feature flag: SPECKIT_EXTENDED_TELEMETRY (default false / disabled)
import {
  sanitizeRetrievalTracePayload,
} from './trace-schema';
import type {
  TelemetryTracePayload,
} from './trace-schema';
import {
  getMemoryRoadmapDefaults,
} from '../config/capability-flags';
import type {
  MemoryRoadmapCapabilityFlags,
  MemoryRoadmapPhase,
} from '../config/capability-flags';

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
 * Weights:
 *   avgRelevance (40%) + topResult (25%) + resultCount saturation (20%) +
 *   latency penalty (15%, inversely proportional, capped at 5s)
 *
 * The score is always clamped to [0, 1].
 */
function computeQualityProxy(t: RetrievalTelemetry): number {
  const avgNorm = Math.max(0, Math.min(1, t.quality.avgRelevanceScore));
  const topNorm = Math.max(0, Math.min(1, t.quality.topResultScore));

  // Result count saturation: reaches 1.0 at QUALITY_PROXY_COUNT_SATURATION_THRESHOLD results
  const countNorm = Math.min(1, t.quality.resultCount / QUALITY_PROXY_COUNT_SATURATION_THRESHOLD);

  // Latency component: 0ms = 1.0, QUALITY_PROXY_LATENCY_CEILING_MS+ = 0.0
  const latencyClamped = Math.max(0, Math.min(QUALITY_PROXY_LATENCY_CEILING_MS, t.latency.totalLatencyMs));
  const latencyNorm = 1 - latencyClamped / QUALITY_PROXY_LATENCY_CEILING_MS;

  const raw =
    avgNorm * 0.40 +
    topNorm * 0.25 +
    countNorm * 0.20 +
    latencyNorm * 0.15;

  return Math.max(0, Math.min(1, raw));
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
  GraphHealthDashboardSummary,
  TraceSamplingOptions,
  SampledTracePayload,
  LatencyStage,
};

// Self-governance: Opus-F agent, TCB=9, 3 findings addressed (A6-P2-2, A6-P2-3, A10-P2-3)
