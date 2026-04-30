// ───────────────────────────────────────────────────────────────
// MODULE: W6 CocoIndex Calibration Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises duplicate-density calibration and duplicate-heavy quality deltas.

import { describe, expect, it } from 'vitest';

import { calibrateCocoIndexOverfetch } from '../../lib/search/cocoindex-calibration.js';
import { runMeasurement } from './measurement-fixtures.js';

describe('W6 CocoIndex overfetch and path-class calibration', () => {
  it('reports duplicate density and applies 4x overfetch only when flagged', () => {
    const candidates = [
      { filePath: 'specs/system/spec.md', pathClass: 'spec' },
      { filePath: 'specs/system/spec.md', pathClass: 'spec' },
      { filePath: 'mcp_server/lib/search/pipeline.ts', pathClass: 'runtime' },
      { filePath: 'mcp_server/lib/search/pipeline.ts', pathClass: 'runtime' },
    ];

    expect(calibrateCocoIndexOverfetch({
      requestedLimit: 5,
      candidates,
      env: {},
    })).toMatchObject({
      requestedLimit: 5,
      effectiveLimit: 5,
      duplicateDensity: 0.5,
      adaptiveOverfetchApplied: false,
    });

    expect(calibrateCocoIndexOverfetch({
      requestedLimit: 5,
      candidates,
      env: { SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH: '1' },
    })).toMatchObject({
      requestedLimit: 5,
      effectiveLimit: 20,
      duplicateDensity: 0.5,
      adaptiveOverfetchApplied: true,
      overfetchMultiplier: 4,
    });
  });

  it('improves duplicate-heavy precision in the variant fixture', async () => {
    const baseline = await runMeasurement({ workstream: 'W6', variant: 'baseline' });
    const variant = await runMeasurement({ workstream: 'W6', variant: 'variant' });

    expect(variant.summary.precisionAt3).toBeGreaterThan(baseline.summary.precisionAt3);
    expect(variant.summary.recallAt3).toBeGreaterThanOrEqual(baseline.summary.recallAt3);
  });
});
