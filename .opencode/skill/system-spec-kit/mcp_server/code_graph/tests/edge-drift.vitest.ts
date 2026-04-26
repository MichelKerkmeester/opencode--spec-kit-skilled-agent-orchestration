import { describe, expect, it } from 'vitest';

import {
  EDGE_DRIFT_JSD_THRESHOLD,
  EDGE_DRIFT_PSI_THRESHOLD,
  EDGE_DRIFT_SHARE_THRESHOLD,
  buildEdgeDistribution,
  computeEdgeShare,
  computeJSD,
  computePSI,
  type EdgeDistribution,
} from '../lib/edge-drift.js';

function isFlagged(currentShare: EdgeDistribution, baselineShare: EdgeDistribution): boolean {
  const shareDrift = (Object.keys(currentShare) as Array<keyof EdgeDistribution>).map((edgeType) => (
    Math.abs(currentShare[edgeType] - baselineShare[edgeType])
  ));
  const psi = computePSI(currentShare, baselineShare);
  const jsd = computeJSD(currentShare, baselineShare);
  const maxShareDrift = shareDrift.reduce((max, value) => Math.max(max, value), 0);

  return psi >= EDGE_DRIFT_PSI_THRESHOLD
    || jsd >= EDGE_DRIFT_JSD_THRESHOLD
    || maxShareDrift >= EDGE_DRIFT_SHARE_THRESHOLD;
}

describe('edge-drift', () => {
  it('returns zero PSI and JSD for identical edge distributions', () => {
    const baseline = buildEdgeDistribution({
      CALLS: 3,
      IMPORTS: 1,
      EXPORTS: 2,
    });
    const observed = buildEdgeDistribution({
      CALLS: 3,
      IMPORTS: 1,
      EXPORTS: 2,
    });

    expect(computePSI(observed, baseline)).toBeCloseTo(0, 12);
    expect(computeJSD(observed, baseline)).toBeCloseTo(0, 12);
  });

  it('flags a 30% single-edge-type share drift and pushes PSI above the threshold', () => {
    const baseline = computeEdgeShare(buildEdgeDistribution({
      CALLS: 5,
      IMPORTS: 5,
    }));
    const observed = computeEdgeShare(buildEdgeDistribution({
      CALLS: 8,
      IMPORTS: 2,
    }));

    expect(observed.CALLS - baseline.CALLS).toBeCloseTo(0.3);
    expect(computePSI(observed, baseline)).toBeGreaterThan(EDGE_DRIFT_PSI_THRESHOLD);
    expect(isFlagged(observed, baseline)).toBe(true);
  });

  it('keeps missing edge types at zero share and still computes finite divergence values', () => {
    const baseline = computeEdgeShare(buildEdgeDistribution({
      IMPORTS: 4,
    }));
    const observed = computeEdgeShare(buildEdgeDistribution({
      CALLS: 2,
    }));

    expect(baseline.CALLS).toBe(0);
    expect(observed.IMPORTS).toBe(0);
    expect(Number.isFinite(computePSI(observed, baseline))).toBe(true);
    expect(Number.isFinite(computeJSD(observed, baseline))).toBe(true);
  });

  it('does not flag minor distribution movement when all thresholds stay below the cutoff', () => {
    const baseline = computeEdgeShare(buildEdgeDistribution({
      CALLS: 51,
      IMPORTS: 49,
    }));
    const observed = computeEdgeShare(buildEdgeDistribution({
      CALLS: 50,
      IMPORTS: 50,
    }));

    expect(computePSI(observed, baseline)).toBeLessThan(EDGE_DRIFT_PSI_THRESHOLD);
    expect(computeJSD(observed, baseline)).toBeLessThan(EDGE_DRIFT_JSD_THRESHOLD);
    expect(isFlagged(observed, baseline)).toBe(false);
  });
});
