// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Status Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_status — reports graph health.

import * as graphDb from '../../lib/code-graph/code-graph-db.js';

/** Handle code_graph_status tool call */
export async function handleCodeGraphStatus(): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    const stats = graphDb.getStats();
    const d = graphDb.getDb();

    // Get stale file count (files that exist in DB but may need re-indexing)
    const staleCount = (d.prepare(`
      SELECT COUNT(*) as c FROM code_files
      WHERE parse_health = 'error' OR parse_health = 'recovered'
    `).get() as { c: number }).c;

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: {
            totalFiles: stats.totalFiles,
            totalNodes: stats.totalNodes,
            totalEdges: stats.totalEdges,
            staleFiles: staleCount,
            lastScanAt: stats.lastScanTimestamp,
            dbFileSize: stats.dbFileSize,
            schemaVersion: stats.schemaVersion,
            nodesByKind: stats.nodesByKind,
            edgesByType: stats.edgesByType,
            parseHealth: stats.parseHealthSummary,
          },
        }, null, 2),
      }],
    };
  } catch (err) {
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
