import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  buildContext: vi.fn(),
  ensureCodeGraphReady: vi.fn(async () => ({
    freshness: 'fresh',
    action: 'none',
    inlineIndexPerformed: false,
    reason: 'ok',
  })),
}));

vi.mock('../lib/code-graph/code-graph-context.js', () => ({
  buildContext: mocks.buildContext,
}));

vi.mock('../lib/code-graph/ensure-ready.js', () => ({
  ensureCodeGraphReady: mocks.ensureCodeGraphReady,
}));

import { handleCodeGraphContext } from '../handlers/code-graph/context.js';

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
    });
    expect(parsed.data.combinedSummary).toBe('summary');
  });
});
