import { describe, expect, it } from 'vitest';

import type { GraphReadinessSnapshot } from '../code_graph/lib/ensure-ready.js';
import { mapGraphReadinessToTelemetry } from '../lib/search/graph-readiness-mapper.js';

function snapshot(
  freshness: GraphReadinessSnapshot['freshness'],
): GraphReadinessSnapshot {
  return {
    freshness,
    action: freshness === 'fresh' ? 'none' : 'full_scan',
    reason: `fixture ${freshness}`,
  };
}

describe('mapGraphReadinessToTelemetry', () => {
  it('TC-1 maps fresh snapshots as not degraded', () => {
    expect(mapGraphReadinessToTelemetry(snapshot('fresh'))).toMatchObject({
      freshness: 'fresh',
      action: 'none',
      reason: 'fixture fresh',
      degraded: false,
    });
  });

  it('TC-2 maps stale snapshots as degraded', () => {
    expect(mapGraphReadinessToTelemetry(snapshot('stale'))).toMatchObject({
      freshness: 'stale',
      degraded: true,
    });
  });

  it('TC-3 maps empty snapshots as degraded', () => {
    expect(mapGraphReadinessToTelemetry(snapshot('empty'))).toMatchObject({
      freshness: 'empty',
      degraded: true,
    });
  });

  it('TC-4 maps error snapshots as degraded', () => {
    expect(mapGraphReadinessToTelemetry(snapshot('error'))).toMatchObject({
      freshness: 'error',
      degraded: true,
    });
  });
});

