import { afterEach, describe, expect, it, vi } from 'vitest';

describe('post-insert deferred enrichment reporting', () => {
  afterEach(() => {
    vi.doUnmock('../handlers/memory-crud-utils');
    vi.doUnmock('../handlers/memory-crud-utils.js');
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

  it('preserves lane-level enrichment state in buildIndexResult output', async () => {
    vi.doMock('../handlers/memory-crud-utils', () => ({
      appendMutationLedgerSafe: vi.fn(() => true),
    }));
    vi.doMock('../handlers/memory-crud-utils.js', () => ({
      appendMutationLedgerSafe: vi.fn(() => true),
    }));

    const { buildIndexResult } = await import('../handlers/save/response-builder.js');
    const result = buildIndexResult({
      database: {} as never,
      existing: undefined,
      embeddingStatus: 'success',
      id: 19,
      parsed: {
        specFolder: 'system-spec-kit/015-save-flow-planner-first-trim',
        title: 'Planner-first partial enrichment',
        triggerPhrases: ['planner-first', 'partial'],
        content: 'Partial enrichment save.',
        contextType: 'implementation',
        importanceTier: 'important',
        memoryType: 'memory',
        memoryTypeSource: 'parser',
        qualityScore: 0.73,
        qualityFlags: [],
        documentType: 'memory',
      } as never,
      validation: { valid: true, errors: [], warnings: [] },
      reconWarnings: [] as never,
      peDecision: { action: 'CREATE', similarity: 0 } as never,
      embeddingFailureReason: null,
      asyncEmbedding: false,
      causalLinksResult: null,
      enrichmentStatus: {
        causalLinks: true,
        entityExtraction: false,
        summaries: true,
        entityLinking: true,
        graphLifecycle: false,
      },
      enrichmentExecutionStatus: { status: 'ran' },
      filePath: '/tmp/partial-memory.md',
    });

    expect(result.postInsertEnrichment).toEqual({
      status: 'partial',
      persistedState: {
        causalLinks: true,
        entityExtraction: false,
        summaries: true,
        entityLinking: true,
        graphLifecycle: false,
      },
      warnings: ['Partial enrichment: entityExtraction, graphLifecycle failed'],
    });
    expect(result.warnings).toEqual(expect.arrayContaining([
      'Partial enrichment: entityExtraction, graphLifecycle failed',
    ]));
  });
});
