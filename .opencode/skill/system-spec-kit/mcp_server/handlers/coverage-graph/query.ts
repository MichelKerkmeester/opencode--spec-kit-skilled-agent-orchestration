// ───────────────────────────────────────────────────────────────
// MODULE: Coverage Graph Query Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for deep_loop_graph_query — structured analysis
// of coverage graph state.

import type { LoopType, Namespace } from '../../lib/coverage-graph/coverage-graph-db.js';
import {
  findCoverageGaps,
  findContradictions,
  findProvenanceChain,
  findUnverifiedClaims,
  rankHotNodes,
} from '../../lib/coverage-graph/coverage-graph-query.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type QueryType =
  | 'uncovered_questions'
  | 'unverified_claims'
  | 'contradictions'
  | 'provenance_chain'
  | 'coverage_gaps'
  | 'hot_nodes';

export interface QueryArgs {
  specFolder: string;
  loopType: LoopType;
  queryType: QueryType;
  nodeId?: string;
  sessionId: string;
  limit?: number;
  maxDepth?: number;
}

// ───────────────────────────────────────────────────────────────
// 2. HANDLER
// ───────────────────────────────────────────────────────────────

/** Handle deep_loop_graph_query tool call */
export async function handleCoverageGraphQuery(
  args: QueryArgs,
): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    // Validate required fields
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

    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200);

    switch (args.queryType) {
      case 'uncovered_questions':
      case 'coverage_gaps': {
        const gaps = findCoverageGaps(ns);
        return okResponse({
          queryType: args.queryType,
          namespace: buildNamespacePayload(ns),
          scopeMode: 'session',
          gaps: gaps.slice(0, limit),
          totalGaps: gaps.length,
        });
      }

      case 'unverified_claims': {
        const claims = findUnverifiedClaims(ns);
        return okResponse({
          queryType: 'unverified_claims',
          namespace: buildNamespacePayload(ns),
          scopeMode: 'session',
          claims: claims.slice(0, limit).map(c => ({
            id: c.id,
            kind: c.kind,
            name: c.name,
            iteration: c.iteration,
            metadata: c.metadata,
          })),
          totalUnverified: claims.length,
        });
      }

      case 'contradictions': {
        const contradictions = findContradictions(ns);
        return okResponse({
          queryType: 'contradictions',
          namespace: buildNamespacePayload(ns),
          scopeMode: 'session',
          contradictions: contradictions.slice(0, limit),
          totalContradictions: contradictions.length,
        });
      }

      case 'provenance_chain': {
        if (!args.nodeId) {
          return errorResponse('nodeId is required for provenance_chain query');
        }
        const maxDepth = Math.min(Math.max(args.maxDepth ?? 10, 1), 20);
        const chain = findProvenanceChain(ns, args.nodeId, maxDepth);
        return okResponse({
          queryType: 'provenance_chain',
          namespace: buildNamespacePayload(ns),
          scopeMode: 'session',
          rootNodeId: args.nodeId,
          chain: chain.slice(0, limit),
          totalSteps: chain.length,
          maxDepth,
        });
      }

      case 'hot_nodes': {
        const hotNodes = rankHotNodes(ns, limit);
        return okResponse({
          queryType: 'hot_nodes',
          namespace: buildNamespacePayload(ns),
          scopeMode: 'session',
          hotNodes,
          totalReturned: hotNodes.length,
        });
      }

      default:
        return errorResponse(
          `Unknown queryType: "${args.queryType}". Valid types: uncovered_questions, unverified_claims, contradictions, provenance_chain, coverage_gaps, hot_nodes`,
        );
    }
  } catch (err: unknown) {
    return errorResponse(
      `Query failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

function buildNamespacePayload(ns: Namespace): Record<string, unknown> {
  return {
    specFolder: ns.specFolder,
    loopType: ns.loopType,
    ...(ns.sessionId ? { sessionId: ns.sessionId } : {}),
  };
}

// ───────────────────────────────────────────────────────────────
// 3. RESPONSE HELPERS
// ───────────────────────────────────────────────────────────────

function okResponse(data: Record<string, unknown>): { content: Array<{ type: string; text: string }> } {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data }, null, 2),
    }],
  };
}

function errorResponse(error: string): { content: Array<{ type: string; text: string }> } {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'error', error }),
    }],
  };
}
