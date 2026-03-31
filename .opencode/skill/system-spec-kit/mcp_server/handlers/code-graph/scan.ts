// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Scan Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_scan — indexes workspace files.

import { readFileSync } from 'node:fs';
import type { ParseResult } from '../../lib/code-graph/indexer-types.js';
import { generateContentHash, detectLanguage, getDefaultConfig } from '../../lib/code-graph/indexer-types.js';
import { parseFile, indexFiles } from '../../lib/code-graph/structural-indexer.js';
import * as graphDb from '../../lib/code-graph/code-graph-db.js';

export interface ScanArgs {
  rootDir?: string;
  includeGlobs?: string[];
  excludeGlobs?: string[];
  incremental?: boolean;
}

export interface ScanResult {
  filesScanned: number;
  filesIndexed: number;
  filesSkipped: number;
  totalNodes: number;
  totalEdges: number;
  errors: string[];
  durationMs: number;
}

/** Handle code_graph_scan tool call */
export async function handleCodeGraphScan(args: ScanArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
  const startTime = Date.now();
  const rootDir = args.rootDir ?? process.cwd();
  const incremental = args.incremental !== false;

  const config = getDefaultConfig(rootDir);
  if (args.includeGlobs) config.includeGlobs = args.includeGlobs;
  if (args.excludeGlobs) config.excludeGlobs = [...config.excludeGlobs, ...args.excludeGlobs];

  const results = await indexFiles(config);

  let filesIndexed = 0;
  let filesSkipped = 0;
  let totalNodes = 0;
  let totalEdges = 0;
  const errors: string[] = [];

  for (const result of results) {
    // Skip unchanged files in incremental mode
    if (incremental && !graphDb.isFileStale(result.filePath, result.contentHash)) {
      filesSkipped++;
      continue;
    }

    try {
      const fileId = graphDb.upsertFile(
        result.filePath, result.language, result.contentHash,
        result.nodes.length, result.edges.length,
        result.parseHealth, result.parseDurationMs,
      );
      graphDb.replaceNodes(fileId, result.nodes);
      const sourceIds = result.nodes.map(n => n.symbolId);
      graphDb.replaceEdges(sourceIds, result.edges);

      filesIndexed++;
      totalNodes += result.nodes.length;
      totalEdges += result.edges.length;
    } catch (err) {
      errors.push(`${result.filePath}: ${err instanceof Error ? err.message : String(err)}`);
    }

    if (result.parseErrors.length > 0) {
      errors.push(...result.parseErrors.map(e => `${result.filePath}: ${e}`));
    }
  }

  const scanResult: ScanResult = {
    filesScanned: results.length,
    filesIndexed,
    filesSkipped,
    totalNodes,
    totalEdges,
    errors: errors.slice(0, 10),
    durationMs: Date.now() - startTime,
  };

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: scanResult }, null, 2),
    }],
  };
}
