// ───────────────────────────────────────────────────────────────
// MODULE: Coverage Graph Status Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for deep_loop_graph_status — reports graph
// health, counts, relation breakdowns, and signal summaries.

import { getStats, type LoopType } from '../../lib/coverage-graph/coverage-graph-db.js';
import {
  computeSignals,
  computeMomentum,
  type Namespace,
} from '../../lib/coverage-graph/coverage-graph-signals.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface StatusArgs {
  specFolder: string;
  loopType: LoopType;
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

    const stats = getStats(args.specFolder, args.loopType);
    const ns: Namespace = { specFolder: args.specFolder, loopType: args.loopType };

    // Compute current signals (safe for empty graphs)
    let signals = null;
    let momentum = null;

    if (stats.totalNodes > 0) {
      try {
        signals = computeSignals(ns);
        momentum = computeMomentum(args.specFolder, args.loopType);
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
            },
            totalNodes: stats.totalNodes,
            totalEdges: stats.totalEdges,
            nodesByKind: stats.nodesByKind,
            edgesByRelation: stats.edgesByRelation,
            lastIteration: stats.lastIteration,
            schemaVersion: stats.schemaVersion,
            dbFileSize: stats.dbFileSize,
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
