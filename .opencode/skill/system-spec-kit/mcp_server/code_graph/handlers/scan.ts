// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Scan Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_scan — indexes workspace files.

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { basename, isAbsolute, relative, resolve } from 'node:path';
import { buildEdgeDistribution, computeEdgeShare } from '../lib/edge-drift.js';
import { getDefaultConfig, type DetectorProvenance, type CodeEdge } from '../lib/indexer-types.js';
import { indexFiles } from '../lib/structural-indexer.js';
import * as graphDb from '../lib/code-graph-db.js';
import { persistIndexedFileResult } from '../lib/ensure-ready.js';
import {
  DEFAULT_GOLD_BATTERY_PATH,
  executeBattery,
  loadGoldBattery,
  type VerifyResult,
} from '../lib/gold-query-verifier.js';
import { isRecord } from '../lib/query-result-adapter.js';
import { buildReadinessBlock } from '../lib/readiness-contract.js';
import { canonicalizeWorkspacePaths, isWithinWorkspace } from '../lib/utils/workspace-path.js';
import { resolveIndexScopePolicy } from '../lib/index-scope-policy.js';
import { handleCodeGraphQuery } from './query.js';

export interface ScanArgs {
  rootDir?: string;
  includeGlobs?: string[];
  excludeGlobs?: string[];
  incremental?: boolean;
  includeSkills?: boolean;
  verify?: boolean;
  persistBaseline?: boolean;
}

export interface ScanResult {
  filesScanned: number;
  filesIndexed: number;
  filesSkipped: number;
  totalNodes: number;
  totalEdges: number;
  errors: string[];
  durationMs: number;
  fullScanRequested: boolean;
  effectiveIncremental: boolean;
  fullReindexTriggered?: boolean;
  currentGitHead?: string | null;
  previousGitHead?: string | null;
  detectorProvenanceSummary?: graphDb.DetectorProvenanceSummary;
  graphEdgeEnrichmentSummary?: graphDb.GraphEdgeEnrichmentSummary | null;
  warnings: string[];
  capExceeded: {
    maxNodes: boolean;
    depth: boolean;
    gitignoreSize: boolean;
  };
  verification?: VerifyResult;
}

function summarizeDetectorProvenance(
  results: Array<{ detectorProvenance?: DetectorProvenance }>,
): graphDb.DetectorProvenanceSummary {
  const counts: Partial<Record<DetectorProvenance, number>> = {};
  let dominant: DetectorProvenance | 'unknown' = 'unknown';
  let dominantCount = 0;

  for (const result of results) {
    if (!result.detectorProvenance) {
      continue;
    }
    const nextCount = (counts[result.detectorProvenance] ?? 0) + 1;
    counts[result.detectorProvenance] = nextCount;
    if (nextCount > dominantCount) {
      dominantCount = nextCount;
      dominant = result.detectorProvenance;
    }
  }

  return { dominant, counts };
}

function summarizeGraphEdgeEnrichment(
  results: Array<{ edges: CodeEdge[] }>,
): graphDb.GraphEdgeEnrichmentSummary | null {
  let best: graphDb.GraphEdgeEnrichmentSummary | null = null;

  for (const result of results) {
    for (const edge of result.edges) {
      const metadata = edge.metadata;
      if (!metadata || typeof metadata.confidence !== 'number') {
        continue;
      }

      const edgeEvidenceClass = (() => {
        switch (edge.edgeType) {
          case 'IMPORTS':
          case 'EXPORTS':
            return 'import' as const;
          case 'EXTENDS':
          case 'IMPLEMENTS':
          case 'TYPE_OF':
            return 'type_reference' as const;
          case 'TESTED_BY':
            return 'test_coverage' as const;
          default:
            return metadata.detectorProvenance === 'heuristic' || metadata.evidenceClass === 'INFERRED'
              ? 'inferred_heuristic' as const
              : 'direct_call' as const;
        }
      })();

      if (!best || metadata.confidence > best.numericConfidence) {
        best = {
          edgeEvidenceClass,
          numericConfidence: metadata.confidence,
        };
      }
    }
  }

  return best;
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

function cleanupMissingTrackedFiles(filePaths: string[]): void {
  for (const filePath of filePaths) {
    if (existsSync(filePath)) {
      continue;
    }

    graphDb.removeFile(filePath);
  }
}

function summarizeEdgeDistribution(results: Array<{ edges: CodeEdge[] }>) {
  const edgeCounts = buildEdgeDistribution();

  for (const result of results) {
    for (const edge of result.edges) {
      edgeCounts[edge.edgeType] += 1;
    }
  }

  return computeEdgeShare(edgeCounts);
}

function hasUsablePersistedEdgeDistributionBaseline(): boolean {
  const rawBaseline = graphDb.getCodeGraphMetadata('edge_distribution_baseline');
  if (!rawBaseline) {
    return false;
  }

  try {
    const parsedBaseline = JSON.parse(rawBaseline) as unknown;
    if (!isRecord(parsedBaseline)) {
      return false;
    }

    buildEdgeDistribution(parsedBaseline);
    return true;
  } catch {
    return false;
  }
}

function relativize(absPath: string, workspaceRoot: string): string {
  const resolvedPath = resolve(absPath);
  const resolvedWorkspace = resolve(workspaceRoot);
  const workspaceRelative = relative(resolvedWorkspace, resolvedPath);
  if (workspaceRelative === '') {
    return '.';
  }
  if (!workspaceRelative.startsWith('..') && !isAbsolute(workspaceRelative)) {
    return workspaceRelative;
  }
  return basename(resolvedPath);
}

function relativizeScanWarning(warning: string, workspaceRoot: string): string {
  return warning.replace(/\/[^\s'"`{}\[\],)]+/g, match => relativize(match, workspaceRoot));
}

/** Handle code_graph_scan tool call */
export async function handleCodeGraphScan(args: ScanArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
  const startTime = Date.now();
  const rootDir = args.rootDir ?? process.cwd();
  const incremental = args.incremental !== false;
  const resolvedRootDir = resolve(rootDir);

  // SECURITY: Canonicalize paths via realpathSync() to prevent symlink bypass.
  // A symlink inside the workspace pointing outside it would pass a lexical
  // startsWith() check on the resolved (but not canonicalized) path.
  const canonical = canonicalizeWorkspacePaths(resolvedRootDir);
  if (!canonical) {
    // Broken symlink or non-existent path — reject immediately
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: `rootDir path is invalid or contains a broken symlink: ${relativize(resolvedRootDir, process.cwd())}`,
        }),
      }],
    };
  }
  const { canonicalWorkspace, canonicalRootDir } = canonical;

  if (!isWithinWorkspace(canonicalWorkspace, canonicalRootDir)) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: `rootDir must stay within the workspace root; received: ${relativize(canonicalRootDir, canonicalWorkspace)}`,
        }),
      }],
    };
  }

  const scopePolicy = resolveIndexScopePolicy({ includeSkills: args.includeSkills });
  const config = getDefaultConfig(canonicalRootDir, scopePolicy);
  if (args.includeGlobs) config.includeGlobs = args.includeGlobs;
  if (args.excludeGlobs) config.excludeGlobs = [...config.excludeGlobs, ...args.excludeGlobs];

  const previousGitHead = graphDb.getLastGitHead();
  const currentGitHead = getCurrentGitHead(canonicalRootDir);
  const fullReindexTriggered = incremental
    && previousGitHead !== null
    && currentGitHead !== null
    && previousGitHead !== currentGitHead;
  const effectiveIncremental = incremental && !fullReindexTriggered;

  if (fullReindexTriggered) {
    console.error(`[code-graph-scan] Git HEAD changed (${previousGitHead} -> ${currentGitHead}); forcing full reindex`);
  }

  const results = await indexFiles(config, { skipFreshFiles: effectiveIncremental });
  const detectorProvenanceSummary = summarizeDetectorProvenance(results);
  const graphEdgeEnrichmentSummary = summarizeGraphEdgeEnrichment(results);
  const preParseSkippedCount = effectiveIncremental ? (results.preParseSkippedCount ?? 0) : 0;

  let filesIndexed = 0;
  let filesSkipped = preParseSkippedCount;
  let totalNodes = 0;
  let totalEdges = 0;
  const errors: string[] = [];

  if (effectiveIncremental) {
    cleanupMissingTrackedFiles(graphDb.getTrackedFiles());
  } else {
    const indexedPaths = new Set(results.map((result) => result.filePath));
    for (const filePath of graphDb.getTrackedFiles()) {
      if (!indexedPaths.has(filePath)) {
        graphDb.removeFile(filePath);
      }
    }
  }

  for (const result of results) {
    // Skip unchanged files in incremental mode
    if (
      effectiveIncremental
      && !graphDb.isFileStale(
        result.filePath,
        result.contentHash ? { currentContentHash: result.contentHash } : undefined,
      )
    ) {
      filesSkipped++;
      continue;
    }

    try {
      persistIndexedFileResult(result);

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

  if (filesIndexed > 0 && results.length > 0) {
    graphDb.setLastDetectorProvenance(results[0].detectorProvenance);
  }

  if (currentGitHead) {
    graphDb.setLastGitHead(currentGitHead);
  }
  if (detectorProvenanceSummary.dominant !== 'unknown') {
    graphDb.setLastDetectorProvenance(detectorProvenanceSummary.dominant);
  }
  graphDb.setLastDetectorProvenanceSummary(detectorProvenanceSummary);
  graphDb.setCodeGraphScope(scopePolicy);
  if (filesIndexed > 0 && graphEdgeEnrichmentSummary) {
    graphDb.setLastGraphEdgeEnrichmentSummary(graphEdgeEnrichmentSummary);
  } else if (filesIndexed > 0) {
    graphDb.clearLastGraphEdgeEnrichmentSummary();
  }

  const hasPersistedBaseline = hasUsablePersistedEdgeDistributionBaseline();
  if (
    !effectiveIncremental
    && errors.length === 0
    && (!hasPersistedBaseline || args.persistBaseline === true)
  ) {
    const distribution = summarizeEdgeDistribution(results);
    graphDb.setCodeGraphMetadata('edge_distribution_baseline', JSON.stringify(distribution));
  }

  const scanResult: ScanResult = {
    filesScanned: results.length,
    filesIndexed,
    filesSkipped,
    totalNodes,
    totalEdges,
    errors: errors.slice(0, 10),
    durationMs: Date.now() - startTime,
    fullScanRequested: args.incremental === false,
    effectiveIncremental,
    fullReindexTriggered,
    currentGitHead,
    previousGitHead,
    detectorProvenanceSummary,
    graphEdgeEnrichmentSummary,
    warnings: (results.warnings ?? []).map(warning => relativizeScanWarning(warning, canonicalWorkspace)),
    capExceeded: results.capExceeded ?? { maxNodes: false, depth: false, gitignoreSize: false },
  };
  const lastPersistedAt = graphDb.getStats().lastScanTimestamp;
  const shouldVerify = args.verify === true && incremental === false;

  if (shouldVerify) {
    const verification = {
      ...(await executeBattery(loadGoldBattery(DEFAULT_GOLD_BATTERY_PATH), handleCodeGraphQuery)),
      batteryPath: DEFAULT_GOLD_BATTERY_PATH,
    };
    graphDb.setLastGoldVerification(verification);
    scanResult.verification = verification;
  }

  const readinessBlock = buildReadinessBlock({
    freshness: lastPersistedAt ? 'fresh' : 'empty',
    action: fullReindexTriggered || !effectiveIncremental ? 'full_scan' : 'selective_reindex',
    inlineIndexPerformed: true,
    reason: lastPersistedAt
      ? 'scan completed and persisted current graph state'
      : 'scan completed but no graph data was persisted',
  });

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        status: 'ok',
        data: {
          ...scanResult,
          readiness: readinessBlock,
          canonicalReadiness: readinessBlock.canonicalReadiness,
          trustState: readinessBlock.trustState,
          lastPersistedAt,
        },
      }, null, 2),
    }],
  };
}
