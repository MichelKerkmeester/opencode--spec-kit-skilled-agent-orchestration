import { afterEach, describe, expect, it, vi } from 'vitest';

describe('post-insert deferred enrichment reporting', () => {
  afterEach(() => {
    vi.doUnmock('../lib/search/search-flags');
    vi.doUnmock('../lib/search/search-flags.js');
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('returns an explicit deferred execution status when planner-first mode skips enrichment', async () => {
    vi.doMock('../lib/search/search-flags', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../lib/search/search-flags')>();
      return {
        ...actual,
        isPostInsertEnrichmentEnabled: vi.fn(() => false),
      };
    });
    vi.doMock('../lib/search/search-flags.js', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../lib/search/search-flags.js')>();
      return {
        ...actual,
        isPostInsertEnrichmentEnabled: vi.fn(() => false),
      };
    });

    const { runPostInsertEnrichmentIfEnabled } = await import('../handlers/save/post-insert.js');
    const result = await runPostInsertEnrichmentIfEnabled(
      {} as never,
      41,
      { content: 'Deferred planner-first save.', hasCausalLinks: false } as never,
      { plannerMode: 'plan-only' },
    );

    expect(result.causalLinksResult).toBeNull();
    expect(result.enrichmentStatus).toEqual({
      causalLinks: true,
      entityExtraction: true,
      summaries: true,
      entityLinking: true,
      graphLifecycle: true,
    });
    expect(result.executionStatus).toEqual({
      status: 'deferred',
      reason: 'planner-first-mode',
      followUpAction: 'runEnrichmentBackfill',
    });
  });

  it('includes deferred enrichment metadata in the save response payload', async () => {
    const { buildSaveResponse } = await import('../handlers/save/response-builder.js');
    const response = buildSaveResponse({
      result: {
        status: 'indexed',
        id: 7,
        specFolder: 'system-spec-kit/015-save-flow-planner-first-trim',
        title: 'Planner-first deferred enrichment',
        triggerPhrases: ['planner-first'],
        qualityScore: 0.91,
        qualityFlags: [],
        postInsertEnrichment: {
          status: 'deferred',
          reason: 'planner-first-mode',
          followUpAction: 'runEnrichmentBackfill',
        },
      },
      filePath: '/tmp/deferred-memory.md',
      asyncEmbedding: false,
      requestId: 'post-insert-deferred-test',
    });

    const payload = JSON.parse(String(response.content?.[0]?.text ?? '{}'));

    expect(payload.data.postInsertEnrichment).toEqual({
      status: 'deferred',
      reason: 'planner-first-mode',
      followUpAction: 'runEnrichmentBackfill',
    });
    expect(payload.hints).toEqual(expect.arrayContaining([
      'Post-insert enrichment was deferred; runEnrichmentBackfill when immediate graph/search freshness matters',
    ]));
  });
});
