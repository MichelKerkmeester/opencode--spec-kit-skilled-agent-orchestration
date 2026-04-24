// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Context Handler Tests
// ───────────────────────────────────────────────────────────────

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  buildContext: vi.fn(),
  getLastDetectorProvenance: vi.fn(() => 'structured'),
  getStats: vi.fn(() => ({
    lastScanTimestamp: '2026-04-17T00:00:00.000Z',
    graphQualitySummary: {
      detectorProvenanceSummary: null,
      graphEdgeEnrichmentSummary: null,
    },
  })),
  ensureCodeGraphReady: vi.fn(async () => ({
    freshness: 'fresh',
    action: 'none',
    inlineIndexPerformed: false,
    reason: 'ok',
  })),
}));

vi.mock('../lib/code-graph-context.js', () => ({
  buildContext: mocks.buildContext,
}));

vi.mock('../lib/ensure-ready.js', () => ({
  ensureCodeGraphReady: mocks.ensureCodeGraphReady,
}));

vi.mock('../lib/code-graph-db.js', () => ({
  getLastDetectorProvenance: mocks.getLastDetectorProvenance,
  getStats: mocks.getStats,
}));

import { handleCodeGraphContext } from '../handlers/context.js';

describe('code-graph-context handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
        deadlineMs: 400,
        partialOutput: {
          isPartial: false,
          reasons: [],
          omittedSections: 0,
          omittedAnchors: 0,
          truncatedText: false,
        },
        freshness: { lastScanAt: null, staleness: 'unknown' },
      },
    });
  });

  it('uses bounded inline refresh settings and returns readiness metadata', async () => {
    const result = await handleCodeGraphContext({
      subject: 'SomeSymbol',
      queryMode: 'neighborhood',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(mocks.ensureCodeGraphReady).toHaveBeenCalledWith(process.cwd(), {
      allowInlineIndex: true,
      allowInlineFullScan: false,
    });
    expect(parsed.data.readiness).toEqual({
      freshness: 'fresh',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'ok',
      canonicalReadiness: 'ready',
      trustState: 'live',
    });
    expect(parsed.data.canonicalReadiness).toBe('ready');
    expect(parsed.data.trustState).toBe('live');
    expect(parsed.data.lastPersistedAt).toBe('2026-04-17T00:00:00.000Z');
    expect(mocks.buildContext).toHaveBeenCalledWith(expect.objectContaining({
      deadlineMs: 400,
    }));
    expect(parsed.data.graphMetadata).toEqual({
      detectorProvenance: 'structured',
    });
    expect(parsed.data.combinedSummary).toBe('summary');
  });

  it('returns an explicit blocked contract when readiness requires a full scan', async () => {
    mocks.ensureCodeGraphReady.mockResolvedValueOnce({
      freshness: 'empty',
      action: 'full_scan',
      inlineIndexPerformed: false,
      reason: 'graph is empty (0 nodes)',
    });

    const result = await handleCodeGraphContext({
      subject: 'SomeSymbol',
      queryMode: 'neighborhood',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.status).toBe('blocked');
    expect(parsed.data).toMatchObject({
      blocked: true,
      degraded: true,
      graphAnswersOmitted: true,
      requiredAction: 'code_graph_scan',
    });
    expect(mocks.buildContext).not.toHaveBeenCalled();
  });

  it('surfaces readiness crash details when ensureCodeGraphReady throws', async () => {
    mocks.ensureCodeGraphReady.mockRejectedValueOnce(new Error('db locked'));

    const result = await handleCodeGraphContext({
      subject: 'SomeSymbol',
      queryMode: 'neighborhood',
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.readiness).toEqual({
      freshness: 'empty',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'readiness_check_crashed',
      error: 'db locked',
      canonicalReadiness: 'missing',
      trustState: 'unavailable',
    });
    expect(parsed.data.canonicalReadiness).toBe('missing');
    expect(parsed.data.trustState).toBe('unavailable');
  });

  it('preserves cocoindex seed fidelity and partial-output metadata', async () => {
    mocks.buildContext.mockReturnValueOnce({
      queryMode: 'neighborhood',
      resolvedAnchors: [{
        filePath: 'src/example.ts',
        startLine: 42,
        endLine: 44,
        symbolId: 'symbol-42',
        fqName: 'Example.handleThing',
        kind: 'function',
        confidence: 0.92,
        resolution: 'exact',
        score: 0.83,
        snippet: 'handleThing();',
        range: { start: 42, end: 44 },
        provider: 'cocoindex',
        source: 'semantic-search',
      }],
      graphContext: [],
      textBrief: 'brief',
      combinedSummary: 'summary',
      nextActions: ['next'],
      metadata: {
        totalNodes: 0,
        totalEdges: 0,
        budgetUsed: 10,
        budgetLimit: 1200,
        deadlineMs: 900,
        partialOutput: {
          isPartial: true,
          reasons: ['deadline'],
          omittedSections: 1,
          omittedAnchors: 0,
          truncatedText: false,
        },
        freshness: { lastScanAt: null, staleness: 'unknown' },
      },
    });

    const result = await handleCodeGraphContext({
      queryMode: 'neighborhood',
      profile: 'research',
      seeds: [{
        provider: 'cocoindex',
        file: 'src/example.ts',
        range: { start: 42, end: 44 },
        score: 0.83,
        snippet: 'handleThing();',
        source: 'semantic-search',
      }],
    });
    const parsed = JSON.parse(result.content[0].text);

    expect(mocks.buildContext).toHaveBeenCalledWith(expect.objectContaining({
      deadlineMs: 900,
      seeds: [expect.objectContaining({
        provider: 'cocoindex',
        file: 'src/example.ts',
        range: { start: 42, end: 44 },
        score: 0.83,
        snippet: 'handleThing();',
        source: 'semantic-search',
      })],
    }));
    expect(parsed.data.anchors[0]).toMatchObject({
      file: 'src/example.ts',
      line: 42,
      symbol: 'Example.handleThing',
      source: 'semantic-search',
      provider: 'cocoindex',
      score: 0.83,
      snippet: 'handleThing();',
      range: { start: 42, end: 44 },
    });
    expect(parsed.data.metadata.partialOutput).toEqual({
      isPartial: true,
      reasons: ['deadline'],
      omittedSections: 1,
      omittedAnchors: 0,
      truncatedText: false,
    });
  });
});
