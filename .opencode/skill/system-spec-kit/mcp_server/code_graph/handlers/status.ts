// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Status Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_status — reports graph health.

import * as graphDb from '../lib/code-graph-db.js';
import { getGraphFreshness } from '../lib/ensure-ready.js';
import { buildReadinessBlock } from '../lib/readiness-contract.js';

/** Handle code_graph_status tool call */
export async function handleCodeGraphStatus(): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    const stats = graphDb.getStats();
    const freshness = getGraphFreshness(process.cwd());
    // PR 4 / F71 step 7: switch on the unified V2 freshness enum so each
    // canonical state has its own status reason (no more V4 string-mapping
    // that swallowed 'error' as 'missing').
    let statusReason: string;
    switch (freshness) {
      case 'fresh':
        statusReason = 'status probe reports graph is ready';
        break;
      case 'stale':
        statusReason = 'status probe reports graph is stale';
        break;
      case 'empty':
        statusReason = 'status probe reports graph is missing';
        break;
      case 'error':
        statusReason = 'status probe crashed; graph is unavailable';
        break;
    }
    const readinessBlock = buildReadinessBlock({
      freshness,
      action: 'none',
      inlineIndexPerformed: false,
      reason: statusReason,
    });

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
            readiness: readinessBlock,
            canonicalReadiness: readinessBlock.canonicalReadiness,
            trustState: readinessBlock.trustState,
            lastScanAt: stats.lastScanTimestamp,
            lastPersistedAt: stats.lastScanTimestamp,
            lastGitHead: stats.lastGitHead,
            dbFileSize: stats.dbFileSize,
            schemaVersion: stats.schemaVersion,
            nodesByKind: stats.nodesByKind,
            edgesByType: stats.edgesByType,
            parseHealth: stats.parseHealthSummary,
            graphQualitySummary: stats.graphQualitySummary,
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
