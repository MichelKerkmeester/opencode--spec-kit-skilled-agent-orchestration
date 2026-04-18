import { afterEach, describe, expect, it, vi } from 'vitest';

import { clearAllBudgets } from '../lib/enrichment/retry-budget.js';

function collectRetryTelemetry(warnSpy: ReturnType<typeof vi.spyOn>): Array<Record<string, unknown>> {
  return warnSpy.mock.calls
    .map((call) => call[0])
    .filter((value): value is string => typeof value === 'string' && value.startsWith('{'))
    .map((value) => JSON.parse(value) as Record<string, unknown>)
    .filter((record) => record.event === 'retry_attempt');
}

describe('retry-budget telemetry', () => {
  afterEach(() => {
    clearAllBudgets();
    vi.doUnmock('../handlers/causal-links-processor.js');
    vi.doUnmock('../lib/search/search-flags');
    vi.doUnmock('../lib/search/search-flags.js');
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('emits a structured retry_attempt event when unresolved causal links are requeued', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.doMock('../handlers/causal-links-processor.js', () => ({
      processCausalLinks: vi.fn(() => ({
        processed: 1,
        inserted: 0,
        resolved: 0,
        unresolved: [{ type: 'memory', reference: 'missing-target' }],
        errors: [],
      })),
    }));
    vi.doMock('../lib/search/search-flags', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../lib/search/search-flags')>();
      return {
        ...actual,
        isAutoEntitiesEnabled: vi.fn(() => false),
        isEntityLinkingEnabled: vi.fn(() => false),
        isMemorySummariesEnabled: vi.fn(() => false),
        isPostInsertEnrichmentEnabled: vi.fn(() => true),
        isGraphRefreshEnabled: vi.fn(() => false),
      };
    });
    vi.doMock('../lib/search/search-flags.js', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../lib/search/search-flags.js')>();
      return {
        ...actual,
        isAutoEntitiesEnabled: vi.fn(() => false),
        isEntityLinkingEnabled: vi.fn(() => false),
        isMemorySummariesEnabled: vi.fn(() => false),
        isPostInsertEnrichmentEnabled: vi.fn(() => true),
        isGraphRefreshEnabled: vi.fn(() => false),
      };
    });

    const { runPostInsertEnrichment } = await import('../handlers/save/post-insert.js');
    await runPostInsertEnrichment(
      {} as never,
      701,
      {
        content: 'Retry telemetry first failure.',
        hasCausalLinks: true,
        causalLinks: [{ relation: 'supports', targetRef: 'missing-target' }],
        qualityScore: 0.8,
      } as never,
    );

    expect(collectRetryTelemetry(warnSpy)).toEqual([
      expect.objectContaining({
        type: 'event',
        event: 'retry_attempt',
        memoryId: '701',
        step: 'causal_links',
        reason: 'partial_causal_link_unresolved',
        attempt: 0,
        outcome: 'retry',
      }),
    ]);
  });

  it('emits give_up when the unresolved causal-link retry budget is exhausted', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.doMock('../handlers/causal-links-processor.js', () => ({
      processCausalLinks: vi.fn(() => ({
        processed: 1,
        inserted: 0,
        resolved: 0,
        unresolved: [{ type: 'memory', reference: 'missing-target' }],
        errors: [],
      })),
    }));
    vi.doMock('../lib/search/search-flags', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../lib/search/search-flags')>();
      return {
        ...actual,
        isAutoEntitiesEnabled: vi.fn(() => false),
        isEntityLinkingEnabled: vi.fn(() => false),
        isMemorySummariesEnabled: vi.fn(() => false),
        isPostInsertEnrichmentEnabled: vi.fn(() => true),
        isGraphRefreshEnabled: vi.fn(() => false),
      };
    });
    vi.doMock('../lib/search/search-flags.js', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../lib/search/search-flags.js')>();
      return {
        ...actual,
        isAutoEntitiesEnabled: vi.fn(() => false),
        isEntityLinkingEnabled: vi.fn(() => false),
        isMemorySummariesEnabled: vi.fn(() => false),
        isPostInsertEnrichmentEnabled: vi.fn(() => true),
        isGraphRefreshEnabled: vi.fn(() => false),
      };
    });

    const { runPostInsertEnrichment } = await import('../handlers/save/post-insert.js');
    const parsed = {
      content: 'Retry telemetry give-up.',
      hasCausalLinks: true,
      causalLinks: [{ relation: 'supports', targetRef: 'missing-target' }],
      qualityScore: 0.9,
    } as never;

    await runPostInsertEnrichment({} as never, 702, parsed);
    await runPostInsertEnrichment({} as never, 702, parsed);
    await runPostInsertEnrichment({} as never, 702, parsed);
    await runPostInsertEnrichment({} as never, 702, parsed);

    const telemetry = collectRetryTelemetry(warnSpy);
    expect(telemetry).toHaveLength(4);
    expect(telemetry.at(-1)).toMatchObject({
      memoryId: '702',
      step: 'causal_links',
      reason: 'partial_causal_link_unresolved',
      attempt: 3,
      outcome: 'give_up',
    });
  });

  it('emits resolved after a later successful post-insert run clears the budget', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const processCausalLinks = vi.fn()
      .mockImplementationOnce(() => ({
        processed: 1,
        inserted: 0,
        resolved: 0,
        unresolved: [{ type: 'memory', reference: 'missing-target' }],
        errors: [],
      }))
      .mockImplementationOnce(() => ({
        processed: 1,
        inserted: 1,
        resolved: 1,
        unresolved: [],
        errors: [],
      }));
    vi.doMock('../handlers/causal-links-processor.js', () => ({ processCausalLinks }));
    vi.doMock('../lib/search/search-flags', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../lib/search/search-flags')>();
      return {
        ...actual,
        isAutoEntitiesEnabled: vi.fn(() => false),
        isEntityLinkingEnabled: vi.fn(() => false),
        isMemorySummariesEnabled: vi.fn(() => false),
        isPostInsertEnrichmentEnabled: vi.fn(() => true),
        isGraphRefreshEnabled: vi.fn(() => false),
      };
    });
    vi.doMock('../lib/search/search-flags.js', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../lib/search/search-flags.js')>();
      return {
        ...actual,
        isAutoEntitiesEnabled: vi.fn(() => false),
        isEntityLinkingEnabled: vi.fn(() => false),
        isMemorySummariesEnabled: vi.fn(() => false),
        isPostInsertEnrichmentEnabled: vi.fn(() => true),
        isGraphRefreshEnabled: vi.fn(() => false),
      };
    });

    const { runPostInsertEnrichment } = await import('../handlers/save/post-insert.js');
    const parsed = {
      content: 'Retry telemetry resolution.',
      hasCausalLinks: true,
      causalLinks: [{ relation: 'supports', targetRef: 'missing-target' }],
      qualityScore: 0.95,
    } as never;

    await runPostInsertEnrichment({} as never, 703, parsed);
    await runPostInsertEnrichment({} as never, 703, parsed);

    const telemetry = collectRetryTelemetry(warnSpy);
    expect(telemetry).toEqual([
      expect.objectContaining({
        memoryId: '703',
        attempt: 0,
        outcome: 'retry',
      }),
      expect.objectContaining({
        memoryId: '703',
        attempt: 0,
        outcome: 'resolved',
      }),
    ]);
  });
});
