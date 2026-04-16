// ───────────────────────────────────────────────────────────────
// TEST: Startup Brief Builder
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../lib/code-graph/code-graph-db.js', () => ({
  getStats: vi.fn(() => ({
    totalFiles: 12,
    totalNodes: 64,
    totalEdges: 48,
    nodesByKind: {},
    edgesByType: {},
    parseHealthSummary: {},
    lastScanTimestamp: '2026-04-02T10:00:00.000Z',
    lastGitHead: null,
    dbFileSize: null,
    schemaVersion: 3,
  })),
  queryStartupHighlights: vi.fn(() => ([
    { name: 'handleSessionBootstrap', kind: 'function', filePath: 'mcp_server/handlers/session-bootstrap.ts', callCount: 5 },
  ])),
}));

vi.mock('../lib/code-graph/ensure-ready.js', () => ({
  getGraphFreshness: vi.fn(() => 'fresh'),
}));

vi.mock('../hooks/claude/hook-state.js', () => ({
  loadMostRecentState: vi.fn(() => ({
    claudeSessionId: 'recent-session',
    speckitSessionId: 'speckit-session',
    lastSpecFolder: 'system-spec-kit/024-compact-code-graph/027-opencode-structural-priming',
    sessionSummary: {
      text: 'Aligned structural bootstrap contract across auto-prime and session_* handlers.',
      extractedAt: '2026-04-02T10:01:00.000Z',
    },
    pendingCompactPrime: null,
    metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
    createdAt: '2026-04-02T10:00:00.000Z',
    updatedAt: '2026-04-02T10:01:00.000Z',
  })),
}));

vi.mock('../lib/utils/cocoindex-path.js', () => ({
  isCocoIndexAvailable: vi.fn(() => false),
}));

import { buildStartupBrief } from '../lib/code-graph/startup-brief.js';
import * as graphDb from '../lib/code-graph/code-graph-db.js';
import { getGraphFreshness } from '../lib/code-graph/ensure-ready.js';
import * as hookState from '../hooks/claude/hook-state.js';
import * as cocoIndexPath from '../lib/utils/cocoindex-path.js';

describe('startup-brief', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds graph outline and session continuity when data exists', () => {
    const brief = buildStartupBrief(undefined, { claudeSessionId: 'recent-session' });

    expect(brief.graphState).toBe('ready');
    expect(brief.graphOutline).toContain('12 files, 64 nodes, 48 edges.');
    expect(brief.graphOutline).toContain('Highlights:');
    expect(brief.graphOutline).toContain('handleSessionBootstrap (function)');
    expect(brief.sessionContinuity).toContain('Last session worked on');
    expect(brief.sessionContinuity).toContain('Summary:');
    expect(brief.cocoIndexAvailable).toBe(false);
    expect(brief.startupSurface).toContain('Session context received. Current state:');
    expect(brief.startupSurface).toContain('- Memory: session continuity available');
    expect(brief.startupSurface).toContain('- Code Graph: healthy');
    expect(brief.startupSurface).toContain('- CocoIndex: missing');
    expect(brief.startupSurface).toContain('- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.');
    expect(brief.sharedPayload?.kind).toBe('startup');
    expect(brief.sharedPayload?.provenance.producer).toBe('startup_brief');
    expect(brief.sharedPayload?.sections.length).toBeGreaterThan(0);
    expect(hookState.loadMostRecentState).toHaveBeenCalledWith({
      scope: {
        claudeSessionId: 'recent-session',
      },
    });
  });

  it('fails closed for continuity when no scope is provided', () => {
    const brief = buildStartupBrief();

    expect(brief.sessionContinuity).toBeNull();
    expect(brief.startupSurface).toContain('- Memory: startup summary only (resume on demand)');
    expect(hookState.loadMostRecentState).not.toHaveBeenCalled();
  });

  it('returns empty graph state with summary but no outline for empty indexes', () => {
    vi.mocked(graphDb.getStats).mockReturnValueOnce({
      totalFiles: 0,
      totalNodes: 0,
      totalEdges: 0,
      nodesByKind: {},
      edgesByType: {},
      parseHealthSummary: {},
      lastScanTimestamp: null,
      lastGitHead: null,
      dbFileSize: null,
      schemaVersion: 3,
    });

    const brief = buildStartupBrief(undefined, { claudeSessionId: 'recent-session' });
    expect(brief.graphState).toBe('empty');
    expect(brief.graphSummary).toMatchObject({ files: 0, nodes: 0, edges: 0, lastScan: null });
    expect(brief.graphOutline).toBeNull();
    expect(brief.startupSurface).toContain('- Code Graph: empty -- run `code_graph_scan`');
    expect(brief.sharedPayload?.provenance.trustState).toBe('stale');
  });

  it('reports stale graph state when freshness detection says stale even with graph counts present', () => {
    vi.mocked(getGraphFreshness).mockReturnValueOnce('stale');

    const brief = buildStartupBrief();

    expect(brief.graphState).toBe('stale');
    expect(brief.graphOutline).toContain('Freshness: stale');
    expect(brief.startupSurface).toContain('- Code Graph: stale');
    expect(brief.startupSurface).toContain('first structural read may refresh inline');
    expect(brief.startupSurface).toContain('startup snapshot');
    expect(brief.sharedPayload?.provenance.trustState).toBe('stale');
  });

  it('reports cocoindex as available when the binary exists', () => {
    vi.mocked(cocoIndexPath.isCocoIndexAvailable).mockReturnValueOnce(true);
    const brief = buildStartupBrief();
    expect(brief.cocoIndexAvailable).toBe(true);
    expect(brief.startupSurface).toContain('- CocoIndex: available');
  });

  it('includes orientation note when highlights are present', () => {
    const brief = buildStartupBrief();
    expect(brief.graphOutline).toContain('Orientation:');
    expect(brief.graphOutline).toContain('CocoIndex');
  });

  it('omits highlights section when queryStartupHighlights returns empty', () => {
    vi.mocked(graphDb.queryStartupHighlights).mockReturnValueOnce([]);
    const brief = buildStartupBrief();
    expect(brief.graphState).toBe('ready');
    expect(brief.graphOutline).not.toContain('Highlights:');
    expect(brief.graphOutline).not.toContain('Orientation:');
  });

  it('respects custom highlightCount parameter', () => {
    const brief = buildStartupBrief(3);
    expect(graphDb.queryStartupHighlights).toHaveBeenCalledWith(3);
  });

  it('returns missing graph state and null continuity when dependencies fail', () => {
    vi.mocked(graphDb.getStats).mockImplementationOnce(() => {
      throw new Error('DB unavailable');
    });
    vi.mocked(hookState.loadMostRecentState).mockReturnValueOnce(null);

    const brief = buildStartupBrief();
    expect(brief.graphState).toBe('missing');
    expect(brief.graphSummary).toBeNull();
    expect(brief.graphOutline).toBeNull();
    expect(brief.sessionContinuity).toBeNull();
    expect(brief.startupSurface).toContain('- Memory: startup summary only (resume on demand)');
    expect(brief.startupSurface).toContain('- Code Graph: unavailable');
    expect(brief.sharedPayload).toBeNull();
  });
});
