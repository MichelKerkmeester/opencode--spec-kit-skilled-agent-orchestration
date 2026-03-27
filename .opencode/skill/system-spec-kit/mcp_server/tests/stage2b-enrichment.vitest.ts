import { beforeEach, describe, expect, it, vi } from 'vitest';

const hoisted = vi.hoisted(() => ({
  anchorMock: vi.fn((rows: unknown[]) => rows),
  validationMock: vi.fn((rows: unknown[]) => rows),
}));

vi.mock('../lib/search/anchor-metadata', () => ({
  enrichResultsWithAnchorMetadata: hoisted.anchorMock,
}));

vi.mock('../lib/search/validation-metadata', () => ({
  enrichResultsWithValidationMetadata: hoisted.validationMock,
}));

import { executeStage2bEnrichment } from '../lib/search/pipeline/stage2b-enrichment';

describe('stage2b enrichment fail-open behavior', () => {
  beforeEach(() => {
    hoisted.anchorMock.mockReset();
    hoisted.validationMock.mockReset();
    hoisted.anchorMock.mockImplementation((rows: unknown[]) => rows);
    hoisted.validationMock.mockImplementation((rows: unknown[]) => rows);
    vi.restoreAllMocks();
  });

  it('returns enriched rows when both enrichment steps succeed', () => {
    hoisted.anchorMock.mockImplementation((rows: Array<Record<string, unknown>>) =>
      rows.map((row) => ({ ...row, anchorMetadata: [{ id: 'state', type: 'state' }] }))
    );
    hoisted.validationMock.mockImplementation((rows: Array<Record<string, unknown>>) =>
      rows.map((row) => ({ ...row, validationMetadata: { level: 3 } }))
    );

    const results = executeStage2bEnrichment([{ id: 1, score: 0.8 } as never]);

    expect(results).toEqual([
      {
        id: 1,
        score: 0.8,
        anchorMetadata: [{ id: 'state', type: 'state' }],
        validationMetadata: { level: 3 },
      },
    ]);
  });

  it('fails open when anchor enrichment throws and still applies validation enrichment', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    hoisted.anchorMock.mockImplementation(() => {
      throw new Error('anchor exploded');
    });
    hoisted.validationMock.mockImplementation((rows: Array<Record<string, unknown>>) =>
      rows.map((row) => ({ ...row, validationMetadata: { passed: true } }))
    );

    const results = executeStage2bEnrichment([{ id: 7, score: 0.7 } as never]);

    expect(results).toEqual([{ id: 7, score: 0.7, validationMetadata: { passed: true } }]);
    expect(hoisted.validationMock).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith('[stage2b-enrichment] anchor metadata enrichment failed: anchor exploded');
  });

  it('fails open when validation enrichment throws and preserves anchor-enriched rows', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    hoisted.anchorMock.mockImplementation((rows: Array<Record<string, unknown>>) =>
      rows.map((row) => ({ ...row, anchorMetadata: [{ id: 'summary', type: 'summary' }] }))
    );
    hoisted.validationMock.mockImplementation(() => {
      throw new Error('validation exploded');
    });

    const results = executeStage2bEnrichment([{ id: 8, score: 0.6 } as never]);

    expect(results).toEqual([
      { id: 8, score: 0.6, anchorMetadata: [{ id: 'summary', type: 'summary' }] },
    ]);
    expect(warnSpy).toHaveBeenCalledWith('[stage2b-enrichment] validation metadata enrichment failed: validation exploded');
  });
});
