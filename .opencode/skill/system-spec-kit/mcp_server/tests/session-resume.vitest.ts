// ───────────────────────────────────────────────────────────────
// TEST: Session Resume Handler
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../handlers/memory-context.js', () => ({
  handleMemoryContext: vi.fn(async () => ({
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: { memories: [] } }),
    }],
  })),
}));

vi.mock('../lib/code-graph/code-graph-db.js', () => ({
  getStats: vi.fn(() => ({
    totalFiles: 10, totalNodes: 50, totalEdges: 30,
    lastScanTimestamp: new Date().toISOString(),
    dbFileSize: 2048, schemaVersion: 1,
    nodesByKind: {}, edgesByType: {}, parseHealthSummary: {},
  })),
}));

vi.mock('../lib/session/context-metrics.js', () => ({
  computeQualityScore: vi.fn(() => ({
    level: 'degraded',
    score: 0.5,
    factors: { recency: 0, recovery: 0, graphFreshness: 0, continuity: 0 },
  })),
  recordMetricEvent: vi.fn(),
  recordBootstrapEvent: vi.fn(),
}));

import { handleSessionResume } from '../handlers/session-resume.js';
import { handleMemoryContext } from '../handlers/memory-context.js';
import * as graphDb from '../lib/code-graph/code-graph-db.js';
import { computeQualityScore, recordBootstrapEvent } from '../lib/session/context-metrics.js';

describe('session-resume handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns MCPResponse with content array', async () => {
    const result = await handleSessionResume({});
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.content[0].type).toBe('text');
  });

  it('result contains memory, codeGraph, cocoIndex, and hints fields', async () => {
    const result = await handleSessionResume({});
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('ok');
    expect(parsed.data.memory).toBeDefined();
    expect(parsed.data.codeGraph).toBeDefined();
    expect(parsed.data.cocoIndex).toBeDefined();
    expect(parsed.data.hints).toBeDefined();
  });

  it('passes specFolder to memory context sub-call', async () => {
    await handleSessionResume({ specFolder: 'specs/001-test' });
    expect(handleMemoryContext).toHaveBeenCalledWith(
      expect.objectContaining({ specFolder: 'specs/001-test' }),
    );
  });

  it('adds hint when code graph has zero nodes (empty)', async () => {
    vi.mocked(graphDb.getStats).mockReturnValueOnce({
      totalFiles: 0, totalNodes: 0, totalEdges: 0,
      lastScanTimestamp: null, dbFileSize: 0, schemaVersion: 1,
      nodesByKind: {}, edgesByType: {}, parseHealthSummary: {},
    });
    const result = await handleSessionResume({});
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.data.codeGraph.status).toBe('empty');
  });

  it('handles memory context failure gracefully', async () => {
    vi.mocked(handleMemoryContext).mockRejectedValueOnce(new Error('DB locked'));
    const result = await handleSessionResume({});
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.data.memory).toHaveProperty('error');
    expect(parsed.data.hints.some((h: string) => h.includes('Memory resume failed'))).toBe(true);
  });

  it('handles code graph error gracefully', async () => {
    vi.mocked(graphDb.getStats).mockImplementationOnce(() => {
      throw new Error('DB not initialized');
    });
    const result = await handleSessionResume({});
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.data.codeGraph.status).toBe('error');
    expect(parsed.data.hints.some((h: string) => h.includes('Code graph unavailable'))).toBe(true);
  });

  it('records bootstrap telemetry for full resume requests', async () => {
    await handleSessionResume({});
    expect(recordBootstrapEvent).toHaveBeenCalledWith('tool', expect.any(Number), 'full');
  });

  it('skips bootstrap telemetry and includes sessionQuality in minimal mode', async () => {
    const result = await handleSessionResume({ minimal: true });
    const parsed = JSON.parse(result.content[0].text);

    expect(handleMemoryContext).not.toHaveBeenCalled();
    expect(computeQualityScore).toHaveBeenCalledTimes(1);
    expect(parsed.data.memory).toEqual({ skipped: true, reason: 'minimal mode' });
    expect(parsed.data.sessionQuality).toBe('degraded');
    expect(recordBootstrapEvent).not.toHaveBeenCalled();
  });
});
