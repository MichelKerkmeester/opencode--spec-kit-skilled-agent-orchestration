import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type ReadyResultFixture = {
  freshness: 'fresh' | 'stale' | 'empty' | 'error';
  action: 'none' | 'full_scan' | 'selective_reindex';
  inlineIndexPerformed: boolean;
  reason: string;
};

const mocks = vi.hoisted(() => ({
  ensureCodeGraphReady: vi.fn(),
  getDb: vi.fn(),
  getLastDetectorProvenance: vi.fn(),
  queryEdgesFrom: vi.fn(),
  queryEdgesTo: vi.fn(),
  queryFileDegrees: vi.fn(),
  queryFileImportDependents: vi.fn(),
  queryOutline: vi.fn(),
  resolveSubjectFilePath: vi.fn(),
}));

function installMocks(readiness: ReadyResultFixture): void {
  mocks.ensureCodeGraphReady.mockResolvedValue(readiness);
  vi.doMock('../code_graph/lib/ensure-ready.js', () => ({
    ensureCodeGraphReady: mocks.ensureCodeGraphReady,
  }));
  vi.doMock('../code_graph/lib/code-graph-db.js', () => ({
    getDb: mocks.getDb,
    getLastDetectorProvenance: mocks.getLastDetectorProvenance,
    queryEdgesFrom: mocks.queryEdgesFrom,
    queryEdgesTo: mocks.queryEdgesTo,
    queryFileDegrees: mocks.queryFileDegrees,
    queryFileImportDependents: mocks.queryFileImportDependents,
    queryOutline: mocks.queryOutline,
    resolveSubjectFilePath: mocks.resolveSubjectFilePath,
  }));
}

async function queryWithReadiness(readiness: ReadyResultFixture) {
  installMocks(readiness);
  const { handleCodeGraphQuery } = await import('../code_graph/handlers/query.js');
  const result = await handleCodeGraphQuery({
    operation: readiness.action === 'full_scan' ? 'calls_from' : 'outline',
    subject: 'src/example.ts',
  });
  return JSON.parse(result.content[0].text) as {
    status: string;
    data?: Record<string, unknown>;
  };
}

describe('code_graph_query fallbackDecision routing', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.getDb.mockReturnValue({
      prepare: vi.fn(() => ({
        all: vi.fn(() => []),
        get: vi.fn(() => undefined),
      })),
    });
    mocks.getLastDetectorProvenance.mockReturnValue('structured');
    mocks.queryEdgesFrom.mockReturnValue([]);
    mocks.queryEdgesTo.mockReturnValue([]);
    mocks.queryFileDegrees.mockReturnValue([]);
    mocks.queryFileImportDependents.mockReturnValue([]);
    mocks.queryOutline.mockReturnValue([]);
    mocks.resolveSubjectFilePath.mockImplementation((subject: string) => subject);
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('routes empty graph reads to code_graph_scan before retrying the query', async () => {
    const parsed = await queryWithReadiness({
      freshness: 'empty',
      action: 'full_scan',
      inlineIndexPerformed: false,
      reason: 'graph is empty (0 nodes)',
    });

    expect(parsed.status).toBe('blocked');
    expect(parsed.data?.fallbackDecision).toEqual({
      nextTool: 'code_graph_scan',
      reason: 'full_scan_required',
      retryAfter: 'scan_complete',
    });
  });

  it('routes stale full-scan states to code_graph_scan before retrying the query', async () => {
    const parsed = await queryWithReadiness({
      freshness: 'stale',
      action: 'full_scan',
      inlineIndexPerformed: false,
      reason: '51 stale files exceed selective threshold',
    });

    expect(parsed.status).toBe('blocked');
    expect(parsed.data?.fallbackDecision).toEqual({
      nextTool: 'code_graph_scan',
      reason: 'full_scan_required',
      retryAfter: 'scan_complete',
    });
  });

  it('does not emit fallbackDecision for stale selective-reindex states', async () => {
    const parsed = await queryWithReadiness({
      freshness: 'stale',
      action: 'selective_reindex',
      inlineIndexPerformed: true,
      reason: 'selective reindex attempted',
    });

    expect(parsed.status).toBe('ok');
    expect(parsed.data).not.toHaveProperty('fallbackDecision');
  });

  it('does not emit fallbackDecision for fresh graph reads', async () => {
    const parsed = await queryWithReadiness({
      freshness: 'fresh',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'all tracked files are up-to-date',
    });

    expect(parsed.status).toBe('ok');
    expect(parsed.data).not.toHaveProperty('fallbackDecision');
  });

  it('routes readiness errors to rg after scan diagnostics fail', async () => {
    vi.doMock('../code_graph/lib/ensure-ready.js', () => ({
      ensureCodeGraphReady: mocks.ensureCodeGraphReady,
    }));
    vi.doMock('../code_graph/lib/code-graph-db.js', () => ({
      getDb: mocks.getDb,
      getLastDetectorProvenance: mocks.getLastDetectorProvenance,
      queryEdgesFrom: mocks.queryEdgesFrom,
      queryEdgesTo: mocks.queryEdgesTo,
      queryFileDegrees: mocks.queryFileDegrees,
      queryFileImportDependents: mocks.queryFileImportDependents,
      queryOutline: mocks.queryOutline,
      resolveSubjectFilePath: mocks.resolveSubjectFilePath,
    }));
    mocks.ensureCodeGraphReady.mockRejectedValueOnce(new Error('db locked'));

    const { handleCodeGraphQuery } = await import('../code_graph/handlers/query.js');
    const result = await handleCodeGraphQuery({
      operation: 'outline',
      subject: 'src/example.ts',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.status).toBe('error');
    expect(parsed.data.fallbackDecision).toEqual({
      nextTool: 'rg',
      reason: 'scan_failed',
    });
  });

  it('preserves the read-path full-scan boundary', async () => {
    await queryWithReadiness({
      freshness: 'fresh',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'all tracked files are up-to-date',
    });

    expect(mocks.ensureCodeGraphReady).toHaveBeenCalledWith(process.cwd(), {
      allowInlineIndex: true,
      allowInlineFullScan: false,
    });
  });
});
