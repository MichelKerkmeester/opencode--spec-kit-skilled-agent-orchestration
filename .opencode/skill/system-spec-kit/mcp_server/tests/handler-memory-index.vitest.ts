// ───────────────────────────────────────────────────────────────
// 1. HANDLER MEMORY INDEX TESTS
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, afterAll, vi } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import BetterSqlite3 from 'better-sqlite3';

import * as handler from '../handlers/memory-index';
import { BATCH_SIZE } from '../core/config';

let tempDir: string | null = null;

function workspaceSpecPath(rootFolder: string, specId: string, fileName: string): string {
  return path.posix.join('/workspace', rootFolder, 'system-spec-kit', specId, fileName);
}

function buildSaveGuardParsedMemory(filePath: string) {
  return {
    specFolder: 'system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix',
    filePath,
    title: 'Memory Indexer Lineage and Concurrency Fix',
    triggerPhrases: ['candidate_changed fix', 'fromScan guard'],
    content: [
      '---',
      'title: "Memory Indexer Lineage and Concurrency Fix"',
      'description: "Regression fixture for the save-time reconsolidation guard."',
      'trigger_phrases:',
      '  - "candidate_changed fix"',
      '  - "fromScan guard"',
      'importance_tier: "high"',
      'contextType: "spec"',
      '---',
      '',
      '# Memory Indexer Lineage and Concurrency Fix',
      '',
      '## SESSION SUMMARY',
      '',
      '| **Meta Data** | **Value** |',
      '|:--------------|:----------|',
      '| Total Messages | 4 |',
      '',
      '<!-- ANCHOR:continue-session -->',
      '',
      '## CONTINUE SESSION',
      '',
      'Continue validating the scan-originated save guard regression.',
      '',
      '<!-- /ANCHOR:continue-session -->',
      '',
      '<!-- ANCHOR:canonical-docs -->',
      '',
      '## CANONICAL SOURCES',
      '',
      '- `plan.md` - B2 fromScan guard narrative',
      '- `implementation-summary.md` - Verification story for the transactional recheck bypass',
      '',
      '<!-- /ANCHOR:canonical-docs -->',
      '',
      '<!-- ANCHOR:overview -->',
      '',
      '## OVERVIEW',
      '',
      'This fixture exists only to exercise the real save-time reconsolidation guard path.',
      '',
      '<!-- /ANCHOR:overview -->',
      '',
      '<!-- ANCHOR:evidence -->',
      '',
      '## DISTINGUISHING EVIDENCE',
      '',
      '- The scan path must bypass the transactional complement recheck.',
      '- The non-scan path must still surface candidate_changed.',
      '',
      '<!-- /ANCHOR:evidence -->',
      '',
      '<!-- ANCHOR:metadata -->',
      '',
      '## MEMORY METADATA',
      '',
      '```yaml',
      'session_id: "handler-memory-index-fromscan-guard"',
      '```',
      '',
      '<!-- /ANCHOR:metadata -->',
    ].join('\n'),
    contentHash: 'fromscan-guard-fixture',
    contextType: 'spec',
    importanceTier: 'high',
    hasCausalLinks: false,
    qualityFlags: [],
  };
}

function resetRealMemorySaveHarnessMocks(): void {
  const mockedModules = [
    '../handlers/memory-save',
    '../handlers/memory-save.js',
    '../core/index.js',
    '../utils/validators.js',
    '../utils/index.js',
    '../lib/parsing/memory-parser.js',
    '../handlers/v-rule-bridge.js',
    '../handlers/quality-loop.js',
    '../lib/validation/save-quality-gate.js',
    '../lib/search/search-flags.js',
    '../handlers/save/embedding-pipeline.js',
    '../handlers/save/dedup.js',
    '../handlers/save/pe-orchestration.js',
    '../handlers/save/reconsolidation-bridge.js',
    '../handlers/save/create-record.js',
    '../handlers/save/post-insert.js',
    '../handlers/save/response-builder.js',
    '../lib/storage/lineage-state.js',
    '@spec-kit/shared/parsing/memory-sufficiency',
    '@spec-kit/shared/parsing/memory-template-contract',
    '@spec-kit/shared/parsing/spec-doc-health',
  ];

  for (const moduleId of mockedModules) {
    vi.doUnmock(moduleId);
  }
  vi.restoreAllMocks();
  vi.resetModules();
}

async function loadRealMemorySaveGuardHarness(database: InstanceType<typeof BetterSqlite3>) {
  vi.resetModules();
  vi.doUnmock('../handlers/memory-save');
  vi.doUnmock('../handlers/memory-save.js');

  const createMemoryRecordMock = vi.fn(() => 4101);
  const findScopeFilteredCandidatesMock = vi.fn(() => ({
    candidates: [
      {
        id: 77,
        file_path: '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix/plan.md',
        title: 'Candidate surfaced during transaction',
        content_text: 'Transaction-only candidate',
        similarity: 95,
        spec_folder: 'system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix',
      },
    ],
    suppressedCandidateIds: [],
    malformedCandidateCount: 0,
    rawCandidateCount: 1,
  }));
  const runReconsolidationIfEnabledMock = vi.fn(async () => ({
    earlyReturn: null,
    warnings: [],
    saveTimeReconsolidation: {
      status: 'skipped' as const,
      persistedState: { kind: 'create' as const },
    },
  }));

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
      parseMemoryFile: vi.fn((filePath: string) => buildSaveGuardParsedMemory(filePath)),
      validateParsedMemory: vi.fn(() => ({ valid: true, errors: [], warnings: [] })),
      isMemoryFile: vi.fn(() => true),
    };
  });

  vi.doMock('../handlers/v-rule-bridge.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../handlers/v-rule-bridge.js')>();
    return {
      ...actual,
      validateMemoryQualityContent: vi.fn(() => ({ valid: true, failedRules: [] })),
      determineValidationDisposition: vi.fn(() => 'allow'),
    };
  });

  vi.doMock('@spec-kit/shared/parsing/memory-sufficiency', () => ({
    MEMORY_SUFFICIENCY_REJECTION_CODE: 'INSUFFICIENT_CONTEXT_ABORT',
    evaluateMemorySufficiency: vi.fn(() => ({
      pass: true,
      rejectionCode: 'INSUFFICIENT_CONTEXT_ABORT',
      reasons: [],
      evidenceCounts: {
        primary: 2,
        support: 2,
        total: 4,
        semanticChars: 420,
        uniqueWords: 72,
        anchors: 2,
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
      isQualityGateEnabled: vi.fn(() => true),
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
      decision: { action: 'CREATE', similarity: 0, reason: 'guard regression fixture' },
      earlyReturn: null,
      supersededId: null,
    })),
  }));

  vi.doMock('../handlers/save/reconsolidation-bridge.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../handlers/save/reconsolidation-bridge.js')>();
    return {
      ...actual,
      findScopeFilteredCandidates: findScopeFilteredCandidatesMock,
      getRequestedScope: vi.fn(() => ({
        tenantId: null,
        userId: null,
        agentId: null,
        sessionId: null,
      })),
      runReconsolidationIfEnabled: runReconsolidationIfEnabledMock,
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

  vi.doMock('../lib/storage/lineage-state.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/storage/lineage-state.js')>();
    return {
      ...actual,
      createAppendOnlyMemoryRecord: vi.fn(() => 4102),
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
        message: 'Indexed successfully',
        embeddingStatus: 'success',
      })),
    };
  });

  const module = await import('../handlers/memory-save');
  return {
    module,
    createMemoryRecordMock,
    findScopeFilteredCandidatesMock,
    runReconsolidationIfEnabledMock,
  };
}

afterAll(() => {
  if (tempDir && fs.existsSync(tempDir)) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
});

describe('Handler Memory Index (T520) [deferred - requires DB test fixtures]', () => {
  describe('Exports Validation', () => {
    it('T520-1: handleMemoryIndexScan exported', () => {
      expect(typeof handler.handleMemoryIndexScan).toBe('function');
    });

    it('T520-2: indexSingleFile exported', () => {
      expect(typeof handler.indexSingleFile).toBe('function');
    });

    it('T520-3: findConstitutionalFiles exported', () => {
      expect(typeof handler.findConstitutionalFiles).toBe('function');
    });

    it('T520-4: snake_case aliases exported', () => {
      const aliases: Array<keyof typeof handler> = [
        'handle_memory_index_scan',
        'index_single_file',
        'find_constitutional_files',
        'summarize_alias_conflicts',
        'run_divergence_reconcile_hooks',
      ];
      for (const alias of aliases) {
        expect(typeof handler[alias]).toBe('function');
      }
    });

    it('T520-4b: summarizeAliasConflicts exported', () => {
      expect(typeof handler.summarizeAliasConflicts).toBe('function');
    });

    it('T520-4c: runDivergenceReconcileHooks exported', () => {
      expect(typeof handler.runDivergenceReconcileHooks).toBe('function');
    });
  });

  describe('findConstitutionalFiles', () => {
    it('T520-5: non-existent path returns empty array', () => {
      const result = handler.findConstitutionalFiles('/non/existent/path');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('T520-6: path without skill dir returns empty array', () => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-index-'));
      const result = handler.findConstitutionalFiles(tempDir);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('T520-7: finds constitutional .md files', () => {
      const skillDir = path.join(tempDir!, '.opencode', 'skill', 'test-skill', 'constitutional');
      fs.mkdirSync(skillDir, { recursive: true });
      fs.writeFileSync(path.join(skillDir, 'test.md'), '# Test Constitutional');

      const result = handler.findConstitutionalFiles(tempDir!);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
    });

    it('T520-8: constitutional README is skipped', () => {
      const skillDir = path.join(tempDir!, '.opencode', 'skill', 'test-skill', 'constitutional');
      fs.writeFileSync(path.join(skillDir, 'README.md'), '# Readme');

      const result = handler.findConstitutionalFiles(tempDir!);
      const hasReadme = result.some((f) => f.includes('README.md'));
      expect(hasReadme).toBe(false);
    });

    it('T520-9: hidden skill directories are skipped', () => {
      const hiddenDir = path.join(tempDir!, '.opencode', 'skill', '.hidden-skill', 'constitutional');
      fs.mkdirSync(hiddenDir, { recursive: true });
      fs.writeFileSync(path.join(hiddenDir, 'hidden.md'), '# Hidden');

      const result = handler.findConstitutionalFiles(tempDir!);
      const hasHidden = result.some((f) => f.includes('.hidden-skill'));
      expect(hasHidden).toBe(false);
    });
  });

  describe('findSpecDocuments', () => {
    it('T520-9a: prefers canonical .opencode/specs over legacy specs root', () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-spec-docs-canonical-'));
      try {
        const canonicalSpecFolder = path.join(
          root,
          '.opencode',
          'specs',
          'system-spec-kit',
          '890-canonical',
        );
        const legacySpecFolder = path.join(
          root,
          'specs',
          'system-spec-kit',
          '891-legacy',
        );
        fs.mkdirSync(canonicalSpecFolder, { recursive: true });
        fs.mkdirSync(legacySpecFolder, { recursive: true });
        fs.writeFileSync(path.join(canonicalSpecFolder, 'spec.md'), '# Canonical Spec');
        fs.writeFileSync(path.join(legacySpecFolder, 'spec.md'), '# Legacy Spec');

        const result = handler.findSpecDocuments(root);
        expect(result).toHaveLength(1);
        expect(result[0]).toContain(path.join('.opencode', 'specs'));
        expect(result[0]).toContain('890-canonical');
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    });

    it('T520-9b: deduplicates symlinked specs roots', () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-spec-docs-'));
      try {
        const canonicalSpecs = path.join(root, '.opencode', 'specs');
        const specFolder = path.join(canonicalSpecs, 'system-spec-kit', '900-dedup-check');
        fs.mkdirSync(specFolder, { recursive: true });
        fs.writeFileSync(path.join(specFolder, 'spec.md'), '# Spec');

        const linkedSpecs = path.join(root, 'specs');
        try {
          fs.symlinkSync(canonicalSpecs, linkedSpecs, 'dir');
        } catch {
          // Symlink creation can fail in restricted test environments.
          const fallbackResult = handler.findSpecDocuments(root);
          expect(Array.isArray(fallbackResult)).toBe(true);
          return;
        }

        const result = handler.findSpecDocuments(root);
        expect(result).toHaveLength(1);
        expect(path.basename(result[0])).toBe('spec.md');
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    });

    it('T520-9c: never walks memory directories even if they contain spec doc names', () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-spec-docs-memory-skip-'));
      try {
        const specFolder = path.join(
          root,
          '.opencode',
          'specs',
          'system-spec-kit',
          '905-no-memory-walk',
        );
        const memoryDir = path.join(specFolder, 'memory');
        fs.mkdirSync(memoryDir, { recursive: true });
        fs.writeFileSync(path.join(specFolder, 'spec.md'), '# Canonical Spec');
        fs.writeFileSync(path.join(memoryDir, 'spec.md'), '# Should Be Ignored');
        fs.writeFileSync(path.join(memoryDir, 'plan.md'), '# Also Ignored');

        const result = handler.findSpecDocuments(root);
        expect(result).toHaveLength(1);
        expect(result[0]).toBe(path.join(specFolder, 'spec.md'));
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    });

    it('T520-9d: keeps specFolder filtering with root dedup', () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-spec-docs-filter-'));
      try {
        const canonicalSpecs = path.join(root, '.opencode', 'specs');
        const targetFolder = path.join(canonicalSpecs, 'system-spec-kit', '910-target');
        const otherFolder = path.join(canonicalSpecs, 'system-spec-kit', '911-other');
        fs.mkdirSync(targetFolder, { recursive: true });
        fs.mkdirSync(otherFolder, { recursive: true });
        fs.writeFileSync(path.join(targetFolder, 'spec.md'), '# Target Spec');
        fs.writeFileSync(path.join(otherFolder, 'spec.md'), '# Other Spec');

        const linkedSpecs = path.join(root, 'specs');
        try {
          fs.symlinkSync(canonicalSpecs, linkedSpecs, 'dir');
        } catch {
          const fallbackResult = handler.findSpecDocuments(root, { specFolder: 'system-spec-kit/910-target' });
          expect(Array.isArray(fallbackResult)).toBe(true);
          return;
        }

        const result = handler.findSpecDocuments(root, { specFolder: 'system-spec-kit/910-target' });
        expect(result).toHaveLength(1);
        expect(result[0].includes('910-target')).toBe(true);
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    });
  });

  describe('scan-originated save guard regressions', () => {
    it('passes fromScan=true for scan-originated saves so the fake recheck never fires', async () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-index-scan-serial-'));
      const previousBasePath = process.env.MEMORY_BASE_PATH;
      let nextId = 1000;
      let transactionalRecheckCalls = 0;

      try {
        const specFolder = path.join(
          root,
          '.opencode',
          'specs',
          'system-spec-kit',
          '026-graph-and-context-optimization',
          '009-hook-daemon-parity',
        );
        fs.mkdirSync(specFolder, { recursive: true });
        for (const fileName of ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md']) {
          fs.writeFileSync(path.join(specFolder, fileName), `# ${fileName}\n`, 'utf8');
        }

        process.env.MEMORY_BASE_PATH = root;
        vi.resetModules();

        const indexMemoryFileMock = vi.fn(async (_filePath: string, options?: { fromScan?: boolean }) => {
          if (!options?.fromScan) {
            transactionalRecheckCalls += 1;
            throw new Error('candidate_changed');
          }
          nextId += 1;
          return {
            status: 'indexed',
            id: nextId,
            title: 'Indexed spec doc',
          };
        });

        vi.doMock('../handlers/memory-save.js', () => ({
          indexMemoryFile: indexMemoryFileMock,
        }));
        vi.doMock('../core/index.js', () => ({
          checkDatabaseUpdated: vi.fn(async () => {}),
        }));
        vi.doMock('../core/db-state.js', async (importOriginal) => {
          const actual = await importOriginal<typeof import('../core/db-state.js')>();
          return {
            ...actual,
            acquireIndexScanLease: vi.fn(async () => ({ acquired: true, waitSeconds: 0, reason: null })),
            completeIndexScanLease: vi.fn(async () => {}),
          };
        });
        vi.doMock('../lib/storage/checkpoints.js', () => ({
          getRestoreBarrierStatus: vi.fn(() => null),
        }));
        vi.doMock('../lib/providers/embeddings.js', () => ({
          getEmbeddingProfile: vi.fn(() => null),
        }));
        vi.doMock('../handlers/mutation-hooks.js', () => ({
          runPostMutationHooks: vi.fn(() => {}),
        }));
        vi.doMock('../handlers/memory-index-alias.js', () => ({
          EMPTY_ALIAS_CONFLICT_SUMMARY: {
            groups: 0,
            rows: 0,
            identicalHashGroups: 0,
            divergentHashGroups: 0,
            samples: [],
          },
          createDefaultDivergenceReconcileSummary: () => ({
            retriesScheduled: 0,
            escalated: 0,
            errors: [],
            attempted: 0,
          }),
          detectAliasConflictsFromIndex: vi.fn(() => ({
            groups: 0,
            rows: 0,
            identicalHashGroups: 0,
            divergentHashGroups: 0,
            samples: [],
          })),
          summarizeAliasConflicts: vi.fn(() => ({
            groups: 0,
            rows: 0,
            identicalHashGroups: 0,
            divergentHashGroups: 0,
            samples: [],
          })),
          runDivergenceReconcileHooks: vi.fn(() => ({
            retriesScheduled: 0,
            escalated: 0,
            errors: [],
            attempted: 0,
          })),
        }));

        const isolatedHandler = await import('../handlers/memory-index');
        const response = await isolatedHandler.handleMemoryIndexScan({
          specFolder: 'system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity',
          includeConstitutional: false,
          includeSpecDocs: true,
          incremental: false,
        });
        const envelope = JSON.parse((response as any).content[0].text) as {
          data: {
            batchSize: number;
            failed: number;
            files: Array<{ error?: string }>;
          };
        };

        expect(indexMemoryFileMock).toHaveBeenCalledTimes(5);
        expect(indexMemoryFileMock.mock.calls.every(([, options]) => (options as { fromScan?: boolean } | undefined)?.fromScan === true)).toBe(true);
        expect(transactionalRecheckCalls).toBe(0);
        expect(envelope.data.batchSize).toBe(BATCH_SIZE);
        expect(envelope.data.failed).toBe(0);
        expect(envelope.data.files.some((entry) => entry.error === 'candidate_changed')).toBe(false);
      } finally {
        if (previousBasePath === undefined) {
          delete process.env.MEMORY_BASE_PATH;
        } else {
          process.env.MEMORY_BASE_PATH = previousBasePath;
        }
        vi.resetModules();
        fs.rmSync(root, { recursive: true, force: true });
      }
    });

    it('keeps non-scan indexSingleFile calls on the normal path so the guard stays conditional', async () => {
      vi.resetModules();
      let transactionalRecheckCalls = 0;

      const indexMemoryFileMock = vi.fn(async (_filePath: string, options?: { fromScan?: boolean }) => {
        if (!options?.fromScan) {
          transactionalRecheckCalls += 1;
          throw new Error('candidate_changed');
        }
        return {
          status: 'indexed',
          id: 2001,
          title: 'Indexed spec doc',
        };
      });

      vi.doMock('../handlers/memory-save.js', () => ({
        indexMemoryFile: indexMemoryFileMock,
      }));

      const isolatedHandler = await import('../handlers/memory-index');

      await expect(
        isolatedHandler.indexSingleFile('/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/spec.md'),
      ).rejects.toThrow('candidate_changed');

      expect(transactionalRecheckCalls).toBe(1);
      expect(indexMemoryFileMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.not.objectContaining({ fromScan: true }),
      );

      vi.resetModules();
    });

    it('bypasses the real memory-save transactional recheck when fromScan=true', async () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-index-real-fromscan-'));
      const filePath = path.join(
        root,
        '.opencode',
        'specs',
        'system-spec-kit',
        '026-graph-and-context-optimization',
        '010-memory-indexer-lineage-and-concurrency-fix',
        'implementation-summary.md',
      );
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, '# placeholder\n', 'utf8');

      const database = new BetterSqlite3(':memory:');

      try {
        const harness = await loadRealMemorySaveGuardHarness(database);
        const result = await harness.module.indexMemoryFile(filePath, {
          force: true,
          asyncEmbedding: false,
          fromScan: true,
        });

        expect(harness.runReconsolidationIfEnabledMock).toHaveBeenCalledTimes(1);
        expect(harness.findScopeFilteredCandidatesMock).not.toHaveBeenCalled();
        expect(harness.createMemoryRecordMock).toHaveBeenCalledTimes(1);
        expect(result.status).toBe('indexed');
        expect(result.id).toBe(4101);
      } finally {
        database.close();
        resetRealMemorySaveHarnessMocks();
        fs.rmSync(root, { recursive: true, force: true });
      }
    });

    it('keeps the real memory-save transactional recheck active when fromScan is omitted', async () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-index-real-nonscan-'));
      const filePath = path.join(
        root,
        '.opencode',
        'specs',
        'system-spec-kit',
        '026-graph-and-context-optimization',
        '010-memory-indexer-lineage-and-concurrency-fix',
        'implementation-summary.md',
      );
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, '# placeholder\n', 'utf8');

      const database = new BetterSqlite3(':memory:');

      try {
        const harness = await loadRealMemorySaveGuardHarness(database);
        const result = await harness.module.indexMemoryFile(filePath, {
          force: true,
          asyncEmbedding: false,
        });

        expect(harness.runReconsolidationIfEnabledMock).toHaveBeenCalledTimes(1);
        expect(harness.findScopeFilteredCandidatesMock).toHaveBeenCalledTimes(1);
        expect(harness.createMemoryRecordMock).not.toHaveBeenCalled();
        expect(result.status).toBe('error');
        expect(result.error).toContain('candidate_changed');
        expect(result.saveTimeReconsolidation).toMatchObject({
          status: 'failed',
          reason: 'candidate_changed',
          persistedState: {
            kind: expect.any(String),
            candidateMemoryIds: [77],
          },
        });
      } finally {
        database.close();
        resetRealMemorySaveHarnessMocks();
        fs.rmSync(root, { recursive: true, force: true });
      }
    });
  });

  describe('summarizeAliasConflicts', () => {
    it('T520-9d: detects identical-hash alias groups', () => {
      const summary = handler.summarizeAliasConflicts([
        {
          file_path: workspaceSpecPath('specs', '200-test', 'implementation-summary.md'),
          content_hash: 'hash-1',
        },
        {
          file_path: workspaceSpecPath('.opencode/specs', '200-test', 'implementation-summary.md'),
          content_hash: 'hash-1',
        },
      ]);

      expect(summary.groups).toBe(1);
      expect(summary.rows).toBe(2);
      expect(summary.identicalHashGroups).toBe(1);
      expect(summary.divergentHashGroups).toBe(0);
      expect(summary.samples).toHaveLength(1);
      expect(summary.samples[0].hashState).toBe('identical');
    });

    it('T520-9e: detects divergent-hash alias groups', () => {
      const summary = handler.summarizeAliasConflicts([
        {
          file_path: workspaceSpecPath('specs', '201-test', 'plan.md'),
          content_hash: 'hash-1',
        },
        {
          file_path: workspaceSpecPath('.opencode/specs', '201-test', 'plan.md'),
          content_hash: 'hash-2',
        },
      ]);

      expect(summary.groups).toBe(1);
      expect(summary.identicalHashGroups).toBe(0);
      expect(summary.divergentHashGroups).toBe(1);
      expect(summary.samples[0].hashState).toBe('divergent');
    });

    it('T520-9f: ignores rows that are not cross-root aliases', () => {
      const summary = handler.summarizeAliasConflicts([
        {
          file_path: workspaceSpecPath('specs', '300-test', 'tasks.md'),
          content_hash: 'hash-1',
        },
        {
          file_path: workspaceSpecPath('specs', '301-test', 'tasks.md'),
          content_hash: 'hash-1',
        },
      ]);

      expect(summary.groups).toBe(0);
      expect(summary.rows).toBe(0);
      expect(summary.identicalHashGroups).toBe(0);
      expect(summary.divergentHashGroups).toBe(0);
      expect(summary.samples).toHaveLength(0);
    });
  });

  describe('runDivergenceReconcileHooks', () => {
    it('T520-9g: applies bounded retries then escalation deterministically', () => {
      const attempts = new Map<string, number>();

      const reconcileHook: NonNullable<
        Parameters<typeof handler.runDivergenceReconcileHooks>[1]
      >['reconcileHook'] = (_db, input) => {
        const maxRetries = input.maxRetries ?? 3;
        const attemptsSoFar = attempts.get(input.normalizedPath) ?? 0;
        const shouldRetry = attemptsSoFar < maxRetries;
        if (shouldRetry) {
          attempts.set(input.normalizedPath, attemptsSoFar + 1);
          return {
            policy: {
              normalizedPath: input.normalizedPath,
              attemptsSoFar,
              nextAttempt: attemptsSoFar + 1,
              maxRetries,
              shouldRetry: true,
              exhausted: false,
            },
            retryEntryId: attemptsSoFar + 1,
            escalationEntryId: null,
            escalation: null,
          };
        }

        return {
          policy: {
            normalizedPath: input.normalizedPath,
            attemptsSoFar,
            nextAttempt: attemptsSoFar + 1,
            maxRetries,
            shouldRetry: false,
            exhausted: true,
          },
          retryEntryId: null,
          escalationEntryId: 999,
          escalation: {
            code: 'E_DIVERGENCE_RECONCILE_RETRY_EXHAUSTED',
            normalizedPath: input.normalizedPath,
            attempts: attemptsSoFar,
            maxRetries,
            recommendation: 'manual_triage_required',
            reason: `Auto-reconcile exhausted after ${maxRetries} attempt(s)`,
            variants: input.variants ?? [],
          },
        };
      };

      const aliasConflicts = {
        groups: 1,
        rows: 2,
        identicalHashGroups: 0,
        divergentHashGroups: 1,
        unknownHashGroups: 0,
        samples: [
          {
            normalizedPath: workspaceSpecPath('specs', '777-test', 'implementation-summary.md'),
            hashState: 'divergent' as const,
            variants: [
              workspaceSpecPath('specs', '777-test', 'implementation-summary.md'),
              workspaceSpecPath('.opencode/specs', '777-test', 'implementation-summary.md'),
            ],
          },
        ],
      };

      const options = {
        maxRetries: 2,
        requireDatabase: () => ({}) as never,
        reconcileHook,
      };

      const first = handler.runDivergenceReconcileHooks(aliasConflicts, options);
      const second = handler.runDivergenceReconcileHooks(aliasConflicts, options);
      const third = handler.runDivergenceReconcileHooks(aliasConflicts, options);

      expect(first.candidates).toBe(1);
      expect(first.retriesScheduled).toBe(1);
      expect(first.escalated).toBe(0);
      expect(second.retriesScheduled).toBe(1);
      expect(second.escalated).toBe(0);
      expect(third.retriesScheduled).toBe(0);
      expect(third.escalated).toBe(1);
      expect(third.escalations).toHaveLength(1);
      expect(third.escalations[0].code).toBe('E_DIVERGENCE_RECONCILE_RETRY_EXHAUSTED');
      expect(third.escalations[0].attempts).toBe(2);
    });

    it('T520-9h: skips database hook when no divergent samples exist', () => {
      let dbCalls = 0;
      const summary = handler.runDivergenceReconcileHooks(
        {
          groups: 1,
          rows: 2,
          identicalHashGroups: 1,
          divergentHashGroups: 0,
          unknownHashGroups: 0,
          samples: [
            {
              normalizedPath: workspaceSpecPath('specs', '778-test', 'plan.md'),
              hashState: 'identical',
              variants: [
                workspaceSpecPath('specs', '778-test', 'plan.md'),
                workspaceSpecPath('.opencode/specs', '778-test', 'plan.md'),
              ],
            },
          ],
        },
        {
          requireDatabase: () => {
            dbCalls++;
            throw new Error('should not be called');
          },
        }
      );

      expect(dbCalls).toBe(0);
      expect(summary.candidates).toBe(0);
      expect(summary.retriesScheduled).toBe(0);
      expect(summary.escalated).toBe(0);
      expect(summary.errors).toHaveLength(0);
    });

    it('T520-9i: expands beyond sample cap when divergent group count is higher', () => {
      const calledPaths: string[] = [];
      const rows = [
        { file_path: workspaceSpecPath('specs', '801-a', 'implementation-summary.md'), content_hash: 'hash-a' },
        { file_path: workspaceSpecPath('.opencode/specs', '801-a', 'implementation-summary.md'), content_hash: 'hash-b' },
        { file_path: workspaceSpecPath('specs', '802-b', 'plan.md'), content_hash: 'hash-c' },
        { file_path: workspaceSpecPath('.opencode/specs', '802-b', 'plan.md'), content_hash: 'hash-d' },
        { file_path: workspaceSpecPath('specs', '803-c', 'tasks.md'), content_hash: 'hash-e' },
        { file_path: workspaceSpecPath('.opencode/specs', '803-c', 'tasks.md'), content_hash: 'hash-f' },
      ];

      const fakeDb = {
        prepare: () => ({
          all: () => rows,
        }),
      };

      const summary = handler.runDivergenceReconcileHooks(
        {
          groups: 7,
          rows: 14,
          identicalHashGroups: 2,
          divergentHashGroups: 3,
          unknownHashGroups: 2,
          samples: [
            {
              normalizedPath: workspaceSpecPath('specs', '801-a', 'implementation-summary.md'),
              hashState: 'divergent',
              variants: [
                workspaceSpecPath('specs', '801-a', 'implementation-summary.md'),
                workspaceSpecPath('.opencode/specs', '801-a', 'implementation-summary.md'),
              ],
            },
          ],
        },
        {
          requireDatabase: () => fakeDb as never,
          reconcileHook: (_db, input) => {
            calledPaths.push(input.normalizedPath);
            return {
              policy: {
                normalizedPath: input.normalizedPath,
                attemptsSoFar: 0,
                nextAttempt: 1,
                maxRetries: 3,
                shouldRetry: true,
                exhausted: false,
              },
              retryEntryId: 1,
              escalationEntryId: null,
              escalation: null,
            };
          },
        }
      );

      expect(summary.candidates).toBe(3);
      expect(summary.retriesScheduled).toBe(3);
      expect(summary.escalated).toBe(0);
      expect(summary.errors).toHaveLength(0);
      expect(calledPaths).toEqual([
        workspaceSpecPath('specs', '801-a', 'implementation-summary.md'),
        workspaceSpecPath('specs', '802-b', 'plan.md'),
        workspaceSpecPath('specs', '803-c', 'tasks.md'),
      ]);
    });
  });

  describe('handleMemoryIndexScan Input/Behavior', () => {
    it('T520-10: empty args returns valid response', async () => {
      try {
        const result = await handler.handleMemoryIndexScan({});
        expect(result).toBeTruthy();
        expect(result.content).toBeTruthy();
        expect(result.content.length).toBeGreaterThan(0);

        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data || parsed.summary).toBeTruthy();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        const isServerDep = /database|getDb|Rate limited|vector_index|null|not initialized|Database/.test(message);
        if (!isServerDep) {
          throw error;
        }
      }
    });
  });
});
