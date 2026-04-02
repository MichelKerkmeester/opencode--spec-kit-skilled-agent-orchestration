// ───────────────────────────────────────────────────────────────
// MODULE: Startup Brief Builder
// ───────────────────────────────────────────────────────────────
// Phase 026: Build a compact startup brief for hook-capable runtimes
// from local code graph + hook state (no MCP round-trip).

import { getStats, queryStartupHighlights, type StartupHighlight } from './code-graph-db.js';
import { loadMostRecentState } from '../../hooks/claude/hook-state.js';

export interface StartupGraphSummary {
  files: number;
  nodes: number;
  edges: number;
  lastScan: string | null;
}

export interface StartupBriefResult {
  graphOutline: string | null;
  sessionContinuity: string | null;
  graphSummary: StartupGraphSummary | null;
  graphState: 'ready' | 'empty' | 'missing';
}

const SUMMARY_MAX_CHARS = 240;

function truncateInline(text: string, maxChars: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxChars) {
    return normalized;
  }
  return normalized.slice(0, maxChars - 3).trimEnd() + '...';
}

function compactPath(filePath: string): string {
  const parts = filePath.replace(/\\/g, '/').split('/').filter(Boolean);
  if (parts.length <= 3) {
    return parts.join('/');
  }
  return parts.slice(-3).join('/');
}

function formatHighlight(highlight: StartupHighlight): string {
  const callSuffix = highlight.callCount > 0 ? ` [calls: ${highlight.callCount}]` : '';
  return `- ${highlight.name} (${highlight.kind}) - ${compactPath(highlight.filePath)}${callSuffix}`;
}

function buildGraphOutline(highlightCount: number = 5): Pick<StartupBriefResult, 'graphOutline' | 'graphSummary' | 'graphState'> {
  try {
    const stats = getStats();
    const graphSummary: StartupGraphSummary = {
      files: stats.totalFiles,
      nodes: stats.totalNodes,
      edges: stats.totalEdges,
      lastScan: stats.lastScanTimestamp,
    };

    if (stats.totalFiles <= 0 || stats.totalNodes <= 0) {
      return {
        graphOutline: null,
        graphSummary,
        graphState: 'empty',
      };
    }

    // Keep startup highlights small by default so graph context stays useful without crowding the token budget.
    const highlights = queryStartupHighlights(highlightCount);
    const lines: string[] = [
      `${stats.totalFiles} files, ${stats.totalNodes} nodes, ${stats.totalEdges} edges.`,
      `Last scan: ${stats.lastScanTimestamp ?? 'unknown'}`,
    ];
    if (highlights.length > 0) {
      lines.push('Orientation: use code graph highlights for structural entry points and call paths; use CocoIndex for semantic discovery when the symbol or file is still unknown.');
      lines.push('Highlights:');
      lines.push(...highlights.map(formatHighlight));
    }

    return {
      graphOutline: lines.join('\n'),
      graphSummary,
      graphState: 'ready',
    };
  } catch {
    return {
      graphOutline: null,
      graphSummary: null,
      graphState: 'missing',
    };
  }
}

function buildSessionContinuity(): string | null {
  const state = loadMostRecentState();
  if (!state) {
    return null;
  }

  const parts: string[] = [];
  if (state.lastSpecFolder) {
    parts.push(`Last session worked on: ${state.lastSpecFolder}`);
  }
  if (state.sessionSummary?.text) {
    parts.push(`Summary: ${truncateInline(state.sessionSummary.text, SUMMARY_MAX_CHARS)}`);
  }
  return parts.length > 0 ? parts.join('\n') : null;
}

export function buildStartupBrief(highlightCount?: number): StartupBriefResult {
  const graph = buildGraphOutline(highlightCount);
  return {
    graphOutline: graph.graphOutline,
    sessionContinuity: buildSessionContinuity(),
    graphSummary: graph.graphSummary,
    graphState: graph.graphState,
  };
}
