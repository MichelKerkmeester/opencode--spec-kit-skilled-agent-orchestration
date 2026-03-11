// ---------------------------------------------------------------
// TEST: HANDLER MEMORY SAVE
// ---------------------------------------------------------------

import { describe, it, expect, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// DB-dependent imports - commented out for deferred test suite
import * as handler from '../handlers/memory-save';

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
        content: '# Atomic Save FI',
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
      checkExistingRowMock?: ReturnType<typeof vi.fn>;
      runQualityGateMock?: ReturnType<typeof vi.fn>;
      isSaveQualityGateEnabledMock?: ReturnType<typeof vi.fn>;
      embeddingPipelineModuleFactory?: () => Record<string, unknown>;
      peOrchestrationModuleFactory?: () => Record<string, unknown>;
    } = {}) {
      vi.resetModules();

      const parseMemoryFileMock = options.parseMemoryFileMock
        ?? vi.fn((targetPath: string) => buildParsedMemory(targetPath));
      const validateParsedMemoryMock = vi.fn(() => ({ valid: true, errors: [], warnings: [] }));
      const runQualityLoopMock = vi.fn(() => ({
        score: { total: 0, issues: [] },
        fixes: [],
        passed: true,
        rejected: false,
      }));
      const checkExistingRowMock = options.checkExistingRowMock
        ?? vi.fn(() => buildIndexResult());
      const runQualityGateMock = options.runQualityGateMock
        ?? vi.fn(() => ({ pass: true, warnOnly: false, reasons: [], layers: {} }));
      const isSaveQualityGateEnabledMock = options.isSaveQualityGateEnabledMock
        ?? vi.fn(() => false);

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
          checkContentHashDedup: vi.fn(() => null),
        };
      });

      if (options.embeddingPipelineModuleFactory) {
        vi.doMock('../handlers/save/embedding-pipeline', options.embeddingPipelineModuleFactory);
      }

      if (options.peOrchestrationModuleFactory) {
        vi.doMock('../handlers/save/pe-orchestration', options.peOrchestrationModuleFactory);
      }

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
        checkExistingRowMock,
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
        vi.doUnmock('../lib/validation/save-quality-gate');
        vi.doUnmock('../lib/search/search-flags');
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
        parseMemoryFileMock,
        checkExistingRowMock: vi.fn(() => buildIndexResult({ status: 'indexed', id: 201 })),
      });

      const filePath = createAtomicSaveTargetPath('retry-once.md');
      const result = await harness.module.atomicSaveMemory(
        { file_path: filePath, content: '# retry once' },
        { force: true }
      );

      expect(result.success).toBe(true);
      expect(harness.parseMemoryFileMock).toHaveBeenCalledTimes(2);
      expect(harness.checkExistingRowMock).toHaveBeenCalledTimes(1);
      expect(harness.deleteFileIfExistsMock).not.toHaveBeenCalled();
    });

    it('rolls back written file when indexMemoryFile throws on both attempts', async () => {
      const parseMemoryFileMock = vi.fn(() => {
        throw new Error('simulated persistent indexing failure');
      });

      const harness = await loadAtomicSaveHarness({
        parseMemoryFileMock,
      });

      const filePath = createAtomicSaveTargetPath('throw-both.md');
      const result = await harness.module.atomicSaveMemory(
        { file_path: filePath, content: '# throw both attempts' },
        { force: true }
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('error');
      expect(result.error).toContain('Indexing failed after retry');
      expect(harness.parseMemoryFileMock).toHaveBeenCalledTimes(2);
      expect(harness.checkExistingRowMock).not.toHaveBeenCalled();
      expect(harness.deleteFileIfExistsMock).toHaveBeenCalledTimes(1);
      expect(harness.deleteFileIfExistsMock).toHaveBeenCalledWith(filePath);
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
      expect(harness.parseMemoryFileMock).toHaveBeenCalledTimes(2);
      expect(harness.checkExistingRowMock).toHaveBeenCalledTimes(2);
      expect(harness.deleteFileIfExistsMock).not.toHaveBeenCalled();
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
      expect(harness.parseMemoryFileMock).toHaveBeenCalledTimes(1);
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
  });
});
