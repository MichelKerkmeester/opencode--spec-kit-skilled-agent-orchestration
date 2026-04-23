// ───────────────────────────────────────────────────────────────
// TEST: Phase 027 — Structural Bootstrap Contract
// ───────────────────────────────────────────────────────────────
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest';

const tempDirs: string[] = [];

function createTempRoot(): string {
  const tempRoot = mkdtempSync(join(tmpdir(), 'structural-contract-'));
  tempDirs.push(tempRoot);
  return tempRoot;
}

function writeFixture(root: string, relativePath: string, content = 'export function fixture() { return 1; }\n'): string {
  const filePath = join(root, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
  return filePath;
}

function freshGraphMock(overrides: Record<string, unknown> = {}) {
  return {
    totalFiles: 42,
    totalNodes: 1200,
    totalEdges: 800,
    nodesByKind: { function: 500, class: 200, variable: 300, interface: 150, type: 50 },
    edgesByType: {},
    parseHealthSummary: {},
    lastScanTimestamp: new Date().toISOString(),
    lastGitHead: null,
    dbFileSize: null,
    schemaVersion: 3,
    ...overrides,
  };
}

function setupSharedMocks() {
  vi.doMock('../hooks/memory-surface.js', () => ({
    isSessionPrimed: vi.fn(() => false),
    getLastActiveSessionId: vi.fn(() => null),
  }));
  vi.doMock('../lib/utils/cocoindex-path.js', () => ({
    isCocoIndexAvailable: vi.fn(() => false),
  }));
  vi.doMock('../lib/session/context-metrics.js', () => ({
    getSessionMetrics: vi.fn(() => ({ currentSpecFolder: null })),
    computeQualityScore: vi.fn(() => ({ level: 'unknown', score: 0 })),
    getLastToolCallAt: vi.fn(() => null),
  }));
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
  delete process.env.SPECKIT_PARSER;
  vi.doUnmock('node:child_process');
  vi.doUnmock('node:fs');
  vi.doUnmock('../code-graph/lib/indexer-types.js');
  vi.doUnmock('../code-graph/lib/code-graph-db.js');
  vi.doUnmock('../code-graph/lib/structural-indexer.js');
  vi.resetModules();
  vi.restoreAllMocks();
});

describe('buildStructuralBootstrapContract', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('returns ready status with highlights when graph is fresh', async () => {
    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      getStats: vi.fn(() => freshGraphMock()),
    }));
    vi.doMock('../code-graph/lib/ensure-ready.js', () => ({
      getGraphFreshness: vi.fn(() => 'fresh'),
    }));
    setupSharedMocks();

    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
    const contract = buildStructuralBootstrapContract('auto-prime');

    expect(contract.status).toBe('ready');
    expect(contract.summary).toContain('42 files');
    expect(contract.summary).toContain('1200 nodes');
    expect(contract.summary).toContain('(fresh)');
    expect(contract.highlights).toBeDefined();
    expect(contract.highlights!.length).toBeLessThanOrEqual(5);
    expect(contract.highlights).toContain('function: 500');
    expect(contract.recommendedAction).toContain('code_graph_query');
    expect(contract.sourceSurface).toBe('auto-prime');
    expect(contract.provenance?.producer).toBe('session_snapshot');
    expect(contract.provenance?.trustState).toBe('live');
  });

  it('returns stale status when graph scan is old', async () => {
    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      getStats: vi.fn(() => freshGraphMock({
        lastScanTimestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      })),
    }));
    vi.doMock('../code-graph/lib/ensure-ready.js', () => ({
      getGraphFreshness: vi.fn(() => 'stale'),
    }));
    setupSharedMocks();

    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
    const contract = buildStructuralBootstrapContract('session_bootstrap');

    expect(contract.status).toBe('stale');
    expect(contract.summary).toContain('stale');
    expect(contract.recommendedAction).toContain('bounded inline refresh');
    expect(contract.sourceSurface).toBe('session_bootstrap');
    expect(contract.provenance?.trustState).toBe('stale');
  });

  it('returns stale highlights and freshness marker for populated stale graphs', async () => {
    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      getStats: vi.fn(() => freshGraphMock({
        nodesByKind: { function: 9, class: 4, interface: 2 },
      })),
    }));
    vi.doMock('../code-graph/lib/ensure-ready.js', () => ({
      getGraphFreshness: vi.fn(() => 'stale'),
    }));
    setupSharedMocks();

    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
    const contract = buildStructuralBootstrapContract('session_resume');

    expect(contract.status).toBe('stale');
    expect(contract.summary).toContain('(stale)');
    expect(contract.highlights).toBeDefined();
    expect(contract.highlights!.length).toBeGreaterThan(0);
    expect(contract.highlights).toContain('function: 9');
  });

  it('returns missing status when graph is empty', async () => {
    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      getStats: vi.fn(() => freshGraphMock({
        totalFiles: 0, totalNodes: 0, totalEdges: 0,
        lastScanTimestamp: null,
      })),
    }));
    vi.doMock('../code-graph/lib/ensure-ready.js', () => ({
      getGraphFreshness: vi.fn(() => 'empty'),
    }));
    setupSharedMocks();

    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
    const contract = buildStructuralBootstrapContract('session_resume');

    expect(contract.status).toBe('missing');
    expect(contract.summary).toContain('No structural context');
    expect(contract.highlights).toBeUndefined();
    expect(contract.recommendedAction).toContain('session_bootstrap');
    expect(contract.sourceSurface).toBe('session_resume');
    // M8 / T-SHP-01: 'missing' structural status now maps to 'absent',
    // distinct from merely stale data. Matches the canonical vocabulary.
    expect(contract.provenance?.trustState).toBe('absent');
  });

  it('avoids self-referential guidance when session_bootstrap is already the current surface', async () => {
    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      getStats: vi.fn(() => freshGraphMock({
        totalFiles: 0, totalNodes: 0, totalEdges: 0,
        lastScanTimestamp: null,
      })),
    }));
    vi.doMock('../code-graph/lib/ensure-ready.js', () => ({
      getGraphFreshness: vi.fn(() => 'empty'),
    }));
    setupSharedMocks();

    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
    const contract = buildStructuralBootstrapContract('session_bootstrap');

    expect(contract.status).toBe('missing');
    expect(contract.recommendedAction).toContain('code_graph_scan');
    expect(contract.recommendedAction).not.toContain('Call session_bootstrap first');
  });

  it('returns missing status when graph DB throws', async () => {
    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      getStats: vi.fn(() => { throw new Error('DB not initialized'); }),
    }));
    vi.doMock('../code-graph/lib/ensure-ready.js', () => ({
      getGraphFreshness: vi.fn(() => { throw new Error('DB not initialized'); }),
    }));
    setupSharedMocks();

    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
    const contract = buildStructuralBootstrapContract('session_health');

    expect(contract.status).toBe('missing');
    expect(contract.sourceSurface).toBe('session_health');
  });

  it('preserves sourceSurface parameter for each surface', async () => {
    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      getStats: vi.fn(() => freshGraphMock()),
    }));
    vi.doMock('../code-graph/lib/ensure-ready.js', () => ({
      getGraphFreshness: vi.fn(() => 'fresh'),
    }));
    setupSharedMocks();

    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');

    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
    for (const surface of surfaces) {
      const contract = buildStructuralBootstrapContract(surface);
      expect(contract.sourceSurface).toBe(surface);
    }
  });

  it('keeps the structural contract within the documented hard ceiling', async () => {
    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      getStats: vi.fn(() => freshGraphMock({
        nodesByKind: Object.fromEntries(
          Array.from({ length: 12 }, (_, index) => [
            `very_long_symbol_kind_name_${index}_with_extra_budget_pressure`,
            1000 - index,
          ]),
        ),
      })),
    }));
    vi.doMock('../code-graph/lib/ensure-ready.js', () => ({
      getGraphFreshness: vi.fn(() => 'fresh'),
    }));
    setupSharedMocks();

    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
    const contract = buildStructuralBootstrapContract('session_bootstrap');
    const estimatedTokens = Math.ceil(JSON.stringify({
      summary: contract.summary,
      highlights: contract.highlights,
      recommendedAction: contract.recommendedAction,
    }).length / 4);

    expect(estimatedTokens).toBeLessThanOrEqual(500);
  });
});

describe('indexFiles options', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    process.env.SPECKIT_PARSER = 'regex';
  });

  it('returns all post-exclude files when skipFreshFiles=false', async () => {
    const tempRoot = createTempRoot();
    writeFixture(tempRoot, 'one.ts');
    writeFixture(tempRoot, 'two.ts');
    writeFixture(tempRoot, 'three.ts');

    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      isFileStale: vi.fn(() => false),
    }));

    const { getDefaultConfig } = await import('../code-graph/lib/indexer-types.js');
    const { indexFiles } = await import('../code-graph/lib/structural-indexer.js');
    const results = await indexFiles({
      ...getDefaultConfig(tempRoot),
      includeGlobs: ['**/*.ts'],
      languages: ['typescript'],
    }, { skipFreshFiles: false });

    const indexedPaths = results.map(result => relative(tempRoot, result.filePath).replace(/\\/g, '/')).sort();
    expect(indexedPaths).toEqual(['one.ts', 'two.ts', 'three.ts'].sort());
  });

  it('skips fresh files when skipFreshFiles=true', async () => {
    const tempRoot = createTempRoot();
    const staleFile = writeFixture(tempRoot, 'stale.ts');
    writeFixture(tempRoot, 'fresh-a.ts');
    writeFixture(tempRoot, 'fresh-b.ts');

    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      isFileStale: vi.fn((filePath: string) => filePath === staleFile),
    }));

    const { getDefaultConfig } = await import('../code-graph/lib/indexer-types.js');
    const { indexFiles } = await import('../code-graph/lib/structural-indexer.js');
    const results = await indexFiles({
      ...getDefaultConfig(tempRoot),
      includeGlobs: ['**/*.ts'],
      languages: ['typescript'],
    }, { skipFreshFiles: true });

    expect(results.map(result => relative(tempRoot, result.filePath).replace(/\\/g, '/'))).toEqual(['stale.ts']);
  });

  it('preserves stale-only behavior when option omitted', async () => {
    const tempRoot = createTempRoot();
    const staleFile = writeFixture(tempRoot, 'stale.ts');
    writeFixture(tempRoot, 'fresh.ts');

    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      isFileStale: vi.fn((filePath: string) => filePath === staleFile),
    }));

    const { getDefaultConfig } = await import('../code-graph/lib/indexer-types.js');
    const { indexFiles } = await import('../code-graph/lib/structural-indexer.js');
    const results = await indexFiles({
      ...getDefaultConfig(tempRoot),
      includeGlobs: ['**/*.ts'],
      languages: ['typescript'],
    });

    expect(results.map(result => relative(tempRoot, result.filePath).replace(/\\/g, '/'))).toEqual(['stale.ts']);
  });
});

describe('indexFiles cross-file dedup (Layer 1)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    process.env.SPECKIT_PARSER = 'regex';
  });

  function mockSymbolCollisionForSharedFunction() {
    vi.doMock('../code-graph/lib/indexer-types.js', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../code-graph/lib/indexer-types.js')>();
      return {
        ...actual,
        generateSymbolId: vi.fn((
          filePath: string,
          fqName: string,
          kind: import('../code-graph/lib/indexer-types.js').SymbolKind,
        ) => {
          if (kind === 'function' && fqName.endsWith('shared')) {
            return 'shared-symbol-id';
          }
          return actual.generateSymbolId(filePath, fqName, kind);
        }),
      };
    });
  }

  async function indexTempTypescriptFiles(tempRoot: string) {
    const { getDefaultConfig } = await import('../code-graph/lib/indexer-types.js');
    const { indexFiles } = await import('../code-graph/lib/structural-indexer.js');
    return indexFiles({
      ...getDefaultConfig(tempRoot),
      includeGlobs: ['**/*.ts'],
      languages: ['typescript'],
    }, { skipFreshFiles: false });
  }

  it('drops nodes whose symbol_id collides with previously-processed file', async () => {
    mockSymbolCollisionForSharedFunction();
    const tempRoot = createTempRoot();
    writeFixture(tempRoot, 'a.ts', 'export function shared() { return 1; }\n');
    writeFixture(tempRoot, 'b.ts', 'export function shared() { return 2; }\n');

    const results = await indexTempTypescriptFiles(tempRoot);
    const sorted = results
      .map(result => ({
        path: relative(tempRoot, result.filePath).replace(/\\/g, '/'),
        sharedNodes: result.nodes.filter(node => node.symbolId === 'shared-symbol-id'),
      }))
      .sort((a, b) => a.path.localeCompare(b.path));

    expect(sorted).toEqual([
      expect.objectContaining({ path: 'a.ts', sharedNodes: [expect.objectContaining({ symbolId: 'shared-symbol-id' })] }),
      expect.objectContaining({ path: 'b.ts', sharedNodes: [] }),
    ]);
    expect(results.flatMap(result => result.nodes).filter(node => node.symbolId === 'shared-symbol-id')).toHaveLength(1);
  });

  it('preserves all nodes when no cross-file collision exists', async () => {
    const tempRoot = createTempRoot();
    writeFixture(tempRoot, 'alpha.ts', 'export function alpha() { return 1; }\n');
    writeFixture(tempRoot, 'beta.ts', 'export function beta() { return 2; }\n');

    const results = await indexTempTypescriptFiles(tempRoot);
    const nodesByFile = Object.fromEntries(
      results.map(result => [
        relative(tempRoot, result.filePath).replace(/\\/g, '/'),
        result.nodes.length,
      ]),
    );

    expect(nodesByFile['alpha.ts']).toBeGreaterThanOrEqual(2);
    expect(nodesByFile['beta.ts']).toBeGreaterThanOrEqual(2);
    expect(new Set(results.flatMap(result => result.nodes.map(node => node.symbolId))).size)
      .toBe(results.flatMap(result => result.nodes).length);
  });

  it('logs dropped count', async () => {
    mockSymbolCollisionForSharedFunction();
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const tempRoot = createTempRoot();
    writeFixture(tempRoot, 'a.ts', 'export function shared() { return 1; }\n');
    writeFixture(tempRoot, 'b.ts', 'export function shared() { return 2; }\n');

    await indexTempTypescriptFiles(tempRoot);

    expect(infoSpy).toHaveBeenCalledWith('[structural-indexer] dropped 1 cross-file duplicate symbol nodes');
  });
});

describe('scan handler integration - incremental:false', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  function setupScanMocks(indexResults: unknown[]) {
    const indexFilesMock = vi.fn(async () => indexResults);
    const removeFileMock = vi.fn();

    vi.doMock('node:child_process', () => ({
      execSync: vi.fn(() => 'same-head\n'),
    }));
    vi.doMock('node:fs', () => ({
      existsSync: vi.fn(() => true),
      realpathSync: vi.fn((pathValue: string) => pathValue),
    }));
    vi.doMock('../code-graph/lib/structural-indexer.js', () => ({
      indexFiles: indexFilesMock,
    }));
    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      getLastGitHead: vi.fn(() => 'same-head'),
      setLastDetectorProvenance: vi.fn(),
      setLastDetectorProvenanceSummary: vi.fn(),
      setLastGraphEdgeEnrichmentSummary: vi.fn(),
      setLastGitHead: vi.fn(),
      isFileStale: vi.fn(() => false),
      upsertFile: vi.fn(() => 1),
      replaceNodes: vi.fn(),
      replaceEdges: vi.fn(),
      removeFile: removeFileMock,
      getTrackedFiles: vi.fn(() => indexResults.map(result => (result as { filePath: string }).filePath)),
      getStats: vi.fn(() => ({ lastScanTimestamp: '2026-04-23T00:00:00.000Z' })),
    }));

    return { indexFilesMock, removeFileMock };
  }

  function parseScanPayload(response: { content: Array<{ text: string }> }) {
    return JSON.parse(response.content[0].text) as {
      status: string;
      data: {
        filesScanned: number;
        filesIndexed: number;
        fullScanRequested: boolean;
        effectiveIncremental: boolean;
      };
    };
  }

  it('passes skipFreshFiles=false for caller-requested full scans', async () => {
    const scanResults = Array.from({ length: 3 }, (_, index) => ({
      filePath: `/workspace/file-${index}.ts`,
      language: 'typescript',
      contentHash: `hash-${index}`,
      nodes: [{ symbolId: `symbol-${index}` }],
      edges: [],
      detectorProvenance: 'structured',
      parseHealth: 'clean',
      parseDurationMs: 1,
      parseErrors: [],
    }));
    const { indexFilesMock } = setupScanMocks(scanResults);

    const { handleCodeGraphScan } = await import('../code-graph/handlers/scan.js');
    const response = await handleCodeGraphScan({ rootDir: process.cwd(), incremental: false });
    const payload = parseScanPayload(response);

    expect(indexFilesMock).toHaveBeenCalledWith(expect.any(Object), { skipFreshFiles: false });
    expect(payload.status).toBe('ok');
    expect(payload.data.filesScanned).toBe(3);
    expect(payload.data.filesIndexed).toBe(3);
    expect(payload.data.fullScanRequested).toBe(true);
    expect(payload.data.effectiveIncremental).toBe(false);
  });

  it('is idempotent for repeated caller-requested full scans with the same indexer results', async () => {
    const scanResults = [
      {
        filePath: '/workspace/current.ts',
        language: 'typescript',
        contentHash: 'hash-current',
        nodes: [{ symbolId: 'current-symbol' }],
        edges: [],
        detectorProvenance: 'structured',
        parseHealth: 'clean',
        parseDurationMs: 1,
        parseErrors: [],
      },
    ];
    const { indexFilesMock } = setupScanMocks(scanResults);

    const { handleCodeGraphScan } = await import('../code-graph/handlers/scan.js');
    const first = parseScanPayload(await handleCodeGraphScan({ rootDir: process.cwd(), incremental: false }));
    const second = parseScanPayload(await handleCodeGraphScan({ rootDir: process.cwd(), incremental: false }));

    expect(indexFilesMock).toHaveBeenCalledTimes(2);
    expect(second.data.filesScanned).toBe(first.data.filesScanned);
    expect(second.data.filesIndexed).toBe(first.data.filesIndexed);
    expect(second.data.fullScanRequested).toBe(true);
    expect(second.data.effectiveIncremental).toBe(false);
  });
});
