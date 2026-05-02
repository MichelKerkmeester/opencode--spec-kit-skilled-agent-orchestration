// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Siblings Readiness Tests
// ───────────────────────────────────────────────────────────────

import { beforeEach, describe, expect, it, vi } from 'vitest';

const LAST_PERSISTED_AT = '2026-04-17T00:00:00.000Z';

const mocks = vi.hoisted(() => ({
  appendFileSync: vi.fn(),
  buildContext: vi.fn(),
  ensureCodeGraphReady: vi.fn(async () => ({
    freshness: 'fresh',
    action: 'none',
    inlineIndexPerformed: false,
    reason: 'ok',
  })),
  execFileSync: vi.fn(),
  execSync: vi.fn(),
  existsSync: vi.fn(),
  getCodeGraphMetadata: vi.fn(),
  getDb: vi.fn(),
  getGraphFreshness: vi.fn(),
  getGraphReadinessSnapshot: vi.fn(),
  getLastDetectorProvenance: vi.fn(),
  getLastGitHead: vi.fn(),
  getLastGoldVerification: vi.fn(),
  getStats: vi.fn(),
  getStoredCodeGraphScope: vi.fn(),
  getTrackedFiles: vi.fn(),
  countTrackedSkillFiles: vi.fn(),
  indexFiles: vi.fn(),
  isFileStale: vi.fn(),
  mkdirSync: vi.fn(),
  queryEdgesFrom: vi.fn(),
  queryEdgesTo: vi.fn(),
  queryFileDegrees: vi.fn(),
  queryFileImportDependents: vi.fn(),
  queryOutline: vi.fn(),
  realpathSync: vi.fn(),
  removeFile: vi.fn(),
  replaceEdges: vi.fn(),
  replaceNodes: vi.fn(),
  resolveSubjectFilePath: vi.fn(),
  setLastDetectorProvenance: vi.fn(),
  setLastDetectorProvenanceSummary: vi.fn(),
  setCodeGraphScope: vi.fn(),
  setLastGitHead: vi.fn(),
  setLastGraphEdgeEnrichmentSummary: vi.fn(),
  statSync: vi.fn(),
  upsertFile: vi.fn(),
}));

vi.mock('node:child_process', () => ({
  execSync: mocks.execSync,
  execFileSync: mocks.execFileSync,
}));

vi.mock('node:fs', () => ({
  appendFileSync: mocks.appendFileSync,
  existsSync: mocks.existsSync,
  mkdirSync: mocks.mkdirSync,
  realpathSync: mocks.realpathSync,
  statSync: mocks.statSync,
}));

vi.mock('../lib/structural-indexer.js', () => ({
  indexFiles: mocks.indexFiles,
}));

vi.mock('../lib/code-graph-context.js', () => ({
  buildContext: mocks.buildContext,
}));

vi.mock('../lib/ensure-ready.js', () => ({
  ensureCodeGraphReady: mocks.ensureCodeGraphReady,
  getGraphFreshness: mocks.getGraphFreshness,
  getGraphReadinessSnapshot: mocks.getGraphReadinessSnapshot,
}));

vi.mock('../lib/code-graph-db.js', () => ({
  getDb: mocks.getDb,
  getCodeGraphMetadata: mocks.getCodeGraphMetadata,
  getLastDetectorProvenance: mocks.getLastDetectorProvenance,
  getLastGitHead: mocks.getLastGitHead,
  getLastGoldVerification: mocks.getLastGoldVerification,
  getStats: mocks.getStats,
  getStoredCodeGraphScope: mocks.getStoredCodeGraphScope,
  getTrackedFiles: mocks.getTrackedFiles,
  countTrackedSkillFiles: mocks.countTrackedSkillFiles,
  isFileStale: mocks.isFileStale,
  queryEdgesFrom: mocks.queryEdgesFrom,
  queryEdgesTo: mocks.queryEdgesTo,
  queryFileDegrees: mocks.queryFileDegrees,
  queryFileImportDependents: mocks.queryFileImportDependents,
  queryOutline: mocks.queryOutline,
  realpathSync: mocks.realpathSync,
  removeFile: mocks.removeFile,
  replaceEdges: mocks.replaceEdges,
  replaceNodes: mocks.replaceNodes,
  resolveSubjectFilePath: mocks.resolveSubjectFilePath,
  setLastDetectorProvenance: mocks.setLastDetectorProvenance,
  setLastDetectorProvenanceSummary: mocks.setLastDetectorProvenanceSummary,
  setCodeGraphScope: mocks.setCodeGraphScope,
  setLastGitHead: mocks.setLastGitHead,
  setLastGraphEdgeEnrichmentSummary: mocks.setLastGraphEdgeEnrichmentSummary,
  upsertFile: mocks.upsertFile,
}));

import { handleCodeGraphQuery } from '../handlers/query.js';
import { handleCodeGraphScan } from '../handlers/scan.js';
import { handleCodeGraphStatus } from '../handlers/status.js';
import { handleCodeGraphContext } from '../handlers/context.js';
import { handleCccStatus } from '../handlers/ccc-status.js';
import { handleCccReindex } from '../handlers/ccc-reindex.js';
import { handleCccFeedback } from '../handlers/ccc-feedback.js';

type GraphStats = {
  totalFiles: number;
  totalNodes: number;
  totalEdges: number;
  nodesByKind: Record<string, number>;
  edgesByType: Record<string, number>;
  parseHealthSummary: Record<string, number>;
  lastScanTimestamp: string | null;
  lastGitHead: string | null;
  dbFileSize: number | null;
  schemaVersion: number;
};

function createStats(overrides: Partial<GraphStats> = {}): GraphStats {
  return {
    totalFiles: 1,
    totalNodes: 2,
    totalEdges: 3,
    nodesByKind: { function: 1 },
    edgesByType: { CALLS: 1 },
    parseHealthSummary: { clean: 1 },
    lastScanTimestamp: LAST_PERSISTED_AT,
    lastGitHead: 'head',
    dbFileSize: 1024,
    schemaVersion: 1,
    ...overrides,
  };
}

function createDb({
  byId,
  byFq = ['symbol-1'],
  byName = ['symbol-1'],
}: {
  byId?: string;
  byFq?: string[];
  byName?: string[];
} = {}) {
  return {
    transaction: vi.fn((fn: () => unknown) => fn),
    prepare: vi.fn((sql: string) => ({
      all: vi.fn(() => {
        if (sql.includes('fq_name = ?')) {
          return byFq.map((symbolId) => ({ symbol_id: symbolId }));
        }
        if (sql.includes('name = ?')) {
          return byName.map((symbolId) => ({ symbol_id: symbolId }));
        }
        return [];
      }),
      get: vi.fn(() => {
        if (sql.includes('symbol_id = ?') && !sql.includes('COUNT(*)')) {
          return byId ? { symbol_id: byId } : undefined;
        }
        if (sql.includes('COUNT(*) as count') && sql.includes('fq_name = ?')) {
          return { count: byFq.length };
        }
        if (sql.includes('COUNT(*) as count') && sql.includes('name = ?')) {
          return { count: byName.length };
        }
        return undefined;
      }),
    })),
  };
}

describe('code-graph sibling readiness emission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.appendFileSync.mockReturnValue(undefined);
    mocks.buildContext.mockReturnValue({
      queryMode: 'neighborhood',
      resolvedAnchors: [],
      graphContext: [],
      textBrief: 'brief',
      combinedSummary: 'summary',
      nextActions: ['next'],
      metadata: {
        totalNodes: 0,
        totalEdges: 0,
        budgetUsed: 10,
        budgetLimit: 1200,
        freshness: { lastScanAt: null, staleness: 'unknown' },
      },
    });
    mocks.execFileSync.mockReturnValue('reindex ok');
    mocks.execSync.mockReturnValue('head\n');
    mocks.existsSync.mockReturnValue(true);
    mocks.getCodeGraphMetadata.mockReturnValue(null);
    mocks.getDb.mockReturnValue(createDb());
    mocks.getGraphFreshness.mockReturnValue('fresh');
    mocks.getGraphReadinessSnapshot.mockReturnValue({
      freshness: 'fresh',
      action: 'none',
      reason: 'all tracked files are up-to-date',
    });
    mocks.getLastDetectorProvenance.mockReturnValue('structured');
    mocks.getLastGitHead.mockReturnValue('head');
    mocks.getLastGoldVerification.mockReturnValue(null);
    mocks.getStoredCodeGraphScope.mockReturnValue({
      fingerprint: 'code-graph-scope:v2:skills=none:agents=none:commands=none:specs=none:plugins=none:mcp-coco-index=excluded',
      label: 'end-user code only; .opencode skill, agent, command, specs and plugins excluded; mcp-coco-index/mcp_server excluded',
      includeSkills: false,
      includedSkillsList: 'none',
      includeAgents: false,
      includeCommands: false,
      includeSpecs: false,
      includePlugins: false,
      source: 'default',
    });
    mocks.getStats.mockReturnValue(createStats());
    mocks.getTrackedFiles.mockReturnValue([]);
    mocks.countTrackedSkillFiles.mockReturnValue(0);
    mocks.indexFiles.mockResolvedValue([{
      filePath: '/workspace/current.ts',
      language: 'typescript',
      contentHash: 'hash-1',
      nodes: [{ symbolId: 'current::symbol' }],
      edges: [],
      detectorProvenance: 'structured',
      parseHealth: 'clean',
      parseDurationMs: 10,
      parseErrors: [],
    }]);
    mocks.isFileStale.mockReturnValue(true);
    mocks.mkdirSync.mockReturnValue(undefined);
    mocks.queryEdgesFrom.mockReturnValue([]);
    mocks.queryEdgesTo.mockReturnValue([]);
    mocks.queryFileDegrees.mockReturnValue([]);
    mocks.queryFileImportDependents.mockReturnValue([]);
    mocks.queryOutline.mockReturnValue([]);
    mocks.realpathSync.mockImplementation((path: string) => path);
    mocks.removeFile.mockReturnValue(undefined);
    mocks.replaceEdges.mockReturnValue(undefined);
    mocks.replaceNodes.mockReturnValue(undefined);
    mocks.resolveSubjectFilePath.mockImplementation((subject: string) => subject);
    mocks.statSync.mockReturnValue({ size: 2048 });
    mocks.upsertFile.mockReturnValue(1);
  });

  it('keeps query.ts as the nested-readiness baseline without touching its frozen surface', async () => {
    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'SomeSymbol',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.readiness).toMatchObject({
      canonicalReadiness: 'ready',
      trustState: 'live',
    });
    expect(parsed.data).not.toHaveProperty('lastPersistedAt');
  });

  it.each([
    {
      name: 'scan',
      invoke: () => handleCodeGraphScan({ rootDir: process.cwd(), incremental: true }),
      expectedCanonicalReadiness: 'ready',
      expectedTrustState: 'live',
    },
    {
      name: 'status',
      invoke: () => handleCodeGraphStatus(),
      expectedCanonicalReadiness: 'ready',
      expectedTrustState: 'live',
    },
    {
      name: 'context',
      invoke: () => handleCodeGraphContext({ subject: 'SomeSymbol', queryMode: 'neighborhood' }),
      expectedCanonicalReadiness: 'ready',
      expectedTrustState: 'live',
    },
    {
      name: 'ccc-status',
      invoke: () => handleCccStatus(),
      expectedCanonicalReadiness: 'missing',
      expectedTrustState: 'unavailable',
    },
    {
      name: 'ccc-reindex',
      invoke: () => handleCccReindex({ full: false }),
      expectedCanonicalReadiness: 'missing',
      expectedTrustState: 'unavailable',
    },
    {
      name: 'ccc-feedback',
      invoke: () => handleCccFeedback({ query: 'readiness parity', rating: 'helpful' }),
      expectedCanonicalReadiness: 'missing',
      expectedTrustState: 'unavailable',
    },
  ])('emits canonical readiness fields for $name', async ({
    invoke,
    expectedCanonicalReadiness,
    expectedTrustState,
  }) => {
    const result = await invoke();
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.status).toBe('ok');
    expect(parsed.data.readiness).toMatchObject({
      canonicalReadiness: expectedCanonicalReadiness,
      trustState: expectedTrustState,
    });
    expect(parsed.data.canonicalReadiness).toBe(expectedCanonicalReadiness);
    expect(parsed.data.trustState).toBe(expectedTrustState);
    expect(['live', 'stale', 'absent', 'unavailable']).toContain(parsed.data.trustState);
    expect(parsed.data.lastPersistedAt).toBe(LAST_PERSISTED_AT);
  });

  it('surfaces persisted gold verification metadata in status responses', async () => {
    const verification = {
      pass_policy: {
        overall_pass_rate: 0.9,
        edge_focus_pass_rate: 0.8,
      },
      passed: true,
    };
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(
      Date.parse('2026-04-17T12:00:00.000Z'),
    );
    mocks.getLastGoldVerification.mockReturnValue(verification);

    try {
      const result = await handleCodeGraphStatus();
      const parsed = JSON.parse(result.content[0].text);

      expect(parsed.status).toBe('ok');
      expect(parsed.data.lastGoldVerification).toEqual(verification);
      expect(parsed.data.goldVerificationTrust).toBe('live');
      expect(parsed.data.verificationPassPolicy).toEqual({
        overall_pass_rate: 0.9,
        edge_focus_pass_rate: 0.8,
      });
    } finally {
      nowSpy.mockRestore();
    }
  });

  it('preserves signed share_drift in status responses while still flagging by absolute drift', async () => {
    mocks.getCodeGraphMetadata.mockReturnValue(JSON.stringify({
      CALLS: 0.75,
      IMPORTS: 0.25,
    }));
    mocks.getStats.mockReturnValue(createStats({
      totalEdges: 4,
      edgesByType: {
        CALLS: 1,
        IMPORTS: 3,
      },
    }));

    const result = await handleCodeGraphStatus();
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.status).toBe('ok');
    expect(parsed.data.edgeDriftSummary.share_drift.CALLS).toBeCloseTo(-0.5);
    expect(parsed.data.edgeDriftSummary.share_drift.IMPORTS).toBeCloseTo(0.5);
    expect(parsed.data.edgeDriftSummary.flagged).toBe(true);
  });

  it('surfaces edge drift as unavailable when the persisted baseline metadata is malformed', async () => {
    mocks.getCodeGraphMetadata.mockReturnValue('{malformed');

    const result = await handleCodeGraphStatus();
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.status).toBe('ok');
    expect(parsed.data.edgeDriftSummary).toBeNull();
  });
});
