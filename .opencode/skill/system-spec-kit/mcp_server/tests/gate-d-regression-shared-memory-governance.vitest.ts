import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const runtime = vi.hoisted(() => ({
  db: null as Database.Database | null,
}));

const PIPELINE_METADATA = {
  stage1: { searchType: 'hybrid', channelCount: 2, candidateCount: 4, constitutionalInjected: 0, durationMs: 1 },
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
  stage4: { stateFiltered: 0, constitutionalInjected: 0, evidenceGapDetected: false, durationMs: 1 },
} as const;

vi.mock('../core', () => ({
  checkDatabaseUpdated: vi.fn(async () => false),
  isEmbeddingModelReady: vi.fn(() => true),
  waitForEmbeddingModel: vi.fn(async () => true),
}));

vi.mock('../lib/cache/tool-cache', () => ({
  generateCacheKey: vi.fn(() => 'gate-d-regression-shared-memory-governance'),
  isEnabled: vi.fn(() => false),
  get: vi.fn(() => null),
  set: vi.fn(() => undefined),
  withCache: vi.fn(async (_tool: string, _args: unknown, fn: () => Promise<unknown>) => fn()),
}));

vi.mock('../lib/search/search-flags', () => ({
  isSessionBoostEnabled: vi.fn(() => false),
  isCausalBoostEnabled: vi.fn(() => false),
  isCommunitySearchFallbackEnabled: vi.fn(() => false),
  isDualRetrievalEnabled: vi.fn(() => false),
  isIntentAutoProfileEnabled: vi.fn(() => false),
}));

vi.mock('../lib/search/pipeline', () => ({
  executePipeline: vi.fn(),
}));

vi.mock('../formatters', () => ({
  formatSearchResults: vi.fn(async (
    results: Array<Record<string, unknown>>,
    _searchType: string,
    _includeContent?: boolean,
    _anchors?: string[] | null,
    _parserOverride?: unknown,
    _startTime?: number | null,
    extraData: Record<string, unknown> = {},
  ) => ({
    content: [{
      type: 'text',
      text: JSON.stringify({
        summary: `Found ${results.length} memories`,
        data: {
          count: results.length,
          results: results.map((row) => ({ ...row })),
          ...extraData,
        },
      }),
    }],
    isError: false,
  })),
}));

vi.mock('../utils', () => ({
  validateQuery: vi.fn((query: unknown) => String(query ?? '').trim()),
  requireDb: vi.fn(() => {
    if (!runtime.db) {
      throw new Error('database fixture not initialized');
    }
    return runtime.db;
  }),
  toErrorMessage: vi.fn((err: unknown) => (err instanceof Error ? err.message : String(err))),
}));

vi.mock('../lib/search/artifact-routing', () => ({
  getStrategyForQuery: vi.fn(() => null),
  applyRoutingWeights: vi.fn((results: unknown[]) => results),
}));

vi.mock('../lib/search/intent-classifier', () => ({
  isValidIntent: vi.fn(() => true),
  getIntentWeights: vi.fn(() => ({ similarity: 0.6, importance: 0.25, recency: 0.15 })),
  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.92, fallback: false })),
  getIntentDescription: vi.fn(() => 'shared memory governance'),
}));

vi.mock('../lib/eval/eval-logger', () => ({
  logSearchQuery: vi.fn(() => ({ queryId: 91, evalRunId: 92 })),
  logChannelResult: vi.fn(() => undefined),
  logFinalResult: vi.fn(() => undefined),
}));

vi.mock('../lib/feedback/feedback-ledger', () => ({
  logFeedbackEvents: vi.fn(() => undefined),
  isImplicitFeedbackLogEnabled: vi.fn(() => false),
}));

vi.mock('../lib/feedback/query-flow-tracker', () => ({
  trackQueryAndDetect: vi.fn(() => ({ queryId: null, status: 'disabled' })),
  logResultCited: vi.fn(() => undefined),
}));

vi.mock('../lib/telemetry/consumption-logger', () => ({
  initConsumptionLog: vi.fn(() => undefined),
  logConsumptionEvent: vi.fn(() => undefined),
}));

vi.mock('../lib/telemetry/retrieval-telemetry', () => ({
  isExtendedTelemetryEnabled: vi.fn(() => false),
  createTelemetry: vi.fn(() => ({ events: [] })),
  recordTransitionDiagnostics: vi.fn(() => undefined),
  recordGraphWalkDiagnostics: vi.fn(() => undefined),
  toJSON: vi.fn(() => ({})),
  finalizeSearchTelemetry: vi.fn(() => undefined),
  logSearchStart: vi.fn(() => undefined),
  logSearchSuccess: vi.fn(() => undefined),
  logSearchError: vi.fn(() => undefined),
}));

import { handleMemorySearch } from '../handlers/memory-search';
import * as pipeline from '../lib/search/pipeline';
import { getAllowedSharedSpaceIds, upsertSharedMembership, upsertSharedSpace, enableSharedMemory } from '../lib/collab/shared-spaces';
import { filterRowsByScope } from '../lib/governance/scope-governance';

type MemorySearchResponse = Awaited<ReturnType<typeof handleMemorySearch>>;

function parseEnvelope(response: MemorySearchResponse): Record<string, unknown> {
  return JSON.parse(response.content[0].text) as Record<string, unknown>;
}

function makeSharedDb(): Database.Database {
  const db = new Database(':memory:');
  enableSharedMemory(db);
  upsertSharedSpace(db, {
    spaceId: 'space-allowed',
    tenantId: 'tenant-a',
    name: 'Allowed Space',
    rolloutEnabled: true,
  });
  upsertSharedSpace(db, {
    spaceId: 'space-blocked',
    tenantId: 'tenant-a',
    name: 'Blocked Space',
    rolloutEnabled: true,
  });
  upsertSharedMembership(db, {
    spaceId: 'space-allowed',
    subjectType: 'user',
    subjectId: 'user-member',
    role: 'editor',
  });
  return db;
}

function buildGovernedFixtureRows(): Array<Record<string, unknown>> {
  return [
    {
      id: 901,
      score: 0.96,
      title: 'Shared canonical spec doc',
      file_path: '/tmp/specs/026-gate-d/spec.md',
      document_type: 'spec',
      tenant_id: 'tenant-a',
      shared_space_id: 'space-allowed',
      anchor_id: 'problem',
      quality_score: 0.95,
    },
    {
      id: 902,
      score: 0.93,
      title: 'Shared thin continuity',
      file_path: '/tmp/specs/026-gate-d/implementation-summary.md',
      document_type: 'continuity',
      tenant_id: 'tenant-a',
      shared_space_id: 'space-allowed',
      anchor_id: '_memory.continuity',
      quality_score: 0.94,
    },
    {
      id: 903,
      score: 0.9,
      title: 'Different shared space',
      file_path: '/tmp/specs/026-gate-d/tasks.md',
      document_type: 'spec',
      tenant_id: 'tenant-a',
      shared_space_id: 'space-blocked',
      anchor_id: 'verification',
      quality_score: 0.91,
    },
    {
      id: 904,
      score: 0.89,
      title: 'Legacy memory row',
      file_path: '/tmp/specs/026-gate-d/memory/legacy.md',
      document_type: 'memory',
      tenant_id: 'tenant-a',
      shared_space_id: 'space-allowed',
      quality_score: 0.9,
    },
  ];
}

beforeEach(() => {
  process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
  runtime.db = makeSharedDb();

  vi.mocked(pipeline.executePipeline).mockImplementation(async (config) => {
    const scope = {
      tenantId: config.tenantId,
      userId: config.userId,
      agentId: config.agentId,
      sharedSpaceId: config.sharedSpaceId,
    };
    const allowedSharedSpaceIds = getAllowedSharedSpaceIds(runtime.db!, scope);
    const filteredRows = filterRowsByScope(buildGovernedFixtureRows(), scope, allowedSharedSpaceIds);

    return {
      results: filteredRows,
      metadata: PIPELINE_METADATA,
      annotations: { stateStats: {}, featureFlags: {} },
      trace: undefined,
    };
  });
});

afterEach(() => {
  delete process.env.SPECKIT_MEMORY_SHARED_MEMORY;
  vi.restoreAllMocks();
  runtime.db?.close();
  runtime.db = null;
});

describe('Gate D regression shared memory governance', () => {
  it('feature 9 keeps deny-by-default shared access while returning only canonical reader sources', async () => {
    const response = await handleMemorySearch({
      query: 'shared rollout state',
      tenantId: 'tenant-a',
      userId: 'user-member',
      sharedSpaceId: 'space-allowed',
      includeArchived: true,
    });

    const envelope = parseEnvelope(response);
    const data = envelope.data as Record<string, unknown>;
    const results = data.results as Array<Record<string, unknown>>;
    const sourceContract = data.sourceContract as Record<string, unknown>;

    expect(results.map((row) => row.id)).toEqual([901, 902]);
    expect(results.map((row) => row.documentType)).toEqual(['spec_doc', 'continuity']);
    expect(results.every((row) => row.shared_space_id === 'space-allowed')).toBe(true);
    expect(results.some((row) => row.id === 904)).toBe(false);
    expect(sourceContract).toMatchObject({
      archivedTierEnabled: false,
      legacyFallbackEnabled: false,
      includeArchivedCompatibility: 'ignored',
      retainedResults: 2,
      droppedNonCanonicalResults: 1,
      countsBySourceKind: {
        spec_doc: 1,
        continuity: 1,
        constitutional: 0,
      },
    });
  });

  it('feature 9 keeps shared memory deny-by-default for unauthorized actors under canonical reader flow', async () => {
    const response = await handleMemorySearch({
      query: 'shared rollout state',
      tenantId: 'tenant-a',
      userId: 'user-outsider',
      sharedSpaceId: 'space-allowed',
    });

    const envelope = parseEnvelope(response);
    const data = envelope.data as Record<string, unknown>;
    const results = data.results as Array<Record<string, unknown>>;
    const sourceContract = data.sourceContract as Record<string, unknown>;

    expect(results).toEqual([]);
    expect(sourceContract).toMatchObject({
      archivedTierEnabled: false,
      legacyFallbackEnabled: false,
      retainedResults: 0,
      droppedNonCanonicalResults: 0,
      countsBySourceKind: {
        spec_doc: 0,
        continuity: 0,
        constitutional: 0,
      },
    });
  });
});
