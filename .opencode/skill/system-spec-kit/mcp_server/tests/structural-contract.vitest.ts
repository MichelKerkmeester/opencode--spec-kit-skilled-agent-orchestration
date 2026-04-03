// ───────────────────────────────────────────────────────────────
// TEST: Phase 027 — Structural Bootstrap Contract
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

describe('buildStructuralBootstrapContract', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('returns ready status with highlights when graph is fresh', async () => {
    vi.doMock('../lib/code-graph/code-graph-db.js', () => ({
      getStats: vi.fn(() => freshGraphMock()),
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
  });

  it('returns stale status when graph scan is old', async () => {
    vi.doMock('../lib/code-graph/code-graph-db.js', () => ({
      getStats: vi.fn(() => freshGraphMock({
        lastScanTimestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      })),
    }));
    setupSharedMocks();

    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
    const contract = buildStructuralBootstrapContract('session_bootstrap');

    expect(contract.status).toBe('stale');
    expect(contract.summary).toContain('stale');
    expect(contract.highlights).toBeUndefined();
    expect(contract.recommendedAction).toContain('session_bootstrap');
    expect(contract.sourceSurface).toBe('session_bootstrap');
  });

  it('returns missing status when graph is empty', async () => {
    vi.doMock('../lib/code-graph/code-graph-db.js', () => ({
      getStats: vi.fn(() => freshGraphMock({
        totalFiles: 0, totalNodes: 0, totalEdges: 0,
        lastScanTimestamp: null,
      })),
    }));
    setupSharedMocks();

    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
    const contract = buildStructuralBootstrapContract('session_resume');

    expect(contract.status).toBe('missing');
    expect(contract.summary).toContain('No structural context');
    expect(contract.highlights).toBeUndefined();
    expect(contract.recommendedAction).toContain('session_bootstrap');
    expect(contract.sourceSurface).toBe('session_resume');
  });

  it('returns missing status when graph DB throws', async () => {
    vi.doMock('../lib/code-graph/code-graph-db.js', () => ({
      getStats: vi.fn(() => { throw new Error('DB not initialized'); }),
    }));
    setupSharedMocks();

    const { buildStructuralBootstrapContract } = await import('../lib/session/session-snapshot.js');
    const contract = buildStructuralBootstrapContract('session_health');

    expect(contract.status).toBe('missing');
    expect(contract.sourceSurface).toBe('session_health');
  });

  it('preserves sourceSurface parameter for each surface', async () => {
    vi.doMock('../lib/code-graph/code-graph-db.js', () => ({
      getStats: vi.fn(() => freshGraphMock()),
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
    vi.doMock('../lib/code-graph/code-graph-db.js', () => ({
      getStats: vi.fn(() => freshGraphMock({
        nodesByKind: Object.fromEntries(
          Array.from({ length: 12 }, (_, index) => [
            `very_long_symbol_kind_name_${index}_with_extra_budget_pressure`,
            1000 - index,
          ]),
        ),
      })),
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
