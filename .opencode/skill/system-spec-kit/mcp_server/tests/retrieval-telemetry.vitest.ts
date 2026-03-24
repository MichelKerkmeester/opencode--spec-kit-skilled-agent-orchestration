// TEST: Retrieval Telemetry (C136-12)
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createTelemetry,
  recordLatency,
  recordMode,
  recordFallback,
  recordArchitecturePhase,
  recordQualityProxy,
  recordTracePayload,
  recordTransitionDiagnostics,
  recordGraphWalkDiagnostics,
  recordLifecycleForecastDiagnostics,
  computeQualityProxy,
  toJSON,
  isExtendedTelemetryEnabled,
} from '../lib/telemetry/retrieval-telemetry';

type TelemetryJson = ReturnType<typeof toJSON> & {
  latency?: { candidateLatencyMs?: number; totalLatencyMs?: number };
  mode?: { selectedMode?: string | null; apiKey?: unknown };
  fallback?: { authorization?: unknown };
  quality?: { resultCount?: number; password?: unknown };
    tracePayload?: {
      traceId?: string;
      totalDurationMs?: number;
      finalResultCount?: number;
      query?: unknown;
    sessionId?: unknown;
    token?: unknown;
      apiKey?: unknown;
      stages?: Array<Record<string, unknown>>;
    };
    transitionDiagnostics?: {
      previousState?: string | null;
      currentState?: string | null;
      confidence?: number;
      signalSources?: string[];
      reason?: string;
    };
    graphWalkDiagnostics?: {
      rolloutState?: string;
      rowsWithGraphContribution?: number;
      rowsWithAppliedBonus?: number;
      capAppliedCount?: number;
      maxRaw?: number;
      maxNormalized?: number;
      maxAppliedBonus?: number;
    };
    lifecycleForecastDiagnostics?: {
      state?: string | null;
      progress?: number;
      filesProcessed?: number;
      filesTotal?: number;
      etaSeconds?: number | null;
      etaConfidence?: number | null;
      failureRisk?: number | null;
      riskSignals?: string[];
      caveat?: string;
    };
  };

type TelemetryWithExtras = Omit<
  ReturnType<typeof createTelemetry>,
  'mode' | 'fallback' | 'quality' | 'tracePayload'
> & {
  mode: ReturnType<typeof createTelemetry>['mode'] & Record<string, unknown>;
  fallback: ReturnType<typeof createTelemetry>['fallback'] & Record<string, unknown>;
  quality: ReturnType<typeof createTelemetry>['quality'] & Record<string, unknown>;
  tracePayload?: Record<string, unknown>;
};

function expectPresent<T>(value: T | null | undefined, message: string): T {
  expect(value).toBeDefined();
  expect(value).not.toBeNull();
  if (value == null) {
    throw new Error(message);
  }
  return value;
}

/** Create a telemetry object with enabled=true for testing recording mechanics. */
function createEnabledTelemetry(): ReturnType<typeof createTelemetry> {
  const t = createTelemetry();
  t.enabled = true;
  return t;
}

describe('C136-12: retrieval-telemetry', () => {
  let previousFlag: string | undefined;

  beforeEach(() => {
    previousFlag = process.env.SPECKIT_EXTENDED_TELEMETRY;
    delete process.env.SPECKIT_EXTENDED_TELEMETRY;
  });

  afterEach(() => {
    if (previousFlag === undefined) {
      delete process.env.SPECKIT_EXTENDED_TELEMETRY;
    } else {
      process.env.SPECKIT_EXTENDED_TELEMETRY = previousFlag;
    }
  });

  // T01: Default telemetry object structure
  it('T01: createTelemetry returns valid default structure', () => {
    const t = createTelemetry();
    expect(t.enabled).toBe(false);
    expect(t.timestamp).toBeTruthy();
    expect(t.latency.totalLatencyMs).toBe(0);
    expect(t.latency.candidateLatencyMs).toBe(0);
    expect(t.latency.fusionLatencyMs).toBe(0);
    expect(t.latency.rerankLatencyMs).toBe(0);
    expect(t.latency.boostLatencyMs).toBe(0);
    expect(t.mode.selectedMode).toBeNull();
    expect(t.mode.modeOverrideApplied).toBe(false);
    expect(t.mode.pressureLevel).toBeNull();
    expect(t.fallback.fallbackTriggered).toBe(false);
    expect(t.fallback.degradedModeActive).toBe(false);
    expect(t.quality.resultCount).toBe(0);
    expect(t.quality.avgRelevanceScore).toBe(0);
    expect(t.quality.topResultScore).toBe(0);
    expect(t.quality.boostImpactDelta).toBe(0);
    expect(t.quality.extractionCountInSession).toBe(0);
    expect(t.quality.qualityProxyScore).toBe(0);
    expect(t.architecture.phase).toBe('shared-rollout');
    expect(t.architecture.capabilities.lineageState).toBe(true);
    expect(t.architecture.capabilities.graphUnified).toBe(true);
    expect(t.architecture.scopeDimensionsTracked).toBe(5);
  });

  // T02: Feature flag disabled
  it('T02: feature flag false disables recording', () => {
    process.env.SPECKIT_EXTENDED_TELEMETRY = 'false';
    const t = createTelemetry();
    expect(t.enabled).toBe(false);

    // Recording should be no-ops
    recordLatency(t, 'candidateLatencyMs', 100);
    expect(t.latency.candidateLatencyMs).toBe(0);

    recordMode(t, 'deep', true, 'focused');
    expect(t.mode.selectedMode).toBeNull();

    recordFallback(t, 'test reason');
    expect(t.fallback.fallbackTriggered).toBe(false);
  });

  it('T02b: feature flag 0 disables recording', () => {
    process.env.SPECKIT_EXTENDED_TELEMETRY = '0';
    expect(isExtendedTelemetryEnabled()).toBe(false);
  });

  it('T02c: feature flag unset defaults to disabled', () => {
    delete process.env.SPECKIT_EXTENDED_TELEMETRY;
    expect(isExtendedTelemetryEnabled()).toBe(false);
  });

  // T03: Latency accumulation
  it('T03: recordLatency accumulates total from components', () => {
    const t = createEnabledTelemetry();
    recordLatency(t, 'candidateLatencyMs', 50);
    recordLatency(t, 'fusionLatencyMs', 30);
    recordLatency(t, 'rerankLatencyMs', 20);
    recordLatency(t, 'boostLatencyMs', 10);

    expect(t.latency.candidateLatencyMs).toBe(50);
    expect(t.latency.fusionLatencyMs).toBe(30);
    expect(t.latency.rerankLatencyMs).toBe(20);
    expect(t.latency.boostLatencyMs).toBe(10);
    expect(t.latency.totalLatencyMs).toBe(110);
  });

  it('T03b: recordLatency clamps negative values to 0', () => {
    const t = createEnabledTelemetry();
    recordLatency(t, 'candidateLatencyMs', -50);
    expect(t.latency.candidateLatencyMs).toBe(0);
    expect(t.latency.totalLatencyMs).toBe(0);
  });

  it('T03c: recordLatency handles NaN gracefully', () => {
    const t = createEnabledTelemetry();
    recordLatency(t, 'fusionLatencyMs', NaN);
    expect(t.latency.fusionLatencyMs).toBe(0);
  });

  // T04: Mode capture
  it('T04: recordMode captures mode, override, and pressure', () => {
    const t = createEnabledTelemetry();
    recordMode(t, 'focused', true, 'quick', 0.85);

    expect(t.mode.selectedMode).toBe('focused');
    expect(t.mode.modeOverrideApplied).toBe(true);
    expect(t.mode.pressureLevel).toBe('quick');
    expect(t.mode.tokenUsageRatio).toBe(0.85);
  });

  it('T04b: recordMode clamps tokenUsageRatio to 0-1', () => {
    const t = createEnabledTelemetry();
    recordMode(t, 'deep', false, 'none', 1.5);
    expect(t.mode.tokenUsageRatio).toBe(1);

    recordMode(t, 'deep', false, 'none', -0.3);
    expect(t.mode.tokenUsageRatio).toBe(0);
  });

  // T05: Fallback flags
  it('T05: recordFallback sets trigger and degraded flags', () => {
    const t = createEnabledTelemetry();
    expect(t.fallback.fallbackTriggered).toBe(false);

    recordFallback(t, 'hybrid search failed');
    expect(t.fallback.fallbackTriggered).toBe(true);
    expect(t.fallback.fallbackReason).toBe('hybrid search failed');
    expect(t.fallback.degradedModeActive).toBe(true);
  });

  it('T05b: recordFallback without reason still sets flags', () => {
    const t = createEnabledTelemetry();
    recordFallback(t);
    expect(t.fallback.fallbackTriggered).toBe(true);
    expect(t.fallback.fallbackReason).toBeUndefined();
    expect(t.fallback.degradedModeActive).toBe(true);
  });

  // T06: Quality proxy 0-1 range
  it('T06: computeQualityProxy returns value in 0-1 range', () => {
    const t = createEnabledTelemetry();
    const score = computeQualityProxy(t);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it('T06b: quality proxy increases with good results', () => {
    const t = createEnabledTelemetry();
    const baseScore = computeQualityProxy(t);

    // Add high-quality results
    recordQualityProxy(
      t,
      [{ score: 0.95 }, { score: 0.85 }, { score: 0.75 }],
      0.1,
      5,
    );

    expect(t.quality.qualityProxyScore).toBeGreaterThan(baseScore);
    expect(t.quality.qualityProxyScore).toBeGreaterThanOrEqual(0);
    expect(t.quality.qualityProxyScore).toBeLessThanOrEqual(1);
  });

  it('T06c: quality proxy with max latency reduces score', () => {
    const t = createEnabledTelemetry();
    recordLatency(t, 'candidateLatencyMs', 5000);
    recordQualityProxy(
      t,
      [{ score: 0.9 }, { score: 0.8 }],
      0,
      0,
    );

    // With 5s latency, latency component = 0, reducing overall score
    expect(t.quality.qualityProxyScore).toBeLessThan(0.85);
  });

  // T07: recordQualityProxy populates quality fields
  it('T07: recordQualityProxy sets all quality metrics', () => {
    const t = createEnabledTelemetry();
    const results = [
      { score: 0.9 },
      { score: 0.7 },
      { similarity: 60 }, // 0.6 when normalized
    ];
    recordQualityProxy(t, results, 0.05, 3);

    expect(t.quality.resultCount).toBe(3);
    expect(t.quality.topResultScore).toBe(0.9);
    expect(t.quality.avgRelevanceScore).toBeCloseTo((0.9 + 0.7 + 0.6) / 3, 4);
    expect(t.quality.boostImpactDelta).toBe(0.05);
    expect(t.quality.extractionCountInSession).toBe(3);
    expect(t.quality.qualityProxyScore).toBeGreaterThan(0);
    expect(t.quality.qualityProxyScore).toBeLessThanOrEqual(1);
  });

  it('T07b: recordQualityProxy handles empty results', () => {
    const t = createEnabledTelemetry();
    recordQualityProxy(t, [], 0, 0);

    expect(t.quality.resultCount).toBe(0);
    expect(t.quality.avgRelevanceScore).toBe(0);
    expect(t.quality.topResultScore).toBe(0);
  });

  // T08: JSON serialization
  it('T08: toJSON produces valid serializable object', () => {
    const t = createEnabledTelemetry();
    recordLatency(t, 'candidateLatencyMs', 42);
    recordMode(t, 'deep', false, 'none');
    recordQualityProxy(t, [{ score: 0.8 }], 0.02, 1);
    recordArchitecturePhase(t, {
      phase: 'graph',
      capabilities: { graphUnified: true },
      scopeDimensionsTracked: 5,
    });

    const json = toJSON(t);
    expect(json.enabled).toBe(true);
    expect(json.timestamp).toBeTruthy();
    expect((json as TelemetryJson).latency?.candidateLatencyMs).toBe(42);
    expect((json as TelemetryJson).mode?.selectedMode).toBe('deep');
    expect((json as TelemetryJson).quality?.resultCount).toBe(1);
    expect((json as { architecture?: { phase?: string; scopeDimensionsTracked?: number; capabilities?: { graphUnified?: boolean } } }).architecture?.phase).toBe('graph');
    expect((json as { architecture?: { phase?: string; scopeDimensionsTracked?: number; capabilities?: { graphUnified?: boolean } } }).architecture?.capabilities?.graphUnified).toBe(true);
    expect((json as { architecture?: { phase?: string; scopeDimensionsTracked?: number; capabilities?: { graphUnified?: boolean } } }).architecture?.scopeDimensionsTracked).toBe(5);

    // Should be serializable without errors
    const serialized = JSON.stringify(json);
    const parsed = JSON.parse(serialized);
    expect(parsed.enabled).toBe(true);
  });

  it('T08b: toJSON when disabled returns minimal object', () => {
    process.env.SPECKIT_EXTENDED_TELEMETRY = 'false';
    const t = createTelemetry();
    const json = toJSON(t);

    expect(json.enabled).toBe(false);
    expect(json.latency).toBeUndefined();
    expect(json.mode).toBeUndefined();
  });

  // T09: Edge cases
  it('T09: handles results with only similarity (no score)', () => {
    const t = createEnabledTelemetry();
    recordQualityProxy(
      t,
      [{ similarity: 80 }, { similarity: 60 }],
      0,
      0,
    );

    expect(t.quality.topResultScore).toBe(0.8);
    expect(t.quality.avgRelevanceScore).toBeCloseTo(0.7, 4);
  });

  it('T09b: handles results with no score fields gracefully', () => {
    const t = createEnabledTelemetry();
    recordQualityProxy(t, [{}, {}], 0, 0);

    expect(t.quality.topResultScore).toBe(0);
    expect(t.quality.avgRelevanceScore).toBe(0);
    expect(t.quality.resultCount).toBe(2);
  });

  it('T09c: Infinity and NaN boostDelta handled', () => {
    const t = createEnabledTelemetry();
    recordQualityProxy(t, [{ score: 0.5 }], Infinity, 0);
    expect(t.quality.boostImpactDelta).toBe(0);

    recordQualityProxy(t, [{ score: 0.5 }], NaN, 0);
    expect(t.quality.boostImpactDelta).toBe(0);
  });

  // T10: Latency overwrite (stage re-recording)
  it('T10: re-recording a latency stage overwrites previous value', () => {
    const t = createEnabledTelemetry();
    recordLatency(t, 'candidateLatencyMs', 100);
    expect(t.latency.totalLatencyMs).toBe(100);

    recordLatency(t, 'candidateLatencyMs', 50);
    expect(t.latency.candidateLatencyMs).toBe(50);
    expect(t.latency.totalLatencyMs).toBe(50);
  });

  it('T10b: recordArchitecturePhase merges partial memory-roadmap updates', () => {
    const t = createEnabledTelemetry();

    recordArchitecturePhase(t, {
      phase: 'adaptive',
      capabilities: { adaptiveRanking: true },
      scopeDimensionsTracked: 6,
    });

    expect(t.architecture.phase).toBe('adaptive');
    expect(t.architecture.capabilities.adaptiveRanking).toBe(true);
    expect(t.architecture.capabilities.sharedMemory).toBe(false);
    expect(t.architecture.scopeDimensionsTracked).toBe(6);
  });

  // T11: Trace payload schema + serialization redaction
  it('T11: recordTracePayload stores canonical trace payload', () => {
    const t = createEnabledTelemetry();
    const accepted = recordTracePayload(t, {
      traceId: 'tr_abc123',
      query: 'sensitive query',
      sessionId: 'session-secret',
      stages: [
        {
          stage: 'candidate',
          timestamp: 1700000000000,
          inputCount: 100,
          outputCount: 25,
          durationMs: 8,
          metadata: { apiKey: 'secret' },
        },
      ],
      totalDurationMs: 8,
      finalResultCount: 25,
      token: 'sensitive-token',
    });

    expect(accepted).toBe(true);

    const json = toJSON(t as unknown as ReturnType<typeof createTelemetry>) as TelemetryJson;
    const tracePayload = expectPresent(json.tracePayload, 'Expected trace payload in telemetry JSON');
    expect(tracePayload.traceId).toBe('tr_abc123');
    expect(tracePayload.totalDurationMs).toBe(8);
    expect(tracePayload.finalResultCount).toBe(25);
    expect(tracePayload.query).toBeUndefined();
    expect(tracePayload.sessionId).toBeUndefined();
    expect(tracePayload.token).toBeUndefined();
    const firstStage = expectPresent(tracePayload.stages?.[0], 'Expected first trace stage');
    expect(firstStage.metadata).toBeUndefined();
  });

  it('T11b: toJSON excludes non-canonical telemetry fields', () => {
    const t = createEnabledTelemetry() as TelemetryWithExtras;

    t.mode.apiKey = 'secret';
    t.fallback.authorization = 'Bearer token';
    t.quality.password = 'should-not-leak';
    t.tracePayload = ({
      traceId: 'tr_clean',
      stages: [
        {
          stage: 'candidate',
          timestamp: 1,
          inputCount: 2,
          outputCount: 1,
          durationMs: 3,
          secret: 'hidden',
        },
      ],
      totalDurationMs: 3,
      finalResultCount: 1,
      apiKey: 'hidden',
    }) as unknown as Record<string, unknown>;

    const json = toJSON(t as unknown as ReturnType<typeof createTelemetry>) as TelemetryJson;
    const mode = expectPresent(json.mode, 'Expected mode payload');
    const fallback = expectPresent(json.fallback, 'Expected fallback payload');
    const quality = expectPresent(json.quality, 'Expected quality payload');
    const tracePayload = expectPresent(json.tracePayload, 'Expected trace payload in telemetry JSON');
    const firstStage = expectPresent(tracePayload.stages?.[0], 'Expected first trace stage');

    expect(mode.apiKey).toBeUndefined();
    expect(fallback.authorization).toBeUndefined();
    expect(quality.password).toBeUndefined();
    expect(tracePayload.apiKey).toBeUndefined();
    expect(firstStage.secret).toBeUndefined();
  });

  it('T11c: invalid trace payload is rejected and omitted', () => {
    const t = createEnabledTelemetry();
    const accepted = recordTracePayload(t, {
      traceId: 'tr_invalid',
      stages: [
        {
          stage: 'invalid-stage',
          timestamp: 1,
          inputCount: 1,
          outputCount: 1,
          durationMs: 1,
        },
      ],
    });

    expect(accepted).toBe(false);

    const json = toJSON(t) as TelemetryJson;
    expect(json.tracePayload).toBeUndefined();
  });

  it('T12: transition diagnostics serialize the spec contract', () => {
    const t = createEnabledTelemetry();
    recordTransitionDiagnostics(t, {
      previousState: null,
      currentState: 'focused',
      confidence: 0.85,
      signalSources: ['intent-classifier'],
      reason: 'intent classifier selected focused mode',
    });

    const json = toJSON(t) as TelemetryJson;
    expect(json.transitionDiagnostics).toEqual({
      previousState: null,
      currentState: 'focused',
      confidence: 0.85,
      signalSources: ['intent-classifier'],
      reason: 'intent classifier selected focused mode',
    });
  });

  it('T12b: graph-walk diagnostics serialize bounded rollout metrics', () => {
    const t = createEnabledTelemetry();
    recordGraphWalkDiagnostics(t, {
      rolloutState: 'bounded_runtime',
      rowsWithGraphContribution: 3,
      rowsWithAppliedBonus: 2,
      capAppliedCount: 0,
      maxRaw: 2.5,
      maxNormalized: 1,
      maxAppliedBonus: 0.03,
    });

    const json = toJSON(t) as TelemetryJson;
    expect(json.graphWalkDiagnostics).toEqual({
      rolloutState: 'bounded_runtime',
      rowsWithGraphContribution: 3,
      rowsWithAppliedBonus: 2,
      capAppliedCount: 0,
      maxRaw: 2.5,
      maxNormalized: 1,
      maxAppliedBonus: 0.03,
    });
  });

  it('T12c: lifecycle forecast diagnostics clamp and serialize ingest telemetry', () => {
    const t = createEnabledTelemetry();
    recordLifecycleForecastDiagnostics(
      t,
      {
        etaSeconds: 45,
        etaConfidence: 1.5,
        failureRisk: -1,
        riskSignals: ['queue_backlog', 7, null],
        caveat: 'eta derived from moving average',
      },
      {
        state: 'indexing',
        progress: 101,
        filesProcessed: 3.8,
        filesTotal: 8.2,
      },
    );

    const json = toJSON(t) as TelemetryJson;
    expect(json.lifecycleForecastDiagnostics).toEqual({
      state: 'indexing',
      progress: 100,
      filesProcessed: 3,
      filesTotal: 8,
      etaSeconds: 45,
      etaConfidence: 1,
      failureRisk: 0,
      riskSignals: ['queue_backlog'],
      caveat: 'eta derived from moving average',
    });
  });
});
