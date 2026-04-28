// ───────────────────────────────────────────────────────────────
// TEST: Degraded-readiness envelope parity (Packet 016)
// ───────────────────────────────────────────────────────────────
// Verifies that `code_graph_context` and `code_graph_status` ship
// the SHARED degraded-readiness vocabulary when the underlying
// readiness probe / DB stats path crashes:
//   - readiness (raw ensure-ready triplet)
//   - canonicalReadiness ('missing' for unreachable scope)
//   - trustState ('unavailable' for crash-on-probe; 'absent' is
//     reserved for genuinely empty graphs)
//   - graphAnswersOmitted: true
//   - fallbackDecision = { nextTool: 'rg', reason: <crash-reason> }
//
// Source of truth:
//   .opencode/specs/system-spec-kit/026-graph-and-context-optimization/
//   011-mcp-runtime-stress-remediation/011-post-stress-followup-research/
//   review/review-report.md §3 (F-001, F-003) and §7 Packet A
//
// Falsifiable success criteria (review-report.md §7 Packet A PASS gate):
//   F-001: Context readiness-crash returns blocked envelope WITH preserved
//          readiness/canonicalReadiness/trustState/graphAnswersOmitted/rg recovery
//   F-003: Status DB-unavailable returns readiness snapshot (stats failure isolated)
//   Cross: Both handlers preserve common readiness fields (shared vocabulary)

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ───────────────────────────────────────────────────────────────
// SHARED MOCK SCAFFOLDING
// ───────────────────────────────────────────────────────────────
const mocks = vi.hoisted(() => ({
  ensureCodeGraphReady: vi.fn(),
  getGraphReadinessSnapshot: vi.fn(),
  getGraphFreshness: vi.fn(),
  getStats: vi.fn(),
  getDb: vi.fn(),
  getLastDetectorProvenance: vi.fn(),
  getLastGoldVerification: vi.fn(),
  getCodeGraphMetadata: vi.fn(),
  queryEdgesFrom: vi.fn(),
  queryEdgesTo: vi.fn(),
  queryFileDegrees: vi.fn(),
  queryFileImportDependents: vi.fn(),
  queryOutline: vi.fn(),
  resolveSubjectFilePath: vi.fn(),
}));

function makeEmptyPrepare() {
  return vi.fn(() => ({
    all: vi.fn(() => []),
    get: vi.fn(() => undefined),
  }));
}

function installContextMocks(): void {
  vi.doMock('../code_graph/lib/ensure-ready.js', () => ({
    ensureCodeGraphReady: mocks.ensureCodeGraphReady,
    getGraphReadinessSnapshot: mocks.getGraphReadinessSnapshot,
    getGraphFreshness: mocks.getGraphFreshness,
  }));
  vi.doMock('../code_graph/lib/code-graph-db.js', () => ({
    getDb: mocks.getDb,
    getStats: mocks.getStats,
    getLastDetectorProvenance: mocks.getLastDetectorProvenance,
    queryEdgesFrom: mocks.queryEdgesFrom,
    queryEdgesTo: mocks.queryEdgesTo,
    queryFileDegrees: mocks.queryFileDegrees,
    queryFileImportDependents: mocks.queryFileImportDependents,
    queryOutline: mocks.queryOutline,
    resolveSubjectFilePath: mocks.resolveSubjectFilePath,
  }));
}

function installStatusMocks(): void {
  vi.doMock('../code_graph/lib/ensure-ready.js', () => ({
    ensureCodeGraphReady: mocks.ensureCodeGraphReady,
    getGraphReadinessSnapshot: mocks.getGraphReadinessSnapshot,
    getGraphFreshness: mocks.getGraphFreshness,
  }));
  vi.doMock('../code_graph/lib/code-graph-db.js', () => ({
    getStats: mocks.getStats,
    getLastGoldVerification: mocks.getLastGoldVerification,
    getCodeGraphMetadata: mocks.getCodeGraphMetadata,
  }));
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  mocks.getDb.mockReturnValue({ prepare: makeEmptyPrepare() });
  mocks.getStats.mockReturnValue({
    totalFiles: 0,
    totalNodes: 0,
    totalEdges: 0,
    lastScanTimestamp: null,
    lastGitHead: null,
    dbFileSize: 0,
    schemaVersion: 3,
    nodesByKind: {},
    edgesByType: {},
    parseHealthSummary: null,
    graphQualitySummary: null,
  });
  mocks.getLastDetectorProvenance.mockReturnValue(null);
  mocks.getLastGoldVerification.mockReturnValue(null);
  mocks.getCodeGraphMetadata.mockReturnValue(null);
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

// ───────────────────────────────────────────────────────────────
// F-001: code_graph_context degraded-readiness envelope on crash
// ───────────────────────────────────────────────────────────────
describe('code_graph_context degraded-readiness envelope (F-001)', () => {
  beforeEach(() => {
    installContextMocks();
  });

  it('returns BLOCKED envelope with preserved readiness/canonicalReadiness/trustState/graphAnswersOmitted on readiness crash', async () => {
    // Simulate the readiness probe throwing — context.ts catches this and
    // remaps to `freshness: 'error'` per the existing post-PR4 contract.
    mocks.ensureCodeGraphReady.mockRejectedValue(new Error('db locked'));

    const { handleCodeGraphContext } = await import('../code_graph/handlers/context.js');
    const result = await handleCodeGraphContext({ subject: 'src/foo.ts' });
    const parsed = JSON.parse(result.content[0].text) as {
      status: string;
      message?: string;
      data?: Record<string, unknown>;
    };

    // F-001 PASS gate: blocked envelope, NOT a generic 'error' fallthrough.
    expect(parsed.status).toBe('blocked');
    expect(parsed.message).toMatch(/code_graph_not_ready/);

    // Shared vocabulary fields preserved.
    expect(parsed.data?.degraded).toBe(true);
    expect(parsed.data?.graphAnswersOmitted).toBe(true);
    expect(parsed.data?.blockReason).toBe('readiness_check_crashed');
    expect(parsed.data?.requiredAction).toBe('rg');

    // Readiness block — canonical projections both present.
    const readiness = parsed.data?.readiness as Record<string, unknown>;
    expect(readiness.freshness).toBe('error');
    expect(readiness.action).toBe('none');
    expect(readiness.canonicalReadiness).toBe('missing');
    expect(readiness.trustState).toBe('unavailable');
    expect(parsed.data?.canonicalReadiness).toBe('missing');
    expect(parsed.data?.trustState).toBe('unavailable');

    // rg recovery signal — same shape as code_graph_query.fallbackDecision.
    const fallbackDecision = parsed.data?.fallbackDecision as Record<string, unknown>;
    expect(fallbackDecision).toBeDefined();
    expect(fallbackDecision.nextTool).toBe('rg');
    expect(String(fallbackDecision.reason)).toMatch(/readiness_check_crashed/);
  });

  it('still returns the standard full_scan-required envelope when the probe succeeds with action=full_scan', async () => {
    // Backward-compat: the existing block branch must still ship for the
    // non-crash full_scan path. Only crash routes to nextTool='rg'.
    mocks.ensureCodeGraphReady.mockResolvedValue({
      freshness: 'empty',
      action: 'full_scan',
      inlineIndexPerformed: false,
      reason: 'graph is empty (0 nodes)',
    });

    const { handleCodeGraphContext } = await import('../code_graph/handlers/context.js');
    const result = await handleCodeGraphContext({ subject: 'src/foo.ts' });
    const parsed = JSON.parse(result.content[0].text) as {
      status: string;
      message?: string;
      data?: Record<string, unknown>;
    };

    expect(parsed.status).toBe('blocked');
    expect(parsed.message).toMatch(/code_graph_full_scan_required/);
    expect(parsed.data?.requiredAction).toBe('code_graph_scan');
    expect(parsed.data?.blockReason).toBe('full_scan_required');
    const fallbackDecision = parsed.data?.fallbackDecision as Record<string, unknown>;
    expect(fallbackDecision?.nextTool).toBe('code_graph_scan');
    expect(fallbackDecision?.reason).toBe('full_scan_required');
  });

  it('survives graphDb.getStats() throwing during the blocked envelope assembly (lastPersistedAt isolated)', async () => {
    // Defense-in-depth: even if stats throw inside the blocked-envelope
    // construction, the degraded envelope still ships with lastPersistedAt
    // = null instead of bubbling out as a generic handler crash.
    mocks.ensureCodeGraphReady.mockRejectedValue(new Error('db locked'));
    mocks.getStats.mockImplementation(() => {
      throw new Error('stats unavailable');
    });

    const { handleCodeGraphContext } = await import('../code_graph/handlers/context.js');
    const result = await handleCodeGraphContext({ subject: 'src/foo.ts' });
    const parsed = JSON.parse(result.content[0].text) as {
      status: string;
      data?: Record<string, unknown>;
    };

    expect(parsed.status).toBe('blocked');
    expect(parsed.data?.graphAnswersOmitted).toBe(true);
    expect(parsed.data?.lastPersistedAt).toBeNull();
    // Recovery signal still present.
    const fallbackDecision = parsed.data?.fallbackDecision as Record<string, unknown>;
    expect(fallbackDecision?.nextTool).toBe('rg');
  });
});

// ───────────────────────────────────────────────────────────────
// F-003: code_graph_status preserves snapshot on stats failure
// ───────────────────────────────────────────────────────────────
describe('code_graph_status DB-unavailable envelope (F-003)', () => {
  beforeEach(() => {
    installStatusMocks();
  });

  it('preserves the readiness snapshot when graphDb.getStats() throws (stats failure isolated)', async () => {
    // Snapshot helper still works (it is read-only and crash-safe per packet
    // 014 — returns `freshness: 'error'` if its own probe throws). We supply
    // a normal snapshot so the test isolates the F-003 behavior: stats fail,
    // snapshot survives.
    mocks.getGraphReadinessSnapshot.mockReturnValue({
      freshness: 'empty',
      action: 'full_scan',
      reason: 'graph is empty (0 nodes)',
    });
    mocks.getGraphFreshness.mockReturnValue('empty');
    mocks.getStats.mockImplementation(() => {
      throw new Error('database is locked');
    });

    const { handleCodeGraphStatus } = await import('../code_graph/handlers/status.js');
    const result = await handleCodeGraphStatus();
    const parsed = JSON.parse(result.content[0].text) as {
      status: string;
      message?: string;
      data?: Record<string, unknown>;
    };

    // F-003 PASS gate: status='error' but the readiness snapshot SURVIVES.
    expect(parsed.status).toBe('error');
    expect(parsed.message).toMatch(/code_graph_not_initialized/);
    expect(parsed.data?.degraded).toBe(true);
    expect(parsed.data?.blockReason).toBe('stats_unavailable');

    // Readiness snapshot preserved — the whole point of packet 014 must not
    // be defeated by the stats path crashing first.
    const readiness = parsed.data?.readiness as Record<string, unknown>;
    expect(readiness.freshness).toBe('empty');
    expect(readiness.action).toBe('full_scan');
    expect(String(readiness.reason)).toMatch(/empty/i);

    // Canonical projections present at top level (shared vocabulary).
    expect(parsed.data?.canonicalReadiness).toBe('missing');
    expect(parsed.data?.trustState).toBe('absent');

    // Recovery signal: rg fallback aligns with F-001 / context behavior.
    const fallbackDecision = parsed.data?.fallbackDecision as Record<string, unknown>;
    expect(fallbackDecision?.nextTool).toBe('rg');
    expect(fallbackDecision?.reason).toBe('stats_unavailable');
  });

  it('preserves the readiness snapshot when the snapshot itself reports a probe crash', async () => {
    // End-to-end degraded path: snapshot helper crashes (returns 'error') AND
    // stats fail. The handler must still ship the unavailable-readiness
    // envelope rather than a generic init error string.
    mocks.getGraphReadinessSnapshot.mockReturnValue({
      freshness: 'error',
      action: 'none',
      reason: 'readiness probe crashed: db locked',
    });
    mocks.getGraphFreshness.mockReturnValue('error');
    mocks.getStats.mockImplementation(() => {
      throw new Error('database is locked');
    });

    const { handleCodeGraphStatus } = await import('../code_graph/handlers/status.js');
    const result = await handleCodeGraphStatus();
    const parsed = JSON.parse(result.content[0].text) as {
      status: string;
      data?: Record<string, unknown>;
    };

    expect(parsed.status).toBe('error');
    expect(parsed.data?.canonicalReadiness).toBe('missing');
    // 'error' freshness projects to 'unavailable' per readiness-contract.ts.
    expect(parsed.data?.trustState).toBe('unavailable');
    const readiness = parsed.data?.readiness as Record<string, unknown>;
    expect(readiness.freshness).toBe('error');
    expect(String(readiness.reason)).toMatch(/probe crashed/);
  });

  it('still ships the ok envelope with action-level readiness on the healthy path', async () => {
    // Sanity: the changes must NOT regress the healthy path. Stats succeed,
    // snapshot returns fresh, response is status=ok with full data block.
    mocks.getGraphReadinessSnapshot.mockReturnValue({
      freshness: 'fresh',
      action: 'none',
      reason: 'all tracked files are up-to-date',
    });
    mocks.getGraphFreshness.mockReturnValue('fresh');
    // getStats default beforeEach() return is fine (lastScanTimestamp=null).

    const { handleCodeGraphStatus } = await import('../code_graph/handlers/status.js');
    const result = await handleCodeGraphStatus();
    const parsed = JSON.parse(result.content[0].text) as {
      status: string;
      data?: Record<string, unknown>;
    };

    expect(parsed.status).toBe('ok');
    expect(parsed.data?.freshness).toBe('fresh');
    const readiness = parsed.data?.readiness as Record<string, unknown>;
    expect(readiness.action).toBe('none');
    expect(parsed.data?.canonicalReadiness).toBe('ready');
    expect(parsed.data?.trustState).toBe('live');
    // No degraded markers on the healthy path.
    expect(parsed.data?.degraded).toBeUndefined();
    expect(parsed.data?.fallbackDecision).toBeUndefined();
  });
});

// ───────────────────────────────────────────────────────────────
// Cross-handler vocabulary parity
// ───────────────────────────────────────────────────────────────
describe('cross-handler shared degraded-readiness vocabulary parity', () => {
  it('context crash and status crash agree on canonicalReadiness="missing" + trustState="unavailable"', async () => {
    // Ship two crash envelopes in the same test file and assert they project
    // the SAME canonical readiness fields. This is what F-008 calls out:
    // shared vocabulary, handler-local payloads. The shared fields must
    // match byte-for-byte across handlers; the wrapping payload differs.
    installContextMocks();
    mocks.ensureCodeGraphReady.mockRejectedValue(new Error('db locked'));
    const { handleCodeGraphContext } = await import('../code_graph/handlers/context.js');
    const ctxResult = await handleCodeGraphContext({ subject: 'src/foo.ts' });
    const ctxParsed = JSON.parse(ctxResult.content[0].text) as {
      data?: Record<string, unknown>;
    };

    vi.resetModules();
    vi.clearAllMocks();
    // Re-prime the default beforeEach state since vi.clearAllMocks above
    // wiped the per-test scaffold. Only the bits status uses are needed.
    mocks.getStats.mockImplementation(() => {
      throw new Error('database is locked');
    });
    mocks.getGraphReadinessSnapshot.mockReturnValue({
      freshness: 'error',
      action: 'none',
      reason: 'readiness probe crashed: db locked',
    });
    mocks.getGraphFreshness.mockReturnValue('error');
    installStatusMocks();
    const { handleCodeGraphStatus } = await import('../code_graph/handlers/status.js');
    const stsResult = await handleCodeGraphStatus();
    const stsParsed = JSON.parse(stsResult.content[0].text) as {
      data?: Record<string, unknown>;
    };

    // Shared vocabulary parity — canonicalReadiness + trustState match
    // because both handlers project from the same readiness-contract.ts
    // helpers.
    expect(ctxParsed.data?.canonicalReadiness).toBe('missing');
    expect(ctxParsed.data?.trustState).toBe('unavailable');
    expect(stsParsed.data?.canonicalReadiness).toBe('missing');
    expect(stsParsed.data?.trustState).toBe('unavailable');

    // Both handlers ship graphAnswersOmitted=true on degraded paths.
    expect(ctxParsed.data?.graphAnswersOmitted).toBe(true);
    expect(stsParsed.data?.graphAnswersOmitted).toBe(true);

    // Both handlers route degraded callers to `rg` recovery.
    const ctxFb = ctxParsed.data?.fallbackDecision as Record<string, unknown>;
    const stsFb = stsParsed.data?.fallbackDecision as Record<string, unknown>;
    expect(ctxFb?.nextTool).toBe('rg');
    expect(stsFb?.nextTool).toBe('rg');
  });
});
