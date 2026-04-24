import BetterSqlite3 from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

type ParsedMemoryFixture = {
  specFolder: string;
  filePath: string;
  title: string;
  triggerPhrases: string[];
  content: string;
  contentHash: string;
  contextType: string;
  importanceTier: string;
  hasCausalLinks: boolean;
  qualityFlags: string[];
  qualityScore: number;
  fileSize: number;
  lastModified: string;
  memoryType: string;
  memoryTypeSource: string;
  memoryTypeConfidence: number;
  causalLinks: {
    caused_by: string[];
    supersedes: string[];
    derived_from: string[];
    blocks: string[];
    related_to: string[];
  };
  documentType: string;
};

function buildParsedMemory(filePath: string): ParsedMemoryFixture {
  const isConstitutional = filePath.includes('/constitutional/');
  return {
    specFolder: 'system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants',
    filePath,
    title: 'Index Scope Test Memory',
    triggerPhrases: ['index scope', 'constitutional tier'],
    content: '# Index Scope Test Memory\n',
    contentHash: `hash:${filePath}`,
    contextType: 'spec',
    importanceTier: 'constitutional',
    hasCausalLinks: false,
    qualityFlags: [],
    qualityScore: 0.95,
    fileSize: 128,
    lastModified: '2026-04-24T00:00:00.000Z',
    memoryType: 'semantic',
    memoryTypeSource: 'frontmatter',
    memoryTypeConfidence: 1,
    causalLinks: {
      caused_by: [],
      supersedes: [],
      derived_from: [],
      blocks: [],
      related_to: [],
    },
    documentType: isConstitutional ? 'constitutional' : 'plan',
  };
}

async function loadMemorySaveHarness(parsedMemory: ParsedMemoryFixture) {
  const database = new BetterSqlite3(':memory:');
  const createMemoryRecordMock = vi.fn((_db, parsed) => {
    return parsed.importanceTier === 'constitutional' ? 8101 : 8102;
  });
  const recordGovernanceAuditMock = vi.fn();

  vi.resetModules();
  vi.doUnmock('../handlers/memory-save');
  vi.doUnmock('../handlers/memory-save.js');

  vi.doMock('../core/index.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../core/index.js')>();
    return {
      ...actual,
      checkDatabaseUpdated: vi.fn(async () => false),
    };
  });

  vi.doMock('../utils/validators.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../utils/validators.js')>();
    return {
      ...actual,
      createFilePathValidator: vi.fn(() => ((candidatePath: string) => candidatePath)),
    };
  });

  vi.doMock('../utils/index.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../utils/index.js')>();
    return {
      ...actual,
      requireDb: vi.fn(() => database),
    };
  });

  vi.doMock('../lib/parsing/memory-parser.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/parsing/memory-parser.js')>();
    return {
      ...actual,
      parseMemoryFile: vi.fn(() => ({ ...parsedMemory })),
      validateParsedMemory: vi.fn(() => ({ valid: true, errors: [], warnings: [] })),
      isMemoryFile: vi.fn(() => true),
    };
  });

  vi.doMock('../handlers/v-rule-bridge.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../handlers/v-rule-bridge.js')>();
    return {
      ...actual,
      validateMemoryQualityContent: vi.fn(() => ({ valid: true, failedRules: [] })),
      determineValidationDisposition: vi.fn(() => null),
    };
  });

  vi.doMock('@spec-kit/shared/parsing/memory-sufficiency', () => ({
    MEMORY_SUFFICIENCY_REJECTION_CODE: 'INSUFFICIENT_CONTEXT_ABORT',
    evaluateMemorySufficiency: vi.fn(() => ({
      pass: true,
      rejectionCode: null,
      reasons: [],
      evidenceCounts: {
        primary: 2,
        support: 2,
        total: 4,
        semanticChars: 420,
        uniqueWords: 72,
        anchors: 1,
        triggerPhrases: 2,
      },
      score: 0.97,
    })),
  }));

  vi.doMock('@spec-kit/shared/parsing/memory-template-contract', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@spec-kit/shared/parsing/memory-template-contract')>();
    return {
      ...actual,
      validateMemoryTemplateContract: vi.fn(() => ({
        valid: true,
        violations: [],
        missingAnchors: [],
        unexpectedTemplateArtifacts: [],
      })),
    };
  });

  vi.doMock('@spec-kit/shared/parsing/spec-doc-health', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@spec-kit/shared/parsing/spec-doc-health')>();
    return {
      ...actual,
      evaluateSpecDocHealth: vi.fn(() => null),
    };
  });

  vi.doMock('../handlers/quality-loop.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../handlers/quality-loop.js')>();
    return {
      ...actual,
      runQualityLoop: vi.fn(() => ({
        score: { total: 0.92, issues: [] },
        fixes: [],
        passed: true,
        rejected: false,
        fixedTriggerPhrases: undefined,
      })),
    };
  });

  vi.doMock('../lib/validation/save-quality-gate.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/validation/save-quality-gate.js')>();
    return {
      ...actual,
      runQualityGate: vi.fn(() => ({ pass: true, warnOnly: false, reasons: [], layers: {} })),
      isQualityGateEnabled: vi.fn(() => false),
    };
  });

  vi.doMock('../lib/search/search-flags.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/search/search-flags.js')>();
    return {
      ...actual,
      isSaveQualityGateEnabled: vi.fn(() => false),
      isPostInsertEnrichmentEnabled: vi.fn(() => false),
      isSaveReconsolidationEnabled: vi.fn(() => true),
    };
  });

  vi.doMock('../handlers/save/embedding-pipeline.js', () => ({
    generateOrCacheEmbedding: vi.fn(async () => ({
      embedding: new Float32Array([0.25, 0.25]),
      status: 'success',
      failureReason: null,
      pendingCacheWrite: null,
    })),
    persistPendingEmbeddingCacheWrite: vi.fn(),
  }));

  vi.doMock('../handlers/save/dedup.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../handlers/save/dedup.js')>();
    return {
      ...actual,
      checkExistingRow: vi.fn(() => null),
      checkContentHashDedup: vi.fn(() => null),
    };
  });

  vi.doMock('../handlers/save/pe-orchestration.js', () => ({
    evaluateAndApplyPeDecision: vi.fn(() => ({
      decision: { action: 'CREATE', similarity: 0, reason: 'index-scope-test' },
      earlyReturn: null,
      supersededId: null,
    })),
  }));

  vi.doMock('../handlers/save/reconsolidation-bridge.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../handlers/save/reconsolidation-bridge.js')>();
    return {
      ...actual,
      findScopeFilteredCandidates: vi.fn(() => ({ candidates: [] })),
      getRequestedScope: vi.fn(() => ({
        tenantId: null,
        userId: null,
        agentId: null,
        sessionId: null,
      })),
      runReconsolidationIfEnabled: vi.fn(async () => ({
        earlyReturn: null,
        warnings: [],
        saveTimeReconsolidation: {
          status: 'skipped' as const,
          persistedState: { kind: 'create' as const },
        },
      })),
    };
  });

  vi.doMock('../handlers/save/create-record.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../handlers/save/create-record.js')>();
    return {
      ...actual,
      createMemoryRecord: createMemoryRecordMock,
      findSamePathExistingMemory: vi.fn(() => undefined),
    };
  });

  vi.doMock('../handlers/save/db-helpers.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../handlers/save/db-helpers.js')>();
    return {
      ...actual,
      applyPostInsertMetadata: vi.fn(),
    };
  });

  vi.doMock('../lib/governance/scope-governance.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/governance/scope-governance.js')>();
    return {
      ...actual,
      ensureGovernanceRuntime: vi.fn(),
      buildGovernancePostInsertFields: vi.fn(() => ({})),
      recordGovernanceAudit: recordGovernanceAuditMock,
      validateGovernedIngest: vi.fn(() => ({
        allowed: true,
        issues: [],
        normalized: { retentionPolicy: 'keep' },
      })),
    };
  });

  vi.doMock('../lib/storage/lineage-state.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/storage/lineage-state.js')>();
    return {
      ...actual,
      createAppendOnlyMemoryRecord: vi.fn(() => 8103),
      recordLineageVersion: vi.fn(),
    };
  });

  vi.doMock('../handlers/save/post-insert.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../handlers/save/post-insert.js')>();
    return {
      ...actual,
      runPostInsertEnrichmentIfEnabled: vi.fn(async () => ({
        causalLinksResult: null,
        enrichmentStatus: {
          causalLinks: { status: 'skipped' as const },
          entityExtraction: { status: 'skipped' as const },
          summaries: { status: 'skipped' as const },
          entityLinking: { status: 'skipped' as const },
          graphLifecycle: { status: 'skipped' as const },
        },
        executionStatus: { status: 'skipped' as const },
      })),
    };
  });

  vi.doMock('../handlers/save/response-builder.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../handlers/save/response-builder.js')>();
    return {
      ...actual,
      buildIndexResult: vi.fn(({ id, parsed }) => ({
        status: 'indexed',
        id,
        specFolder: parsed.specFolder,
        title: parsed.title,
        triggerPhrases: parsed.triggerPhrases,
        contextType: parsed.contextType,
        importanceTier: parsed.importanceTier,
        qualityScore: parsed.qualityScore,
        qualityFlags: parsed.qualityFlags,
        message: 'Indexed successfully',
        embeddingStatus: 'success',
      })),
      buildSaveResponse: vi.fn(({ result }) => ({ status: 'ok', data: result })),
    };
  });

  const module = await import('../handlers/memory-save');
  return { module, createMemoryRecordMock, recordGovernanceAuditMock };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('memory-save index scope and constitutional tier invariants', () => {
  it('downgrades invalid constitutional tier during direct memory_save and logs a warning', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const filePath = '/workspace/.opencode/specs/system-spec-kit/011-index-scope-and-constitutional-tier-invariants/plan.md';
    const harness = await loadMemorySaveHarness(buildParsedMemory(filePath));

    const response = await harness.module.handleMemorySave({ filePath });

    expect(response).toMatchObject({
      status: 'ok',
      data: {
        importanceTier: 'important',
      },
    });
    expect(harness.createMemoryRecordMock).toHaveBeenCalledTimes(1);
    expect(harness.createMemoryRecordMock.mock.calls[0][1].importanceTier).toBe('important');
    expect(harness.recordGovernanceAuditMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: 'tier_downgrade_non_constitutional_path',
        decision: 'conflict',
        reason: 'non_constitutional_path',
      }),
    );
    expect(
      warnSpy.mock.calls.some(([message]) => String(message).includes('importance_tier=constitutional rejected for non-constitutional path'))
    ).toBe(true);
  });

  it('downgrades invalid constitutional tier for scan-originated saves too', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const filePath = '/workspace/.opencode/specs/system-spec-kit/011-index-scope-and-constitutional-tier-invariants/tasks.md';
    const harness = await loadMemorySaveHarness(buildParsedMemory(filePath));

    const result = await harness.module.indexMemoryFileFromScan(filePath);

    expect(result.importanceTier).toBe('important');
    expect(harness.createMemoryRecordMock).toHaveBeenCalledTimes(1);
    expect(harness.createMemoryRecordMock.mock.calls[0][1].importanceTier).toBe('important');
    expect(harness.recordGovernanceAuditMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: 'tier_downgrade_non_constitutional_path',
        decision: 'conflict',
        reason: 'non_constitutional_path',
      }),
    );
    expect(
      warnSpy.mock.calls.some(([message]) => String(message).includes('importance_tier=constitutional rejected for non-constitutional path'))
    ).toBe(true);
  });

  it('preserves constitutional tier for files inside /constitutional/', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const filePath = '/workspace/.opencode/skill/system-spec-kit/constitutional/gate-foo.md';
    const harness = await loadMemorySaveHarness(buildParsedMemory(filePath));

    const response = await harness.module.handleMemorySave({ filePath });

    expect(response).toMatchObject({
      status: 'ok',
      data: {
        importanceTier: 'constitutional',
      },
    });
    expect(harness.createMemoryRecordMock.mock.calls[0][1].importanceTier).toBe('constitutional');
    expect(
      harness.recordGovernanceAuditMock.mock.calls.some(([, entry]) =>
        (entry as { action?: string }).action === 'tier_downgrade_non_constitutional_path')
    ).toBe(false);
    expect(
      warnSpy.mock.calls.some(([message]) => String(message).includes('importance_tier=constitutional rejected for non-constitutional path'))
    ).toBe(false);
  });
});
