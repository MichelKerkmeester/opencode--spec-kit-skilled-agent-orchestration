import { describe, expect, it } from 'vitest';

import { runMeasurement } from './measurement-fixtures.js';

// Fixture-only supplement. Real degraded code-graph behavior is covered by
// w10-degraded-readiness-integration.vitest.ts.
describe('W7 unavailable code-graph readiness stress cell', () => {
  it('preserves harness metrics for unavailable rg fallback envelopes', async () => {
    const measurement = await runMeasurement({ workstream: 'W7', variant: 'variant' });
    const testCase = measurement.cases.find((item) => item.caseId === 'w7-code-graph-unavailable');

    expect(testCase?.citationPolicy.passed).toBe(true);
    expect(testCase?.finalRelevance.recallAt3).toBe(1);
  });
});
