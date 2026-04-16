import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const NOW = '2026-04-16T20:30:00.000Z';
const LAST_TOOL_CALL_AT = '2026-04-16T20:28:00.000Z';
const LAST_GRAPH_UPDATE_AT = '2026-04-16T20:25:00.000Z';

const {
  isSessionPrimedMock,
  getSessionTimestampsMock,
  getLastActiveSessionIdMock,
  getCodeGraphStatusSnapshotMock,
  computeQualityScoreMock,
  getLastToolCallAtMock,
  getSessionMetricsMock,
  buildStructuralBootstrapContractMock,
} = vi.hoisted(() => ({
  isSessionPrimedMock: vi.fn(),
  getSessionTimestampsMock: vi.fn(),
  getLastActiveSessionIdMock: vi.fn(),
  getCodeGraphStatusSnapshotMock: vi.fn(),
  computeQualityScoreMock: vi.fn(),
  getLastToolCallAtMock: vi.fn(),
  getSessionMetricsMock: vi.fn(),
  buildStructuralBootstrapContractMock: vi.fn(),
}));

vi.mock('../hooks/memory-surface.js', () => ({
  isSessionPrimed: isSessionPrimedMock,
  getSessionTimestamps: getSessionTimestampsMock,
  getLastActiveSessionId: getLastActiveSessionIdMock,
  getCodeGraphStatusSnapshot: getCodeGraphStatusSnapshotMock,
}));

vi.mock('../lib/session/context-metrics.js', () => ({
  computeQualityScore: computeQualityScoreMock,
  getLastToolCallAt: getLastToolCallAtMock,
  getSessionMetrics: getSessionMetricsMock,
}));

vi.mock('../lib/session/session-snapshot.js', () => ({
  buildStructuralBootstrapContract: buildStructuralBootstrapContractMock,
}));

import { handleSessionHealth } from '../handlers/session-health.js';

function createGraphSnapshot(args: {
  totalFiles?: number;
  lastScanAt?: string | null;
}) {
  return {
    status: 'ok',
    data: {
      totalFiles: args.totalFiles ?? 12,
      totalNodes: 48,
      totalEdges: 96,
      lastScanAt: args.lastScanAt ?? LAST_GRAPH_UPDATE_AT,
    },
  };
}

function createStructuralContext(
  status: 'ready' | 'stale' | 'missing',
  lastUpdated: string | null = LAST_GRAPH_UPDATE_AT,
) {
  return {
    status,
    summary: `Structural context is ${status}`,
    recommendedAction: 'Use code_graph_query for structural lookups.',
    sourceSurface: 'session_health',
    provenance: {
      producer: 'session_snapshot',
      sourceSurface: 'session_health',
      trustState: status === 'ready' ? 'live' : 'stale',
      generatedAt: NOW,
      lastUpdated,
      sourceRefs: ['code-graph-db'],
    },
  };
}

function getSection(
  parsed: Record<string, unknown>,
  key: string,
): Record<string, unknown> | undefined {
  const sections = (parsed.data as { sections: Array<Record<string, unknown>> }).sections;
  return sections.find((section) => section.key === key);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(NOW));

  getSessionTimestampsMock.mockReturnValue({
    serverStartedAt: new Date('2026-04-16T19:30:00.000Z').getTime(),
  });
  getLastActiveSessionIdMock.mockReturnValue('session-1');
  isSessionPrimedMock.mockReturnValue(true);
  getCodeGraphStatusSnapshotMock.mockReturnValue(createGraphSnapshot({}));
  computeQualityScoreMock.mockReturnValue({
    level: 'healthy',
    score: 0.91,
    factors: {
      recency: 1,
      recovery: 1,
      graphFreshness: 1,
      continuity: 1,
    },
  });
  getLastToolCallAtMock.mockReturnValue(new Date(LAST_TOOL_CALL_AT).getTime());
  getSessionMetricsMock.mockReturnValue({
    currentSpecFolder: 'system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review',
  });
  buildStructuralBootstrapContractMock.mockReturnValue(createStructuralContext('ready'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('session-health handler', () => {
  it('attaches live trust metadata to health sections and keeps shared payload structural trust', async () => {
    const result = await handleSessionHealth();
    const parsed = JSON.parse(result.content[0].text);
    const sessionSection = getSection(parsed, 'session-health');
    const structuralSection = getSection(parsed, 'structural-context');
    const readinessSection = getSection(parsed, 'code-graph-readiness');
    const payloadStructuralSection = parsed.data.payloadContract.sections.find(
      (section: { key: string }) => section.key === 'structural-context',
    );

    expect(sessionSection?.structuralTrust).toEqual({
      state: 'live',
      trustedAt: LAST_TOOL_CALL_AT,
    });
    expect(structuralSection?.structuralTrust).toEqual({
      state: 'live',
      trustedAt: LAST_GRAPH_UPDATE_AT,
    });
    expect(readinessSection?.structuralTrust).toEqual({
      state: 'live',
      trustedAt: LAST_GRAPH_UPDATE_AT,
    });
    expect(payloadStructuralSection?.structuralTrust).toEqual({
      parserProvenance: 'ast',
      evidenceStatus: 'confirmed',
      freshnessAuthority: 'live',
    });
  });

  it('marks session and graph sections as stale when the underlying sources are stale', async () => {
    getCodeGraphStatusSnapshotMock.mockReturnValueOnce(createGraphSnapshot({
      lastScanAt: '2026-04-14T20:25:00.000Z',
    }));
    getLastToolCallAtMock.mockReturnValueOnce(new Date('2026-04-16T19:00:00.000Z').getTime());
    buildStructuralBootstrapContractMock.mockReturnValueOnce(createStructuralContext(
      'stale',
      '2026-04-14T20:25:00.000Z',
    ));

    const result = await handleSessionHealth();
    const parsed = JSON.parse(result.content[0].text);

    expect(getSection(parsed, 'session-health')?.structuralTrust).toEqual({
      state: 'stale',
      trustedAt: '2026-04-16T19:00:00.000Z',
    });
    expect(getSection(parsed, 'structural-context')?.structuralTrust).toEqual({
      state: 'stale',
      trustedAt: '2026-04-14T20:25:00.000Z',
    });
    expect(getSection(parsed, 'code-graph-readiness')?.structuralTrust).toEqual({
      state: 'stale',
      trustedAt: '2026-04-14T20:25:00.000Z',
    });
  });

  it('marks graph-backed sections as absent when the graph is empty', async () => {
    getCodeGraphStatusSnapshotMock.mockReturnValueOnce(createGraphSnapshot({
      totalFiles: 0,
      lastScanAt: null,
    }));
    buildStructuralBootstrapContractMock.mockReturnValueOnce(createStructuralContext('missing', null));

    const result = await handleSessionHealth();
    const parsed = JSON.parse(result.content[0].text);

    expect(getSection(parsed, 'structural-context')?.structuralTrust).toEqual({
      state: 'absent',
      trustedAt: NOW,
    });
    expect(getSection(parsed, 'code-graph-readiness')?.structuralTrust).toEqual({
      state: 'absent',
      trustedAt: NOW,
    });
  });

  it('marks graph-backed sections as unavailable when graph status lookup fails', async () => {
    getCodeGraphStatusSnapshotMock.mockImplementationOnce(() => {
      throw new Error('DB locked');
    });
    buildStructuralBootstrapContractMock.mockReturnValueOnce(createStructuralContext('missing', null));

    const result = await handleSessionHealth();
    const parsed = JSON.parse(result.content[0].text);

    expect(getSection(parsed, 'structural-context')?.structuralTrust).toEqual({
      state: 'unavailable',
      trustedAt: NOW,
    });
    expect(getSection(parsed, 'code-graph-readiness')?.structuralTrust).toEqual({
      state: 'unavailable',
      trustedAt: NOW,
    });
  });
});
