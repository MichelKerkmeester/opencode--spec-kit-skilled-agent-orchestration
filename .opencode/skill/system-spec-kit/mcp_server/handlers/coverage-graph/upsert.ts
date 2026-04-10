// ───────────────────────────────────────────────────────────────
// MODULE: Coverage Graph Upsert Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for deep_loop_graph_upsert — idempotent
// node/edge upsert with self-loop rejection and weight clamping.

import {
  upsertNode,
  upsertEdge,
  batchUpsert,
  clampWeight,
  VALID_KINDS,
  VALID_RELATIONS,
  type CoverageNode,
  type CoverageEdge,
  type LoopType,
  type NodeKind,
  type Relation,
} from '../../lib/coverage-graph/coverage-graph-db.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface UpsertArgs {
  specFolder: string;
  loopType: LoopType;
  sessionId: string;
  nodes?: Array<{
    id: string;
    kind: string;
    name: string;
    contentHash?: string;
    iteration?: number;
    metadata?: Record<string, unknown>;
  }>;
  edges?: Array<{
    id: string;
    sourceId: string;
    targetId: string;
    relation: string;
    weight?: number;
    metadata?: Record<string, unknown>;
  }>;
}

// ───────────────────────────────────────────────────────────────
// 2. VALIDATION
// ───────────────────────────────────────────────────────────────

function validateLoopType(loopType: string): loopType is LoopType {
  return loopType === 'research' || loopType === 'review';
}

function validateNodeKind(loopType: LoopType, kind: string): boolean {
  return VALID_KINDS[loopType].includes(kind);
}

function validateRelation(loopType: LoopType, relation: string): boolean {
  return VALID_RELATIONS[loopType].includes(relation);
}

// ───────────────────────────────────────────────────────────────
// 3. HANDLER
// ───────────────────────────────────────────────────────────────

/** Handle deep_loop_graph_upsert tool call */
export async function handleCoverageGraphUpsert(
  args: UpsertArgs,
): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    // Validate required fields
    if (!args.specFolder || typeof args.specFolder !== 'string') {
      return errorResponse('specFolder is required and must be a string');
    }
    if (!validateLoopType(args.loopType)) {
      return errorResponse('loopType must be "research" or "review"');
    }
    if (!args.sessionId || typeof args.sessionId !== 'string') {
      return errorResponse('sessionId is required and must be a string');
    }

    const inputNodes = args.nodes ?? [];
    const inputEdges = args.edges ?? [];

    if (inputNodes.length === 0 && inputEdges.length === 0) {
      return errorResponse('At least one node or edge must be provided');
    }

    // Validate and build node objects
    const validationErrors: string[] = [];
    const nodes: CoverageNode[] = [];

    for (const n of inputNodes) {
      if (!n.id || typeof n.id !== 'string') {
        validationErrors.push(`Node missing required id`);
        continue;
      }
      if (!validateNodeKind(args.loopType, n.kind)) {
        validationErrors.push(`Invalid node kind "${n.kind}" for loop type "${args.loopType}". Valid: ${VALID_KINDS[args.loopType].join(', ')}`);
        continue;
      }
      if (!n.name || typeof n.name !== 'string') {
        validationErrors.push(`Node "${n.id}" missing required name`);
        continue;
      }

      nodes.push({
        id: n.id,
        specFolder: args.specFolder,
        loopType: args.loopType,
        sessionId: args.sessionId,
        kind: n.kind as NodeKind,
        name: n.name,
        contentHash: n.contentHash,
        iteration: n.iteration,
        metadata: n.metadata,
      });
    }

    // Validate and build edge objects
    const edges: CoverageEdge[] = [];
    const rejectedSelfLoops: string[] = [];

    for (const e of inputEdges) {
      if (!e.id || typeof e.id !== 'string') {
        validationErrors.push(`Edge missing required id`);
        continue;
      }
      if (!e.sourceId || !e.targetId) {
        validationErrors.push(`Edge "${e.id}" missing sourceId or targetId`);
        continue;
      }
      if (e.sourceId === e.targetId) {
        rejectedSelfLoops.push(e.id);
        continue;
      }
      if (!validateRelation(args.loopType, e.relation)) {
        validationErrors.push(`Invalid relation "${e.relation}" for loop type "${args.loopType}". Valid: ${VALID_RELATIONS[args.loopType].join(', ')}`);
        continue;
      }

      edges.push({
        id: e.id,
        specFolder: args.specFolder,
        loopType: args.loopType,
        sourceId: e.sourceId,
        targetId: e.targetId,
        relation: e.relation as Relation,
        weight: clampWeight(e.weight ?? 1.0),
        metadata: e.metadata,
      });
    }

    // Execute batch upsert
    const result = batchUpsert(nodes, edges);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: {
            insertedNodes: result.insertedNodes,
            insertedEdges: result.insertedEdges,
            rejectedEdges: result.rejectedEdges,
            rejectedSelfLoops,
            validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
            namespace: {
              specFolder: args.specFolder,
              loopType: args.loopType,
              sessionId: args.sessionId,
            },
          },
        }, null, 2),
      }],
    };
  } catch (err: unknown) {
    return errorResponse(
      `Upsert failed: ${err instanceof Error ? err.message : String(err)}`,
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
