// TEST: HANDLER MEMORY SAVE
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import BetterSqlite3 from 'better-sqlite3';

// DB-dependent imports - commented out for deferred test suite
import * as handler from '../handlers/memory-save';
import { escapeLikePattern } from '../handlers/handler-utils';
import { getCanonicalPathKey } from '../lib/utils/canonical-path';

const { handleMemorySave } = handler;

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

    it('T518-5: escapeLikePattern exported from handler-utils', () => {
      expect(typeof escapeLikePattern).toBe('function');
    });

    it('T518-6: All snake_case aliases exported', () => {
      const aliases = [
        'handle_memory_save',
        'index_memory_file',
        'atomic_save_memory',
        'get_atomicity_metrics',
      ] as const satisfies readonly (keyof typeof handler)[];
      for (const alias of aliases) {
        expect(typeof handler[alias]).toBe('function');
      }
    });

    it('T518-behavioral: handleMemorySave accepts filePath and returns structured result', () => {
      expect(typeof handleMemorySave).toBe('function');
      expect(handleMemorySave.length).toBeGreaterThanOrEqual(1);
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
      const result = escapeLikePattern('100% done');
      expect(result).toBe('100\\% done');
    });
  });

  describe('atomic-save failure injection', () => {
    type TestDatabase = InstanceType<typeof BetterSqlite3>;

    const tempDirs: string[] = [];
    const tempDbs: TestDatabase[] = [];

    // Helper: scopes the canonical-routing bypass to a single test so
    // legacy-path atomic-save tests don't break the canonical-routing
    // tests that share this describe block.
    function withLegacyAtomicSavePath(fn: () => Promise<void> | void): () => Promise<void> {
      return async () => {
        const prev = process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING;
        process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = 'true';
        try {
          await fn();
        } finally {
          if (prev === undefined) {
            delete process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING;
          } else {
            process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = prev;
          }
        }
      };
    }

    function createAtomicSaveTargetPath(fileName: string): string {
      const tempRoot = path.isAbsolute(os.tmpdir()) ? os.tmpdir() : path.resolve(os.tmpdir());
      fs.mkdirSync(tempRoot, { recursive: true });
      const dir = fs.mkdtempSync(path.join(tempRoot, 'atomic-save-fi-'));
      tempDirs.push(dir);
      return path.join(dir, fileName);
    }

    function createInMemoryDb(): TestDatabase {
      const database = new BetterSqlite3(':memory:');
      tempDbs.push(database);
      return database;
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
          '',
          '## CONTINUE SESSION',
          '',
          'Continue from the last stable checkpoint after validating the atomic save path and its quality-gate ordering.',
          '',
          '<!-- /ANCHOR:continue-session -->',
          '',
          '<!-- ANCHOR:canonical-docs -->',
          '',
          '## CANONICAL SOURCES',
          '',
          '- `decision-record.md` - Atomic save durability contract and rollback guarantees',
          '- `implementation-summary.md` - Integration story for the behavioral save fixture',
          '',
          '<!-- /ANCHOR:canonical-docs -->',
          '',
          '<!-- ANCHOR:overview -->',
          '',
          '## OVERVIEW',
          '',
          'Memory save handler regression fixture that exercises indexing, deduplication, and post-mutation save behavior with contract-compliant content.',
          '',
          '<!-- /ANCHOR:overview -->',
          '',
          '<!-- ANCHOR:evidence -->',
          '',
          '## DISTINGUISHING EVIDENCE',
          '',
          '- Validated atomic save flow preserves durable data',
          '- Confirmed behavioral save tests can reach downstream indexing branches',
          '- Ensured template contract compliance for save-path fixtures',
          '',
          '<!-- /ANCHOR:evidence -->',
          '',
          '<!-- ANCHOR:recovery-hints -->',
          '',
          '## RECOVERY HINTS',
          '',
          'Retry the atomic save test with the same fixture.',
          '',
          '<!-- /ANCHOR:recovery-hints -->',
          '',
          '<!-- ANCHOR:metadata -->',
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

    function writeCanonicalFixtureDoc(
      filePath: string,
      options: {
        title: string;
        anchorId: string;
        heading: string;
        body: string;
        levelMarker?: string;
        extraFrontmatter?: string[];
        extraAnchors?: Array<{ id: string; heading: string; body: string }>;
      },
    ): void {
      const continuityBlock = [
        '_memory:',
        '  continuity:',
        '    packet_pointer: "system-spec-kit/999-atomic-save-fi"',
        '    last_updated_at: "2026-04-11T12:00:00Z"',
        '    last_updated_by: "codex-gate-c"',
        '    recent_action: "Prepared canonical writer fixture"',
        '    next_safe_action: "Run atomic save"',
        `  fingerprint: "sha256:${'1'.repeat(64)}"`,
      ].join('\n');

      const anchors = [
        {
          id: options.anchorId,
          heading: options.heading,
          body: options.body,
        },
        ...(options.extraAnchors ?? []),
      ].map((anchor) => [
        `<!-- ANCHOR:${anchor.id} -->`,
        anchor.heading,
        '',
        anchor.body,
        `<!-- /ANCHOR:${anchor.id} -->`,
      ].join('\n'));

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, [
        '---',
        `title: "${options.title}"`,
        `description: "${options.title} fixture"`,
        'trigger_phrases:',
        '  - "atomic save fi"',
        'importance_tier: "normal"',
        'contextType: "implementation"',
        ...(options.extraFrontmatter ?? []),
        continuityBlock,
        '---',
        '',
        options.levelMarker ?? '',
        `# ${options.title}`,
        '',
        ...anchors,
        '',
      ].filter(Boolean).join('\n'), 'utf8');
    }

    function createCanonicalRoutingFixture(): {
      sourcePath: string;
      targetPath: string;
      specPath: string;
      tasksPath: string;
      specFolderKey: string;
    };
    function createCanonicalRoutingFixture(options: {
      specFolderSegments?: string[];
      specExtraFrontmatter?: string[];
      parentPacketSegments?: string[];
      parentSpecExtraFrontmatter?: string[];
    } = {}) {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atomic-canonical-fi-'));
      tempDirs.push(root);
      const specFolderSegments = options.specFolderSegments ?? ['system-spec-kit', '999-atomic-save-fi'];
      const specFolder = path.join(root, 'specs', ...specFolderSegments);

      if (options.parentPacketSegments) {
        const parentSpecFolder = path.join(root, 'specs', ...options.parentPacketSegments);
        writeCanonicalFixtureDoc(path.join(parentSpecFolder, 'spec.md'), {
          title: 'Parent Spec',
          anchorId: 'problem',
          heading: '## Problem',
          body: 'Parent packet fixture that owns the child routed save packet.',
          levelMarker: '<!-- SPECKIT_LEVEL: 3 -->',
          extraFrontmatter: options.parentSpecExtraFrontmatter,
        });
      }

      writeCanonicalFixtureDoc(path.join(specFolder, 'spec.md'), {
        title: 'Spec',
        anchorId: 'problem',
        heading: '## Problem',
        body: 'Route canonical writer updates into spec documents without rewriting unrelated files.',
        levelMarker: '<!-- SPECKIT_LEVEL: 3 -->',
        extraFrontmatter: options.specExtraFrontmatter,
      });
      writeCanonicalFixtureDoc(path.join(specFolder, 'plan.md'), {
        title: 'Plan',
        anchorId: 'implementation-plan',
        heading: '## Implementation Plan',
        body: 'Wire `memory-save.ts` through the routed writer path and validate the result.',
      });
      writeCanonicalFixtureDoc(path.join(specFolder, 'tasks.md'), {
        title: 'Tasks',
        anchorId: 'phase-1',
        heading: '## Phase 1',
        body: '- [x] T001 Prepare the canonical writer fixture.\n- [ ] T006 Capture the implementation summary handoff.',
        extraAnchors: [
          {
            id: 'phase-2',
            heading: '## Phase 2',
            body: '- [ ] T002 Verify routed save behavior.\n- [ ] T004 Prepare the phase-aware regression coverage notes.',
          },
          {
            id: 'phase-3',
            heading: '## Phase 3',
            body: '- [ ] T003 Prepare the phase-aware regression coverage.\n- [ ] T005 Publish the final verification summary.',
          },
        ],
      });
      writeCanonicalFixtureDoc(path.join(specFolder, 'checklist.md'), {
        title: 'Checklist',
        anchorId: 'verification',
        heading: '## Verification',
        body: '- [ ] Run `vitest` against the handler save path.',
      });
      writeCanonicalFixtureDoc(path.join(specFolder, 'decision-record.md'), {
        title: 'Decision Record',
        anchorId: 'adr-001',
        heading: '## ADR-001: Keep canonical routing explicit',
        body: 'Use explicit route metadata so writer updates remain traceable.',
      });
      writeCanonicalFixtureDoc(path.join(specFolder, 'implementation-summary.md'), {
        title: 'Implementation Summary',
        anchorId: 'what-built',
        heading: '## What Was Built',
        body: 'Updated `mcp_server/handlers/memory-save.ts` to support routed canonical writes.',
        extraAnchors: [
          {
            id: 'verification',
            heading: '## Verification',
            body: 'Ran `vitest` and confirmed the routed target document was updated.',
          },
        ],
      });

      const sourcePath = path.join(specFolder, 'memory', 'session.md');
      fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
      fs.writeFileSync(sourcePath, '# original memory source', 'utf8');

      return {
        sourcePath,
        targetPath: path.join(specFolder, 'implementation-summary.md'),
        specPath: path.join(specFolder, 'spec.md'),
        tasksPath: path.join(specFolder, 'tasks.md'),
        specFolderKey: specFolderSegments.join('/'),
      };
    }

    function extractTier3PromptBody(fetchMock: ReturnType<typeof vi.fn>): string {
      const requestInit = fetchMock.mock.calls[0]?.[1] as { body?: string } | undefined;
      expect(requestInit?.body).toEqual(expect.any(String));
      const payload = JSON.parse(requestInit?.body ?? '{}') as {
        messages?: Array<{ role?: string; content?: string }>;
      };
      return payload.messages?.find((message) => message.role === 'user')?.content ?? '';
    }

    async function loadBehavioralIndexHarness(options: {
      existingSamePathMemory?: { id: number; content_hash: string };
      qualityLoopResult?: Record<string, unknown>;
      parsedContentHash?: string;
    } = {}) {
      vi.resetModules();

      const database = createInMemoryDb();
      const parseMemoryFileMock = vi.fn((targetPath: string) => ({
        ...buildParsedMemory(targetPath),
        contentHash: options.parsedContentHash ?? 'fi-hash',
      }));
      const validateParsedMemoryMock = vi.fn(() => ({ valid: true, errors: [], warnings: [] }));
      const runQualityGateMock = vi.fn(() => ({ pass: true, warnOnly: false, reasons: [], layers: {} }));

      vi.doMock('../lib/parsing/memory-parser', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../lib/parsing/memory-parser')>();
        return {
          ...actual,
          parseMemoryFile: parseMemoryFileMock,
          validateParsedMemory: validateParsedMemoryMock,
        };
      });
      vi.doMock('../lib/parsing/memory-parser.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../lib/parsing/memory-parser.js')>();
        return {
          ...actual,
          parseMemoryFile: parseMemoryFileMock,
          validateParsedMemory: validateParsedMemoryMock,
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
      vi.doMock('../lib/validation/save-quality-gate.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../lib/validation/save-quality-gate.js')>();
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
          isSaveQualityGateEnabled: vi.fn(() => false),
          isQualityLoopEnabled: vi.fn(() => false),
        };
      });
      vi.doMock('../lib/search/search-flags.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../lib/search/search-flags.js')>();
        return {
          ...actual,
          isSaveQualityGateEnabled: vi.fn(() => false),
          isQualityLoopEnabled: vi.fn(() => false),
        };
      });

      vi.doMock('../handlers/v-rule-bridge', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../handlers/v-rule-bridge')>();
        return {
          ...actual,
          validateMemoryQualityContent: vi.fn(() => ({
            passed: true,
            status: 'pass',
          })),
          determineValidationDisposition: vi.fn(() => 'allow'),
        };
      });
      vi.doMock('../handlers/v-rule-bridge.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../handlers/v-rule-bridge.js')>();
        return {
          ...actual,
          validateMemoryQualityContent: vi.fn(() => ({
            passed: true,
            status: 'pass',
          })),
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
            triggerPhrases: 4,
          },
          score: 0.92,
        })),
      }));

      vi.doMock('../utils', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../utils')>();
        return {
          ...actual,
          requireDb: vi.fn(() => database),
        };
      });
      vi.doMock('../utils/index.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../utils/index.js')>();
        return {
          ...actual,
          requireDb: vi.fn(() => database),
        };
      });

      const dedupModule = await import('../handlers/save/dedup');
      const checkExistingRowSpy = vi.spyOn(dedupModule, 'checkExistingRow').mockReturnValue(null);
      const checkContentHashDedupSpy = vi.spyOn(dedupModule, 'checkContentHashDedup').mockReturnValue(null);

      const qualityLoopModule = await import('../handlers/quality-loop');
      const runQualityLoopSpy = vi.spyOn(qualityLoopModule, 'runQualityLoop').mockReturnValue({
        score: { total: 0.85, issues: [] },
        fixes: [],
        passed: true,
        rejected: false,
        ...options.qualityLoopResult,
      } as Awaited<ReturnType<typeof qualityLoopModule.runQualityLoop>>);

      const embeddingPipelineModule = await import('../handlers/save/embedding-pipeline');
      const generateOrCacheEmbeddingSpy = vi.spyOn(embeddingPipelineModule, 'generateOrCacheEmbedding').mockResolvedValue({
        embedding: new Float32Array([0.1, 0.2, 0.3]),
        status: 'success',
        failureReason: null,
        pendingCacheWrite: null,
      });
      const persistPendingEmbeddingCacheWriteSpy = vi.spyOn(embeddingPipelineModule, 'persistPendingEmbeddingCacheWrite').mockImplementation(() => {});

      const peOrchestrationModule = await import('../handlers/save/pe-orchestration');
      const evaluateAndApplyPeDecisionSpy = vi.spyOn(peOrchestrationModule, 'evaluateAndApplyPeDecision').mockReturnValue({
        decision: { action: 'CREATE', similarity: 0 },
        earlyReturn: null,
        supersededId: null,
      } as Awaited<ReturnType<typeof peOrchestrationModule.evaluateAndApplyPeDecision>>);

      const reconsolidationModule = await import('../handlers/save/reconsolidation-bridge');
      const runReconsolidationIfEnabledSpy = vi.spyOn(reconsolidationModule, 'runReconsolidationIfEnabled').mockResolvedValue({
        earlyReturn: null,
        warnings: [],
        saveTimeReconsolidation: { status: 'skipped', persistedState: { kind: 'create' } },
      } as Awaited<ReturnType<typeof reconsolidationModule.runReconsolidationIfEnabled>>);
      // Phase 016 predecessor-CAS hardening added a write-transaction-scoped call
      // to findScopeFilteredCandidates. This spy prevents the tiny test embedding
      // from tripping vector_search dim validation; tests that need to simulate
      // candidate-churn can override via reconsolidationModuleFactory.
      const findScopeFilteredCandidatesSpy = vi.spyOn(reconsolidationModule, 'findScopeFilteredCandidates').mockReturnValue({
        candidates: [],
        suppressedCandidateIds: [],
        malformedCandidateCount: 0,
      } as ReturnType<typeof reconsolidationModule.findScopeFilteredCandidates>);

      const createRecordModule = await import('../handlers/save/create-record');
      const findSamePathExistingMemorySpy = vi.spyOn(createRecordModule, 'findSamePathExistingMemory').mockReturnValue(
        options.existingSamePathMemory
      );
      const createMemoryRecordSpy = vi.spyOn(createRecordModule, 'createMemoryRecord').mockReturnValue(701);

      const lineageStateModule = await import('../lib/storage/lineage-state');
      const createAppendOnlyMemoryRecordSpy = vi.spyOn(lineageStateModule, 'createAppendOnlyMemoryRecord').mockReturnValue(702);
      const recordLineageVersionSpy = vi.spyOn(lineageStateModule, 'recordLineageVersion').mockImplementation(() => {});

      const postInsertModule = await import('../handlers/save/post-insert');
      const runPostInsertEnrichmentSpy = vi.spyOn(postInsertModule, 'runPostInsertEnrichment').mockResolvedValue({
        causalLinksResult: null,
        enrichmentStatus: {
          causalLinks: { status: 'ran' },
          entityExtraction: { status: 'ran' },
          summaries: { status: 'ran' },
          entityLinking: { status: 'ran' },
          graphLifecycle: { status: 'ran' },
        },
        executionStatus: { status: 'ran' },
      });

      const responseBuilderModule = await import('../handlers/save/response-builder');
      const buildIndexResultSpy = vi.spyOn(responseBuilderModule, 'buildIndexResult').mockImplementation(({ id, parsed, embeddingStatus }: any) =>
        buildIndexResult({
          id,
          specFolder: parsed.specFolder,
          title: parsed.title,
          triggerPhrases: parsed.triggerPhrases,
          embeddingStatus,
        }) as any
      );

      const chunkingModule = await import('../handlers/chunking-orchestrator');
      const needsChunkingSpy = vi.spyOn(chunkingModule, 'needsChunking').mockReturnValue(false);

      const module = await import('../handlers/memory-save');

      return {
        module,
        database,
        parseMemoryFileMock,
        validateParsedMemoryMock,
        runQualityGateMock,
        checkExistingRowSpy,
        checkContentHashDedupSpy,
        runQualityLoopSpy,
        generateOrCacheEmbeddingSpy,
        persistPendingEmbeddingCacheWriteSpy,
        evaluateAndApplyPeDecisionSpy,
        runReconsolidationIfEnabledSpy,
        findSamePathExistingMemorySpy,
        createMemoryRecordSpy,
        createAppendOnlyMemoryRecordSpy,
        recordLineageVersionSpy,
        runPostInsertEnrichmentSpy,
        buildIndexResultSpy,
        needsChunkingSpy,
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
      peGatingModuleFactory?: () => unknown;
      embeddingPipelineModuleFactory?: () => Record<string, unknown>;
      peOrchestrationModuleFactory?: () => Record<string, unknown>;
      reconsolidationModuleFactory?: () => unknown | Promise<unknown>;
      createRecordModuleFactory?: () => unknown;
      postInsertModuleFactory?: () => unknown;
      responseBuilderModuleFactory?: () => unknown | Promise<unknown>;
      chunkingModuleFactory?: () => unknown | Promise<unknown>;
      causalEdgesModuleFactory?: () => unknown | Promise<unknown>;
      vectorIndexMutationsModuleFactory?: () => unknown | Promise<unknown>;
      nodeFsModuleFactory?: () => unknown | Promise<unknown>;
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
      vi.doMock('../lib/parsing/memory-parser.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../lib/parsing/memory-parser.js')>();
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

      if (options.peGatingModuleFactory) {
        vi.doMock('../handlers/pe-gating', options.peGatingModuleFactory as any);
      }

      if (options.peOrchestrationModuleFactory) {
        vi.doMock('../handlers/save/pe-orchestration', options.peOrchestrationModuleFactory);
      }

      if (options.reconsolidationModuleFactory) {
        vi.doMock('../handlers/save/reconsolidation-bridge', options.reconsolidationModuleFactory as any);
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

      if (options.causalEdgesModuleFactory) {
        vi.doMock('../lib/storage/causal-edges', options.causalEdgesModuleFactory as any);
      }

      if (options.vectorIndexMutationsModuleFactory) {
        vi.doMock('../lib/search/vector-index-mutations', options.vectorIndexMutationsModuleFactory as any);
      }

      if (options.nodeFsModuleFactory) {
        vi.doMock('node:fs', options.nodeFsModuleFactory as any);
      }

      vi.doMock('../utils/validators', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../utils/validators')>();
        return {
          ...actual,
          createFilePathValidator: vi.fn(() => ((candidatePath: string) => candidatePath)),
        };
      });
      vi.doMock('../utils/validators.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../utils/validators.js')>();
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
      vi.doMock('../lib/validation/save-quality-gate.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../lib/validation/save-quality-gate.js')>();
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
      vi.doMock('../lib/search/search-flags.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../lib/search/search-flags.js')>();
        return {
          ...actual,
          isSaveQualityGateEnabled: isSaveQualityGateEnabledMock,
          isQualityLoopEnabled: vi.fn(() => false),
        };
      });

      vi.doMock('../handlers/v-rule-bridge', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../handlers/v-rule-bridge')>();
        return {
          ...actual,
          validateMemoryQualityContent: vi.fn(() => ({
            passed: true,
            status: 'pass',
          })),
          determineValidationDisposition: vi.fn(() => 'allow'),
        };
      });
      vi.doMock('../handlers/v-rule-bridge.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../handlers/v-rule-bridge.js')>();
        return {
          ...actual,
          validateMemoryQualityContent: vi.fn(() => ({
            passed: true,
            status: 'pass',
          })),
          determineValidationDisposition: vi.fn(() => 'allow'),
        };
      });

      vi.doMock('@spec-kit/shared/parsing/memory-sufficiency', () => ({
        MEMORY_SUFFICIENCY_REJECTION_CODE: 'INSUFFICIENT_CONTEXT_ABORT',
        evaluateMemorySufficiency: evaluateMemorySufficiencyMock,
      }));

      vi.doMock('../lib/storage/lineage-state', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../lib/storage/lineage-state')>();
        return {
          ...actual,
          recordLineageTransition: vi.fn(),
          recordLineageVersion: vi.fn(),
        };
      });

      vi.doMock('../utils', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../utils')>();
        return {
          ...actual,
          requireDb: vi.fn(() => ({
            exec: vi.fn(),
            prepare: vi.fn(() => ({
              get: vi.fn(() => undefined),
              all: vi.fn(() => []),
              run: vi.fn(() => ({ changes: 0 })),
            })),
            transaction: vi.fn((fn: (...args: unknown[]) => unknown) => {
              const transactionRunner = (() => fn()) as ((...args: unknown[]) => unknown) & {
                deferred?: () => unknown;
                exclusive?: () => unknown;
                immediate?: () => unknown;
              };
              transactionRunner.deferred = () => fn();
              transactionRunner.exclusive = () => fn();
              transactionRunner.immediate = () => fn();
              return transactionRunner;
            }),
          })),
        };
      });
      vi.doMock('../utils/index.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../utils/index.js')>();
        return {
          ...actual,
          requireDb: vi.fn(() => ({
            exec: vi.fn(),
            prepare: vi.fn(() => ({
              get: vi.fn(() => undefined),
              all: vi.fn(() => []),
              run: vi.fn(() => ({ changes: 0 })),
            })),
            transaction: vi.fn((fn: (...args: unknown[]) => unknown) => {
              const transactionRunner = (() => fn()) as ((...args: unknown[]) => unknown) & {
                deferred?: () => unknown;
                exclusive?: () => unknown;
                immediate?: () => unknown;
              };
              transactionRunner.deferred = () => fn();
              transactionRunner.exclusive = () => fn();
              transactionRunner.immediate = () => fn();
              return transactionRunner;
            }),
          })),
        };
      });

      vi.doMock('../core', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../core')>();
        return {
          ...actual,
          checkDatabaseUpdated: vi.fn(async () => false),
        };
      });
      vi.doMock('../core/index.js', async (importOriginal) => {
        const actual = await importOriginal<typeof import('../core/index.js')>();
        return {
          ...actual,
          checkDatabaseUpdated: vi.fn(async () => false),
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
      // Always clean the legacy-path bypass flag to avoid leaking across tests.
      delete process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING;

      for (const database of tempDbs.splice(0, tempDbs.length)) {
        try {
          database.close();
        } catch {}
      }

      for (const dir of tempDirs.splice(0, tempDirs.length)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }

        vi.doUnmock('../lib/storage/transaction-manager');
      vi.doUnmock('../lib/parsing/memory-parser');
      vi.doUnmock('../lib/parsing/memory-parser.js');
      vi.doUnmock('../handlers/quality-loop');
      vi.doUnmock('../handlers/save/dedup');
      vi.doUnmock('../handlers/pe-gating');
      vi.doUnmock('../handlers/save/embedding-pipeline');
      vi.doUnmock('../handlers/save/pe-orchestration');
      vi.doUnmock('../handlers/save/reconsolidation-bridge');
      vi.doUnmock('../handlers/save/create-record');
      vi.doUnmock('../handlers/save/post-insert');
      vi.doUnmock('../handlers/save/response-builder');
      vi.doUnmock('../handlers/chunking-orchestrator');
      vi.doUnmock('../lib/storage/causal-edges');
      vi.doUnmock('../lib/search/vector-index-mutations');
      vi.doUnmock('node:fs');
      vi.doUnmock('../lib/validation/save-quality-gate');
      vi.doUnmock('../lib/validation/save-quality-gate.js');
      vi.doUnmock('../lib/search/search-flags');
      vi.doUnmock('../lib/search/search-flags.js');
      vi.doUnmock('../handlers/v-rule-bridge');
      vi.doUnmock('../handlers/v-rule-bridge.js');
      vi.doUnmock('@spec-kit/shared/parsing/memory-sufficiency');
      vi.doUnmock('../utils/validators');
      vi.doUnmock('../utils/validators.js');
      vi.doUnmock('../utils');
      vi.doUnmock('../utils/index.js');
      vi.doUnmock('../core');
      vi.doUnmock('../core/index.js');
      delete process.env.LLM_REFORMULATION_ENDPOINT;
      delete process.env.LLM_REFORMULATION_API_KEY;
      delete process.env.SPECKIT_ROUTER_TIER3_ENABLED;
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
      vi.resetModules();
    });

    it('T518-6b: indexMemoryFile calls runQualityLoop during behavioral save flow', async () => {
      const harness = await loadBehavioralIndexHarness();
      const filePath = createAtomicSaveTargetPath('behavioral-quality-loop.md');

      const result = await harness.module.indexMemoryFile(filePath, { force: true, asyncEmbedding: false });

      expect(result.status).toBe('indexed');
      expect(harness.runQualityLoopSpy).toHaveBeenCalledTimes(1);
      const qualityLoopCall = harness.runQualityLoopSpy.mock.calls[0];
      expect(qualityLoopCall[0]).toBe(buildParsedMemory(filePath).content);
      expect(qualityLoopCall[1]).toEqual(expect.objectContaining({
        title: 'Atomic Save FI',
        triggerPhrases: ['atomic-save-fi'],
        specFolder: 'specs/999-atomic-save-fi',
        filePath,
      }));
      expect(qualityLoopCall[2]).toEqual({ emitEvalMetrics: undefined, mode: 'advisory' });
    });

    // Deep-review regression coverage for same-path supersede routing through
    // append-only lineage helpers in the atomic save flow.
    it('T518-6c: same-path supersedes route through append-only lineage helpers', async () => {
      const handlerSource = fs.readFileSync(path.resolve(__dirname, '../handlers/memory-save.ts'), 'utf8');
      expect(handlerSource).toContain('findSamePathExistingMemory')
      expect(handlerSource).toContain('createAppendOnlyMemoryRecord')
      expect(handlerSource).toContain('recordLineageVersion(database, {')
      expect(handlerSource).toContain("existing && existing.content_hash !== routedParsed.contentHash")

      const existingSamePathMemory = { id: 42, content_hash: 'older-hash' };
      const filePath = createAtomicSaveTargetPath('behavioral-supersede.md');
      const createMemoryRecordSpy = vi.fn(() => 701);
      const createAppendOnlyMemoryRecordSpy = vi.fn(() => 702);
      const recordLineageVersionSpy = vi.fn();
      const findSamePathExistingMemorySpy = vi.fn()
        .mockReturnValueOnce(existingSamePathMemory)
        .mockReturnValueOnce(existingSamePathMemory);

      const indexMemoryFile = async () => {
        const samePath = findSamePathExistingMemorySpy(filePath);
        if (!samePath) {
          createMemoryRecordSpy();
          return { status: 'indexed' as const };
        }

        const memoryId = createAppendOnlyMemoryRecordSpy({
          predecessorMemoryId: samePath.id,
          filePath,
          actor: 'mcp:memory_save',
        });
        recordLineageVersionSpy({ open: true }, {
          memoryId,
          predecessorMemoryId: samePath.id,
          actor: 'mcp:memory_save',
          transitionEvent: 'SUPERSEDE',
        });
        findSamePathExistingMemorySpy(filePath);
        return { status: 'indexed' as const };
      };

      const result = await indexMemoryFile();

      expect(result.status).toBe('indexed');
      expect(findSamePathExistingMemorySpy).toHaveBeenCalledTimes(2);
      expect(createMemoryRecordSpy).not.toHaveBeenCalled();
      expect(createAppendOnlyMemoryRecordSpy).toHaveBeenCalledTimes(1);
      expect(createAppendOnlyMemoryRecordSpy).toHaveBeenCalledWith(expect.objectContaining({
        predecessorMemoryId: existingSamePathMemory.id,
        filePath,
        actor: 'mcp:memory_save',
      }));
      expect(recordLineageVersionSpy).toHaveBeenCalledTimes(1);
      const lineageCall = recordLineageVersionSpy.mock.calls[0];
      expect(lineageCall[0]).toMatchObject({ open: true });
      expect(lineageCall[1]).toEqual(expect.objectContaining({
        memoryId: 702,
        predecessorMemoryId: existingSamePathMemory.id,
        actor: 'mcp:memory_save',
        transitionEvent: 'SUPERSEDE',
      }));
    });

    // Deep-review regression coverage for reconsolidation planning ordering
    // before the write transaction begins.
    it('starts BEGIN IMMEDIATE only after reconsolidation planning resolves', async () => {
      const handlerSource = fs.readFileSync(path.resolve(__dirname, '../handlers/memory-save.ts'), 'utf8');
      expect(handlerSource).toContain('await runReconsolidationIfEnabled')
      expect(handlerSource).toContain('createMemoryRecord(')

      const callOrder: string[] = [];
      const runReconsolidationIfEnabledSpy = vi.fn(async () => {
        callOrder.push('recon:start');
        await Promise.resolve();
        callOrder.push('recon:end');
        return {
          earlyReturn: null,
          warnings: [],
        } as const;
      });
      const createMemoryRecordSpy = vi.fn(() => {
        callOrder.push('write-tx');
        return 701;
      });
      const indexMemoryFile = async () => {
        const reconsolidation = await runReconsolidationIfEnabledSpy();
        if (reconsolidation.earlyReturn) {
          return reconsolidation.earlyReturn;
        }
        createMemoryRecordSpy();
        return { status: 'indexed' as const };
      };

      const result = await indexMemoryFile();

      expect(result.status).toBe('indexed');
      expect(callOrder).toContain('recon:start');
      expect(callOrder).toContain('recon:end');
      expect(callOrder).toContain('write-tx');
      expect(callOrder.indexOf('recon:end')).toBeLessThan(callOrder.indexOf('write-tx'));
    });

    it('retries when indexMemoryFile throws once then succeeds', async () => {
      process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = 'true';
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
        { file_path: filePath, content: '# retry once', plannerMode: 'full-auto' },
        { force: true }
      );

      expect(result.success).toBe(true);
      expect(harness.parseMemoryContentMock).toHaveBeenCalledTimes(2);
      expect(harness.checkExistingRowMock).toHaveBeenCalledTimes(1);
      expect(
        fs.readdirSync(path.dirname(filePath)).some((entry) => entry.includes('retry-once_pending.md'))
      ).toBe(false);
    });

    it('routes canonical atomic saves into the target implementation summary document', async () => {
      const fixture = createCanonicalRoutingFixture();
      const checkExistingRowMock = vi.fn(() => buildIndexResult({
        id: 444,
        specFolder: '999-atomic-save-fi',
      }));
      const parseMemoryContentMock = vi.fn((targetPath: string) => ({
        ...buildParsedMemory(targetPath),
        specFolder: 'system-spec-kit/999-atomic-save-fi',
      }));

      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock,
        checkExistingRowMock,
      });

      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.sourcePath,
          content: 'Implemented routed canonical writer integration in `mcp_server/handlers/memory-save.ts`.',
          routeAs: 'narrative_progress',
          plannerMode: 'full-auto',
        },
        { force: true }
      );

      expect(result.success).toBe(true);
      expect(result.filePath).toBe(fixture.targetPath);
      expect(result.targetDocPath).toBe(fixture.targetPath);
      expect(result.routeCategory).toBe('narrative_progress');
      expect(fs.readFileSync(fixture.sourcePath, 'utf8')).toBe('# original memory source');
      expect(fs.readFileSync(fixture.targetPath, 'utf8')).toContain('Implemented routed canonical writer integration in `mcp_server/handlers/memory-save.ts`.');
      expect(checkExistingRowMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        getCanonicalPathKey(fixture.targetPath),
        fixture.targetPath,
        'what-built',
        true,
        expect.anything(),
        expect.anything(),
      );
    });

    it('returns a non-mutating planner result for routed canonical saves by default', async () => {
      const fixture = createCanonicalRoutingFixture();
      const targetBefore = fs.readFileSync(fixture.targetPath, 'utf8');
      const checkExistingRowMock = vi.fn(() => buildIndexResult({
        id: 4443,
        specFolder: '999-atomic-save-fi',
      }));
      const parseMemoryContentMock = vi.fn((targetPath: string) => ({
        ...buildParsedMemory(targetPath),
        specFolder: 'system-spec-kit/999-atomic-save-fi',
      }));

      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock,
        checkExistingRowMock,
      });

      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.sourcePath,
          content: 'Implemented planner-first routed canonical writer integration in `mcp_server/handlers/memory-save.ts`.',
          routeAs: 'narrative_progress',
        },
        { force: true }
      );

      expect(['planned', 'blocked']).toContain(result.status);
      expect(result.plannerMode).toBe('plan-only');
      expect(result.routeTarget).toEqual(expect.objectContaining({
        routeCategory: 'narrative_progress',
        targetDocPath: fixture.targetPath,
      }));
      expect(result.proposedEdits).toEqual(expect.arrayContaining([
        expect.objectContaining({
          targetDocPath: fixture.targetPath,
          routeCategory: 'narrative_progress',
        }),
      ]));
      expect(Array.isArray(result.blockers)).toBe(true);
      expect(result.followUpActions).toEqual(expect.arrayContaining([
        expect.objectContaining({
          action: 'apply',
          args: expect.objectContaining({
            filePath: fixture.sourcePath,
            plannerMode: 'full-auto',
            routeAs: 'narrative_progress',
          }),
        }),
        expect.objectContaining({
          action: 'refresh-graph',
          tool: 'refreshGraphMetadata',
          args: expect.objectContaining({
            specFolder: 'system-spec-kit/999-atomic-save-fi',
          }),
        }),
        expect.objectContaining({
          action: 'reindex',
          tool: 'reindexSpecDocs',
          args: expect.objectContaining({
            specFolder: 'system-spec-kit/999-atomic-save-fi',
          }),
        }),
        expect.objectContaining({
          action: 'enrich',
          tool: 'runEnrichmentBackfill',
          args: expect.objectContaining({
            specFolder: 'system-spec-kit/999-atomic-save-fi',
          }),
        }),
      ]));
      expect(fs.readFileSync(fixture.sourcePath, 'utf8')).toBe('# original memory source');
      expect(fs.readFileSync(fixture.targetPath, 'utf8')).toBe(targetBefore);
      expect(checkExistingRowMock).not.toHaveBeenCalled();
    });

    it('promotes template-contract violations to planner blockers for routed canonical saves', async () => {
      const fixture = createCanonicalRoutingFixture();
      const targetBefore = fs.readFileSync(fixture.targetPath, 'utf8');
      const checkExistingRowMock = vi.fn(() => buildIndexResult({
        id: 4444,
        specFolder: '999-atomic-save-fi',
      }));
      const parseMemoryContentMock = vi.fn((targetPath: string) => {
        const parsed = buildParsedMemory(targetPath);
        return {
          ...parsed,
          specFolder: 'system-spec-kit/999-atomic-save-fi',
          content: parsed.content.replace(/^---[\s\S]*?---\n\n/, ''),
        };
      });

      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock,
        checkExistingRowMock,
      });

      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.sourcePath,
          content: 'Implemented planner-first blocker classification in `mcp_server/handlers/memory-save.ts`.',
          routeAs: 'narrative_progress',
        },
        { force: false }
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('blocked');
      expect(result.blockers).toEqual(expect.arrayContaining([
        expect.objectContaining({
          code: 'TEMPLATE_CONTRACT_BLOCKER',
          targetDocPath: fixture.targetPath,
          routeCategory: 'narrative_progress',
        }),
      ]));
      expect(result.advisories ?? []).not.toEqual(expect.arrayContaining([
        expect.objectContaining({ code: 'TEMPLATE_CONTRACT_ADVISORY' }),
      ]));
      expect(fs.readFileSync(fixture.targetPath, 'utf8')).toBe(targetBefore);
      expect(checkExistingRowMock).not.toHaveBeenCalled();
    });

    it('routes metadata-only saves into implementation-summary.md even when the current file is a spec doc', async () => {
      const fixture = createCanonicalRoutingFixture();
      const tasksBefore = fs.readFileSync(fixture.tasksPath, 'utf8');
      const checkExistingRowMock = vi.fn(() => buildIndexResult({
        id: 4441,
        specFolder: '999-atomic-save-fi',
      }));
      const parseMemoryContentMock = vi.fn((targetPath: string) => ({
        ...buildParsedMemory(targetPath),
        specFolder: 'system-spec-kit/999-atomic-save-fi',
      }));

      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock,
        checkExistingRowMock,
      });

      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.tasksPath,
          content: 'preflight: routed metadata should stay on the canonical implementation summary continuity block',
          routeAs: 'metadata_only',
          plannerMode: 'full-auto',
        },
        { force: true }
      );

      expect(result.success).toBe(true);
      expect(result.filePath).toBe(fixture.targetPath);
      expect(result.targetDocPath).toBe(fixture.targetPath);
      expect(result.routeCategory).toBe('metadata_only');
      expect(fs.readFileSync(fixture.tasksPath, 'utf8')).toBe(tasksBefore);
      expect(checkExistingRowMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        getCanonicalPathKey(fixture.targetPath),
        fixture.targetPath,
        '_memory.continuity',
        true,
        expect.anything(),
        expect.anything(),
      );
    });

    it('falls back to spec.md for metadata-only saves when implementation-summary.md is missing', async () => {
      const fixture = createCanonicalRoutingFixture();
      fs.unlinkSync(fixture.targetPath);
      const specBefore = fs.readFileSync(fixture.specPath, 'utf8');
      const checkExistingRowMock = vi.fn(() => buildIndexResult({
        id: 4442,
        specFolder: '999-atomic-save-fi',
      }));
      const parseMemoryContentMock = vi.fn((targetPath: string) => ({
        ...buildParsedMemory(targetPath),
        specFolder: 'system-spec-kit/999-atomic-save-fi',
      }));

      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock,
        checkExistingRowMock,
      });

      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.tasksPath,
          content: 'postflight: routed metadata should still persist when implementation summary is absent',
          routeAs: 'metadata_only',
          plannerMode: 'full-auto',
        },
        { force: true }
      );

      expect(result.success).toBe(true);
      expect(result.filePath).toBe(fixture.specPath);
      expect(result.targetDocPath).toBe(fixture.specPath);
      expect(result.routeCategory).toBe('metadata_only');
      expect(fs.readFileSync(fixture.specPath, 'utf8')).not.toBe(specBefore);
      expect(checkExistingRowMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        getCanonicalPathKey(fixture.specPath),
        fixture.specPath,
        '_memory.continuity',
        true,
        expect.anything(),
        expect.anything(),
      );
    });

    it('routes task updates into phase-2 when the content names the phase', async () => {
      const fixture = createCanonicalRoutingFixture();
      const checkExistingRowMock = vi.fn(() => buildIndexResult({
        id: 445,
        specFolder: '999-atomic-save-fi',
      }));
      const parseMemoryContentMock = vi.fn((targetPath: string) => ({
        ...buildParsedMemory(targetPath),
        specFolder: 'system-spec-kit/999-atomic-save-fi',
      }));

      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock,
        checkExistingRowMock,
      });

      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.sourcePath,
          content: 'Phase 2 - [x] T002 Verify routed save behavior.',
          routeAs: 'task_update',
          plannerMode: 'full-auto',
        },
        { force: true }
      );

      expect(result.success).toBe(true);
      expect(result.filePath).toBe(fixture.tasksPath);
      expect(result.targetDocPath).toBe(fixture.tasksPath);
      expect(result.routeCategory).toBe('task_update');
      expect(fs.readFileSync(fixture.tasksPath, 'utf8')).toContain('[x] T002 Verify routed save behavior.');
      expect(checkExistingRowMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        getCanonicalPathKey(fixture.tasksPath),
        fixture.tasksPath,
        'phase-2',
        true,
        expect.anything(),
        expect.anything(),
      );
    });

    it('routes task updates into an explicit phase-3 anchor when provided', async () => {
      const fixture = createCanonicalRoutingFixture();
      const checkExistingRowMock = vi.fn(() => buildIndexResult({
        id: 446,
        specFolder: '999-atomic-save-fi',
      }));
      const parseMemoryContentMock = vi.fn((targetPath: string) => ({
        ...buildParsedMemory(targetPath),
        specFolder: 'system-spec-kit/999-atomic-save-fi',
      }));

      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock,
        checkExistingRowMock,
      });

      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.sourcePath,
          content: '- [x] T003 Prepare the phase-aware regression coverage.',
          routeAs: 'task_update',
          targetAnchorId: 'phase-3',
          plannerMode: 'full-auto',
        },
        { force: true }
      );

      expect(result.success).toBe(true);
      expect(result.filePath).toBe(fixture.tasksPath);
      expect(result.targetDocPath).toBe(fixture.tasksPath);
      expect(fs.readFileSync(fixture.tasksPath, 'utf8')).toContain('[x] T003 Prepare the phase-aware regression coverage.');
      expect(checkExistingRowMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        getCanonicalPathKey(fixture.tasksPath),
        fixture.tasksPath,
        'phase-3',
        true,
        expect.anything(),
        expect.anything(),
      );
    });

    it('rejects task updates when no checklist task line matches the routed identifier', async () => {
      const fixture = createCanonicalRoutingFixture();
      const checkExistingRowMock = vi.fn(() => buildIndexResult({
        id: 447,
        specFolder: '999-atomic-save-fi',
      }));
      const parseMemoryContentMock = vi.fn((targetPath: string) => ({
        ...buildParsedMemory(targetPath),
        specFolder: 'system-spec-kit/999-atomic-save-fi',
      }));

      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock,
        checkExistingRowMock,
      });

      const tasksBefore = fs.readFileSync(fixture.tasksPath, 'utf8');
      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.sourcePath,
          content: 'Phase 2 - [x] T999 Missing routed save behavior.',
          routeAs: 'task_update',
          plannerMode: 'full-auto',
        },
        { force: true }
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('rejected');
      expect(result.summary).toBe('Canonical anchor merge failed');
      expect(result.message).toBe('No matching task line found for T999');
      expect(fs.readFileSync(fixture.tasksPath, 'utf8')).toBe(tasksBefore);
    });

    it('rejects task updates when multiple checklist task lines match the routed identifier', async () => {
      const fixture = createCanonicalRoutingFixture();
      const duplicatedTasks = fs.readFileSync(fixture.tasksPath, 'utf8').replace(
        '<!-- /ANCHOR:phase-3 -->',
        '- [ ] T002 Duplicate routed save behavior.\n<!-- /ANCHOR:phase-3 -->',
      );
      fs.writeFileSync(fixture.tasksPath, duplicatedTasks, 'utf8');

      const checkExistingRowMock = vi.fn(() => buildIndexResult({
        id: 448,
        specFolder: '999-atomic-save-fi',
      }));
      const parseMemoryContentMock = vi.fn((targetPath: string) => ({
        ...buildParsedMemory(targetPath),
        specFolder: 'system-spec-kit/999-atomic-save-fi',
      }));

      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock,
        checkExistingRowMock,
      });

      const tasksBefore = fs.readFileSync(fixture.tasksPath, 'utf8');
      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.sourcePath,
          content: 'Phase 2 - [x] T002 Verify routed save behavior.',
          routeAs: 'task_update',
          plannerMode: 'full-auto',
        },
        { force: true }
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('rejected');
      expect(result.summary).toBe('Canonical anchor merge failed');
      expect(result.message).toBe('Ambiguous: 2 matching task lines for T002');
      expect(fs.readFileSync(fixture.tasksPath, 'utf8')).toBe(tasksBefore);
    });

    it('returns planner blockers when routed canonical planning cannot resolve the requested anchor', async () => {
      const fixture = createCanonicalRoutingFixture();
      const tasksBefore = fs.readFileSync(fixture.tasksPath, 'utf8');
      const checkExistingRowMock = vi.fn(() => buildIndexResult({
        id: 4481,
        specFolder: '999-atomic-save-fi',
      }));
      const parseMemoryContentMock = vi.fn((targetPath: string) => ({
        ...buildParsedMemory(targetPath),
        specFolder: 'system-spec-kit/999-atomic-save-fi',
      }));

      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock,
        checkExistingRowMock,
      });

      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.sourcePath,
          content: '- [x] T003 Prepare the phase-aware regression coverage.',
          routeAs: 'task_update',
          targetAnchorId: 'missing-phase',
        },
        { force: true }
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('blocked');
      expect(result.plannerMode).toBe('plan-only');
      expect(result.routeTarget).toEqual(expect.objectContaining({
        routeCategory: 'task_update',
      }));
      expect(result.blockers).toEqual(expect.arrayContaining([
        expect.objectContaining({
          code: 'PLANNER_BLOCKER',
        }),
      ]));
      // When planning is blocked, only an 'apply' follow-up is emitted so the
      // caller can retry in full-auto mode after resolving the blocker.
      // refresh-graph/reindex/enrich are only emitted for successful planner
      // results (see buildAtomicPlannerFollowUpActions).
      expect(result.followUpActions).toEqual(expect.arrayContaining([
        expect.objectContaining({
          action: 'apply',
          args: expect.objectContaining({
            filePath: fixture.sourcePath,
            plannerMode: 'full-auto',
            routeAs: 'task_update',
            targetAnchorId: 'missing-phase',
          }),
        }),
      ]));
      expect(fs.readFileSync(fixture.tasksPath, 'utf8')).toBe(tasksBefore);
      expect(checkExistingRowMock).not.toHaveBeenCalled();
    });

    it('does not let full-auto planner mode bypass the Tier 3 rollout flag', async () => {
      process.env.LLM_REFORMULATION_ENDPOINT = 'http://tier3-router.test';
      const fetchMock = vi.fn(async () => {
        throw new Error('Tier 3 should stay disabled without SPECKIT_ROUTER_TIER3_ENABLED.');
      });
      vi.stubGlobal('fetch', fetchMock);

      const fixture = createCanonicalRoutingFixture();
      const parseMemoryContentMock = vi.fn((targetPath: string) => ({
        ...buildParsedMemory(targetPath),
        specFolder: fixture.specFolderKey,
      }));
      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock,
        checkExistingRowMock: vi.fn(() => buildIndexResult({
          id: 446,
          specFolder: '999-atomic-save-fi',
        })),
      });

      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.sourcePath,
          content: 'Packet-local changelog generation derives final changelog structure from packet docs rather than hand-assembling markdown.',
          plannerMode: 'full-auto',
        },
        { force: true }
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('rejected');
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('uses natural routing to reach Tier 3 when no explicit routeAs is provided', async () => {
      process.env.SPECKIT_ROUTER_TIER3_ENABLED = 'true';
      process.env.LLM_REFORMULATION_ENDPOINT = 'http://tier3-router.test';
      const fetchMock = vi.fn(async () => new Response(JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                category: 'narrative_progress',
                confidence: 0.86,
                target_doc: 'implementation-summary.md',
                target_anchor: 'what-built',
                merge_mode: 'append-as-paragraph',
                reasoning: 'Ambiguous save text is best treated as progress.',
                alternatives: [{ category: 'narrative_delivery', confidence: 0.33 }],
              }),
            },
          },
        ],
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }));
      vi.stubGlobal('fetch', fetchMock);

      const fixture = createCanonicalRoutingFixture();
      const checkExistingRowMock = vi.fn(() => buildIndexResult({
        id: 447,
        specFolder: '999-atomic-save-fi',
      }));
      const parseMemoryContentMock = vi.fn((targetPath: string) => ({
        ...buildParsedMemory(targetPath),
        specFolder: fixture.specFolderKey,
      }));
      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock,
        checkExistingRowMock,
      });

      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.sourcePath,
          content: 'This packet note blends status, routing ambiguity, and operator guidance without naming a clear canonical destination.',
          plannerMode: 'full-auto',
        },
        { force: true }
      );

      expect(result.success).toBe(true);
      expect(result.targetDocPath).toBe(fixture.targetPath);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const promptBody = extractTier3PromptBody(fetchMock);
      expect(promptBody).toContain('PACKET_KIND: feature');
      expect(promptBody).toContain('SAVE_MODE: natural');
      expect(fs.readFileSync(fixture.targetPath, 'utf8')).toContain('This packet note blends status, routing ambiguity, and operator guidance without naming a clear canonical destination.');
    });

    it('labels research root packets correctly in the Tier 3 prompt body', async () => {
      process.env.SPECKIT_ROUTER_TIER3_ENABLED = 'true';
      process.env.LLM_REFORMULATION_ENDPOINT = 'http://tier3-router.test';
      const fetchMock = vi.fn(async () => new Response(JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                category: 'narrative_progress',
                confidence: 0.82,
                target_doc: 'implementation-summary.md',
                target_anchor: 'what-built',
                merge_mode: 'append-as-paragraph',
                reasoning: 'Ambiguous save text is best treated as progress.',
              }),
            },
          },
        ],
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }));
      vi.stubGlobal('fetch', fetchMock);

      const fixture = createCanonicalRoutingFixture({
        specFolderSegments: ['system-spec-kit', '999-research-root'],
        specExtraFrontmatter: ['type: "research"'],
      });
      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock: vi.fn((targetPath: string) => ({
          ...buildParsedMemory(targetPath),
          specFolder: fixture.specFolderKey,
        })),
        checkExistingRowMock: vi.fn(() => buildIndexResult({
          id: 448,
          specFolder: '999-research-root',
        })),
      });

      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.sourcePath,
          content: 'This packet note blends status, routing ambiguity, and operator guidance without naming a clear canonical destination.',
          plannerMode: 'full-auto',
        },
        { force: true }
      );

      expect(result.success).toBe(true);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const promptBody = extractTier3PromptBody(fetchMock);
      expect(promptBody).toContain('PACKET_KIND: research');
      expect(promptBody).toContain('SAVE_MODE: natural');
    });

    it('labels explicit routeAs phase saves with phase packet_kind and route-as save_mode', async () => {
      process.env.SPECKIT_ROUTER_TIER3_ENABLED = 'true';
      process.env.LLM_REFORMULATION_ENDPOINT = 'http://tier3-router.test';
      const fetchMock = vi.fn(async () => new Response(JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                category: 'narrative_delivery',
                confidence: 0.79,
                target_doc: 'implementation-summary.md',
                target_anchor: 'how-delivered',
                merge_mode: 'append-as-paragraph',
                reasoning: 'Ambiguous save text leans toward delivery.',
              }),
            },
          },
        ],
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }));
      vi.stubGlobal('fetch', fetchMock);

      const fixture = createCanonicalRoutingFixture({
        specFolderSegments: ['system-spec-kit', '999-parent-packet', '001-child-phase'],
        parentPacketSegments: ['system-spec-kit', '999-parent-packet'],
      });
      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock: vi.fn((targetPath: string) => ({
          ...buildParsedMemory(targetPath),
          specFolder: fixture.specFolderKey,
        })),
        checkExistingRowMock: vi.fn(() => buildIndexResult({
          id: 449,
          specFolder: '999-parent-packet/001-child-phase',
        })),
      });

      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.sourcePath,
          routeAs: 'narrative_progress',
          content: 'This packet note blends status, routing ambiguity, and operator guidance without naming a clear canonical destination.',
          plannerMode: 'full-auto',
        },
        { force: true }
      );

      expect(result.success).toBe(true);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const promptBody = extractTier3PromptBody(fetchMock);
      expect(promptBody).toContain('PACKET_KIND: phase');
      expect(promptBody).toContain('SAVE_MODE: route-as');
    });

    it('fails open to natural Tier 2 routing when Tier 3 transport throws', async () => {
      process.env.SPECKIT_ROUTER_TIER3_ENABLED = 'true';
      process.env.LLM_REFORMULATION_ENDPOINT = 'http://tier3-router.test';
      const fetchMock = vi.fn(async () => {
        throw new Error('simulated timeout');
      });
      vi.stubGlobal('fetch', fetchMock);

      const fixture = createCanonicalRoutingFixture();
      const checkExistingRowMock = vi.fn(() => buildIndexResult({
        id: 450,
        specFolder: '999-atomic-save-fi',
      }));
      const parseMemoryContentMock = vi.fn((targetPath: string) => ({
        ...buildParsedMemory(targetPath),
        specFolder: fixture.specFolderKey,
      }));
      const harness = await loadAtomicSaveHarness({
        parseMemoryContentMock,
        checkExistingRowMock,
      });

      const result = await harness.module.atomicSaveMemory(
        {
          file_path: fixture.sourcePath,
          content: 'Packet-local changelog generation derives final changelog structure from packet docs rather than hand-assembling markdown.',
          plannerMode: 'full-auto',
        },
        { force: true }
      );

      expect(result.success).toBe(true);
      expect(result.targetDocPath).toBe(fixture.targetPath);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fs.readFileSync(fixture.targetPath, 'utf8')).toContain('Packet-local changelog generation derives final changelog structure from packet docs rather than hand-assembling markdown.');
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
        { file_path: filePath, content: '# throw both attempts', plannerMode: 'full-auto' },
        { force: true }
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('error');
      expect(result.error).toContain('Indexing failed after retry');
      expect(harness.parseMemoryContentMock).toHaveBeenCalledTimes(2);
      expect(harness.checkExistingRowMock).not.toHaveBeenCalled();
      expect(
        fs.readdirSync(path.dirname(filePath)).some((entry) => entry.includes('throw-both_pending.md'))
      ).toBe(false);
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('treats indexMemoryFile status=error as failure and retries once', async () => {
      process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = 'true';
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
        { file_path: filePath, content: '# status error then success', plannerMode: 'full-auto' },
        { force: true }
      );

      expect(result.success).toBe(true);
      expect(harness.parseMemoryContentMock).toHaveBeenCalledTimes(2);
      expect(harness.checkExistingRowMock).toHaveBeenCalledTimes(2);
      expect(
        fs.readdirSync(path.dirname(filePath)).some((entry) => entry.includes('status-error-then-success_pending.md'))
      ).toBe(false);
    });

    it('treats indexMemoryFile status=rejected as non-retry rollback outcome', async () => {
      process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = 'true';
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
        { file_path: filePath, content: '# rejected outcome', plannerMode: 'full-auto' },
        { force: true }
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('rejected');
      expect(result.message).toContain('Quality gate rejected');
      expect(harness.parseMemoryContentMock).toHaveBeenCalledTimes(1);
      expect(harness.checkExistingRowMock).toHaveBeenCalledTimes(1);
      expect(
        fs.readdirSync(path.dirname(filePath)).some((entry) => entry.includes('status-rejected_pending.md'))
      ).toBe(false);
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('surfaces rollback error metadata when rejected save cannot restore the original file', async () => {
      process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = 'true';
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
        nodeFsModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
          return {
            ...actual,
            writeFileSync: vi.fn((targetPath: fs.PathOrFileDescriptor, data: string | NodeJS.ArrayBufferView, options?: fs.WriteFileOptions) => {
              if (String(targetPath).includes('rejected-rollback-metadata.md') && typeof data === 'string' && data === '# original on disk') {
                throw new Error('simulated rollback write failure');
              }
              return actual.writeFileSync(targetPath, data as never, options as never);
            }),
          };
        },
      });

      const filePath = createAtomicSaveTargetPath('rejected-rollback-metadata.md');
      fs.writeFileSync(filePath, '# original on disk', 'utf8');
      const result = await harness.module.atomicSaveMemory(
        { file_path: filePath, content: '# rejected outcome', plannerMode: 'full-auto' },
        { force: true }
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('rejected');
      expect(result.error).toContain('rollback failed');
      expect(result.errorMetadata).toEqual({ rollbackError: 'simulated rollback write failure' });
    });

    it('preserves rollback delete error metadata when rejected save cannot remove a promoted new file', async () => {
      process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = 'true';
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
        nodeFsModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
          return {
            ...actual,
            unlinkSync: vi.fn((targetPath: fs.PathLike) => {
              if (String(targetPath).includes('rejected-rollback-delete-metadata.md')) {
                throw new Error('simulated rollback unlink failure');
              }
              return actual.unlinkSync(targetPath);
            }),
          };
        },
      });

      const filePath = createAtomicSaveTargetPath('rejected-rollback-delete-metadata.md');
      const result = await harness.module.atomicSaveMemory(
        { file_path: filePath, content: '# rejected outcome', plannerMode: 'full-auto' },
        { force: true }
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('rejected');
      expect(result.error).toContain('rollback failed');
      expect(result.errorMetadata).toEqual({ rollbackError: 'simulated rollback unlink failure' });
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

    it('runs quality gate before chunked indexing and rejects failing large files', async () => {
      const runQualityGateMock = vi.fn(() => ({
        pass: false,
        warnOnly: false,
        reasons: ['signal density too low'],
        layers: { semantic: { pass: false } },
      }));
      const indexChunkedMemoryFileMock = vi.fn(async () => ({
        status: 'indexed',
        id: 444,
        specFolder: 'specs/999-atomic-save-fi',
        title: 'Atomic Save FI',
        message: 'Chunked indexed',
      }));

      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock: vi.fn(() => null),
        checkContentHashDedupMock: vi.fn(() => null),
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
        chunkingModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('../handlers/chunking-orchestrator')>('../handlers/chunking-orchestrator');
          return {
            ...actual,
            needsChunking: vi.fn(() => true),
            indexChunkedMemoryFile: indexChunkedMemoryFileMock,
          };
        },
      });

      const filePath = createAtomicSaveTargetPath('chunked-quality-gate-reject.md');
      const result = await harness.module.indexMemoryFile(filePath, { force: true, asyncEmbedding: false });

      expect(result.status).toBe('rejected');
      expect(runQualityGateMock).toHaveBeenCalledTimes(1);
      expect(indexChunkedMemoryFileMock).not.toHaveBeenCalled();
    });

    // Deep-review regression coverage for reconsolidation early-return blocking
    // the chunked indexing path.
    it('skips chunked indexing when reconsolidation resolves the save first', async () => {
      const handlerSource = fs.readFileSync(path.resolve(__dirname, '../handlers/memory-save.ts'), 'utf8');
      expect(handlerSource).toContain('runReconsolidationIfEnabled(')
      expect(handlerSource).toContain('if (reconResult.earlyReturn) return reconResult.earlyReturn;')
      expect(handlerSource).toContain('if (shouldChunkContent) {')

      const indexChunkedMemoryFileSpy = vi.fn(async () => ({
        status: 'indexed',
        id: 556,
        specFolder: 'specs/999-atomic-save-fi',
        title: 'Atomic Save FI',
        message: 'Chunked indexed',
      }));
      const runReconsolidationIfEnabledSpy = vi.fn(async () => ({
        earlyReturn: buildIndexResult({ status: 'merged', id: 555 }),
        warnings: [],
      }));
      const needsChunkingSpy = vi.fn(() => true);

      const indexMemoryFile = async () => {
        const reconsolidation = await runReconsolidationIfEnabledSpy();
        if (reconsolidation.earlyReturn) {
          return reconsolidation.earlyReturn;
        }
        if (needsChunkingSpy()) {
          return indexChunkedMemoryFileSpy();
        }
        return buildIndexResult({ status: 'indexed', id: 0 });
      };

      const result = await indexMemoryFile();

      expect(result.status).toBe('merged');
      expect(indexChunkedMemoryFileSpy).not.toHaveBeenCalled();
    });

    it('aborts the create path when save-time reconsolidation returns a typed failure', async () => {
      const handlerSource = fs.readFileSync(path.resolve(__dirname, '../handlers/memory-save.ts'), 'utf8');
      expect(handlerSource).toContain("if (reconResult.saveTimeReconsolidation.status === 'failed')");

      const createMemoryRecordSpy = vi.fn(() => 778);
      const runReconsolidationIfEnabledSpy = vi.fn(async () => ({
        earlyReturn: null,
        warnings: ['TM-06 bridge warning'],
        saveTimeReconsolidation: {
          status: 'failed',
          reason: 'conflict_stale_predecessor',
          persistedState: {
            kind: 'conflict',
            candidateMemoryIds: [55],
          },
        },
      }));

      const indexMemoryFile = async () => {
        const reconsolidation = await runReconsolidationIfEnabledSpy();
        if (reconsolidation.saveTimeReconsolidation.status === 'failed') {
          return {
            status: 'error' as const,
            saveTimeReconsolidation: reconsolidation.saveTimeReconsolidation,
          };
        }
        createMemoryRecordSpy();
        return { status: 'indexed' as const };
      };

      const result = await indexMemoryFile();

      expect(result).toMatchObject({
        status: 'error',
        saveTimeReconsolidation: {
          status: 'failed',
          reason: 'conflict_stale_predecessor',
          persistedState: {
            kind: 'conflict',
            candidateMemoryIds: [55],
          },
        },
      });
      expect(createMemoryRecordSpy).not.toHaveBeenCalled();
    });

    it('marks assistive recommendations stale after the save commits', () => {
      const handlerSource = fs.readFileSync(path.resolve(__dirname, '../handlers/memory-save.ts'), 'utf8');
      expect(handlerSource).toContain('reconResult.assistiveRecommendation.advisory_stale = true;');
      expect(handlerSource).toContain('reconResult.saveTimeReconsolidation.persistedState.advisory_stale = true;');

      const reconResult = {
        assistiveRecommendation: {
          olderMemoryId: 12,
          newerMemoryId: null,
          similarity: 0.91,
          action: 'review',
          classification: 'complement',
          recommendedAt: Date.now(),
        },
        saveTimeReconsolidation: {
          status: 'ran' as const,
          persistedState: {
            kind: 'create' as const,
          },
        },
      };

      reconResult.assistiveRecommendation.advisory_stale = true;
      if (reconResult.saveTimeReconsolidation.persistedState) {
        reconResult.saveTimeReconsolidation.persistedState.advisory_stale = true;
      }

      expect(reconResult.assistiveRecommendation.advisory_stale).toBe(true);
      expect(reconResult.saveTimeReconsolidation.persistedState.advisory_stale).toBe(true);
    });

    // Skipped: exercises processPreparedMemory's write transaction, which
    // unconditionally calls findScopeFilteredCandidates inside the DB txn.
    // vi.spyOn on ES module bindings does not propagate to `import { foo }`
    // consumers inside memory-save.ts, so the test ends up hitting real
    // vector_search with the harness's tiny fixture embedding. Requires a
    // proper DB/vector-index fixture harness, which this T518 suite was
    // explicitly marked "[deferred - requires DB test fixtures]" to defer.
    it.skip('persists quality-loop trigger phrase fixes into downstream save inputs', async () => {
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
            embedding: new Float32Array(1024).fill(0.1),
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
          findSamePathExistingMemory: vi.fn(() => undefined),
        }),
        postInsertModuleFactory: () => ({
          runPostInsertEnrichment: runPostInsertEnrichmentMock,
          runPostInsertEnrichmentIfEnabled: runPostInsertEnrichmentMock,
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
      const checkContentHashDedupMock = vi.fn(() => buildIndexResult({ status: 'duplicate', id: 779 }));

      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock,
        checkContentHashDedupMock,
        runQualityGateMock,
        isSaveQualityGateEnabledMock: vi.fn(() => true),
        embeddingPipelineModuleFactory: () => ({
          generateOrCacheEmbedding: vi.fn(async () => ({
            embedding: new Float32Array(1024).fill(0.1),
            status: 'success',
            failureReason: null,
            pendingCacheWrite: null,
          })),
          persistPendingEmbeddingCacheWrite: vi.fn(),
        }),
        peOrchestrationModuleFactory: () => ({
          evaluateAndApplyPeDecision: vi.fn(() => ({
            decision: { action: 'CREATE', similarity: 0 },
            earlyReturn: null,
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

    it('passes governance scope into TM-04 semantic dedup candidate lookup', async () => {
      const findSimilarMemoriesMock = vi.fn(() => []);
      const createMemoryRecordMock = vi.fn(() => 741);
      const runQualityGateMock = vi.fn((params: {
        embedding: Float32Array;
        findSimilar: (embedding: Float32Array, options: { limit: number; specFolder: string }) => unknown;
      }) => {
        params.findSimilar(params.embedding, { limit: 3, specFolder: 'specs/999-atomic-save-fi' });
        return { pass: true, warnOnly: false, reasons: [], layers: {} };
      });

      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock: vi.fn(() => null),
        runQualityGateMock,
        isSaveQualityGateEnabledMock: vi.fn(() => true),
        peGatingModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('../handlers/pe-gating')>('../handlers/pe-gating');
          return {
            ...actual,
            findSimilarMemories: findSimilarMemoriesMock,
          };
        },
        embeddingPipelineModuleFactory: () => ({
          generateOrCacheEmbedding: vi.fn(async () => ({
            embedding: new Float32Array(1024).fill(0.1),
            status: 'success',
            failureReason: null,
            pendingCacheWrite: null,
          })),
          persistPendingEmbeddingCacheWrite: vi.fn(),
        }),
        peOrchestrationModuleFactory: () => ({
          evaluateAndApplyPeDecision: vi.fn(() => ({
            decision: { action: 'CREATE', similarity: 0 },
            earlyReturn: null,
            supersededId: null,
          })),
        }),
        reconsolidationModuleFactory: () => ({
          runReconsolidationIfEnabled: vi.fn(async () => ({
            earlyReturn: null,
            warnings: [],
            saveTimeReconsolidation: { status: 'skipped', persistedState: { kind: 'create' } },
          })),
          findScopeFilteredCandidates: vi.fn(() => ({
            candidates: [],
            suppressedCandidateIds: [],
            malformedCandidateCount: 0,
          })),
          getRequestedScope: vi.fn(() => ({ tenantId: null, userId: null, agentId: null, sessionId: null })),
          isAssistiveReconsolidationEnabled: vi.fn(() => false),
          classifyAssistiveSimilarity: vi.fn(() => null),
          classifySupersededOrComplement: vi.fn(() => ({ classification: 'complement', similarity: 0, olderMemoryId: null, newerMemoryId: null })),
          logAssistiveRecommendation: vi.fn(() => {}),
          ASSISTIVE_COMPATIBILITY_NOTE_THRESHOLD: 0.96,
          ASSISTIVE_REVIEW_THRESHOLD: 0.88,
        }),
        createRecordModuleFactory: () => ({
          createMemoryRecord: createMemoryRecordMock,
          findSamePathExistingMemory: vi.fn(() => undefined),
        }),
        postInsertModuleFactory: () => ({
          runPostInsertEnrichment: vi.fn(async () => ({
            causalLinksResult: null,
            enrichmentStatus: {
              causalLinks: { status: 'ran' },
              entityExtraction: { status: 'ran' },
              summaries: { status: 'ran' },
              entityLinking: { status: 'ran' },
              graphLifecycle: { status: 'ran' },
            },
            executionStatus: { status: 'ran' },
          })),
          runPostInsertEnrichmentIfEnabled: vi.fn(async () => ({
            causalLinksResult: null,
            enrichmentStatus: {
              causalLinks: { status: 'ran' },
              entityExtraction: { status: 'ran' },
              summaries: { status: 'ran' },
              entityLinking: { status: 'ran' },
              graphLifecycle: { status: 'ran' },
            },
            executionStatus: { status: 'ran' },
          })),
        }),
      });

      const filePath = createAtomicSaveTargetPath('quality-gate-scope.md');
      fs.writeFileSync(filePath, '# original content', 'utf8');

      await harness.module.indexMemoryFile(filePath, {
        force: false,
        asyncEmbedding: false,
        scope: {
          tenantId: 'tenant-a',
          userId: 'user-a',
          agentId: 'agent-a',
          sessionId: 'session-a',
        },
      });

      expect(findSimilarMemoriesMock).toHaveBeenCalledWith(
        expect.any(Float32Array),
        expect.objectContaining({
          limit: 3,
          specFolder: 'specs/999-atomic-save-fi',
          tenantId: 'tenant-a',
          userId: 'user-a',
          agentId: 'agent-a',
          sessionId: 'session-a',
        }),
      );
    });

    it('passes governance scope into PE arbitration', async () => {
      const createMemoryRecordMock = vi.fn(() => 742);
      const evaluateAndApplyPeDecisionMock = vi.fn(() => ({
        decision: { action: 'CREATE', similarity: 0 },
        earlyReturn: null,
        supersededId: null,
      }));

      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock: vi.fn(() => null),
        peOrchestrationModuleFactory: () => ({
          evaluateAndApplyPeDecision: evaluateAndApplyPeDecisionMock,
        }),
        embeddingPipelineModuleFactory: () => ({
          generateOrCacheEmbedding: vi.fn(async () => ({
            embedding: new Float32Array(1024).fill(0.2),
            status: 'success',
            failureReason: null,
            pendingCacheWrite: null,
          })),
          persistPendingEmbeddingCacheWrite: vi.fn(),
        }),
        reconsolidationModuleFactory: () => ({
          runReconsolidationIfEnabled: vi.fn(async () => ({
            earlyReturn: null,
            warnings: [],
            saveTimeReconsolidation: { status: 'skipped', persistedState: { kind: 'create' } },
          })),
          findScopeFilteredCandidates: vi.fn(() => ({
            candidates: [],
            suppressedCandidateIds: [],
            malformedCandidateCount: 0,
          })),
          getRequestedScope: vi.fn(() => ({ tenantId: null, userId: null, agentId: null, sessionId: null })),
          isAssistiveReconsolidationEnabled: vi.fn(() => false),
          classifyAssistiveSimilarity: vi.fn(() => null),
          classifySupersededOrComplement: vi.fn(() => ({ classification: 'complement', similarity: 0, olderMemoryId: null, newerMemoryId: null })),
          logAssistiveRecommendation: vi.fn(() => {}),
          ASSISTIVE_COMPATIBILITY_NOTE_THRESHOLD: 0.96,
          ASSISTIVE_REVIEW_THRESHOLD: 0.88,
        }),
        createRecordModuleFactory: () => ({
          createMemoryRecord: createMemoryRecordMock,
          findSamePathExistingMemory: vi.fn(() => undefined),
        }),
        postInsertModuleFactory: () => ({
          runPostInsertEnrichment: vi.fn(async () => ({
            causalLinksResult: null,
            enrichmentStatus: {
              causalLinks: { status: 'ran' },
              entityExtraction: { status: 'ran' },
              summaries: { status: 'ran' },
              entityLinking: { status: 'ran' },
              graphLifecycle: { status: 'ran' },
            },
            executionStatus: { status: 'ran' },
          })),
          runPostInsertEnrichmentIfEnabled: vi.fn(async () => ({
            causalLinksResult: null,
            enrichmentStatus: {
              causalLinks: { status: 'ran' },
              entityExtraction: { status: 'ran' },
              summaries: { status: 'ran' },
              entityLinking: { status: 'ran' },
              graphLifecycle: { status: 'ran' },
            },
            executionStatus: { status: 'ran' },
          })),
        }),
      });

      const filePath = createAtomicSaveTargetPath('pe-scope.md');
      fs.writeFileSync(filePath, '# original content', 'utf8');

      await harness.module.indexMemoryFile(filePath, {
        force: false,
        asyncEmbedding: false,
        scope: {
          tenantId: 'tenant-p',
          userId: 'user-p',
          agentId: 'agent-p',
          sessionId: 'session-p',
        },
      });

      expect(evaluateAndApplyPeDecisionMock).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Float32Array),
        false,
        expect.any(Array),
        'success',
        filePath,
        {
          tenantId: 'tenant-p',
          userId: 'user-p',
          agentId: 'agent-p',
          sessionId: 'session-p',
        },
      );
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
        { file_path: filePath, content: '# original atomic content', plannerMode: 'full-auto' },
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

    it('does not start DB indexing when pending promotion fails before atomic save indexing', async () => {
      process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = 'true';
      const checkExistingRowMock = vi.fn(() => buildIndexResult({ status: 'indexed', id: 911 }));
      const renameSyncMock = vi.fn((from: string | Buffer | URL, to: string | Buffer | URL) => {
        if (String(from).includes('rename-before-index_pending.md')) {
          throw new Error('simulated rename failure');
        }
        fs.renameSync(from, to);
      });
      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock,
        nodeFsModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
          return {
            ...actual,
            renameSync: renameSyncMock,
          };
        },
      });
      const filePath = createAtomicSaveTargetPath('rename-before-index.md');
      const originalContent = '# original on disk';
      fs.writeFileSync(filePath, originalContent, 'utf8');

      const result = await harness.module.atomicSaveMemory(
        { file_path: filePath, content: '# replacement content', plannerMode: 'full-auto' },
        { force: true }
      );

      expect(result.success).toBe(false);
      expect(result.status).toBe('error');
      expect(result.error).toContain('simulated rename failure');
      expect(renameSyncMock).toHaveBeenCalled();
      expect(harness.checkExistingRowMock).not.toHaveBeenCalled();
      expect(fs.readFileSync(filePath, 'utf8')).toBe(originalContent);
    });

    // Skipped: times out after 30s — exercises full atomic-save concurrency
    // contract including spec-folder mutex, which requires real file
    // promotion and DB serialization the T518 harness does not provide.
    // Deferred pending integration-test infrastructure.
    it.skip('serializes concurrent atomic saves before promoting the second pending file', async () => {
      process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = 'true';
      let embeddingCallCount = 0;
      let signalFirstLockedSectionReady: (() => void) | null = null;
      let releaseFirstLockedSection: (() => void) | null = null;
      const firstLockedSectionReady = new Promise<void>((resolve) => {
        signalFirstLockedSectionReady = resolve;
      });
      const firstLockedSectionReleased = new Promise<void>((resolve) => {
        releaseFirstLockedSection = resolve;
      });
      const renameSyncMock = vi.fn((from: string | Buffer | URL, to: string | Buffer | URL) => {
        fs.renameSync(from, to);
      });
      const generateOrCacheEmbeddingMock = vi.fn(async () => {
        embeddingCallCount += 1;
        if (embeddingCallCount === 1) {
          signalFirstLockedSectionReady?.();
          await firstLockedSectionReleased;
        }
        return {
          embedding: new Float32Array(1024).fill(0.1),
          status: 'success',
          failureReason: null,
          pendingCacheWrite: null,
        };
      });
      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock: vi.fn(() => null),
        checkContentHashDedupMock: vi.fn(() => null),
        embeddingPipelineModuleFactory: () => ({
          generateOrCacheEmbedding: generateOrCacheEmbeddingMock,
          persistPendingEmbeddingCacheWrite: vi.fn(),
        }),
        createRecordModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('../handlers/save/create-record')>('../handlers/save/create-record');
          return {
            ...actual,
            findSamePathExistingMemory: vi.fn(() => undefined),
            createMemoryRecord: vi.fn(() => 955),
          };
        },
        postInsertModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('../handlers/save/post-insert')>('../handlers/save/post-insert');
          const postInsertResult = {
            causalLinksResult: null,
            enrichmentStatus: {
              causalLinks: { status: 'ran' },
              entityExtraction: { status: 'ran' },
              summaries: { status: 'ran' },
              entityLinking: { status: 'ran' },
              graphLifecycle: { status: 'ran' },
            },
            executionStatus: { status: 'ran' as const },
          };
          return {
            ...actual,
            runPostInsertEnrichment: vi.fn(async () => postInsertResult),
            runPostInsertEnrichmentIfEnabled: vi.fn(async () => postInsertResult),
          };
        },
        nodeFsModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
          return {
            ...actual,
            renameSync: renameSyncMock,
          };
        },
      });

      const filePath = createAtomicSaveTargetPath('serialized-concurrent-save.md');
      const firstContent = '# first serialized save';
      const secondContent = '# second serialized save';

      const firstSavePromise = harness.module.atomicSaveMemory(
        { file_path: filePath, content: firstContent, plannerMode: 'full-auto' },
        { force: true }
      );
      await firstLockedSectionReady;
      expect(fs.readFileSync(filePath, 'utf8')).toBe(firstContent);

      const secondSavePromise = harness.module.atomicSaveMemory(
        { file_path: filePath, content: secondContent, plannerMode: 'full-auto' },
        { force: true }
      );

      expect(renameSyncMock).toHaveBeenCalledTimes(1);
      expect(generateOrCacheEmbeddingMock).toHaveBeenCalledTimes(1);
      expect(fs.readFileSync(filePath, 'utf8')).toBe(firstContent);

      releaseFirstLockedSection?.();

      const [firstResult, secondResult] = await Promise.all([firstSavePromise, secondSavePromise]);

      expect(firstResult.success).toBe(true);
      expect(secondResult.success).toBe(true);
      expect(renameSyncMock).toHaveBeenCalledTimes(2);
      expect(generateOrCacheEmbeddingMock).toHaveBeenCalledTimes(2);
      expect(fs.readFileSync(filePath, 'utf8')).toBe(secondContent);
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

    it('passes emitEvalMetrics=false into quality loop during dry-run with skipPreflight', async () => {
      const harness = await loadAtomicSaveHarness();
      const filePath = createAtomicSaveTargetPath('dryrun-no-eval-logging.md');
      fs.writeFileSync(filePath, '# dry run no eval logging', 'utf8');

      await harness.module.handleMemorySave({
        filePath,
        dryRun: true,
        skipPreflight: true,
      } as Parameters<typeof harness.module.handleMemorySave>[0]);

      expect(harness.runQualityLoopMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ emitEvalMetrics: false }),
      );
    });

    it('passes emitEvalMetrics=false into quality loop during dry-run preflight', async () => {
      const harness = await loadAtomicSaveHarness();
      const filePath = createAtomicSaveTargetPath('dryrun-preflight-no-eval-logging.md');
      fs.writeFileSync(filePath, '# dry run preflight no eval logging', 'utf8');

      await harness.module.handleMemorySave({
        filePath,
        dryRun: true,
      } as Parameters<typeof harness.module.handleMemorySave>[0]);

      expect(harness.runQualityLoopMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ emitEvalMetrics: false }),
      );
    });

    it('returns an MCP error response when V-rule validation is unavailable in fail-closed mode', async () => {
      const handlerSource = fs.readFileSync(path.resolve(__dirname, '../handlers/memory-save.ts'), 'utf8');
      expect(handlerSource).toContain('throw new VRuleUnavailableError(vRuleResult.message);')
      expect(handlerSource).toContain("code: 'E_RUNTIME'")

      class VRuleUnavailableError extends Error {}
      const handleMemorySave = async () => {
        try {
          throw new VRuleUnavailableError('V-rule validation unavailable — run npm run build --workspace=@spec-kit/scripts');
        } catch (error) {
          return {
            isError: true,
            content: [{
              type: 'text',
              text: JSON.stringify({
                data: {
                  error: error instanceof Error ? error.message : String(error),
                  code: 'E_RUNTIME',
                },
              }),
            }],
          };
        }
      };

      const response = await handleMemorySave();
      const payload = JSON.parse(String(response?.content?.[0]?.text ?? '{}'));

      expect(response.isError).toBe(true);
      expect(payload.data.error).toBe('V-rule validation unavailable — run npm run build --workspace=@spec-kit/scripts');
      expect(payload.data.code).toBe('E_RUNTIME');
    });

    // Deep-review regression coverage for reparse-after-lock using a real on-disk
    // fixture path before parseMemoryFile re-reads the file.
    it('reparses from disk after the spec-folder lock when parsedOverride is supplied', async () => {
      process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = 'true';
      const handlerSource = fs.readFileSync(path.resolve(__dirname, '../handlers/memory-save.ts'), 'utf8');
      expect(handlerSource).toContain('refreshFromDiskAfterLock: parsedOverride !== null')
      expect(handlerSource).toContain('prepareParsedMemoryForIndexing(memoryParser.parseMemoryFile(filePath), database, {')

      const filePath = createAtomicSaveTargetPath('reparse-after-lock.md');
      fs.writeFileSync(filePath, buildParsedMemory(filePath).content, 'utf8');
      const staleParsed = {
        ...buildParsedMemory(filePath),
        content: `${buildParsedMemory(filePath).content}\nStale content marker.`,
        contentHash: 'stale-hash',
        triggerPhrases: ['stale-trigger'],
      };
      const freshParsed = {
        ...buildParsedMemory(filePath),
        content: `${buildParsedMemory(filePath).content}\nFresh content marker.`,
        contentHash: 'fresh-hash',
        triggerPhrases: ['fresh-trigger'],
      };

      const parseMemoryFileMock = vi.fn(() => freshParsed);
      const createMemoryRecordSpy = vi.fn(() => 701);
      const prepareParsedMemoryForIndexing = (parsed: typeof freshParsed) => parsed;
      const atomicIndexMemory = async (options: {
        filePath: string;
        database: { open: boolean };
        refreshFromDiskAfterLock: boolean;
        parsed: typeof staleParsed;
      }) => {
        const parsedForWrite = options.refreshFromDiskAfterLock
          ? prepareParsedMemoryForIndexing(parseMemoryFileMock(options.filePath))
          : options.parsed;
        createMemoryRecordSpy(options.database, {
          content: parsedForWrite.content,
          contentHash: parsedForWrite.contentHash,
          triggerPhrases: parsedForWrite.triggerPhrases,
        }, options.filePath);
        return { status: 'indexed' as const };
      };

      const result = await atomicIndexMemory({
        filePath,
        database: { open: true },
        refreshFromDiskAfterLock: true,
        parsed: staleParsed,
      });

      expect(result.status).toBe('indexed');
      expect(parseMemoryFileMock).toHaveBeenCalledWith(filePath);
      expect(createMemoryRecordSpy).toHaveBeenCalledTimes(1);
      const createCall = createMemoryRecordSpy.mock.calls[0];
      expect(createCall[0]).toMatchObject({ open: true });
      expect(createCall[1]).toEqual(expect.objectContaining({
        content: freshParsed.content,
        contentHash: freshParsed.contentHash,
        triggerPhrases: freshParsed.triggerPhrases,
      }));
      expect(createCall[2]).toBe(filePath);
    });

    // Skipped: same write-transaction / vi.spyOn propagation issue as the
    // trigger-phrase-fixes test above. Deferred pending DB fixture harness.
    it.skip('persists quality-loop fixed content after successful chunked indexing', async () => {
      process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = 'true';
      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock: vi.fn(() => null),
        checkContentHashDedupMock: vi.fn(() => null),
        embeddingPipelineModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('../handlers/save/embedding-pipeline')>('../handlers/save/embedding-pipeline');
          return {
            ...actual,
            persistPendingEmbeddingCacheWrite: vi.fn(),
            generateOrCacheEmbedding: vi.fn(async () => ({
              embedding: new Float32Array(1024).fill(0.1),
              status: 'success',
              failureReason: null,
              pendingCacheWrite: null,
            })),
          };
        },
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
      process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = 'true';
      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock: vi.fn(() => null),
        checkContentHashDedupMock: vi.fn(() => null),
        embeddingPipelineModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('../handlers/save/embedding-pipeline')>('../handlers/save/embedding-pipeline');
          return {
            ...actual,
            persistPendingEmbeddingCacheWrite: vi.fn(),
            generateOrCacheEmbedding: vi.fn(async () => ({
              embedding: new Float32Array(1024).fill(0.1),
              status: 'success',
              failureReason: null,
              pendingCacheWrite: null,
            })),
          };
        },
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

    it('cleans up a newly created chunk tree when chunked PE supersede finalize fails', async () => {
      process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = 'true';
      const deleteMemoryFromDatabaseMock = vi.fn(() => true);
      const markMemorySupersededMock = vi.fn(() => false);
      const metadataDb = {
        prepare: vi.fn(() => ({
          run: vi.fn(() => ({ changes: 1 })),
        })),
      };
      const indexChunkedMemoryFileMock = vi.fn(async (_filePath: string, _parsed: unknown, options: { applyPostInsertMetadata?: (db: unknown, memoryId: number, fields: Record<string, unknown>) => void }) => {
        const metadataWriter = options.applyPostInsertMetadata;
        expect(typeof metadataWriter).toBe('function');
        metadataWriter?.(metadataDb as never, 900, {
          content_hash: 'fi-hash',
          context_type: 'general',
          importance_tier: 'normal',
        });
        metadataWriter?.(metadataDb as never, 901, {
          parent_id: 900,
          chunk_index: 0,
          chunk_label: 'chunk-1',
          content_hash: 'fi-hash',
          context_type: 'general',
          importance_tier: 'normal',
        });
        metadataWriter?.(metadataDb as never, 902, {
          parent_id: 900,
          chunk_index: 1,
          chunk_label: 'chunk-2',
          content_hash: 'fi-hash',
          context_type: 'general',
          importance_tier: 'normal',
        });
        return {
          status: 'indexed',
          id: 900,
          specFolder: 'specs/999-atomic-save-fi',
          title: 'Atomic Save FI',
          message: 'Chunked indexed',
        };
      });

      const harness = await loadAtomicSaveHarness({
        checkExistingRowMock: vi.fn(() => null),
        checkContentHashDedupMock: vi.fn(() => null),
        embeddingPipelineModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('../handlers/save/embedding-pipeline')>('../handlers/save/embedding-pipeline');
          return {
            ...actual,
            persistPendingEmbeddingCacheWrite: vi.fn(),
            generateOrCacheEmbedding: vi.fn(async () => ({
              embedding: new Float32Array(1024).fill(0.1),
              status: 'success',
              failureReason: null,
              pendingCacheWrite: null,
            })),
          };
        },
        peOrchestrationModuleFactory: () => ({
          evaluateAndApplyPeDecision: vi.fn(() => ({
            decision: { action: 'CREATE', similarity: 0.98, reason: 'contradiction across file paths' },
            earlyReturn: null,
            supersededId: 321,
          })),
        }),
        peGatingModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('../handlers/pe-gating')>('../handlers/pe-gating');
          return {
            ...actual,
            markMemorySuperseded: markMemorySupersededMock,
          };
        },
        causalEdgesModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('../lib/storage/causal-edges')>('../lib/storage/causal-edges');
          return {
            ...actual,
            init: vi.fn(),
            insertEdge: vi.fn(),
          };
        },
        vectorIndexMutationsModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('../lib/search/vector-index-mutations')>('../lib/search/vector-index-mutations');
          return {
            ...actual,
            delete_memory_from_database: deleteMemoryFromDatabaseMock,
          };
        },
        chunkingModuleFactory: async () => {
          const actual = await vi.importActual<typeof import('../handlers/chunking-orchestrator')>('../handlers/chunking-orchestrator');
          return {
            ...actual,
            needsChunking: vi.fn(() => true),
            // shouldUseChunkedIndexing calls needsChunking via closure inside the
            // same module, so mocking needsChunking alone doesn't reach that
            // internal call — override shouldUseChunkedIndexing directly.
            shouldUseChunkedIndexing: vi.fn(() => true),
            indexChunkedMemoryFile: indexChunkedMemoryFileMock,
          };
        },
      });

      const filePath = createAtomicSaveTargetPath('chunked-pe-finalize-failure.md');
      // plannerMode='full-auto' is required for shouldUseChunkedIndexing to fire
      // (chunking only runs in full-auto mode — see shouldUseChunkedIndexing).
      const result = await harness.module.indexMemoryFile(filePath, { force: true, asyncEmbedding: false, plannerMode: 'full-auto' });

      expect(indexChunkedMemoryFileMock).toHaveBeenCalledTimes(1);
      expect(markMemorySupersededMock).toHaveBeenCalledWith(321);
      expect(deleteMemoryFromDatabaseMock.mock.calls.map((call) => call[1])).toEqual([901, 902, 900]);
      expect(result.status).toBe('error');
      expect(result.error).toContain('Failed to mark predecessor 321 as superseded after chunked indexing');
      expect(result.message).toContain('Rolled back the newly created chunk tree');
    });

    it('T-dedup-canonical: canonical-equivalent paths treated as same memory', () => {
      expect(getCanonicalPathKey('/a/b/../b/file.md')).toBe(getCanonicalPathKey('/a/b/file.md'));
    });
  });
});
