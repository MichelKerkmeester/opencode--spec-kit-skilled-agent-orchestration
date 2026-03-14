import { describe, expect, it, afterEach } from 'vitest';

import {
  compareDeterministicRows,
  sortDeterministicRows,
} from '../lib/search/pipeline/ranking-contract';
import { createUnifiedGraphSearchFn } from '../lib/search/graph-search-fn';
import {
  createTelemetry,
  recordAdaptiveEvaluation,
  recordGraphHealth,
  recordTracePayload,
  sampleTracePayloads,
  summarizeGraphHealthDashboard,
  toJSON,
} from '../lib/telemetry/retrieval-telemetry';

describe('Phase 3 graph roadmap finalization', () => {
  afterEach(() => {
    delete process.env.SPECKIT_EXTENDED_TELEMETRY;
  });

  it('uses deterministic ordering for equal-score rows', () => {
    const rows = sortDeterministicRows([
      { id: 7, score: 0.9, similarity: 80 },
      { id: 3, score: 0.9, similarity: 80 },
      { id: 5, score: 0.9, similarity: 81 },
    ]);

    expect(rows.map((row) => row.id)).toEqual([5, 3, 7]);
    expect(compareDeterministicRows(
      { id: 9, score: 0.6, similarity: 50 },
      { id: 4, score: 0.6, similarity: 50 },
    )).toBeGreaterThan(0);
  });

  it('serializes graph-health and adaptive telemetry contracts', () => {
    process.env.SPECKIT_EXTENDED_TELEMETRY = 'true';
    const telemetry = createTelemetry();

    recordGraphHealth(telemetry, {
      killSwitchActive: true,
      causalBoosted: 2,
      coActivationBoosted: 1,
      communityInjected: 3,
      graphSignalsBoosted: 4,
      totalGraphInjected: 5,
    });
    recordAdaptiveEvaluation(telemetry, {
      mode: 'shadow',
      promotedCount: 2,
      demotedCount: 1,
      bounded: true,
      maxDeltaApplied: 0.08,
    });

    const payload = toJSON(telemetry);
    expect(payload.graphHealth).toEqual({
      killSwitchActive: true,
      causalBoosted: 2,
      coActivationBoosted: 1,
      communityInjected: 3,
      graphSignalsBoosted: 4,
      totalGraphInjected: 5,
    });
    expect(payload.adaptive).toEqual({
      mode: 'shadow',
      promotedCount: 2,
      demotedCount: 1,
      bounded: true,
      maxDeltaApplied: 0.08,
    });
  });

  it('summarizes graph-health dashboard metrics across telemetry payloads', () => {
    process.env.SPECKIT_EXTENDED_TELEMETRY = 'true';

    const first = createTelemetry();
    first.timestamp = '2026-03-14T10:00:00.000Z';
    recordGraphHealth(first, {
      killSwitchActive: true,
      causalBoosted: 2,
      coActivationBoosted: 1,
      communityInjected: 3,
      graphSignalsBoosted: 4,
      totalGraphInjected: 5,
    });

    const second = createTelemetry();
    second.timestamp = '2026-03-14T10:05:00.000Z';
    recordGraphHealth(second, {
      killSwitchActive: false,
      causalBoosted: 1,
      coActivationBoosted: 2,
      communityInjected: 0,
      graphSignalsBoosted: 1,
      totalGraphInjected: 2,
    });

    const summary = summarizeGraphHealthDashboard([
      toJSON(first),
      toJSON(second),
      { enabled: true, timestamp: '2026-03-14T10:10:00.000Z' },
    ]);

    expect(summary).toEqual({
      totalPayloads: 3,
      payloadsWithGraphHealth: 2,
      killSwitchActiveCount: 1,
      averageGraphInjected: 3.5,
      maxGraphInjected: 5,
      causalBoostedTotal: 3,
      coActivationBoostedTotal: 3,
      communityInjectedTotal: 3,
      graphSignalsBoostedTotal: 5,
    });
  });

  it('samples sanitized trace payloads using graph-health thresholds', () => {
    process.env.SPECKIT_EXTENDED_TELEMETRY = 'true';

    const highGraph = createTelemetry();
    highGraph.timestamp = '2026-03-14T10:06:00.000Z';
    recordGraphHealth(highGraph, {
      killSwitchActive: true,
      totalGraphInjected: 6,
      graphSignalsBoosted: 3,
    });
    recordTracePayload(highGraph, {
      traceId: 'trace-high',
      totalDurationMs: 24,
      finalResultCount: 3,
      stages: [
        { stage: 'candidate', timestamp: 1, inputCount: 8, outputCount: 5, durationMs: 10 },
        { stage: 'final-rank', timestamp: 2, inputCount: 5, outputCount: 3, durationMs: 14 },
      ],
      ignoredField: 'drop-me',
    });

    const recentLowGraph = createTelemetry();
    recentLowGraph.timestamp = '2026-03-14T10:07:00.000Z';
    recordGraphHealth(recentLowGraph, {
      killSwitchActive: false,
      totalGraphInjected: 2,
    });
    recordTracePayload(recentLowGraph, {
      traceId: 'trace-low',
      totalDurationMs: 12,
      finalResultCount: 2,
      stages: [
        { stage: 'candidate', timestamp: 1, inputCount: 4, outputCount: 2, durationMs: 12 },
      ],
    });

    const noTrace = createTelemetry();
    noTrace.timestamp = '2026-03-14T10:08:00.000Z';
    recordGraphHealth(noTrace, {
      killSwitchActive: true,
      totalGraphInjected: 9,
    });

    const sampled = sampleTracePayloads(
      [toJSON(recentLowGraph), toJSON(noTrace), toJSON(highGraph)],
      { limit: 2, minGraphInjected: 2, killSwitchOnly: true },
    );

    expect(sampled).toHaveLength(1);
    expect(sampled[0]).toEqual({
      timestamp: '2026-03-14T10:06:00.000Z',
      graphHealth: {
        killSwitchActive: true,
        causalBoosted: 0,
        coActivationBoosted: 0,
        communityInjected: 0,
        graphSignalsBoosted: 3,
        totalGraphInjected: 6,
      },
      tracePayload: {
        traceId: 'trace-high',
        totalDurationMs: 24,
        finalResultCount: 3,
        stages: [
          { stage: 'candidate', timestamp: 1, inputCount: 8, outputCount: 5, durationMs: 10 },
          { stage: 'final-rank', timestamp: 2, inputCount: 5, outputCount: 3, durationMs: 14 },
        ],
      },
    });
  });

  it('keeps unified graph retrieval within a local microbenchmark budget', () => {
    const graphRows = Array.from({ length: 12 }, (_value, index) => ({
      id: `edge-${index + 1}`,
      source_id: String(index + 1),
      target_id: String(index + 101),
      relation: 'supports',
      strength: 0.75,
    }));
    const mockDb = {
      prepare(sql: string) {
        if (sql.includes("name='memory_fts'")) {
          return { get: () => undefined };
        }
        return { all: () => graphRows };
      },
    } as unknown as import('better-sqlite3').Database;

    const searchFn = createUnifiedGraphSearchFn(mockDb);
    const start = performance.now();
    for (let index = 0; index < 250; index += 1) {
      const results = searchFn('graph latency probe', { limit: 10 });
      expect(results.length).toBeGreaterThan(0);
    }
    const elapsedMs = performance.now() - start;

    expect(elapsedMs).toBeLessThan(150);
  });
});
