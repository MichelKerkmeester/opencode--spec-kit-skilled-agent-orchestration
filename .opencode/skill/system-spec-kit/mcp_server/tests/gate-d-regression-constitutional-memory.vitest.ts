import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const handlerMocks = vi.hoisted(() => ({
  executePipeline: vi.fn(),
  logChannelResult: vi.fn(),
  logFinalResult: vi.fn(),
  logSearchQuery: vi.fn(() => ({ queryId: 111, evalRunId: 222 })),
}));

vi.mock('../core', () => ({
  checkDatabaseUpdated: vi.fn(async () => false),
  isEmbeddingModelReady: vi.fn(() => true),
  waitForEmbeddingModel: vi.fn(async () => true),
}));

vi.mock('../lib/cache/tool-cache', () => ({
  generateCacheKey: vi.fn(() => 'gate-d-constitutional-memory'),
  isEnabled: vi.fn(() => false),
  get: vi.fn(() => null),
  withCache: vi.fn(async (_tool: string, _args: unknown, fn: () => Promise<unknown>) => fn()),
}));

vi.mock('../lib/search/pipeline', () => ({
  executePipeline: handlerMocks.executePipeline,
}));

vi.mock('../formatters', () => ({
  formatSearchResults: vi.fn(async (
    results: Array<Record<string, unknown>>,
    _searchType: string,
    _includeContent: boolean,
    _basePath: unknown,
    _arg4: unknown,
    _arg5: unknown,
    extraData: Record<string, unknown> | undefined,
  ) => ({
    content: [{
      type: 'text',
      text: JSON.stringify({
        data: {
          count: results.length,
          results,
          ...(extraData ?? {}),
        },
      }),
    }],
    isError: false,
  })),
}));

vi.mock('../utils', () => ({
  validateQuery: vi.fn((query: unknown) => String(query ?? '').trim()),
  requireDb: vi.fn(() => {
    throw new Error('db unavailable in gate-d constitutional regression');
  }),
  toErrorMessage: vi.fn((error: unknown) => error instanceof Error ? error.message : String(error)),
}));

vi.mock('../lib/search/artifact-routing', () => ({
  getStrategyForQuery: vi.fn(() => null),
  applyRoutingWeights: vi.fn((results: unknown[]) => results),
}));

vi.mock('../lib/search/intent-classifier', () => ({
  isValidIntent: vi.fn(() => true),
  getIntentWeights: vi.fn(() => ({ similarity: 0.6, importance: 0.25, recency: 0.15 })),
  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.92, fallback: false })),
  getIntentDescription: vi.fn(() => 'intent description'),
}));

vi.mock('../lib/search/session-boost', () => ({
  isEnabled: vi.fn(() => false),
}));

vi.mock('../lib/search/causal-boost', () => ({
  isEnabled: vi.fn(() => false),
}));

vi.mock('../lib/eval/eval-logger', () => ({
  logSearchQuery: (payload: unknown) => handlerMocks.logSearchQuery(payload),
  logChannelResult: (payload: unknown) => handlerMocks.logChannelResult(payload),
  logFinalResult: (payload: unknown) => handlerMocks.logFinalResult(payload),
}));

import { handleMemorySearch } from '../handlers/memory-search';
import { findConstitutionalFiles } from '../handlers/memory-index-discovery';

const TEMP_DIRS: string[] = [];

function makeTempDir(prefix: string): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  TEMP_DIRS.push(tempDir);
  return tempDir;
}

function parseResponseData(
  response: Awaited<ReturnType<typeof handleMemorySearch>>,
): Record<string, unknown> {
  return JSON.parse(response.content[0].text).data as Record<string, unknown>;
}

afterEach(() => {
  vi.clearAllMocks();
  while (TEMP_DIRS.length > 0) {
    const tempDir = TEMP_DIRS.pop();
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
});

describe('Gate D regression constitutional memory', () => {
  beforeEach(() => {
    handlerMocks.executePipeline.mockReset();
  });

  it('discovers constitutional guidance from dedicated skill files and skips README placeholders', () => {
    const workspace = makeTempDir('gate-d-constitutional-files-');
    const constitutionalDir = path.join(
      workspace,
      '.opencode',
      'skill',
      'gate-d-skill',
      'constitutional',
    );
    fs.mkdirSync(constitutionalDir, { recursive: true });

    const ruleFile = path.join(constitutionalDir, 'reader-ready-rules.md');
    const readmeFile = path.join(constitutionalDir, 'README.md');
    fs.writeFileSync(ruleFile, '# Reader-ready rules\n', 'utf8');
    fs.writeFileSync(readmeFile, '# Placeholder\n', 'utf8');

    const discovered = findConstitutionalFiles(workspace);

    expect(discovered).toEqual([ruleFile]);
  });

  it('keeps constitutional guidance at the top while dropping archived and legacy-memory rows', async () => {
    handlerMocks.executePipeline.mockResolvedValueOnce({
      results: [
        {
          id: 300,
          title: 'Archived fallback note',
          file_path: '/workspace/specs/system-spec-kit/026/memory/archived-note.md',
          document_type: 'memory',
          importance_tier: 'archived',
          score: 0.99,
          similarity: 0.99,
        },
        {
          id: 101,
          title: 'Reader Ready Guardrails',
          file_path: '/workspace/.opencode/skill/system-spec-kit/constitutional/reader-ready-rules.md',
          document_type: 'constitutional',
          importance_tier: 'constitutional',
          score: 0.98,
          similarity: 0.98,
        },
        {
          id: 202,
          title: 'Implementation Summary',
          file_path: '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/implementation-summary.md',
          document_type: 'implementation_summary',
          importance_tier: 'important',
          score: 0.95,
          similarity: 0.95,
        },
        {
          id: 400,
          title: 'Legacy memory row',
          file_path: '/workspace/specs/system-spec-kit/026/memory/legacy-note.md',
          document_type: 'memory',
          importance_tier: 'normal',
          score: 0.97,
          similarity: 0.97,
        },
      ],
      metadata: {
        stage1: { searchType: 'hybrid', channelCount: 2, candidateCount: 4, constitutionalInjected: 1, durationMs: 1 },
        stage2: {
          sessionBoostApplied: 'off',
          causalBoostApplied: 'off',
          intentWeightsApplied: 'off',
          artifactRoutingApplied: 'off',
          feedbackSignalsApplied: 'off',
          qualityFiltered: 0,
          durationMs: 1,
        },
        stage3: {
          rerankApplied: false,
          chunkReassemblyStats: { collapsedChunkHits: 0, chunkParents: 0, reassembled: 0, fallback: 0 },
          durationMs: 1,
        },
        stage4: { stateFiltered: 0, constitutionalInjected: 1, evidenceGapDetected: false, durationMs: 1 },
      },
      annotations: { stateStats: {}, featureFlags: {} },
      trace: undefined,
    });

    const response = await handleMemorySearch({
      query: 'what reader-ready guardrails apply before editing canonical handlers',
      includeConstitutional: true,
      includeArchived: true,
    });

    const data = parseResponseData(response);
    const results = data.results as Array<Record<string, unknown>>;
    const sourceContract = data.sourceContract as Record<string, unknown>;
    const pipelineMetadata = data.pipelineMetadata as Record<string, unknown>;
    const stage1 = pipelineMetadata.stage1 as Record<string, unknown>;

    expect(results.map((row) => row.id)).toEqual([101, 202]);
    expect(results[0]).toMatchObject({
      id: 101,
      canonicalSource: 'constitutional',
      canonicalSourceType: 'constitutional',
      documentType: 'constitutional',
    });
    expect(results[1]).toMatchObject({
      id: 202,
      canonicalSource: 'spec_doc',
      canonicalSourceType: 'spec_doc',
      documentType: 'spec_doc',
    });

    expect(stage1.constitutionalInjected).toBe(1);
    expect(sourceContract).toMatchObject({
      version: 'gate-d-reader-ready-v1',
      archivedTierEnabled: false,
      legacyFallbackEnabled: false,
      includeArchivedCompatibility: 'ignored',
      retainedResults: 2,
      droppedNonCanonicalResults: 2,
      countsBySourceKind: {
        constitutional: 1,
        continuity: 0,
        spec_doc: 1,
      },
    });
  });
});
