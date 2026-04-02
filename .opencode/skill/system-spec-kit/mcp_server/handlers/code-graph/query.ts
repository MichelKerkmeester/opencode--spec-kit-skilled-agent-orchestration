// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Query Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_query — queries structural relationships.

import * as graphDb from '../../lib/code-graph/code-graph-db.js';
import { ensureCodeGraphReady } from '../../lib/code-graph/ensure-ready.js';

export interface QueryArgs {
  operation: 'outline' | 'calls_from' | 'calls_to' | 'imports_from' | 'imports_to';
  subject: string; // filePath, fqName, or symbolId
  edgeType?: string;
  limit?: number;
  includeTransitive?: boolean;
  maxDepth?: number;
}

function resolveRequestedEdgeType(args: QueryArgs): string | undefined {
  if (typeof args.edgeType === 'string' && args.edgeType.trim().length > 0) {
    return args.edgeType.trim().toUpperCase();
  }

  if (args.operation.startsWith('calls')) {
    return 'CALLS';
  }

  if (args.operation.startsWith('imports')) {
    return 'IMPORTS';
  }

  return undefined;
}

/** Resolve a subject string to a symbolId */
function resolveSubject(subject: string): string | null {
  const d = graphDb.getDb();

  // Try as symbolId first
  const byId = d.prepare('SELECT symbol_id FROM code_nodes WHERE symbol_id = ?').get(subject) as { symbol_id: string } | undefined;
  if (byId) return byId.symbol_id;

  // Try as fqName
  const byFq = d.prepare('SELECT symbol_id FROM code_nodes WHERE fq_name = ? LIMIT 1').get(subject) as { symbol_id: string } | undefined;
  if (byFq) return byFq.symbol_id;

  // Try as name
  const byName = d.prepare('SELECT symbol_id FROM code_nodes WHERE name = ? LIMIT 1').get(subject) as { symbol_id: string } | undefined;
  if (byName) return byName.symbol_id;

  return null;
}

/** BFS transitive traversal from a symbolId via the given edge type */
function transitiveTraversal(
  startId: string,
  edgeType: string,
  direction: 'from' | 'to',
  maxDepth: number,
  limit: number,
): Array<{ symbolId: string; fqName: string | null; filePath: string | null; line: number | null; depth: number }> {
  const visited = new Set<string>();
  const resultSymbolIds = new Set<string>();
  const results: Array<{ symbolId: string; fqName: string | null; filePath: string | null; line: number | null; depth: number }> = [];
  let frontier = [{ id: startId, depth: 0 }];

  while (frontier.length > 0 && results.length < limit) {
    const next: typeof frontier = [];
    for (const item of frontier) {
      if (visited.has(item.id) || item.depth >= maxDepth) continue;
      visited.add(item.id);

      if (direction === 'from') {
        for (const { edge, targetNode } of graphDb.queryEdgesFrom(item.id, edgeType)) {
          if (!visited.has(edge.targetId)) {
            if (!resultSymbolIds.has(edge.targetId)) {
              resultSymbolIds.add(edge.targetId);
              results.push({
                symbolId: edge.targetId,
                fqName: targetNode?.fqName ?? null,
                filePath: targetNode?.filePath ?? null,
                line: targetNode?.startLine ?? null,
                depth: item.depth + 1,
              });
            }
            if (results.length >= limit) break;
            next.push({ id: edge.targetId, depth: item.depth + 1 });
          }
        }
      } else {
        for (const { edge, sourceNode } of graphDb.queryEdgesTo(item.id, edgeType)) {
          if (!visited.has(edge.sourceId)) {
            if (!resultSymbolIds.has(edge.sourceId)) {
              resultSymbolIds.add(edge.sourceId);
              results.push({
                symbolId: edge.sourceId,
                fqName: sourceNode?.fqName ?? null,
                filePath: sourceNode?.filePath ?? null,
                line: sourceNode?.startLine ?? null,
                depth: item.depth + 1,
              });
            }
            if (results.length >= limit) break;
            next.push({ id: edge.sourceId, depth: item.depth + 1 });
          }
        }
      }

      if (results.length >= limit) break;
    }
    frontier = next;
  }

  return results.slice(0, limit);
}

/** Handle code_graph_query tool call */
export async function handleCodeGraphQuery(args: QueryArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
  // Auto-trigger: ensure graph is fresh before querying
  try {
    await ensureCodeGraphReady(process.cwd(), { allowInlineIndex: false });
  } catch {
    // Non-blocking: continue with potentially stale data
  }

  const { operation, subject, limit = 50 } = args;
  const requestedEdgeType = resolveRequestedEdgeType(args);

  if (operation === 'outline') {
    const nodes = graphDb.queryOutline(subject);
    const limited = nodes.slice(0, limit);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: {
            operation: 'outline',
            filePath: subject,
            nodeCount: limited.length,
            nodes: limited.map(n => ({
              name: n.name,
              kind: n.kind,
              fqName: n.fqName,
              line: n.startLine,
              signature: n.signature,
              symbolId: n.symbolId,
            })),
          },
        }, null, 2),
      }],
    };
  }

  const symbolId = resolveSubject(subject);
  if (!symbolId) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ status: 'error', error: `Could not resolve subject: ${subject}` }),
      }],
    };
  }

  const maxDepth = args.maxDepth ?? 3;

  // If includeTransitive, use BFS traversal instead of 1-hop
  if (args.includeTransitive) {
    const direction = operation.endsWith('from') ? 'from' : 'to';
    const transitive = transitiveTraversal(symbolId, requestedEdgeType ?? 'CALLS', direction, maxDepth, limit);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: { operation, symbolId, edgeType: requestedEdgeType, transitive: true, maxDepth, nodes: transitive },
        }, null, 2),
      }],
    };
  }

  let result;
  switch (operation) {
    case 'calls_from': {
      const edges = graphDb.queryEdgesFrom(symbolId, requestedEdgeType).slice(0, limit);
      result = { operation, symbolId, edgeType: requestedEdgeType, edges: edges.map(e => ({ target: e.targetNode?.fqName ?? e.edge.targetId, file: e.targetNode?.filePath, line: e.targetNode?.startLine })) };
      break;
    }
    case 'calls_to': {
      const edges = graphDb.queryEdgesTo(symbolId, requestedEdgeType).slice(0, limit);
      result = { operation, symbolId, edgeType: requestedEdgeType, edges: edges.map(e => ({ source: e.sourceNode?.fqName ?? e.edge.sourceId, file: e.sourceNode?.filePath, line: e.sourceNode?.startLine })) };
      break;
    }
    case 'imports_from': {
      const edges = graphDb.queryEdgesFrom(symbolId, requestedEdgeType).slice(0, limit);
      result = { operation, symbolId, edgeType: requestedEdgeType, edges: edges.map(e => ({ target: e.targetNode?.fqName ?? e.edge.targetId, file: e.targetNode?.filePath })) };
      break;
    }
    case 'imports_to': {
      const edges = graphDb.queryEdgesTo(symbolId, requestedEdgeType).slice(0, limit);
      result = { operation, symbolId, edgeType: requestedEdgeType, edges: edges.map(e => ({ source: e.sourceNode?.fqName ?? e.edge.sourceId, file: e.sourceNode?.filePath })) };
      break;
    }
    default:
      return { content: [{ type: 'text', text: JSON.stringify({ status: 'error', error: `Unknown operation: ${operation}` }) }] };
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
    }],
  };
}
