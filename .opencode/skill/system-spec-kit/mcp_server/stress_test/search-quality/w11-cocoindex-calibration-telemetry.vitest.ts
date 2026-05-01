// ───────────────────────────────────────────────────────────────
// MODULE: W11 CocoIndex Calibration Telemetry Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises recommended overfetch telemetry without changing live routing.

import { describe, expect, it } from 'vitest';

import { createEmptyQueryPlan } from '../../lib/query/query-plan.js';
import { calibrateCocoIndexOverfetch } from '../../lib/search/cocoindex-calibration.js';
import { buildSearchDecisionEnvelope } from '../../lib/search/search-decision-envelope.js';

describe('W11 CocoIndex calibration telemetry', () => {
  it('emits recommended multiplier into the envelope without applying adaptive overfetch', () => {
    const telemetry = calibrateCocoIndexOverfetch({
      requestedLimit: 3,
      tenantId: 'tenant-a',
      candidates: [
        { filePath: 'src/a.ts', pathClass: 'runtime' },
        { filePath: 'src/a.ts', pathClass: 'runtime' },
        { filePath: 'src/a.ts', pathClass: 'runtime' },
        { filePath: 'src/b.ts', pathClass: 'runtime' },
      ],
      env: { SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH: 'false' },
    });

    const envelope = buildSearchDecisionEnvelope({
      requestId: 'w11',
      queryPlan: createEmptyQueryPlan(),
      cocoindexCalibration: telemetry,
      timestamp: '2026-04-29T00:00:00.000Z',
    });

    expect(telemetry.adaptiveOverfetchApplied).toBe(false);
    expect(telemetry.effectiveLimit).toBe(3);
    expect(telemetry.scope?.tenantId).toBe('tenant-a');
    expect(envelope.cocoindexCalibration?.recommendedMultiplier).toBe(4);
  });

  // F-011-C1-04: graduated-overfetch flag. The new
  // SPECKIT_COCOINDEX_GRADUATED_OVERFETCH flag promotes the adaptive overfetch
  // recommendation from telemetry-only to a live 2x multiplier (conservative
  // bridge — the existing 4x adaptive flag still wins when both are set).
  // CI / default-OFF behavior is unchanged.
  it('applies graduated 2x multiplier when SPECKIT_COCOINDEX_GRADUATED_OVERFETCH=1 and duplicate density >= 0.35 (F-011-C1-04)', () => {
    const telemetry = calibrateCocoIndexOverfetch({
      requestedLimit: 5,
      candidates: [
        { filePath: 'src/a.ts', pathClass: 'runtime' },
        { filePath: 'src/a.ts', pathClass: 'runtime' },
        { filePath: 'src/b.ts', pathClass: 'runtime' },
        { filePath: 'src/b.ts', pathClass: 'runtime' },
      ],
      env: { SPECKIT_COCOINDEX_GRADUATED_OVERFETCH: '1' },
    });

    expect(telemetry.adaptiveOverfetchApplied).toBe(false);
    expect(telemetry.graduatedOverfetchApplied).toBe(true);
    expect(telemetry.overfetchMultiplier).toBe(2);
    expect(telemetry.effectiveLimit).toBe(10);
  });

  it('graduated flag is a no-op when duplicate density is below the threshold', () => {
    const telemetry = calibrateCocoIndexOverfetch({
      requestedLimit: 5,
      candidates: [
        { filePath: 'src/a.ts', pathClass: 'runtime' },
        { filePath: 'src/b.ts', pathClass: 'runtime' },
        { filePath: 'src/c.ts', pathClass: 'runtime' },
        { filePath: 'src/d.ts', pathClass: 'runtime' },
      ],
      env: { SPECKIT_COCOINDEX_GRADUATED_OVERFETCH: '1' },
    });

    expect(telemetry.duplicateDensity).toBe(0);
    expect(telemetry.graduatedOverfetchApplied).toBe(false);
    expect(telemetry.overfetchMultiplier).toBe(1);
  });

  it('adaptive 4x flag wins when both flags are set (graduated 2x is suppressed)', () => {
    const telemetry = calibrateCocoIndexOverfetch({
      requestedLimit: 5,
      candidates: [
        { filePath: 'src/a.ts', pathClass: 'runtime' },
        { filePath: 'src/a.ts', pathClass: 'runtime' },
        { filePath: 'src/b.ts', pathClass: 'runtime' },
        { filePath: 'src/b.ts', pathClass: 'runtime' },
      ],
      env: {
        SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH: '1',
        SPECKIT_COCOINDEX_GRADUATED_OVERFETCH: '1',
      },
    });

    expect(telemetry.adaptiveOverfetchApplied).toBe(true);
    expect(telemetry.graduatedOverfetchApplied).toBe(false);
    expect(telemetry.overfetchMultiplier).toBe(4);
    expect(telemetry.effectiveLimit).toBe(20);
  });

  it('graduated flag default OFF preserves CI behavior (no behavior change without opt-in)', () => {
    const telemetry = calibrateCocoIndexOverfetch({
      requestedLimit: 5,
      candidates: [
        { filePath: 'src/a.ts', pathClass: 'runtime' },
        { filePath: 'src/a.ts', pathClass: 'runtime' },
        { filePath: 'src/b.ts', pathClass: 'runtime' },
        { filePath: 'src/b.ts', pathClass: 'runtime' },
      ],
      env: {},
    });

    expect(telemetry.adaptiveOverfetchApplied).toBe(false);
    expect(telemetry.graduatedOverfetchApplied).toBe(false);
    expect(telemetry.overfetchMultiplier).toBe(1);
    expect(telemetry.effectiveLimit).toBe(5);
  });
});
