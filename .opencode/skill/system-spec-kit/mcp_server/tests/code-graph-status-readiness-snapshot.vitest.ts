// ───────────────────────────────────────────────────────────────
// TEST: Code Graph Status — Readiness Snapshot (Packet 014)
// ───────────────────────────────────────────────────────────────
// Verifies that `code_graph_status` surfaces an action-level readiness
// snapshot (full_scan | selective_reindex | none) WITHOUT mutating the
// graph database. The snapshot replaces the previous behavior where
// `readiness.action` was hard-coded to "none" regardless of state.
//
// Source of truth:
//   .opencode/specs/system-spec-kit/026-graph-and-context-optimization/
//   011-mcp-runtime-stress-remediation/011-post-stress-followup-research/
//   research/research.md §5 (Q-P2)
//
// Falsifiable success criteria (research §5.5):
//   A. Fresh state            → readiness.action = "none"
//   B. Empty graph            → readiness.action = "full_scan"
//   C. Broad stale (>50 files)→ readiness.action = "full_scan"
//   D. Bounded stale          → readiness.action = "selective_reindex"
//   E. Side-effect freedom    → DB byte-equal before vs after status call

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type FreshnessFixture = 'fresh' | 'stale' | 'empty' | 'error';
type ActionFixture = 'none' | 'full_scan' | 'selective_reindex';

interface SnapshotFixture {
  freshness: FreshnessFixture;
  action: ActionFixture;
  reason: string;
}

const mocks = vi.hoisted(() => ({
  getGraphReadinessSnapshot: vi.fn(),
  getGraphFreshness: vi.fn(),
  getStats: vi.fn(),
  getLastGoldVerification: vi.fn(),
  getCodeGraphMetadata: vi.fn(),
}));

const writeSurfaceMocks = vi.hoisted(() => ({
  getStats: vi.fn(),
  getLastGoldVerification: vi.fn(),
  getCodeGraphMetadata: vi.fn(),
  setCodeGraphMetadata: vi.fn(),
  setLastGitHead: vi.fn(),
  setLastDetectorProvenance: vi.fn(),
  setLastDetectorProvenanceSummary: vi.fn(),
  setLastGraphEdgeEnrichmentSummary: vi.fn(),
  clearLastGraphEdgeEnrichmentSummary: vi.fn(),
  setLastGoldVerification: vi.fn(),
  upsertFile: vi.fn(),
  replaceNodes: vi.fn(),
  replaceEdges: vi.fn(),
  removeFile: vi.fn(),
  cleanupOrphans: vi.fn(),
  initDb: vi.fn(),
  closeDb: vi.fn(),
  getDb: vi.fn(),
  ensureFreshFiles: vi.fn(),
  getTrackedFiles: vi.fn(),
  isFileStale: vi.fn(),
  getLastGitHead: vi.fn(),
  getLastDetectorProvenance: vi.fn(),
}));

const ensureReadyMocks = vi.hoisted(() => ({
  getGraphReadinessSnapshot: vi.fn(),
  getGraphFreshness: vi.fn(),
  ensureCodeGraphReady: vi.fn(),
}));

function installMocks(snapshot: SnapshotFixture): void {
  mocks.getGraphReadinessSnapshot.mockReturnValue(snapshot);
  // Legacy entry point: still used by status.ts as a `typeof` reference for
  // the `getGoldVerificationTrust` parameter. Keep its return value aligned
  // with the snapshot's freshness so the trust calculation stays consistent.
  mocks.getGraphFreshness.mockReturnValue(snapshot.freshness);

  vi.doMock('../code_graph/lib/ensure-ready.js', () => ({
    getGraphReadinessSnapshot: mocks.getGraphReadinessSnapshot,
    getGraphFreshness: mocks.getGraphFreshness,
  }));

  vi.doMock('../code_graph/lib/code-graph-db.js', () => ({
    getStats: mocks.getStats,
    getLastGoldVerification: mocks.getLastGoldVerification,
    getCodeGraphMetadata: mocks.getCodeGraphMetadata,
  }));
}

async function statusWithSnapshot(snapshot: SnapshotFixture) {
  installMocks(snapshot);
  const { handleCodeGraphStatus } = await import('../code_graph/handlers/status.js');
  const result = await handleCodeGraphStatus();
  return JSON.parse(result.content[0].text) as {
    status: string;
    data?: Record<string, unknown>;
  };
}

const STATS_FIXTURE = {
  totalFiles: 12,
  totalNodes: 240,
  totalEdges: 480,
  lastScanTimestamp: '2026-04-27T12:00:00.000Z',
  lastGitHead: 'abc1234',
  dbFileSize: 65536,
  schemaVersion: 3,
  nodesByKind: { function: 200, class: 40 },
  edgesByType: { calls: 300, imports: 180 },
  parseHealthSummary: null,
  graphQualitySummary: null,
};

describe('code_graph_status readiness snapshot routing (Packet 014)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.getStats.mockReturnValue(STATS_FIXTURE);
    mocks.getLastGoldVerification.mockReturnValue(null);
    mocks.getCodeGraphMetadata.mockReturnValue(null);
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  // ── A. Fresh state → readiness.action = "none" ────────────────
  it('surfaces readiness.action="none" for a fresh graph (criterion A)', async () => {
    const parsed = await statusWithSnapshot({
      freshness: 'fresh',
      action: 'none',
      reason: 'all tracked files are up-to-date',
    });

    expect(parsed.status).toBe('ok');
    const readiness = (parsed.data?.readiness ?? {}) as Record<string, unknown>;
    expect(readiness.action).toBe('none');
    expect(readiness.freshness).toBe('fresh');
    expect(readiness.reason).toBe('all tracked files are up-to-date');
  });

  // ── B. Empty graph → readiness.action = "full_scan" ───────────
  it('surfaces readiness.action="full_scan" for an empty graph with descriptive reason (criterion B)', async () => {
    const parsed = await statusWithSnapshot({
      freshness: 'empty',
      action: 'full_scan',
      reason: 'graph is empty (0 nodes)',
    });

    expect(parsed.status).toBe('ok');
    const readiness = (parsed.data?.readiness ?? {}) as Record<string, unknown>;
    expect(readiness.action).toBe('full_scan');
    expect(readiness.freshness).toBe('empty');
    // The reason MUST describe the "empty" condition so operators can act
    // without invoking the mutating `code_graph_scan` to find out.
    expect(String(readiness.reason)).toMatch(/empty/i);
  });

  // ── C. Broad stale → readiness.action = "full_scan" ───────────
  it('surfaces readiness.action="full_scan" for broad stale (>50 files) (criterion C)', async () => {
    const parsed = await statusWithSnapshot({
      freshness: 'stale',
      action: 'full_scan',
      reason: '120 stale files exceed selective threshold (50)',
    });

    expect(parsed.status).toBe('ok');
    const readiness = (parsed.data?.readiness ?? {}) as Record<string, unknown>;
    expect(readiness.action).toBe('full_scan');
    expect(readiness.freshness).toBe('stale');
    expect(String(readiness.reason)).toMatch(/exceed selective threshold/);
  });

  // ── D. Bounded stale → readiness.action = "selective_reindex" ─
  it('surfaces readiness.action="selective_reindex" for bounded stale (criterion D)', async () => {
    const parsed = await statusWithSnapshot({
      freshness: 'stale',
      action: 'selective_reindex',
      reason: '7 file(s) have newer mtime than indexed_at',
    });

    expect(parsed.status).toBe('ok');
    const readiness = (parsed.data?.readiness ?? {}) as Record<string, unknown>;
    expect(readiness.action).toBe('selective_reindex');
    expect(readiness.freshness).toBe('stale');
    expect(String(readiness.reason)).toMatch(/newer mtime/);
  });

  // ── Error path → no exception, action defaults to "none" ──────
  it('surfaces readiness for an unavailable graph without throwing', async () => {
    const parsed = await statusWithSnapshot({
      freshness: 'error',
      action: 'none',
      reason: 'readiness probe crashed: db locked',
    });

    expect(parsed.status).toBe('ok');
    const readiness = (parsed.data?.readiness ?? {}) as Record<string, unknown>;
    expect(readiness.freshness).toBe('error');
    expect(readiness.action).toBe('none');
    expect(String(readiness.reason)).toMatch(/probe crashed/);
  });

  // ── Trust-state alignment: snapshot does not break canonical mapping
  it('preserves canonicalReadiness/trustState mapping from freshness', async () => {
    const parsed = await statusWithSnapshot({
      freshness: 'empty',
      action: 'full_scan',
      reason: 'graph is empty (0 nodes)',
    });

    expect(parsed.status).toBe('ok');
    expect(parsed.data?.canonicalReadiness).toBe('missing');
    // 'empty' projects onto SharedPayloadTrustState 'absent' per readiness-contract.
    expect(parsed.data?.trustState).toBe('absent');
  });
});

// ───────────────────────────────────────────────────────────────
// E. Side-effect freedom (criterion E — most important)
// ───────────────────────────────────────────────────────────────
// `code_graph_status` MUST be non-mutating. We assert that:
//   1. The snapshot helper was called with `process.cwd()`
//   2. NO write-side `code-graph-db` exports were invoked
//   3. NO inline indexer / scan entry points were called
//   4. The handler did not invoke `ensureCodeGraphReady` (mutating)
//
// Note: a true on-disk byte-equal check on `code-graph.sqlite` would
// require initializing the live DB inside vitest, which the existing
// suite avoids (handler tests across this folder all mock `code-graph-db`
// rather than touching the on-disk file). The mock-surface assertions
// below give the same guarantee at the API boundary: if the handler
// never calls a mutating function, it cannot mutate the DB.

describe('code_graph_status is side-effect free (criterion E)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    writeSurfaceMocks.getStats.mockReturnValue(STATS_FIXTURE);
    writeSurfaceMocks.getLastGoldVerification.mockReturnValue(null);
    writeSurfaceMocks.getCodeGraphMetadata.mockReturnValue(null);
    ensureReadyMocks.getGraphReadinessSnapshot.mockReturnValue({
      freshness: 'fresh',
      action: 'none',
      reason: 'all tracked files are up-to-date',
    });
    ensureReadyMocks.getGraphFreshness.mockReturnValue('fresh');

    vi.doMock('../code_graph/lib/ensure-ready.js', () => ({
      getGraphReadinessSnapshot: ensureReadyMocks.getGraphReadinessSnapshot,
      getGraphFreshness: ensureReadyMocks.getGraphFreshness,
      ensureCodeGraphReady: ensureReadyMocks.ensureCodeGraphReady,
    }));

    vi.doMock('../code_graph/lib/code-graph-db.js', () => writeSurfaceMocks);
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('does NOT call any mutating code-graph-db export', async () => {
    const { handleCodeGraphStatus } = await import('../code_graph/handlers/status.js');
    await handleCodeGraphStatus();

    // Write-side surface MUST stay untouched.
    expect(writeSurfaceMocks.setCodeGraphMetadata).not.toHaveBeenCalled();
    expect(writeSurfaceMocks.setLastGitHead).not.toHaveBeenCalled();
    expect(writeSurfaceMocks.setLastDetectorProvenance).not.toHaveBeenCalled();
    expect(writeSurfaceMocks.setLastDetectorProvenanceSummary).not.toHaveBeenCalled();
    expect(writeSurfaceMocks.setLastGraphEdgeEnrichmentSummary).not.toHaveBeenCalled();
    expect(writeSurfaceMocks.clearLastGraphEdgeEnrichmentSummary).not.toHaveBeenCalled();
    expect(writeSurfaceMocks.setLastGoldVerification).not.toHaveBeenCalled();
    expect(writeSurfaceMocks.upsertFile).not.toHaveBeenCalled();
    expect(writeSurfaceMocks.replaceNodes).not.toHaveBeenCalled();
    expect(writeSurfaceMocks.replaceEdges).not.toHaveBeenCalled();
    expect(writeSurfaceMocks.removeFile).not.toHaveBeenCalled();
    expect(writeSurfaceMocks.cleanupOrphans).not.toHaveBeenCalled();
  });

  it('does NOT call ensureCodeGraphReady (mutating entry point)', async () => {
    const { handleCodeGraphStatus } = await import('../code_graph/handlers/status.js');
    await handleCodeGraphStatus();
    expect(ensureReadyMocks.ensureCodeGraphReady).not.toHaveBeenCalled();
  });

  it('uses the read-only snapshot helper with process.cwd()', async () => {
    const { handleCodeGraphStatus } = await import('../code_graph/handlers/status.js');
    await handleCodeGraphStatus();
    expect(ensureReadyMocks.getGraphReadinessSnapshot).toHaveBeenCalledWith(process.cwd());
  });
});
