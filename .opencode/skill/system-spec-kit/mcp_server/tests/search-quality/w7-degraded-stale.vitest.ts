import { describe, expect, it } from 'vitest';

import { runMeasurement } from './measurement-fixtures.js';

describe('W7 stale code-graph readiness stress cell', () => {
  it('preserves harness metrics for stale fallback envelopes', async () => {
    const measurement = await runMeasurement({ workstream: 'W7', variant: 'variant' });
    const testCase = measurement.cases.find((item) => item.caseId === 'w7-code-graph-stale');

    expect(testCase?.citationPolicy.passed).toBe(true);
    expect(testCase?.finalRelevance.recallAt3).toBe(1);
  });
});
