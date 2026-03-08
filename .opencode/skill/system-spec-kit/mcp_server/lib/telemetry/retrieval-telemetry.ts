// ---------------------------------------------------------------
// MODULE: Retrieval Telemetry (C136-12)
// ---------------------------------------------------------------
// AI-WHY: Captures latency, mode selection, fallback, and quality-proxy
// dimensions for governance review and Wave 2 gate decisions.
// Feature flag: SPECKIT_EXTENDED_TELEMETRY (default false / disabled)
// ---------------------------------------------------------------

import {
  sanitizeRetrievalTracePayload,
} from './trace-schema';
import type {
  TelemetryTracePayload,
} from './trace-schema';

/* ---------------------------------------------------------------
   1. FEATURE FLAG
--------------------------------------------------------------- */

/**
 * AI-WHY: Extended telemetry controlled by env var (default: disabled for performance).
 * Set SPECKIT_EXTENDED_TELEMETRY=true to enable detailed retrieval metrics collection.
 */
function isExtendedTelemetryEnabled(): boolean {
  return process.env.SPECKIT_EXTENDED_TELEMETRY === 'true';
}

/* ---------------------------------------------------------------
   1b. QUALITY PROXY CONSTANTS
--------------------------------------------------------------- */

/** Maximum latency value (ms) for quality proxy normalization.
 *  Latencies at or above this ceiling map to a 0.0 quality score component. */
const QUALITY_PROXY_LATENCY_CEILING_MS = 5000;

/** Result count at which the count-saturation component reaches 1.0. */
const QUALITY_PROXY_COUNT_SATURATION_THRESHOLD = 10;

/* ---------------------------------------------------------------
   2. TYPES
--------------------------------------------------------------- */

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

/** Full retrieval telemetry record */
interface RetrievalTelemetry {
  enabled: boolean;
  timestamp: string;
  latency: LatencyMetrics;
  mode: ModeMetrics;
  fallback: FallbackMetrics;
  quality: QualityMetrics;
  tracePayload?: TelemetryTracePayload;
}

type LatencyStage = keyof Omit<LatencyMetrics, 'totalLatencyMs'>;

/* ---------------------------------------------------------------
   3. FACTORY
--------------------------------------------------------------- */

function createTelemetry(): RetrievalTelemetry {
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
  };
}

/* ---------------------------------------------------------------
   4. RECORDING FUNCTIONS
--------------------------------------------------------------- */

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
    // AI-WHY: reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
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

/* ---------------------------------------------------------------
   5. QUALITY PROXY COMPUTATION
--------------------------------------------------------------- */

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

/* ---------------------------------------------------------------
   6. SERIALIZATION
--------------------------------------------------------------- */

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
  };

  if (tracePayload) {
    payload.tracePayload = tracePayload;
  }

  return payload;
}

/* ---------------------------------------------------------------
   7. EXPORTS
--------------------------------------------------------------- */

export {
  isExtendedTelemetryEnabled,
  createTelemetry,
  recordLatency,
  recordMode,
  recordFallback,
  recordQualityProxy,
  recordTracePayload,
  computeQualityProxy,
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
  LatencyStage,
};

// Self-governance: Opus-F agent, TCB=9, 3 findings addressed (A6-P2-2, A6-P2-3, A10-P2-3)
