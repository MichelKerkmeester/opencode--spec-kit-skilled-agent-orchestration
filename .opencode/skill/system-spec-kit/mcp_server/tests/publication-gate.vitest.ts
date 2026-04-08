import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { evaluatePublicationGate } from '../lib/context/publication-gate.js';

const VALID_ROW = {
  certainty: 'exact' as const,
  methodologyStatus: 'published' as const,
  schemaVersion: 'measurement-contract/v1',
  provenance: ['eval_metric_snapshots', 'normalized_reader'],
};

describe('publication gate contract', () => {
  it('marks rows publishable when certainty and publication metadata are complete', () => {
    expect(evaluatePublicationGate(VALID_ROW)).toEqual({ publishable: true });
  });

  it('excludes rows missing methodology status', () => {
    expect(evaluatePublicationGate({
      ...VALID_ROW,
      methodologyStatus: undefined,
    })).toEqual({
      publishable: false,
      exclusionReason: 'missing_methodology',
    });
  });

  it('excludes rows missing schema version', () => {
    expect(evaluatePublicationGate({
      ...VALID_ROW,
      schemaVersion: '   ',
    })).toEqual({
      publishable: false,
      exclusionReason: 'missing_schema_version',
    });
  });

  it('excludes rows missing provenance', () => {
    expect(evaluatePublicationGate({
      ...VALID_ROW,
      provenance: [],
    })).toEqual({
      publishable: false,
      exclusionReason: 'missing_provenance',
    });
  });

  it('rejects rows that do not use packet 005 certainty values', () => {
    expect(evaluatePublicationGate({
      ...VALID_ROW,
      certainty: 'high',
    })).toEqual({
      publishable: false,
      exclusionReason: 'unsupported_certainty',
    });
  });
});

describe('publication gate multiplier contract', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.doUnmock('../lib/context/shared-payload.js');
  });

  it('delegates multiplier publication checks to packet 005 canPublishMultiplier()', async () => {
    const canPublishMultiplier = vi.fn(() => false);

    vi.doMock('../lib/context/shared-payload.js', async () => {
      const actual = await vi.importActual<typeof import('../lib/context/shared-payload.js')>(
        '../lib/context/shared-payload.js',
      );

      return {
        ...actual,
        canPublishMultiplier,
      };
    });

    const { evaluatePublicationGate: evaluatePublicationGateWithMock } = await import(
      '../lib/context/publication-gate.js'
    );

    const multiplierAuthorityFields = {
      promptTokens: { certainty: 'exact' as const, authority: 'provider_counted' as const },
      completionTokens: { certainty: 'exact' as const, authority: 'provider_counted' as const },
      cacheReadTokens: { certainty: 'exact' as const, authority: 'provider_counted' as const },
      cacheWriteTokens: { certainty: 'exact' as const, authority: 'provider_counted' as const },
    };

    expect(evaluatePublicationGateWithMock({
      ...VALID_ROW,
      multiplierAuthorityFields,
    })).toEqual({
      publishable: false,
      exclusionReason: 'unsupported_certainty',
    });
    expect(canPublishMultiplier).toHaveBeenCalledWith(multiplierAuthorityFields);
  });
});
