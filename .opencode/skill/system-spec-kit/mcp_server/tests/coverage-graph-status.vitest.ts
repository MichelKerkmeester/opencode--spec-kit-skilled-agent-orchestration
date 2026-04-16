// TEST: COVERAGE GRAPH STATUS HANDLER
// T234: handleCoverageGraphStatus fail-opens on signal computation errors.
// T233: Coverage skewed toward helpers — this file exercises the shipped handler path.
//
// The handler at handlers/coverage-graph/status.ts swallows exceptions from
// computeScopedSignals() and computeScopedMomentum() inside a bare try/catch,
// returning status: 'ok' with null signals. These tests verify the fail-open
// behavior is visible and that the handler propagates correct data when signals
// succeed.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We test the handler through its public export, mocking the convergence
// module to simulate signal computation failures.
const convergenceMock = {
  computeScopedStats: vi.fn(),
  computeScopedSignals: vi.fn(),
  computeScopedMomentum: vi.fn(),
};

vi.mock('../handlers/coverage-graph/convergence.js', () => convergenceMock);

// Dynamic import AFTER mocks are in place
const { handleCoverageGraphStatus } = await import('../handlers/coverage-graph/status');

function parsePayload(result: { content: Array<{ type: string; text: string }> }) {
  return JSON.parse(result.content[0].text);
}

const VALID_ARGS = {
  specFolder: 'specs/026-graph-optimization',
  loopType: 'research' as const,
  sessionId: 'session-abc-123',
};

beforeEach(() => {
  vi.clearAllMocks();
  convergenceMock.computeScopedStats.mockReturnValue({
    totalNodes: 5,
    totalEdges: 3,
    nodesByKind: { QUESTION: 3, CLAIM: 2 },
    edgesByRelation: { COVERS: 2, EVIDENCE_FOR: 1 },
    lastIteration: 2,
  });
  convergenceMock.computeScopedSignals.mockReturnValue({
    questionCoverage: 0.8,
    claimVerificationRate: 0.6,
  });
  convergenceMock.computeScopedMomentum.mockReturnValue({
    questionCoverage: 0.1,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('handleCoverageGraphStatus — shipped handler path (T233/T234)', () => {
  // ─── INPUT VALIDATION ───────────────────────────────────────

  it('rejects empty specFolder', async () => {
    const result = await handleCoverageGraphStatus({
      ...VALID_ARGS,
      specFolder: '',
    });
    const payload = parsePayload(result);
    expect(payload.status).toBe('error');
    expect(payload.error).toMatch(/specFolder/);
  });

  it('rejects invalid loopType', async () => {
    const result = await handleCoverageGraphStatus({
      ...VALID_ARGS,
      loopType: 'invalid' as any,
    });
    const payload = parsePayload(result);
    expect(payload.status).toBe('error');
    expect(payload.error).toMatch(/loopType/);
  });

  it('rejects empty sessionId', async () => {
    const result = await handleCoverageGraphStatus({
      ...VALID_ARGS,
      sessionId: '',
    });
    const payload = parsePayload(result);
    expect(payload.status).toBe('error');
    expect(payload.error).toMatch(/sessionId/);
  });

  // ─── HAPPY PATH ─────────────────────────────────────────────

  it('returns status ok with signals and momentum on success', async () => {
    const result = await handleCoverageGraphStatus(VALID_ARGS);
    const payload = parsePayload(result);

    expect(payload.status).toBe('ok');
    expect(payload.data.totalNodes).toBe(5);
    expect(payload.data.totalEdges).toBe(3);
    expect(payload.data.signals).toEqual({ questionCoverage: 0.8, claimVerificationRate: 0.6 });
    expect(payload.data.momentum).toEqual({ questionCoverage: 0.1 });
    expect(payload.data.namespace.specFolder).toBe(VALID_ARGS.specFolder);
    expect(payload.data.namespace.loopType).toBe(VALID_ARGS.loopType);
    expect(payload.data.namespace.sessionId).toBe(VALID_ARGS.sessionId);
  });

  // ─── FAIL-OPEN BEHAVIOR (T234) ──────────────────────────────

  it('returns status ok with null signals when computeScopedSignals throws', async () => {
    convergenceMock.computeScopedSignals.mockImplementation(() => {
      throw new Error('Signal computation failed: NaN in question coverage');
    });

    const result = await handleCoverageGraphStatus(VALID_ARGS);
    const payload = parsePayload(result);

    expect(payload.status).toBe('ok');
    expect(payload.data.signals).toBeNull();
    // Momentum also swallowed because both are in the same try/catch
    expect(payload.data.momentum).toBeNull();
    expect(payload.data.totalNodes).toBe(5);
  });

  it('returns status ok with null momentum when computeScopedMomentum throws', async () => {
    convergenceMock.computeScopedMomentum.mockImplementation(() => {
      throw new Error('Momentum snapshot missing');
    });

    const result = await handleCoverageGraphStatus(VALID_ARGS);
    const payload = parsePayload(result);

    expect(payload.status).toBe('ok');
    // Signals succeed but momentum fails — both end up null because
    // the handler catches the entire block
    expect(payload.data.signals).toBeNull();
    expect(payload.data.momentum).toBeNull();
  });

  // ─── EMPTY GRAPH ────────────────────────────────────────────

  it('skips signal computation when totalNodes is 0', async () => {
    convergenceMock.computeScopedStats.mockReturnValue({
      totalNodes: 0,
      totalEdges: 0,
      nodesByKind: {},
      edgesByRelation: {},
      lastIteration: null,
    });

    const result = await handleCoverageGraphStatus(VALID_ARGS);
    const payload = parsePayload(result);

    expect(payload.status).toBe('ok');
    expect(payload.data.signals).toBeNull();
    expect(payload.data.momentum).toBeNull();
    // computeScopedSignals should NOT be called for empty graphs
    expect(convergenceMock.computeScopedSignals).not.toHaveBeenCalled();
    expect(convergenceMock.computeScopedMomentum).not.toHaveBeenCalled();
  });

  // ─── OUTER CATCH ────────────────────────────────────────────

  it('returns error when computeScopedStats itself throws', async () => {
    convergenceMock.computeScopedStats.mockImplementation(() => {
      throw new Error('DB connection lost');
    });

    const result = await handleCoverageGraphStatus(VALID_ARGS);
    const payload = parsePayload(result);

    expect(payload.status).toBe('error');
    expect(payload.error).toContain('DB connection lost');
  });
});
