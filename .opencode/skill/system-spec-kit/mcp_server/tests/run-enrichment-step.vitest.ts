import { afterEach, describe, expect, it, vi } from 'vitest';

import { runEnrichmentStep } from '../handlers/save/post-insert.js';

describe('runEnrichmentStep', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns feature_disabled when the step is disabled without a custom skip reason', async () => {
    await expect(
      runEnrichmentStep(
        'entityExtraction',
        () => false,
        async () => ({ stored: 1 }),
        () => ({ status: 'ran' }),
      ),
    ).resolves.toEqual({
      status: 'skipped',
      reason: 'feature_disabled',
    });
  });

  it('returns the provided skip reason when the step is disabled', async () => {
    await expect(
      runEnrichmentStep(
        'entityLinking',
        () => false,
        async () => ({ linksCreated: 0 }),
        () => ({ status: 'ran' }),
        { skipReason: 'extraction_not_ran' },
      ),
    ).resolves.toEqual({
      status: 'skipped',
      reason: 'extraction_not_ran',
    });
  });

  it('returns the success handler result when the runner succeeds', async () => {
    const runner = vi.fn(async () => ({ unresolved: 2 }));
    const successHandler = vi.fn((result: { unresolved: number }) => ({
      status: 'partial' as const,
      reason: 'partial_causal_link_unresolved' as const,
      warnings: [`${result.unresolved} unresolved`],
    }));

    const result = await runEnrichmentStep(
      'causalLinks',
      () => true,
      runner,
      successHandler,
      { skipReason: 'nothing_to_do' },
    );

    expect(result).toEqual({
      status: 'partial',
      reason: 'partial_causal_link_unresolved',
      warnings: ['2 unresolved'],
    });
    expect(runner).toHaveBeenCalledOnce();
    expect(successHandler).toHaveBeenCalledWith({ unresolved: 2 });
  });

  it('maps Error throws to the step failure reason and logs the failure', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await runEnrichmentStep(
      'entityExtraction',
      () => true,
      async () => {
        throw new Error('entity boom');
      },
      () => ({ status: 'ran' }),
    );

    expect(result).toEqual({
      status: 'failed',
      reason: 'entity_extraction_exception',
      warnings: ['entity boom'],
    });
    expect(warnSpy).toHaveBeenCalledWith(
      '[memory-save] R10 entity extraction failed: entity boom',
    );
  });

  it('stringifies non-Error throws in warnings', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await runEnrichmentStep(
      'summaries',
      () => true,
      async () => {
        throw 'summary boom';
      },
      () => ({ status: 'ran' }),
    );

    expect(result).toEqual({
      status: 'failed',
      reason: 'summary_exception',
      warnings: ['summary boom'],
    });
    expect(warnSpy).toHaveBeenCalledWith(
      '[memory-save] R8 summary generation failed: summary boom',
    );
  });

  it('uses the graph lifecycle failure mapping for graph refresh exceptions', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await runEnrichmentStep(
      'graphLifecycle',
      () => true,
      async () => {
        throw new Error('graph boom');
      },
      () => ({ status: 'ran' }),
    );

    expect(result).toEqual({
      status: 'failed',
      reason: 'graph_lifecycle_exception',
      warnings: ['graph boom'],
    });
    expect(warnSpy).toHaveBeenCalledWith(
      '[memory-save] D3 graph-lifecycle enrichment failed: graph boom',
    );
  });
});
