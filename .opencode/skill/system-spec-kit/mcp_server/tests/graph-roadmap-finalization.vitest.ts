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
