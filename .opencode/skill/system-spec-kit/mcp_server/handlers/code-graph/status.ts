// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Status Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_status — reports graph health.

import * as graphDb from '../../lib/code-graph/code-graph-db.js';
import { getGraphFreshness } from '../../lib/code-graph/ensure-ready.js';

/** Handle code_graph_status tool call */
export async function handleCodeGraphStatus(): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    const stats = graphDb.getStats();
    const freshness = getGraphFreshness(process.cwd());

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: {
            totalFiles: stats.totalFiles,
            totalNodes: stats.totalNodes,
            totalEdges: stats.totalEdges,
            freshness,
            lastScanAt: stats.lastScanTimestamp,
            lastGitHead: stats.lastGitHead,
            dbFileSize: stats.dbFileSize,
            schemaVersion: stats.schemaVersion,
            nodesByKind: stats.nodesByKind,
            edgesByType: stats.edgesByType,
            parseHealth: stats.parseHealthSummary,
          },
        }, null, 2),
      }],
    };
  } catch (err: unknown) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: `Code graph not initialized: ${err instanceof Error ? err.message : String(err)}`,
        }),
      }],
    };
  }
}
