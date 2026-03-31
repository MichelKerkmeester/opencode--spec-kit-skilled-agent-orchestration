// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Query Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_query — queries structural relationships.

import * as graphDb from '../../lib/code-graph/code-graph-db.js';

export interface QueryArgs {
  operation: 'outline' | 'calls_from' | 'calls_to' | 'imports_from' | 'imports_to';
  subject: string; // filePath, fqName, or symbolId
  edgeType?: string;
  limit?: number;
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

/** Handle code_graph_query tool call */
export async function handleCodeGraphQuery(args: QueryArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
  const { operation, subject, limit = 50 } = args;

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

  let result;
  switch (operation) {
    case 'calls_from': {
      const edges = graphDb.queryEdgesFrom(symbolId, 'CALLS').slice(0, limit);
      result = { operation, symbolId, edges: edges.map(e => ({ target: e.targetNode?.fqName ?? e.edge.targetId, file: e.targetNode?.filePath, line: e.targetNode?.startLine })) };
      break;
    }
    case 'calls_to': {
      const edges = graphDb.queryEdgesTo(symbolId, 'CALLS').slice(0, limit);
      result = { operation, symbolId, edges: edges.map(e => ({ source: e.sourceNode?.fqName ?? e.edge.sourceId, file: e.sourceNode?.filePath, line: e.sourceNode?.startLine })) };
      break;
    }
    case 'imports_from': {
      const edges = graphDb.queryEdgesFrom(symbolId, 'IMPORTS').slice(0, limit);
      result = { operation, symbolId, edges: edges.map(e => ({ target: e.targetNode?.fqName ?? e.edge.targetId, file: e.targetNode?.filePath })) };
      break;
    }
    case 'imports_to': {
      const edges = graphDb.queryEdgesTo(symbolId, 'IMPORTS').slice(0, limit);
      result = { operation, symbolId, edges: edges.map(e => ({ source: e.sourceNode?.fqName ?? e.edge.sourceId, file: e.sourceNode?.filePath })) };
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
