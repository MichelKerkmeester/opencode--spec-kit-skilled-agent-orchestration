// TEST: HANDLER MEMORY SAVE
import { describe, it, expect, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// DB-dependent imports - commented out for deferred test suite
import * as handler from '../handlers/memory-save';
import { getCanonicalPathKey } from '../lib/utils/canonical-path';

const MEMORY_SAVE_SOURCE = fs.readFileSync(path.join(__dirname, '..', 'handlers', 'memory-save.ts'), 'utf8');

describe('Handler Memory Save (T518) [deferred - requires DB test fixtures]', () => {
  describe('Exports Validation', () => {
    it('T518-1: handleMemorySave exported', () => {
      expect(typeof handler.handleMemorySave).toBe('function');
    });

    it('T518-2: indexMemoryFile exported', () => {
      expect(typeof handler.indexMemoryFile).toBe('function');
    });

    it('T518-3: atomicSaveMemory exported', () => {
      expect(typeof handler.atomicSaveMemory).toBe('function');
    });

    it('T518-4: getAtomicityMetrics exported', () => {
      expect(typeof handler.getAtomicityMetrics).toBe('function');
    });

    it('T518-5: escapeLikePattern exported', () => {
      expect(typeof handler.escapeLikePattern).toBe('function');
    });

    it('T518-6: All snake_case aliases exported', () => {
      const aliases = [
        'handle_memory_save',
        'index_memory_file',
        'atomic_save_memory',
        'get_atomicity_metrics',
        'find_similar_memories',
        'reinforce_existing_memory',
        'mark_memory_superseded',
        'update_existing_memory',
        'log_pe_decision',
        'process_causal_links',
        'resolve_memory_reference',
      ] as const satisfies readonly (keyof typeof handler)[];
      for (const alias of aliases) {
        expect(typeof handler[alias]).toBe('function');
      }
    });

    it('T518-6b: indexMemoryFile integrates runQualityLoop in save flow', () => {
      expect(MEMORY_SAVE_SOURCE).toContain('const qualityLoopResult = runQualityLoop(');
    });

    it('T518-6c: same-path supersedes route through append-only lineage helpers', () => {
      expect(MEMORY_SAVE_SOURCE).toContain('createAppendOnlyMemoryRecord');
      expect(MEMORY_SAVE_SOURCE).toContain('recordLineageVersion');
      expect(MEMORY_SAVE_SOURCE).toContain("predecessorMemoryId: existing.id");
    });
  });

  describe('Input Validation', () => {
    it('T518-7: Missing filePath throws error', async () => {
      await expect(handler.handleMemorySave({} as Parameters<typeof handler.handleMemorySave>[0])).rejects.toThrow(/filePath.*required/);
    });

    it('T518-8: Null filePath throws error', async () => {
      await expect(
        handler.handleMemorySave({ filePath: null } as unknown as Parameters<typeof handler.handleMemorySave>[0])
      ).rejects.toThrow(/filePath/);
    });

    it('T518-9: Non-string filePath throws error', async () => {
      await expect(
        handler.handleMemorySave({ filePath: 12345 } as unknown as Parameters<typeof handler.handleMemorySave>[0])
      ).rejects.toThrow(/filePath.*string/);
    });

    it('T518-10: Path traversal blocked', async () => {
      await expect(
        handler.handleMemorySave({ filePath: '/specs/../../../etc/passwd' })
      ).rejects.toThrow();
    });

    it('T518-11: Non-memory file rejected', async () => {
      await expect(
        handler.handleMemorySave({ filePath: '/tmp/not-a-memory-file.txt' })
      ).rejects.toThrow();
    });
  });

  describe('escapeLikePattern Helper', () => {
    it('T518-12: Escapes % character', () => {
      const result = handler.escapeLikePattern('100% done');
      expect(result).toBe('100\\% done');
    });
  });

  describe('atomic-save failure injection', () => {
    const tempDirs: string[] = [];

    function createAtomicSaveTargetPath(fileName: string): string {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atomic-save-fi-'));
      tempDirs.push(dir);
      return path.join(dir, fileName);
    }

    function buildParsedMemory(targetPath: string) {
      return {
        specFolder: 'specs/999-atomic-save-fi',
        filePath: targetPath,
        title: 'Atomic Save FI',
        triggerPhrases: ['atomic-save-fi'],
        content: [
          '---',
          'title: "Atomic Save FI"',
          'description: "Contract-compliant memory-save fixture."',
          'trigger_phrases:',
          '  - "atomic save fi"',
          'importance_tier: "normal"',
          'contextType: "general"',
          '---',
          '',
          '# Atomic Save FI',
          '',
          '## SESSION SUMMARY',
          '',
          '| **Meta Data** | **Value** |',
          '|:--------------|:----------|',
          '| Total Messages | 2 |',
          '',
          '<!-- ANCHOR:continue-session -->',
          '<a id="continue-session"></a>',
          '',
          '## CONTINUE SESSION',
          '',
          'Continue from the last stable checkpoint.',
          '',
          '<!-- ANCHOR:project-state-snapshot -->',
          '<a id="project-state-snapshot"></a>',
          '',
          '## PROJECT STATE SNAPSHOT',
          '',
          'Memory save handler regression fixture.',
          '',
          '<!-- ANCHOR:decisions -->',
          '<a id="decisions"></a>',
          '',
          '## 2. DECISIONS',
          '',
          'Atomic save flow should preserve durable data.',
          '',
          '<!-- ANCHOR:session-history -->',
          '<a id="conversation"></a>',
          '',
          '## 3. CONVERSATION',
          '',
          'Single fixture memory for indexing tests.',
          '',
          '<!-- ANCHOR:recovery-hints -->',
          '<a id="recovery-hints"></a>',
          '',
          '## RECOVERY HINTS',
          '',
          'Retry the atomic save test with the same fixture.',
          '',
          '<!-- ANCHOR:metadata -->',
          '<a id="memory-metadata"></a>',
          '',
          '## MEMORY METADATA',
          '',
          '```yaml',
          'session_id: "atomic-save-fi"',
          '```',
          '',
          '<!-- /ANCHOR:metadata -->',
        ].join('\n'),
        contentHash: 'fi-hash',
        contextType: 'general',
        importanceTier: 'normal',
        hasCausalLinks: false,
      };
    }

    function buildIndexResult(overrides: Record<string, unknown> = {}) {
      return {
        status: 'indexed',
        id: 101,
        specFolder: 'specs/999-atomic-save-fi',
        title: 'Atomic Save FI',
        message: 'Indexed successfully',
        embeddingStatus: 'success',
        ...overrides,
      };
    }

    async function loadAtomicSaveHarness(options: {
      parseMemoryFileMock?: ReturnType<typeof vi.fn>;
      parseMemoryContentMock?: ReturnType<typeof vi.fn>;
      isMemoryFileMock?: ReturnType<typeof vi.fn>;
      checkExistingRowMock?: ReturnType<typeof vi.fn>;
      checkContentHashDedupMock?: ReturnType<typeof vi.fn>;
      runQualityGateMock?: ReturnType<typeof vi.fn>;
      isSaveQualityGateEnabledMock?: ReturnType<typeof vi.fn>;
      evaluateMemorySufficiencyMock?: ReturnType<typeof vi.fn>;
      embeddingPipelineModuleFactory?: () => Record<string, unknown>;
      peOrchestrationModuleFactory?: () => Record<string, unknown>;
      createRecordModuleFactory?: () => unknown;
      postInsertModuleFactory?: () => unknown;
      responseBuilderModuleFactory?: () => unknown | Promise<unknown>;
      chunkingModuleFactory?: () => unknown | Promise<unknown>;
    } = {}) {
      vi.resetModules();

      const parseMemoryFileMock = options.parseMemoryFileMock
        ?? vi.fn((targetPath: string) => buildParsedMemory(targetPath));
      const parseMemoryContentMock = options.parseMemoryContentMock
        ?? parseMemoryFileMock;
      const isMemoryFileMock = options.isMemoryFileMock
        ?? vi.fn(() => true);
      const validateParsedMemoryMock = vi.fn(() => ({ valid: true, errors: [], warnings: [] }));
      const runQualityLoopMock = vi.fn(() => ({
        score: { total: 0, issues: [] },
        fixes: [],
        passed: true,
        rejected: false,
        fixedTriggerPhrases: undefined,
      }));
      const checkExistingRowMock = options.checkExistingRowMock
        ?? vi.fn(() => buildIndexResult());
      const checkContentHashDedupMock = options.checkContentHashDedupMock
        ?? vi.fn(() => null);
      const runQualityGateMock = options.runQualityGateMock
        ?? vi.fn(() => ({ pass: true, warnOnly: false, reasons: [], layers: {} }));
      const isSaveQualityGateEnabledMock = options.isSaveQualityGateEnabledMock
        ?? vi.fn(() => false);
      const evaluateMemorySufficiencyMock = options.evaluateMemorySufficiencyMock
        ?? vi.fn(() => ({
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
            triggerPhrases: 4,
          },
          score: 0.92,
        }));

      const transactionManagerActual = await vi.importActual<typeof import('../lib/storage/transaction-manager')>(
        '../lib/storage/transaction-manager'
      );
      const executeAtomicSaveMock = vi.fn((filePath: string, content: string, dbOperation: () => void) =>
        transactionManagerActual.executeAtomicSave(filePath, content, dbOperation)
      );
      const deleteFileIfExistsMock = vi.fn((filePath: string) =>
        transactionManagerActual.deleteFileIfExists(filePath)
      );
      const atomicWriteFileMock = vi.fn((filePath: string, content: string) =>
        transactionManagerActual.atomicWriteFile(filePath, content)
      );

      vi.doMock('../lib/storage/transaction-manager', () => ({
        ...transactionManagerActual,
        executeAtomicSave: executeAtomicSaveMock,
        deleteFileIfExists: deleteFileIfExistsMock,
        atomicWriteFile: atomicWriteFileMock,
      }));

      vi.doMock('../lib/parsing/memory-parser', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../lib/parsing/memory-parser')>();
        return {
          ...actual,
          parseMemoryFile: parseMemoryFileMock,
          parseMemoryContent: parseMemoryContentMock,
          isMemoryFile: isMemoryFileMock,
          validateParsedMemory: validateParsedMemoryMock,
        };
      });

      vi.doMock('../handlers/quality-loop', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../handlers/quality-loop')>();
        return {
          ...actual,
          runQualityLoop: runQualityLoopMock,
        };
      });

      vi.doMock('../handlers/save/dedup', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../handlers/save/dedup')>();
        return {
          ...actual,
          checkExistingRow: checkExistingRowMock,
          checkContentHashDedup: checkContentHashDedupMock,
        };
      });

      if (options.embeddingPipelineModuleFactory) {
        vi.doMock('../handlers/save/embedding-pipeline', options.embeddingPipelineModuleFactory);
      }

      if (options.peOrchestrationModuleFactory) {
        vi.doMock('../handlers/save/pe-orchestration', options.peOrchestrationModuleFactory);
      }

      if (options.createRecordModuleFactory) {
        vi.doMock('../handlers/save/create-record', options.createRecordModuleFactory as any);
      }

      if (options.postInsertModuleFactory) {
        vi.doMock('../handlers/save/post-insert', options.postInsertModuleFactory as any);
      }

      if (options.responseBuilderModuleFactory) {
        vi.doMock('../handlers/save/response-builder', options.responseBuilderModuleFactory as any);
      }

      if (options.chunkingModuleFactory) {
        vi.doMock('../handlers/chunking-orchestrator', options.chunkingModuleFactory as any);
      }

      vi.doMock('../utils/validators', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../utils/validators')>();
        return {
          ...actual,
          createFilePathValidator: vi.fn(() => ((candidatePath: string) => candidatePath)),
        };
      });

      vi.doMock('../lib/validation/save-quality-gate', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../lib/validation/save-quality-gate')>();
        return {
          ...actual,
          runQualityGate: runQualityGateMock,
          isQualityGateEnabled: vi.fn(() => true),
        };
      });

      vi.doMock('../lib/search/search-flags', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../lib/search/search-flags')>();
        return {
          ...actual,
          isSaveQualityGateEnabled: isSaveQualityGateEnabledMock,
          isQualityLoopEnabled: vi.fn(() => false),
        };
      });

      vi.doMock('@spec-kit/shared/parsing/memory-sufficiency', () => ({
        MEMORY_SUFFICIENCY_REJECTION_CODE: 'INSUFFICIENT_CONTEXT_ABORT',
        evaluateMemorySufficiency: evaluateMemorySufficiencyMock,
      }));

      vi.doMock('../utils', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../utils')>();
        return {
          ...actual,
          requireDb: vi.fn(() => ({
            prepare: vi.fn(() => ({
              get: vi.fn(() => undefined),
              all: vi.fn(() => []),
              run: vi.fn(() => ({ changes: 0 })),
            })),
            transaction: vi.fn((fn: (...args: unknown[]) => unknown) => fn),
          })),
        };
      });

      const module = await import('../handlers/memory-save');
      return {
        module,
        parseMemoryFileMock,
        parseMemoryContentMock,
        runQualityLoopMock,
        evaluateMemorySufficiencyMock,
        checkExistingRowMock,
        checkContentHashDedupMock,
        executeAtomicSaveMock,
        deleteFileIfExistsMock,
      };
    }

    afterEach(() => {
      for (const dir of tempDirs.splice(0, tempDirs.length)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }

        vi.doUnmock('../lib/storage/transaction-manager');
        vi.doUnmock('../lib/parsing/memory-parser');
        vi.doUnmock('../handlers/quality-loop');
        vi.doUnmock('../handlers/save/dedup');
        vi.doUnmock('../handlers/save/embedding-pipeline');
        vi.doUnmock('../handlers/save/pe-orchestration');
        vi.doUnmock('../handlers/save/create-record');
        vi.doUnmock('../handlers/save/post-insert');
        vi.doUnmock('../handlers/save/response-builder');
        vi.doUnmock('../handlers/chunking-orchestrator');
        vi.doUnmock('../lib/validation/save-quality-gate');
        vi.doUnmock('../lib/search/search-flags');
        vi.doUnmock('@spec-kit/shared/parsing/memory-sufficiency');
        vi.doUnmock('../utils/validators');
        vi.doUnmock('../utils');
        vi.restoreAllMocks();
        vi.resetModules();
    });

    it('retries when indexMemoryFile throws once then succeeds', async () => {
      const parseMemoryFileMock = vi.fn()
        .mockImplementationOnce(() => {
          throw new Error('simulated transient indexing failure');
        })
        .mockImplementation((targetPath: string) => buildParsedMemory(targetPath));

      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock: parseMemoryFileMock,
        checkExistingRowMock: vi.fn(() => buildIndexResult({ status: 'indexed', id: 201 })),
      });

      const filePath = createAtomicSaveTargetPath('retry-once.md');
      const result = await harness.module.atomicSaveMemory(
        { file_path: filePath, content: '# retry once' },
        { force: true }
      );

      expect(result.success).toBe(true);
      expect(harness.parseMemoryContentMock).toHaveBeenCalledTimes(2);
      expect(harness.checkExistingRowMock).toHaveBeenCalledTimes(1);
      expect(harness.deleteFileIfExistsMock).toHaveBeenCalledTimes(1);
      expect(harness.deleteFileIfExistsMock).toHaveBeenCalledWith(path.join(path.dirname(filePath), 'retry-once_pending.md'));
    });

    it('rolls back written file when indexMemoryFile throws on both attempts', async () => {
      const parseMemoryFileMock = vi.fn(() => {
        throw new Error('simulated persistent indexing failure');
      });

      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock: parseMemoryFileMock,
      });

      const filePath = createAtomicSaveTargetPath('throw-both.md');
      const result = await harness.module.atomicSaveMemory(
        { file_path: filePath, content: '# throw both attempts' },
        { force: true }
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('error');
      expect(result.error).toContain('Indexing failed after retry');
      expect(harness.parseMemoryContentMock).toHaveBeenCalledTimes(2);
      expect(harness.checkExistingRowMock).not.toHaveBeenCalled();
      expect(harness.deleteFileIfExistsMock.mock.calls.length).toBeGreaterThanOrEqual(2);
      expect(harness.deleteFileIfExistsMock).toHaveBeenCalledWith(path.join(path.dirname(filePath), 'throw-both_pending.md'));
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('treats indexMemoryFile status=error as failure and retries once', async () => {
      const checkExistingRowMock = vi.fn()
        .mockReturnValueOnce(
          buildIndexResult({
            status: 'error',
            id: 0,
            message: 'forced error status',
            error: 'forced error status',
          })
        )
        .mockReturnValueOnce(buildIndexResult({ status: 'indexed', id: 301 }));

      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock,
      });

      const filePath = createAtomicSaveTargetPath('status-error-then-success.md');
      const result = await harness.module.atomicSaveMemory(
        { file_path: filePath, content: '# status error then success' },
        { force: true }
      );

      expect(result.success).toBe(true);
      expect(harness.parseMemoryContentMock).toHaveBeenCalledTimes(2);
      expect(harness.checkExistingRowMock).toHaveBeenCalledTimes(2);
      expect(harness.deleteFileIfExistsMock).toHaveBeenCalledTimes(1);
    });

    it('treats indexMemoryFile status=rejected as non-retry rollback outcome', async () => {
      const checkExistingRowMock = vi.fn().mockReturnValue(
        buildIndexResult({
          status: 'rejected',
          id: 0,
          message: 'Quality gate rejected: signal density too low',
          rejectionReason: 'Quality gate rejected: signal density too low',
        })
      );

      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock,
      });

      const filePath = createAtomicSaveTargetPath('status-rejected.md');
      const result = await harness.module.atomicSaveMemory(
        { file_path: filePath, content: '# rejected outcome' },
        { force: true }
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('rejected');
      expect(result.message).toContain('Quality gate rejected');
      expect(harness.parseMemoryContentMock).toHaveBeenCalledTimes(1);
      expect(harness.checkExistingRowMock).toHaveBeenCalledTimes(1);
      expect(harness.deleteFileIfExistsMock).toHaveBeenCalledTimes(1);
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('does not persist embedding cache writes before hard quality-gate rejection', async () => {
      const persistPendingEmbeddingCacheWriteMock = vi.fn();
      const runQualityGateMock = vi.fn(() => ({
        pass: false,
        warnOnly: false,
        reasons: ['signal density too low'],
        layers: { semantic: { pass: false } },
      }));

      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock: vi.fn(() => null),
        runQualityGateMock,
        isSaveQualityGateEnabledMock: vi.fn(() => true),
        embeddingPipelineModuleFactory: () => ({
          generateOrCacheEmbedding: vi.fn(async () => ({
            embedding: new Float32Array([0.1, 0.2, 0.3]),
            status: 'success',
            failureReason: null,
            pendingCacheWrite: {
              cacheKey: 'cache-key',
              modelId: 'test-model',
              embeddingBuffer: Buffer.from([1, 2, 3]),
              dimensions: 3,
            },
          })),
          persistPendingEmbeddingCacheWrite: persistPendingEmbeddingCacheWriteMock,
        }),
      });

      const filePath = createAtomicSaveTargetPath('quality-gate-rejected.md');
      const result = await harness.module.indexMemoryFile(filePath, { force: true, asyncEmbedding: false });

      expect(result.status).toBe('rejected');
      expect(runQualityGateMock).toHaveBeenCalledTimes(1);
      expect(persistPendingEmbeddingCacheWriteMock).not.toHaveBeenCalled();
    });

    it('persists deferred embedding cache write after quality gate passes', async () => {
      const persistPendingEmbeddingCacheWriteMock = vi.fn();

      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock: vi.fn(() => null),
        runQualityGateMock: vi.fn(() => ({ pass: true, warnOnly: false, reasons: [], layers: {} })),
        isSaveQualityGateEnabledMock: vi.fn(() => true),
        embeddingPipelineModuleFactory: () => ({
          generateOrCacheEmbedding: vi.fn(async () => ({
            embedding: new Float32Array([0.1, 0.2, 0.3]),
            status: 'success',
            failureReason: null,
            pendingCacheWrite: {
              cacheKey: 'cache-key',
              modelId: 'test-model',
              embeddingBuffer: Buffer.from([1, 2, 3]),
              dimensions: 3,
            },
          })),
          persistPendingEmbeddingCacheWrite: persistPendingEmbeddingCacheWriteMock,
        }),
        peOrchestrationModuleFactory: () => ({
          evaluateAndApplyPeDecision: vi.fn(() => ({
            decision: { action: 'CREATE', similarity: 0 },
            earlyReturn: buildIndexResult({ status: 'indexed', id: 401 }),
          })),
        }),
      });

      const filePath = createAtomicSaveTargetPath('quality-gate-passed.md');
      const result = await harness.module.indexMemoryFile(filePath, { force: true, asyncEmbedding: false });

      expect(result.status).toBe('indexed');
      expect(persistPendingEmbeddingCacheWriteMock).toHaveBeenCalledTimes(1);
    });

    it('persists quality-loop trigger phrase fixes into downstream save inputs', async () => {
      const runQualityGateMock = vi.fn(() => ({ pass: true, warnOnly: false, reasons: [], layers: {} }));
      const checkExistingRowMock = vi.fn(() => null);
      const checkContentHashDedupMock = vi.fn(() => null);
      const createMemoryRecordMock = vi.fn(() => 777);
      const runPostInsertEnrichmentMock = vi.fn(async () => ({ causalLinksResult: null }));
      const buildIndexResultMock = vi.fn(({ parsed }) => ({
        status: 'indexed',
        id: 777,
        specFolder: parsed.specFolder,
        title: parsed.title,
        triggerPhrases: parsed.triggerPhrases,
        embeddingStatus: 'success',
        message: 'Indexed successfully',
      }));
      const persistPendingEmbeddingCacheWriteMock = vi.fn();

      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock,
        checkContentHashDedupMock,
        runQualityGateMock,
        isSaveQualityGateEnabledMock: vi.fn(() => true),
        embeddingPipelineModuleFactory: () => ({
          generateOrCacheEmbedding: vi.fn(async () => ({
            embedding: new Float32Array([0.1, 0.2, 0.3]),
            status: 'success',
            failureReason: null,
            pendingCacheWrite: null,
          })),
          persistPendingEmbeddingCacheWrite: persistPendingEmbeddingCacheWriteMock,
        }),
        peOrchestrationModuleFactory: () => ({
          evaluateAndApplyPeDecision: vi.fn(() => ({
            decision: { action: 'CREATE', similarity: 0 },
            earlyReturn: null,
          })),
        }),
        createRecordModuleFactory: () => ({
          createMemoryRecord: createMemoryRecordMock,
        }),
        postInsertModuleFactory: () => ({
          runPostInsertEnrichment: runPostInsertEnrichmentMock,
        }),
        responseBuilderModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('../handlers/save/response-builder')>('../handlers/save/response-builder');
          return {
            ...actual,
            buildIndexResult: buildIndexResultMock,
          };
        },
      });

      harness.runQualityLoopMock.mockReturnValue({
        score: { total: 0.8, issues: [] },
        fixes: ['Re-extracted 4 trigger phrases from content'],
        passed: true,
        rejected: false,
        fixedContent: buildParsedMemory('quality-loop-trigger-fix.md').content,
        fixedTriggerPhrases: ['alpha', 'beta', 'gamma', 'delta'],
      } as any);

      const filePath = createAtomicSaveTargetPath('quality-loop-trigger-fix.md');
      fs.writeFileSync(filePath, '# original content', 'utf8');

      const result = await harness.module.indexMemoryFile(filePath, { force: true, asyncEmbedding: false });

      expect(result.status).toBe('indexed');
      expect(createMemoryRecordMock).toHaveBeenCalledTimes(1);
      expect((createMemoryRecordMock.mock.calls[0] as any)?.[1].triggerPhrases).toEqual(['alpha', 'beta', 'gamma', 'delta']);
      expect((createMemoryRecordMock.mock.calls[0] as any)?.[1].content).toBe(buildParsedMemory('quality-loop-trigger-fix.md').content);
      expect(fs.readFileSync(filePath, 'utf8')).toBe(buildParsedMemory('quality-loop-trigger-fix.md').content);
    });

    it('passes same-path exclusion into content-hash dedup after unchanged miss', async () => {
      const runQualityGateMock = vi.fn(() => ({ pass: true, warnOnly: false, reasons: [], layers: {} }));
      const checkExistingRowMock = vi.fn(() => null);
      const checkContentHashDedupMock = vi.fn(() => null);

      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock,
        checkContentHashDedupMock,
        runQualityGateMock,
        isSaveQualityGateEnabledMock: vi.fn(() => true),
        embeddingPipelineModuleFactory: () => ({
          generateOrCacheEmbedding: vi.fn(async () => ({
            embedding: new Float32Array([0.1, 0.2, 0.3]),
            status: 'success',
            failureReason: null,
            pendingCacheWrite: null,
          })),
          persistPendingEmbeddingCacheWrite: vi.fn(),
        }),
        peOrchestrationModuleFactory: () => ({
          evaluateAndApplyPeDecision: vi.fn(() => ({
            decision: { action: 'CREATE', similarity: 0 },
            earlyReturn: buildIndexResult({ status: 'indexed', id: 778 }),
          })),
        }),
      });

      const filePath = createAtomicSaveTargetPath('quality-loop-same-path-exclusion.md');
      fs.writeFileSync(filePath, '# original content', 'utf8');

      await harness.module.indexMemoryFile(filePath, { force: false, asyncEmbedding: false });

      expect(checkExistingRowMock).toHaveBeenCalledTimes(1);
      expect(checkContentHashDedupMock).toHaveBeenCalledTimes(1);
      expect((checkContentHashDedupMock.mock.calls[0] as any)?.[4]).toEqual({
        canonicalFilePath: getCanonicalPathKey(filePath),
        filePath,
      });
    });

    it('does not rewrite file before later hard rejection under atomic save', async () => {
      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock: vi.fn(() => null),
        runQualityGateMock: vi.fn(() => ({
          pass: false,
          warnOnly: false,
          reasons: ['signal density too low'],
          layers: { semantic: { pass: false } },
        })),
        isSaveQualityGateEnabledMock: vi.fn(() => true),
        embeddingPipelineModuleFactory: () => ({
          generateOrCacheEmbedding: vi.fn(async () => ({
            embedding: new Float32Array([0.1, 0.2, 0.3]),
            status: 'success',
            failureReason: null,
            pendingCacheWrite: null,
          })),
          persistPendingEmbeddingCacheWrite: vi.fn(),
        }),
      });
      harness.runQualityLoopMock.mockReturnValue({
        score: { total: 0.7, issues: [] },
        fixes: ['Re-extracted 4 trigger phrases from content'],
        passed: true,
        rejected: false,
        fixedContent: buildParsedMemory('reject-no-prewrite.md').content,
        fixedTriggerPhrases: ['alpha', 'beta', 'gamma', 'delta'],
      } as any);

      const filePath = createAtomicSaveTargetPath('reject-no-prewrite.md');
      fs.writeFileSync(filePath, '# original on disk', 'utf8');
      const result = await harness.module.atomicSaveMemory(
        { file_path: filePath, content: '# original atomic content' },
        { force: true }
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('rejected');
      expect(fs.readFileSync(filePath, 'utf8')).toBe('# original on disk');
    });

    it('does not rewrite file when PE gating short-circuits before create path', async () => {
      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock: vi.fn(() => null),
        runQualityGateMock: vi.fn(() => ({
          pass: true,
          warnOnly: false,
          reasons: [],
          layers: {},
        })),
        isSaveQualityGateEnabledMock: vi.fn(() => true),
        embeddingPipelineModuleFactory: () => ({
          generateOrCacheEmbedding: vi.fn(async () => ({
            embedding: new Float32Array([0.1, 0.2, 0.3]),
            status: 'success',
            failureReason: null,
            pendingCacheWrite: null,
          })),
          persistPendingEmbeddingCacheWrite: vi.fn(),
        }),
        peOrchestrationModuleFactory: () => ({
          evaluateAndApplyPeDecision: vi.fn(() => ({
            decision: { action: 'REINFORCE', similarity: 97.2 },
            earlyReturn: buildIndexResult({ status: 'reinforced', id: 902 }),
          })),
        }),
      });

      harness.runQualityLoopMock.mockReturnValue({
        score: { total: 0.7, issues: [] },
        fixes: ['Re-extracted 4 trigger phrases from content'],
        passed: true,
        rejected: false,
        fixedContent: buildParsedMemory('pe-early-return-no-prewrite.md').content,
        fixedTriggerPhrases: ['alpha', 'beta', 'gamma', 'delta'],
      } as any);

      const filePath = createAtomicSaveTargetPath('pe-early-return-no-prewrite.md');
      fs.writeFileSync(filePath, '# original on disk', 'utf8');

      const result = await harness.module.indexMemoryFile(filePath, { force: true, asyncEmbedding: false });

      expect(result.status).toBe('reinforced');
      expect(fs.readFileSync(filePath, 'utf8')).toBe('# original on disk');
    });

    it('rejects insufficient context before embedding even when force=true', async () => {
      const generateOrCacheEmbeddingMock = vi.fn();
      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock: vi.fn(() => null),
        evaluateMemorySufficiencyMock: vi.fn(() => ({
          pass: false,
          rejectionCode: 'INSUFFICIENT_CONTEXT_ABORT',
          reasons: ['No primary evidence was captured for this memory.'],
          evidenceCounts: {
            primary: 0,
            support: 1,
            total: 1,
            semanticChars: 88,
            uniqueWords: 16,
            anchors: 1,
            triggerPhrases: 1,
          },
          score: 0.18,
        })),
        embeddingPipelineModuleFactory: () => ({
          generateOrCacheEmbedding: generateOrCacheEmbeddingMock,
          persistPendingEmbeddingCacheWrite: vi.fn(),
        }),
      });

      const filePath = createAtomicSaveTargetPath('insufficient-context.md');
      fs.writeFileSync(filePath, '# too thin', 'utf8');

      const result = await harness.module.indexMemoryFile(filePath, { force: true, asyncEmbedding: false });

      expect(result.status).toBe('rejected');
      expect(result.rejectionCode).toBe('INSUFFICIENT_CONTEXT_ABORT');
      expect(result.sufficiency?.pass).toBe(false);
      expect(generateOrCacheEmbeddingMock).not.toHaveBeenCalled();
    });

    it('rejects template-contract violations before embedding', async () => {
      const generateOrCacheEmbeddingMock = vi.fn();
      const harness = await loadAtomicSaveHarness({
        parseMemoryFileMock: vi.fn((targetPath: string) => ({
          ...buildParsedMemory(targetPath),
          content: [
            '---',
            'title: "Broken contract memory"',
            'description: "Looks plausible but is missing required anchors."',
            'trigger_phrases:',
            '  - "broken contract memory"',
            'importance_tier: "normal"',
            'contextType: "general"',
            '---',
            '',
            '# Broken contract memory',
            '',
            '## SESSION SUMMARY',
            '',
            'No mandatory sections follow.',
          ].join('\n'),
        })),
        checkExistingRowMock: vi.fn(() => null),
        embeddingPipelineModuleFactory: () => ({
          generateOrCacheEmbedding: generateOrCacheEmbeddingMock,
          persistPendingEmbeddingCacheWrite: vi.fn(),
        }),
      });

      const filePath = createAtomicSaveTargetPath('template-contract-invalid.md');
      fs.writeFileSync(filePath, '# broken', 'utf8');

      const result = await harness.module.indexMemoryFile(filePath, { force: true, asyncEmbedding: false });

      expect(result.status).toBe('rejected');
      expect(result.rejectionReason).toMatch(/Template contract validation failed/);
      expect(generateOrCacheEmbeddingMock).not.toHaveBeenCalled();
    });

    it('reports insufficiency explicitly during dry-run without indexing', async () => {
      const checkExistingRowMock = vi.fn(() => buildIndexResult({ status: 'indexed', id: 1001 }));
      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock,
        evaluateMemorySufficiencyMock: vi.fn(() => ({
          pass: false,
          rejectionCode: 'INSUFFICIENT_CONTEXT_ABORT',
          reasons: [
            'No primary evidence was captured for this memory.',
            'Fewer than two spec-relevant evidence items were captured.',
          ],
          evidenceCounts: {
            primary: 0,
            support: 1,
            total: 1,
            semanticChars: 96,
            uniqueWords: 18,
            anchors: 1,
            triggerPhrases: 1,
          },
          score: 0.2,
        })),
      });

      const filePath = createAtomicSaveTargetPath('dryrun-insufficient.md');
      fs.writeFileSync(filePath, '# dry run insufficient', 'utf8');

      const response = await harness.module.handleMemorySave({
        filePath,
        dryRun: true,
        skipPreflight: true,
      } as Parameters<typeof harness.module.handleMemorySave>[0]);

      const payload = JSON.parse(String(response?.content?.[0]?.text ?? '{}'));
      expect(payload?.data?.status).toBe('dry_run');
      expect(payload?.data?.would_pass).toBe(false);
      expect(payload?.data?.rejectionCode).toBe('INSUFFICIENT_CONTEXT_ABORT');
      expect(payload?.data?.sufficiency?.pass).toBe(false);
      expect(checkExistingRowMock).not.toHaveBeenCalled();
    });

    it('returns dry-run response without indexing when dryRun and skipPreflight are both true', async () => {
      const checkExistingRowMock = vi.fn(() => buildIndexResult({ status: 'indexed', id: 999 }));
      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock,
      });

      const filePath = createAtomicSaveTargetPath('dryrun-skip-preflight.md');
      fs.writeFileSync(filePath, '# dry run original content', 'utf8');

      const response = await harness.module.handleMemorySave({
        filePath,
        dryRun: true,
        skipPreflight: true,
      } as Parameters<typeof harness.module.handleMemorySave>[0]);

      const payload = JSON.parse(String(response?.content?.[0]?.text ?? '{}'));
      expect(payload?.data?.status).toBe('dry_run');
      expect(payload?.data?.validation?.skipped).toBe(true);
      expect(checkExistingRowMock).not.toHaveBeenCalled();
      expect(fs.readFileSync(filePath, 'utf8')).toBe('# dry run original content');
    });

    it('persists quality-loop fixed content after successful chunked indexing', async () => {
      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock: vi.fn(() => null),
        checkContentHashDedupMock: vi.fn(() => null),
        chunkingModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('../handlers/chunking-orchestrator')>('../handlers/chunking-orchestrator');
          return {
            ...actual,
            needsChunking: vi.fn(() => true),
            indexChunkedMemoryFile: vi.fn(async () => ({
              status: 'indexed',
              id: 444,
              specFolder: 'specs/999-atomic-save-fi',
              title: 'Atomic Save FI',
              message: 'Chunked indexed',
            })),
          };
        },
      });

      harness.runQualityLoopMock.mockReturnValue({
        score: { total: 0.9, issues: [] },
        fixes: ['normalized structure'],
        passed: true,
        rejected: false,
        fixedContent: buildParsedMemory('chunked-quality-fix.md').content,
      } as any);

      const filePath = createAtomicSaveTargetPath('chunked-quality-fix.md');
      fs.writeFileSync(filePath, '# original chunked content', 'utf8');

      const result = await harness.module.indexMemoryFile(filePath, { force: true, asyncEmbedding: false });
      expect(result.status).toBe('indexed');
      expect(fs.readFileSync(filePath, 'utf8')).toBe(buildParsedMemory('chunked-quality-fix.md').content);
    });

    it('does not persist quality-loop fixed content when chunked indexing fails', async () => {
      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock: vi.fn(() => null),
        checkContentHashDedupMock: vi.fn(() => null),
        chunkingModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('../handlers/chunking-orchestrator')>('../handlers/chunking-orchestrator');
          return {
            ...actual,
            needsChunking: vi.fn(() => true),
            indexChunkedMemoryFile: vi.fn(async () => ({
              status: 'error',
              id: 0,
              specFolder: 'specs/999-atomic-save-fi',
              title: 'Atomic Save FI',
              message: 'Chunked indexing failed',
            })),
          };
        },
      });

      harness.runQualityLoopMock.mockReturnValue({
        score: { total: 0.9, issues: [] },
        fixes: ['normalized structure'],
        passed: true,
        rejected: false,
        fixedContent: buildParsedMemory('chunked-quality-fix-error.md').content,
      } as any);

      const filePath = createAtomicSaveTargetPath('chunked-quality-fix-error.md');
      fs.writeFileSync(filePath, '# original chunked content', 'utf8');

      const result = await harness.module.indexMemoryFile(filePath, { force: true, asyncEmbedding: false });
      expect(result.status).toBe('error');
      expect(fs.readFileSync(filePath, 'utf8')).toBe('# original chunked content');
    });
  });
});
