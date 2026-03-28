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

describe('stage2b enrichment extended coverage', () => {
  beforeEach(() => {
    hoisted.anchorMock.mockReset();
    hoisted.validationMock.mockReset();
    hoisted.anchorMock.mockImplementation((rows: unknown[]) => rows);
    hoisted.validationMock.mockImplementation((rows: unknown[]) => rows);
    vi.restoreAllMocks();
  });

  it('fails open when both enrichment steps throw', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rows = [{ id: 11, score: 0.42 }] as never;

    hoisted.anchorMock.mockImplementation(() => {
      throw new Error('anchor failed');
    });
    hoisted.validationMock.mockImplementation(() => {
      throw new Error('validation failed');
    });

    expect(executeStage2bEnrichment(rows)).toEqual(rows);
    expect(warnSpy).toHaveBeenNthCalledWith(
      1,
      '[stage2b-enrichment] anchor metadata enrichment failed: anchor failed'
    );
    expect(warnSpy).toHaveBeenNthCalledWith(
      2,
      '[stage2b-enrichment] validation metadata enrichment failed: validation failed'
    );
  });

  it('handles empty input array', () => {
    expect(executeStage2bEnrichment([])).toEqual([]);
    expect(hoisted.anchorMock).toHaveBeenCalledWith([]);
    expect(hoisted.validationMock).toHaveBeenCalledWith([]);
  });

  it('handles input with missing optional fields', () => {
    const rows = [{ id: 21 }, { path: 'memory/example.md' }] as never;

    expect(executeStage2bEnrichment(rows)).toEqual(rows);
  });
});
