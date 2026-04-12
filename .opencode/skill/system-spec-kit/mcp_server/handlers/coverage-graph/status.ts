// ───────────────────────────────────────────────────────────────
// MODULE: Coverage Graph Status Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for deep_loop_graph_status — reports graph
// health, counts, relation breakdowns, and signal summaries.

import type { LoopType, Namespace } from '../../lib/coverage-graph/coverage-graph-db.js';
import {
  computeScopedMomentum,
  computeScopedSignals,
  computeScopedStats,
} from './convergence.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface StatusArgs {
  specFolder: string;
  loopType: LoopType;
  sessionId: string;
}

// ───────────────────────────────────────────────────────────────
// 2. HANDLER
// ───────────────────────────────────────────────────────────────

/** Handle deep_loop_graph_status tool call */
export async function handleCoverageGraphStatus(
  args: StatusArgs,
): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    if (!args.specFolder || typeof args.specFolder !== 'string') {
      return errorResponse('specFolder is required');
    }
    if (args.loopType !== 'research' && args.loopType !== 'review') {
      return errorResponse('loopType must be "research" or "review"');
    }
    if (!args.sessionId || typeof args.sessionId !== 'string') {
      return errorResponse('sessionId is required for non-admin reads');
    }

    const ns: Namespace = {
      specFolder: args.specFolder,
      loopType: args.loopType,
      sessionId: args.sessionId,
    };
    const stats = computeScopedStats(ns);

    // Compute current signals (safe for empty graphs)
    let signals = null;
    let momentum = null;

    if (stats.totalNodes > 0) {
      try {
        signals = computeScopedSignals(ns);
        momentum = computeScopedMomentum(ns);
      } catch {
        // Non-blocking: continue with null signals
      }
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: {
            namespace: {
              specFolder: args.specFolder,
              loopType: args.loopType,
              sessionId: args.sessionId,
            },
            scopeMode: 'session',
            notes: ['Status metrics were computed from the session-scoped subgraph only.'],
            totalNodes: stats.totalNodes,
            totalEdges: stats.totalEdges,
            nodesByKind: stats.nodesByKind,
            edgesByRelation: stats.edgesByRelation,
            lastIteration: stats.lastIteration,
            signals,
            momentum,
          },
        }, null, 2),
      }],
    };
  } catch (err: unknown) {
    return errorResponse(
      `Status check failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

function errorResponse(error: string): { content: Array<{ type: string; text: string }> } {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'error', error }),
    }],
  };
}
