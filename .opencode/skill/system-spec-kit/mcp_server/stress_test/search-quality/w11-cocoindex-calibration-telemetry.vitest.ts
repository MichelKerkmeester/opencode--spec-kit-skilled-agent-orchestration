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
      env: { SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH: 'false' } as NodeJS.ProcessEnv,
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
});
