// Migrated as part of 016 remediation — see FINAL-synthesis-and-review.md §6.3 for rationale.
// T-TEST-01 (M13): enrichmentStatus migrated from boolean record to per-step OperationResult.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearBudget } from '../lib/enrichment/retry-budget.js';

describe('post-insert deferred enrichment reporting', () => {
  afterEach(() => {
    clearBudget();
    vi.doUnmock('../handlers/memory-crud-utils');
    vi.doUnmock('../handlers/memory-crud-utils.js');
    vi.doUnmock('../handlers/causal-links-processor.js');
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
    // M13: every step reports explicit `deferred` status (not silently `true`).
    const deferred = { status: 'deferred', reason: 'planner_first_mode' };
    expect(result.enrichmentStatus).toEqual({
      causalLinks: deferred,
      entityExtraction: deferred,
      summaries: deferred,
      entityLinking: deferred,
      graphLifecycle: deferred,
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
      // M13: per-step OperationResult shape.
      enrichmentStatus: {
        causalLinks: { status: 'ran' },
        entityExtraction: { status: 'failed', reason: 'entity_extraction_exception', warnings: ['boom'] },
        summaries: { status: 'ran' },
        entityLinking: { status: 'skipped', reason: 'extraction_not_ran' },
        graphLifecycle: { status: 'failed', reason: 'graph_lifecycle_exception', warnings: ['graph kaboom'] },
      },
      enrichmentExecutionStatus: { status: 'ran' },
      filePath: '/tmp/partial-memory.md',
    });

    expect(result.postInsertEnrichment?.status).toBe('partial');
    expect(result.postInsertEnrichment?.persistedState).toEqual({
      causalLinks: { status: 'ran' },
      entityExtraction: { status: 'failed', reason: 'entity_extraction_exception', warnings: ['boom'] },
      summaries: { status: 'ran' },
      entityLinking: { status: 'skipped', reason: 'extraction_not_ran' },
      graphLifecycle: { status: 'failed', reason: 'graph_lifecycle_exception', warnings: ['graph kaboom'] },
    });
    // Aggregated response warnings must name the failed steps + carry the step-level reasons.
    expect(result.postInsertEnrichment?.warnings).toEqual(expect.arrayContaining([
      'Enrichment failed: entityExtraction, graphLifecycle',
      '[entityExtraction] boom',
      '[graphLifecycle] graph kaboom',
    ]));
    expect(result.warnings).toEqual(expect.arrayContaining([
      'Enrichment failed: entityExtraction, graphLifecycle',
    ]));
  });

  it('returns ran status when all enrichment steps succeed', async () => {
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
      id: 20,
      parsed: {
        specFolder: 'system-spec-kit/015-save-flow-planner-first-trim',
        title: 'All-ran enrichment',
        triggerPhrases: ['ran'],
        content: 'All steps ran.',
        contextType: 'implementation',
        importanceTier: 'important',
        memoryType: 'memory',
        memoryTypeSource: 'parser',
        qualityScore: 0.8,
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
        causalLinks: { status: 'ran' },
        entityExtraction: { status: 'ran' },
        summaries: { status: 'ran' },
        entityLinking: { status: 'ran' },
        graphLifecycle: { status: 'ran' },
      },
      enrichmentExecutionStatus: { status: 'ran' },
      filePath: '/tmp/ran-memory.md',
    });

    expect(result.postInsertEnrichment?.status).toBe('ran');
    expect(result.postInsertEnrichment?.warnings).toBeUndefined();
  });

  it('propagates partial causal-link status without collapsing into success', async () => {
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
      id: 21,
      parsed: {
        specFolder: 'system-spec-kit/015-save-flow-planner-first-trim',
        title: 'Partial causal links',
        triggerPhrases: ['partial'],
        content: 'Partial save with unresolved causal refs.',
        contextType: 'implementation',
        importanceTier: 'important',
        memoryType: 'memory',
        memoryTypeSource: 'parser',
        qualityScore: 0.8,
        qualityFlags: [],
        documentType: 'memory',
      } as never,
      validation: { valid: true, errors: [], warnings: [] },
      reconWarnings: [] as never,
      peDecision: { action: 'CREATE', similarity: 0 } as never,
      embeddingFailureReason: null,
      asyncEmbedding: false,
      causalLinksResult: null,
      // T-PIN-04 (R14-003): partial causal-link failures must propagate as `partial`.
      enrichmentStatus: {
        causalLinks: {
          status: 'partial',
          reason: 'partial_causal_link_unresolved',
          warnings: ['2 causal reference(s) unresolved'],
        },
        entityExtraction: { status: 'ran' },
        summaries: { status: 'ran' },
        entityLinking: { status: 'ran' },
        graphLifecycle: { status: 'ran' },
      },
      enrichmentExecutionStatus: { status: 'ran' },
      filePath: '/tmp/partial-causal-memory.md',
    });

    expect(result.postInsertEnrichment?.status).toBe('partial');
    expect(result.postInsertEnrichment?.warnings).toEqual(expect.arrayContaining([
      'Enrichment partial: causalLinks',
      '[causalLinks] 2 causal reference(s) unresolved',
    ]));
  });

  it('propagates density-guard skip with reason without collapsing into success', async () => {
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
      id: 22,
      parsed: {
        specFolder: 'system-spec-kit/015-save-flow-planner-first-trim',
        title: 'Density-guarded linking',
        triggerPhrases: ['density'],
        content: 'Save with density-guarded entity linking.',
        contextType: 'implementation',
        importanceTier: 'important',
        memoryType: 'memory',
        memoryTypeSource: 'parser',
        qualityScore: 0.8,
        qualityFlags: [],
        documentType: 'memory',
      } as never,
      validation: { valid: true, errors: [], warnings: [] },
      reconWarnings: [] as never,
      peDecision: { action: 'CREATE', similarity: 0 } as never,
      embeddingFailureReason: null,
      asyncEmbedding: false,
      causalLinksResult: null,
      // T-PIN-06 (R12-005): density-guard skip surfaces as skipped with reason 'density_guard'.
      enrichmentStatus: {
        causalLinks: { status: 'ran' },
        entityExtraction: { status: 'ran' },
        summaries: { status: 'ran' },
        entityLinking: { status: 'skipped', reason: 'density_guard', warnings: ['density=0.800, threshold=0.500'] },
        graphLifecycle: { status: 'ran' },
      },
      enrichmentExecutionStatus: { status: 'ran' },
      filePath: '/tmp/density-memory.md',
    });

    // Skip-only (no failures, no partials) with executionStatus='ran' → overall 'ran'.
    expect(result.postInsertEnrichment?.status).toBe('ran');
    // Step-level warnings still propagate.
    expect(result.postInsertEnrichment?.warnings).toEqual(expect.arrayContaining([
      '[entityLinking] density=0.800, threshold=0.500',
    ]));
    expect((result.postInsertEnrichment?.persistedState as Record<string, unknown> | undefined)?.entityLinking).toEqual({
      status: 'skipped',
      reason: 'density_guard',
      warnings: ['density=0.800, threshold=0.500'],
    });
  });

  it('runs entity linking only after extraction succeeds (R8-002 gate)', async () => {
    // Verify the post-insert pipeline: when extraction fails, linking must be `skipped`
    // with reason `extraction_not_ran` rather than running on stale rows.
    vi.doMock('../lib/search/search-flags', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../lib/search/search-flags')>();
      return {
        ...actual,
        isPostInsertEnrichmentEnabled: vi.fn(() => true),
        isAutoEntitiesEnabled: vi.fn(() => true),
        isEntityLinkingEnabled: vi.fn(() => true),
        isMemorySummariesEnabled: vi.fn(() => false),
        isGraphRefreshEnabled: vi.fn(() => false),
      };
    });
    vi.doMock('../lib/search/search-flags.js', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../lib/search/search-flags.js')>();
      return {
        ...actual,
        isPostInsertEnrichmentEnabled: vi.fn(() => true),
        isAutoEntitiesEnabled: vi.fn(() => true),
        isEntityLinkingEnabled: vi.fn(() => true),
        isMemorySummariesEnabled: vi.fn(() => false),
        isGraphRefreshEnabled: vi.fn(() => false),
      };
    });
    vi.doMock('../lib/extraction/entity-extractor', () => ({
      extractEntities: vi.fn(() => { throw new Error('extractor boom'); }),
      filterEntities: vi.fn((x: unknown) => x),
      refreshAutoEntitiesForMemory: vi.fn(),
    }));
    vi.doMock('../lib/extraction/entity-extractor.js', () => ({
      extractEntities: vi.fn(() => { throw new Error('extractor boom'); }),
      filterEntities: vi.fn((x: unknown) => x),
      refreshAutoEntitiesForMemory: vi.fn(),
    }));
    const runLinkerMock = vi.fn(() => ({ linksCreated: 0, crossDocMatches: 0 }));
    vi.doMock('../lib/search/entity-linker', () => ({ runEntityLinkingForMemory: runLinkerMock }));
    vi.doMock('../lib/search/entity-linker.js', () => ({ runEntityLinkingForMemory: runLinkerMock }));
    vi.doMock('../lib/search/graph-lifecycle', () => ({
      onIndex: vi.fn(() => ({ edgesCreated: 0, llmBackfillScheduled: false, skipped: true })),
      isGraphRefreshEnabled: vi.fn(() => false),
    }));
    vi.doMock('../lib/search/graph-lifecycle.js', () => ({
      onIndex: vi.fn(() => ({ edgesCreated: 0, llmBackfillScheduled: false, skipped: true })),
      isGraphRefreshEnabled: vi.fn(() => false),
    }));

    const { runPostInsertEnrichment } = await import('../handlers/save/post-insert.js');
    const result = await runPostInsertEnrichment(
      {} as never,
      99,
      { content: 'Extraction fails here.', hasCausalLinks: false, qualityScore: 0.5 } as never,
    );

    expect(result.enrichmentStatus.entityExtraction.status).toBe('failed');
    expect(result.enrichmentStatus.entityExtraction.reason).toBe('entity_extraction_exception');
    expect(result.enrichmentStatus.entityLinking).toEqual({
      status: 'skipped',
      reason: 'extraction_not_ran',
    });
    // Linker must not have been called.
    expect(runLinkerMock).not.toHaveBeenCalled();
  });

  it('stops scheduling runEnrichmentBackfill after the unresolved causal-link retry budget is exhausted', async () => {
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
      content: 'Repeated unresolved causal links.',
      hasCausalLinks: true,
      causalLinks: [{ relation: 'supports', targetRef: 'missing-target' }],
      qualityScore: 0.8,
    } as never;

    const first = await runPostInsertEnrichment({} as never, 404, parsed);
    const second = await runPostInsertEnrichment({} as never, 404, parsed);
    const third = await runPostInsertEnrichment({} as never, 404, parsed);
    const fourth = await runPostInsertEnrichment({} as never, 404, parsed);

    expect(['partial', 'failed']).toContain(first.executionStatus.status);
    expect(['enrichment_step_partial', 'enrichment_step_failed']).toContain(first.executionStatus.reason);
    expect(first.executionStatus.followUpAction).toBe('runEnrichmentBackfill');
    expect(second.executionStatus.followUpAction).toBe('runEnrichmentBackfill');
    expect(third.executionStatus.followUpAction).toBe('runEnrichmentBackfill');
    expect(['partial', 'failed']).toContain(fourth.executionStatus.status);
    expect(['enrichment_step_partial', 'enrichment_step_failed']).toContain(fourth.executionStatus.reason);
    if (fourth.executionStatus.status === 'partial') {
      expect(fourth.executionStatus.followUpAction).toBeUndefined();
    } else {
      expect(fourth.executionStatus.followUpAction).toBe('runEnrichmentBackfill');
    }
  });
});
