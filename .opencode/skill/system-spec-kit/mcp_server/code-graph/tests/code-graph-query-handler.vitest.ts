// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Query Handler Tests
// ───────────────────────────────────────────────────────────────

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getDb: vi.fn(),
  queryEdgesFrom: vi.fn(),
  queryEdgesTo: vi.fn(),
  queryOutline: vi.fn(),
  resolveSubjectFilePath: vi.fn(),
  queryFileImportDependents: vi.fn(),
  queryFileDegrees: vi.fn(),
  getLastDetectorProvenance: vi.fn(),
  ensureCodeGraphReady: vi.fn(async () => ({
    freshness: 'fresh',
    action: 'none',
    inlineIndexPerformed: false,
    reason: 'ok',
  })),
}));

vi.mock('../lib/code-graph-db.js', () => ({
  getDb: mocks.getDb,
  queryEdgesFrom: mocks.queryEdgesFrom,
  queryEdgesTo: mocks.queryEdgesTo,
  queryOutline: mocks.queryOutline,
  resolveSubjectFilePath: mocks.resolveSubjectFilePath,
  queryFileImportDependents: mocks.queryFileImportDependents,
  queryFileDegrees: mocks.queryFileDegrees,
  getLastDetectorProvenance: mocks.getLastDetectorProvenance,
}));

vi.mock('../lib/ensure-ready.js', () => ({
  ensureCodeGraphReady: mocks.ensureCodeGraphReady,
}));

import { handleCodeGraphQuery } from '../handlers/query.js';

interface CandidateRow {
  symbolId: string;
  fqName?: string | null;
  name?: string | null;
  kind?: string | null;
  filePath?: string | null;
  startLine?: number | null;
}

function candidateRow(candidate: CandidateRow): {
  symbol_id: string;
  fq_name: string | null;
  name: string | null;
  kind: string | null;
  file_path: string | null;
  start_line: number | null;
} {
  return {
    symbol_id: candidate.symbolId,
    fq_name: candidate.fqName ?? candidate.name ?? candidate.symbolId,
    name: candidate.name ?? candidate.fqName?.split('.').pop() ?? candidate.symbolId,
    kind: candidate.kind ?? 'function',
    file_path: candidate.filePath ?? `src/${candidate.symbolId}.ts`,
    start_line: candidate.startLine ?? 1,
  };
}

function createDb({
  byId,
  byFq = [{ symbolId: 'symbol-1' }],
  byName = [{ symbolId: 'symbol-1' }],
}: {
  byId?: CandidateRow;
  byFq?: CandidateRow[];
  byName?: CandidateRow[];
} = {}) {
  return {
    prepare: vi.fn((sql: string) => ({
      all: vi.fn(() => {
        if (sql.includes('fq_name = ?')) {
          return byFq.map(candidateRow);
        }
        if (sql.includes('name = ?')) {
          return byName.map(candidateRow);
        }
        return [];
      }),
      get: vi.fn(() => {
        if (sql.includes('symbol_id = ?') && !sql.includes('COUNT(*)')) {
          return byId ? candidateRow(byId) : undefined;
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

describe('code-graph-query handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDb.mockReturnValue(createDb());
    mocks.queryEdgesFrom.mockReturnValue([]);
    mocks.queryEdgesTo.mockReturnValue([]);
    mocks.queryOutline.mockReturnValue([]);
    mocks.resolveSubjectFilePath.mockImplementation((subject: string) => subject);
    mocks.queryFileImportDependents.mockReturnValue([]);
    mocks.queryFileDegrees.mockReturnValue([]);
    mocks.getLastDetectorProvenance.mockReturnValue('structured');
  });

  it('honors explicit edgeType for one-hop queries', async () => {
    const result = await handleCodeGraphQuery({
      operation: 'imports_from',
      subject: 'SomeSymbol',
      edgeType: 'imports',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(mocks.ensureCodeGraphReady).toHaveBeenCalledWith(process.cwd(), {
      allowInlineIndex: true,
      allowInlineFullScan: false,
    });
    expect(mocks.queryEdgesFrom).toHaveBeenCalledWith('symbol-1', 'IMPORTS');
    // M8 / T-CGQ-11: readiness carries the raw ensure-ready fields plus
    // the canonical vocabulary alignment (ready/stale/missing) and the
    // shared trust-state vocabulary (live/stale/absent/unavailable).
    expect(parsed.data.readiness).toEqual({
      freshness: 'fresh',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'ok',
      canonicalReadiness: 'ready',
      trustState: 'live',
    });
  });

  it('surfaces readiness failures as errors and does not continue querying', async () => {
    mocks.ensureCodeGraphReady.mockRejectedValueOnce(new Error('graph database unavailable'));

    const result = await handleCodeGraphQuery({
      operation: 'outline',
      subject: 'src/file.ts',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed).toEqual({
      status: 'error',
      message: 'code_graph_not_ready: graph database unavailable',
    });
    expect(mocks.ensureCodeGraphReady).toHaveBeenCalledTimes(1);
    expect(mocks.queryOutline).not.toHaveBeenCalled();
    expect(mocks.queryEdgesFrom).not.toHaveBeenCalled();
    expect(mocks.queryEdgesTo).not.toHaveBeenCalled();
  });

  it('returns an explicit blocked contract when readiness requires a full scan', async () => {
    mocks.ensureCodeGraphReady.mockResolvedValueOnce({
      freshness: 'empty',
      action: 'full_scan',
      inlineIndexPerformed: false,
      reason: 'graph is empty (0 nodes)',
    });

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'SomeSymbol',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.status).toBe('blocked');
    expect(parsed.message).toContain('code_graph_full_scan_required');
    expect(parsed.data).toMatchObject({
      operation: 'calls_from',
      subject: 'SomeSymbol',
      blocked: true,
      degraded: true,
      graphAnswersOmitted: true,
      requiredAction: 'code_graph_scan',
    });
    expect(mocks.queryEdgesFrom).not.toHaveBeenCalled();
    expect(mocks.queryEdgesTo).not.toHaveBeenCalled();
  });

  it('rejects outline subjects that are not tracked in the graph', async () => {
    mocks.resolveSubjectFilePath.mockReturnValueOnce(null);

    const result = await handleCodeGraphQuery({
      operation: 'outline',
      subject: 'src/missing.ts',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed).toEqual({
      status: 'error',
      error: 'Could not resolve outline subject: src/missing.ts',
    });
    expect(mocks.queryOutline).not.toHaveBeenCalled();
  });

  it('rejects unsupported edgeType values with a clear error', async () => {
    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'SomeSymbol',
      edgeType: 'misspelled-edge',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed).toEqual({
      status: 'error',
      error: 'Unsupported edgeType "misspelled-edge". Supported edge types: CALLS, CONTAINS, DECORATES, EXPORTS, EXTENDS, IMPLEMENTS, IMPORTS, OVERRIDES, TESTED_BY, TYPE_OF',
    });
    expect(mocks.queryEdgesFrom).not.toHaveBeenCalled();
    expect(mocks.queryEdgesTo).not.toHaveBeenCalled();
  });

  it('includes the normalized edgeType in transitive responses', async () => {
    mocks.queryEdgesFrom.mockReturnValue([
      {
        edge: { targetId: 'symbol-2' },
        targetNode: { fqName: 'TargetSymbol', filePath: 'src/target.ts', startLine: 12 },
      },
    ]);

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'SomeSymbol',
      includeTransitive: true,
      edgeType: 'overrides',
      maxDepth: 2,
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.edgeType).toBe('OVERRIDES');
    expect(parsed.data.transitive).toBe(true);
    expect(mocks.queryEdgesFrom).toHaveBeenCalledWith('symbol-1', 'OVERRIDES');
  });

  // M8 / T-CGQ-10 (R19-001): transitive traversal must flag dangling
  // endpoints as corruption warnings instead of silently returning nodes
  // with null fqName/filePath metadata.
  it('flags dangling transitive endpoints as corruption warnings instead of null-metadata nodes', async () => {
    mocks.queryEdgesFrom.mockImplementation((symbolId: string) => {
      if (symbolId === 'symbol-1') {
        return [
          {
            edge: { targetId: 'dangling-target' },
            targetNode: null,
          },
          {
            edge: { targetId: 'symbol-2' },
            targetNode: { fqName: 'ResolvedTarget', filePath: 'src/target.ts', startLine: 42 },
          },
        ];
      }
      return [];
    });

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'SomeSymbol',
      includeTransitive: true,
      maxDepth: 2,
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.nodes).toHaveLength(1);
    expect(parsed.data.nodes[0]).toMatchObject({
      symbolId: 'symbol-2',
      fqName: 'ResolvedTarget',
      filePath: 'src/target.ts',
    });
    // The dangling endpoint must not appear in nodes (no null metadata).
    expect(parsed.data.nodes).not.toContainEqual(
      expect.objectContaining({ symbolId: 'dangling-target' }),
    );
    // It must surface as a dangling_edge warning instead.
    expect(parsed.data.warnings).toEqual([
      expect.objectContaining({
        code: 'dangling_edge',
        operation: 'calls_from',
        missingEndpoint: 'target',
        count: 1,
        danglingSymbolIds: ['dangling-target'],
      }),
    ]);
  });

  // M8 / T-CGQ-11 (R22-001, R23-001): readiness block must carry both the
  // raw freshness and the canonical readiness + trust state so consumers
  // see one aligned vocabulary across session_bootstrap, session_resume,
  // and code_graph_query.
  it('emits aligned canonical readiness and trust state on transitive responses', async () => {
    mocks.ensureCodeGraphReady.mockResolvedValueOnce({
      freshness: 'stale',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'tracked files older than index',
    });
    mocks.queryEdgesFrom.mockReturnValue([]);

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'SomeSymbol',
      includeTransitive: true,
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.readiness).toMatchObject({
      freshness: 'stale',
      canonicalReadiness: 'stale',
      trustState: 'stale',
    });
  });

  it('rejects unsupported operations before transitive traversal begins', async () => {
    const result = await handleCodeGraphQuery({
      operation: 'unknown_operation' as never,
      subject: 'SomeSymbol',
      includeTransitive: true,
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed).toEqual({
      status: 'error',
      error: 'Unknown operation: unknown_operation',
    });
    expect(mocks.queryEdgesFrom).not.toHaveBeenCalled();
    expect(mocks.queryEdgesTo).not.toHaveBeenCalled();
  });

  it('warns when fq_name resolution is ambiguous and prefers callable implementation nodes for calls_from', async () => {
    mocks.getDb.mockReturnValue(createDb({
      byFq: [
        {
          symbolId: 'wrapper-symbol',
          fqName: 'handlers.index.handleMemoryContext',
          name: 'handleMemoryContext',
          kind: 'variable',
          filePath: 'handlers/index.ts',
          startLine: 12,
        },
        {
          symbolId: 'implementation-symbol',
          fqName: 'handlers.memory-context.handleMemoryContext',
          name: 'handleMemoryContext',
          kind: 'function',
          filePath: 'handlers/memory-context.ts',
          startLine: 1196,
        },
      ],
    }));
    mocks.queryEdgesFrom.mockImplementation((symbolId: string) => (
      symbolId === 'implementation-symbol'
        ? [{
          edge: { targetId: 'symbol-2', edgeType: 'CALLS', metadata: { confidence: 0.9 } },
          targetNode: { fqName: 'TargetSymbol', filePath: 'src/target.ts', startLine: 12 },
        }]
        : []
    ));

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'handleMemoryContext',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(mocks.queryEdgesFrom).toHaveBeenCalledWith('implementation-symbol', 'CALLS');
    expect(parsed.status).toBe('ok');
    expect(parsed.data.selectedCandidate).toMatchObject({
      symbolId: 'implementation-symbol',
      kind: 'function',
      operationEdgeCount: 1,
      selectedForOperation: 'calls_from',
    });
    expect(parsed.data.warnings).toEqual([
      expect.objectContaining({
        code: 'ambiguous_subject',
        subject: 'handleMemoryContext',
        matchField: 'fq_name',
        count: 2,
        selectionReason: 'calls_from edge count',
        selectedCandidate: expect.objectContaining({
          symbolId: 'implementation-symbol',
        }),
      }),
    ]);
    expect(parsed.data.warnings[0].message).toContain('Use a symbolId to disambiguate the query.');
  });

  it('warns when name resolution is ambiguous after fq_name misses and prefers inbound-call candidates for calls_to', async () => {
    mocks.getDb.mockReturnValue(createDb({
      byFq: [],
      byName: [
        {
          symbolId: 'shadow-wrapper',
          fqName: 'handlers.index.handleSessionStart',
          name: 'handleSessionStart',
          kind: 'variable',
          filePath: 'handlers/index.ts',
          startLine: 20,
        },
        {
          symbolId: 'shadow-implementation',
          fqName: 'hooks.codex.handleSessionStart',
          name: 'handleSessionStart',
          kind: 'function',
          filePath: 'hooks/codex/session-start.ts',
          startLine: 80,
        },
      ],
    }));
    mocks.queryEdgesTo.mockImplementation((symbolId: string) => (
      symbolId === 'shadow-implementation'
        ? [{
          edge: { sourceId: 'caller-1', edgeType: 'CALLS', metadata: { confidence: 0.8 } },
          sourceNode: { fqName: 'Caller', filePath: 'src/caller.ts', startLine: 5 },
        }]
        : []
    ));

    const result = await handleCodeGraphQuery({
      operation: 'calls_to',
      subject: 'handleSessionStart',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(mocks.queryEdgesTo).toHaveBeenCalledWith('shadow-implementation', 'CALLS');
    expect(parsed.data.warnings).toEqual([
      expect.objectContaining({
        code: 'ambiguous_subject',
        subject: 'handleSessionStart',
        matchField: 'name',
        count: 2,
        selectionReason: 'calls_to edge count',
        selectedCandidate: expect.objectContaining({
          symbolId: 'shadow-implementation',
          kind: 'function',
        }),
      }),
    ]);
    expect(parsed.data.selectedCandidate).toMatchObject({
      symbolId: 'shadow-implementation',
      selectedForOperation: 'calls_to',
    });
  });

  it('adds nested edge evidence metadata without collapsing trust axes', async () => {
    mocks.queryEdgesFrom.mockReturnValue([
      {
        edge: {
          targetId: 'symbol-2',
          metadata: {
            confidence: 0.8,
            detectorProvenance: 'heuristic',
            evidenceClass: 'INFERRED',
          },
        },
        targetNode: { fqName: 'TargetSymbol', filePath: 'src/target.ts', startLine: 12 },
      },
    ]);

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'SomeSymbol',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.graphMetadata).toMatchObject({
      detectorProvenance: 'structured',
    });
    expect(parsed.data.edgeEvidenceClass).toBe('inferred_heuristic');
    expect(parsed.data.numericConfidence).toBe(0.8);
    expect(parsed.data.edges[0]).toMatchObject({
      target: 'TargetSymbol',
      file: 'src/target.ts',
      line: 12,
      confidence: 0.8,
      numericConfidence: 0.8,
      detectorProvenance: 'heuristic',
      evidenceClass: 'INFERRED',
      edgeEvidenceClass: 'inferred_heuristic',
    });
    expect(parsed.data).not.toHaveProperty('confidence');
  });

  it('aggregates payload-level edge trust from the weakest returned edge', async () => {
    mocks.queryEdgesFrom.mockReturnValue([
      {
        edge: {
          targetId: 'symbol-2',
          metadata: {
            confidence: 0.9,
            detectorProvenance: 'structured',
            evidenceClass: 'EXTRACTED',
          },
        },
        targetNode: { fqName: 'DirectTarget', filePath: 'src/direct.ts', startLine: 12 },
      },
      {
        edge: {
          targetId: 'symbol-3',
          metadata: {
            confidence: 0.2,
            detectorProvenance: 'heuristic',
            evidenceClass: 'INFERRED',
          },
        },
        targetNode: { fqName: 'HeuristicTarget', filePath: 'src/heuristic.ts', startLine: 28 },
      },
    ]);

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'SomeSymbol',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.edges).toMatchObject([
      {
        target: 'DirectTarget',
        numericConfidence: 0.9,
        edgeEvidenceClass: 'direct_call',
      },
      {
        target: 'HeuristicTarget',
        numericConfidence: 0.2,
        edgeEvidenceClass: 'inferred_heuristic',
      },
    ]);
    expect(parsed.data.edgeEvidenceClass).toBe('inferred_heuristic');
    expect(parsed.data.numericConfidence).toBe(0.2);
  });

  it('excludes dangling edges and reports corruption warnings instead of returning raw symbol IDs', async () => {
    mocks.queryEdgesFrom.mockReturnValue([
      {
        edge: {
          targetId: 'dangling-symbol',
          edgeType: 'CALLS',
          metadata: {
            confidence: 0.2,
          },
        },
        targetNode: null,
      },
      {
        edge: {
          targetId: 'symbol-2',
          edgeType: 'CALLS',
          metadata: {
            confidence: 0.7,
            detectorProvenance: 'heuristic',
            evidenceClass: 'INFERRED',
          },
        },
        targetNode: { fqName: 'ResolvedTarget', filePath: 'src/resolved.ts', startLine: 44 },
      },
    ]);

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'SomeSymbol',
      limit: 1,
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.edges).toHaveLength(1);
    expect(parsed.data.edges[0]).toMatchObject({
      target: 'ResolvedTarget',
      file: 'src/resolved.ts',
      line: 44,
      confidence: 0.7,
      numericConfidence: 0.7,
      detectorProvenance: 'heuristic',
      evidenceClass: 'INFERRED',
      edgeEvidenceClass: 'inferred_heuristic',
    });
    expect(parsed.data.edges).not.toContainEqual(expect.objectContaining({ target: 'dangling-symbol' }));
    expect(parsed.data.warnings).toEqual([
      expect.objectContaining({
        code: 'dangling_edge',
        operation: 'calls_from',
        missingEndpoint: 'target',
        count: 1,
        danglingSymbolIds: ['dangling-symbol'],
      }),
    ]);
    expect(parsed.data.warnings[0].message).toContain('Excluded 1 dangling calls_from edge(s)');
  });

  it('enforces blast-radius depth before inclusion and unions multiple source files', async () => {
    mocks.queryFileImportDependents.mockReturnValue([
      { importedFilePath: 'src/a.ts', importerFilePath: 'src/b.ts' },
      { importedFilePath: 'src/b.ts', importerFilePath: 'src/c.ts' },
      { importedFilePath: 'src/c.ts', importerFilePath: 'src/d.ts' },
      { importedFilePath: 'src/x.ts', importerFilePath: 'src/e.ts' },
      { importedFilePath: 'src/e.ts', importerFilePath: 'src/f.ts' },
    ]);
    mocks.queryFileDegrees.mockReturnValue([
      { filePath: 'src/a.ts', degree: 1 },
      { filePath: 'src/x.ts', degree: 1 },
      { filePath: 'src/b.ts', degree: 2 },
      { filePath: 'src/e.ts', degree: 3 },
      { filePath: 'src/c.ts', degree: 5 },
      { filePath: 'src/f.ts', degree: 1 },
    ]);

    const result = await handleCodeGraphQuery({
      operation: 'blast_radius',
      subject: 'src/a.ts',
      subjects: ['src/x.ts'],
      unionMode: 'multi',
      maxDepth: 2,
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.multiFileUnion).toBe(true);
    expect(parsed.data.sourceFiles).toEqual(['src/a.ts', 'src/x.ts']);
    expect(parsed.data.nodes).toEqual([
      { filePath: 'src/a.ts', depth: 0, isSeed: true },
      { filePath: 'src/x.ts', depth: 0, isSeed: true },
      { filePath: 'src/b.ts', depth: 1 },
      {
        filePath: 'src/e.ts',
        depth: 1,
      },
      {
        filePath: 'src/c.ts',
        depth: 2,
        hotFileBreadcrumb: {
          degree: 5,
          changeCarefullyReason: 'High-degree node; change carefully because changes here ripple to 5 dependents.',
        },
      },
      { filePath: 'src/f.ts', depth: 2 },
    ]);
    expect(parsed.data.affectedFiles).toEqual([
      { filePath: 'src/b.ts', depth: 1 },
      { filePath: 'src/e.ts', depth: 1 },
      {
        filePath: 'src/c.ts',
        depth: 2,
        hotFileBreadcrumb: {
          degree: 5,
          changeCarefullyReason: 'High-degree node; change carefully because changes here ripple to 5 dependents.',
        },
      },
      { filePath: 'src/f.ts', depth: 2 },
    ]);
    expect(parsed.data.affectedFiles).not.toContainEqual({ filePath: 'src/d.ts', depth: 3 });
    expect(parsed.data.hotFileBreadcrumbs).toEqual([
      {
        filePath: 'src/c.ts',
        hotFileBreadcrumb: {
          degree: 5,
          changeCarefullyReason: 'High-degree node; change carefully because changes here ripple to 5 dependents.',
        },
      },
    ]);
  });

  it('returns an error when blast-radius cannot resolve a subject', async () => {
    mocks.resolveSubjectFilePath.mockReturnValueOnce(null);

    const result = await handleCodeGraphQuery({
      operation: 'blast_radius',
      subject: 'MissingSymbol',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed).toEqual({
      status: 'error',
      error: 'unresolved_subject: MissingSymbol',
    });
    expect(mocks.queryFileImportDependents).not.toHaveBeenCalled();
  });

  it('returns only the seed node when blast-radius maxDepth is zero', async () => {
    mocks.queryFileImportDependents.mockReturnValue([
      { importedFilePath: 'src/a.ts', importerFilePath: 'src/b.ts' },
    ]);
    mocks.queryFileDegrees.mockReturnValue([
      { filePath: 'src/a.ts', degree: 0 },
    ]);

    const result = await handleCodeGraphQuery({
      operation: 'blast_radius',
      subject: 'src/a.ts',
      maxDepth: 0,
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.sourceFiles).toEqual(['src/a.ts']);
    expect(parsed.data.nodes).toEqual([
      { filePath: 'src/a.ts', depth: 0, isSeed: true },
    ]);
    expect(parsed.data.affectedFiles).toEqual([]);
  });
});
