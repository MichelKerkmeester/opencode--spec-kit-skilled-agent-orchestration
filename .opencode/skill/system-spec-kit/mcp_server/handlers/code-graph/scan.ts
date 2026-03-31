// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Scan Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_scan — indexes workspace files.

import { execSync } from 'node:child_process';
import { resolve, sep } from 'node:path';
import { getDefaultConfig } from '../../lib/code-graph/indexer-types.js';
import { indexFiles } from '../../lib/code-graph/structural-indexer.js';
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
  fullReindexTriggered?: boolean;
  currentGitHead?: string | null;
  previousGitHead?: string | null;
}

function getCurrentGitHead(rootDir: string): string | null {
  try {
    return execSync('git rev-parse HEAD', {
      cwd: rootDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[code-graph-scan] Failed to read git HEAD for ${rootDir}: ${message}`);
    return null;
  }
}

/** Handle code_graph_scan tool call */
export async function handleCodeGraphScan(args: ScanArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
  const startTime = Date.now();
  const rootDir = args.rootDir ?? process.cwd();
  const incremental = args.incremental !== false;
  const workspaceRoot = resolve(process.cwd());
  const resolvedRootDir = resolve(rootDir);
  const workspacePrefix = workspaceRoot.endsWith(sep) ? workspaceRoot : `${workspaceRoot}${sep}`;

  if (resolvedRootDir !== workspaceRoot && !resolvedRootDir.startsWith(workspacePrefix)) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: `rootDir must stay within the workspace root: ${workspaceRoot}`,
        }),
      }],
    };
  }

  const config = getDefaultConfig(resolvedRootDir);
  if (args.includeGlobs) config.includeGlobs = args.includeGlobs;
  if (args.excludeGlobs) config.excludeGlobs = [...config.excludeGlobs, ...args.excludeGlobs];

  const previousGitHead = graphDb.getLastGitHead();
  const currentGitHead = getCurrentGitHead(resolvedRootDir);
  const fullReindexTriggered = incremental
    && previousGitHead !== null
    && currentGitHead !== null
    && previousGitHead !== currentGitHead;
  const effectiveIncremental = incremental && !fullReindexTriggered;

  if (fullReindexTriggered) {
    console.error(`[code-graph-scan] Git HEAD changed (${previousGitHead} -> ${currentGitHead}); forcing full reindex`);
  }

  const results = await indexFiles(config);

  let filesIndexed = 0;
  let filesSkipped = 0;
  let totalNodes = 0;
  let totalEdges = 0;
  const errors: string[] = [];

  if (!effectiveIncremental) {
    const indexedPaths = new Set(results.map((result) => result.filePath));
    const existingRows = graphDb.getDb().prepare('SELECT file_path FROM code_files').all() as Array<{ file_path: string }>;
    for (const row of existingRows) {
      if (!indexedPaths.has(row.file_path)) {
        graphDb.removeFile(row.file_path);
      }
    }
  }

  for (const result of results) {
    // Skip unchanged files in incremental mode
    if (effectiveIncremental && !graphDb.isFileStale(result.filePath)) {
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
    } catch (err: unknown) {
      errors.push(`${result.filePath}: ${err instanceof Error ? err.message : String(err)}`);
    }

    if (result.parseErrors.length > 0) {
      errors.push(...result.parseErrors.map(e => `${result.filePath}: ${e}`));
    }
  }

  if (currentGitHead) {
    graphDb.setLastGitHead(currentGitHead);
  }

  const scanResult: ScanResult = {
    filesScanned: results.length,
    filesIndexed,
    filesSkipped,
    totalNodes,
    totalEdges,
    errors: errors.slice(0, 10),
    durationMs: Date.now() - startTime,
    fullReindexTriggered,
    currentGitHead,
    previousGitHead,
  };

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: scanResult }, null, 2),
    }],
  };
}
