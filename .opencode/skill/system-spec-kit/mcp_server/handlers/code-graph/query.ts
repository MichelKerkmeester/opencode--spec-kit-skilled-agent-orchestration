// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Query Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_query — queries structural relationships.

import * as graphDb from '../../lib/code-graph/code-graph-db.js';
import { ensureCodeGraphReady, type ReadyResult } from '../../lib/code-graph/ensure-ready.js';
import type { EdgeType } from '../../lib/code-graph/indexer-types.js';
import {
  attachGraphEdgeEnrichment,
  attachStructuralTrustFields,
  type EdgeEvidenceClass,
  type HotFileBreadcrumb,
} from '../../lib/context/shared-payload.js';

export interface QueryArgs {
  operation: 'outline' | 'calls_from' | 'calls_to' | 'imports_from' | 'imports_to' | 'blast_radius';
  subject: string; // filePath, fqName, or symbolId
  subjects?: string[];
  edgeType?: string;
  limit?: number;
  includeTransitive?: boolean;
  maxDepth?: number;
  unionMode?: 'single' | 'multi';
}

const SUPPORTED_EDGE_TYPES = [
  'CALLS',
  'CONTAINS',
  'DECORATES',
  'EXPORTS',
  'EXTENDS',
  'IMPLEMENTS',
  'IMPORTS',
  'OVERRIDES',
  'TESTED_BY',
  'TYPE_OF',
] as const satisfies readonly EdgeType[];

const SUPPORTED_EDGE_TYPE_SET = new Set<string>(SUPPORTED_EDGE_TYPES);

function isSupportedEdgeType(edgeType: string): edgeType is EdgeType {
  return SUPPORTED_EDGE_TYPE_SET.has(edgeType);
}

function resolveRequestedEdgeType(args: QueryArgs): { edgeType?: EdgeType; error?: string } {
  if (typeof args.edgeType === 'string' && args.edgeType.trim().length > 0) {
    const normalizedEdgeType = args.edgeType.trim().toUpperCase();
    // Reject typoed filters so empty results never masquerade as valid absence.
    if (!isSupportedEdgeType(normalizedEdgeType)) {
      return {
        error: `Unsupported edgeType "${args.edgeType}". Supported edge types: ${SUPPORTED_EDGE_TYPES.join(', ')}`,
      };
    }
    return { edgeType: normalizedEdgeType };
  }

  if (args.operation.startsWith('calls')) {
    return { edgeType: 'CALLS' };
  }

  if (args.operation.startsWith('imports')) {
    return { edgeType: 'IMPORTS' };
  }

  return {};
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

function buildQueryStructuralTrust(readiness: ReadyResult) {
  if (readiness.freshness === 'fresh') {
    return {
      parserProvenance: 'ast',
      evidenceStatus: 'confirmed',
      freshnessAuthority: 'live',
    } as const;
  }

  if (readiness.freshness === 'stale') {
    return {
      parserProvenance: 'ast',
      evidenceStatus: 'probable',
      freshnessAuthority: 'stale',
    } as const;
  }

  return {
    parserProvenance: 'unknown',
    evidenceStatus: 'unverified',
    freshnessAuthority: 'unknown',
  } as const;
}

function buildGraphQueryPayload<T extends Record<string, unknown>>(
  payload: T,
  readiness: ReadyResult,
  label: string,
  graphEdgeEnrichment?: {
    edgeEvidenceClass: EdgeEvidenceClass;
    numericConfidence: number;
  } | null,
) {
  const withTrust = attachStructuralTrustFields({
    ...payload,
    graphMetadata: {
      detectorProvenance: graphDb.getLastDetectorProvenance() ?? 'unknown',
    },
  }, buildQueryStructuralTrust(readiness), { label });

  return graphEdgeEnrichment
    ? attachGraphEdgeEnrichment(withTrust, graphEdgeEnrichment, {
      label: `${label} graph edge enrichment`,
    })
    : withTrust;
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
          const nextDepth = item.depth + 1;
          if (nextDepth > maxDepth) {
            continue;
          }
          if (!visited.has(edge.targetId)) {
            if (!resultSymbolIds.has(edge.targetId)) {
              resultSymbolIds.add(edge.targetId);
              results.push({
                symbolId: edge.targetId,
                fqName: targetNode?.fqName ?? null,
                filePath: targetNode?.filePath ?? null,
                line: targetNode?.startLine ?? null,
                depth: nextDepth,
              });
            }
            if (results.length >= limit) break;
            next.push({ id: edge.targetId, depth: nextDepth });
          }
        }
      } else {
        for (const { edge, sourceNode } of graphDb.queryEdgesTo(item.id, edgeType)) {
          const nextDepth = item.depth + 1;
          if (nextDepth > maxDepth) {
            continue;
          }
          if (!visited.has(edge.sourceId)) {
            if (!resultSymbolIds.has(edge.sourceId)) {
              resultSymbolIds.add(edge.sourceId);
              results.push({
                symbolId: edge.sourceId,
                fqName: sourceNode?.fqName ?? null,
                filePath: sourceNode?.filePath ?? null,
                line: sourceNode?.startLine ?? null,
                depth: nextDepth,
              });
            }
            if (results.length >= limit) break;
            next.push({ id: edge.sourceId, depth: nextDepth });
          }
        }
      }

      if (results.length >= limit) break;
    }
    frontier = next;
  }

  return results.slice(0, limit);
}

function classifyEdgeEvidenceClass(
  edgeType: string,
  metadata: Record<string, unknown> | undefined,
): EdgeEvidenceClass {
  switch (edgeType) {
    case 'IMPORTS':
    case 'EXPORTS':
      return 'import';
    case 'EXTENDS':
    case 'IMPLEMENTS':
    case 'TYPE_OF':
      return 'type_reference';
    case 'TESTED_BY':
      return 'test_coverage';
    default:
      return metadata?.detectorProvenance === 'heuristic' || metadata?.evidenceClass === 'INFERRED'
        ? 'inferred_heuristic'
        : 'direct_call';
  }
}

function clampNumericConfidence(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(1, value));
}

function buildHotFileBreadcrumbs(filePaths: string[]): Array<{
  filePath: string;
  hotFileBreadcrumb: HotFileBreadcrumb;
}> {
  const uniqueFilePaths = [...new Set(filePaths)];
  if (uniqueFilePaths.length === 0) {
    return [];
  }

  const degreeRows = graphDb.queryFileDegrees(uniqueFilePaths);
  const positiveDegrees = degreeRows
    .map((row) => row.degree)
    .filter((degree) => degree > 0)
    .sort((left, right) => right - left);
  if (positiveDegrees.length === 0) {
    return [];
  }

  const topCount = Math.max(1, Math.ceil(positiveDegrees.length * 0.1));
  const threshold = Math.min(20, positiveDegrees[topCount - 1] ?? positiveDegrees[0]);

  return degreeRows
    .filter((row) => row.degree >= threshold)
    .map((row) => ({
      filePath: row.filePath,
      hotFileBreadcrumb: {
        degree: row.degree,
        changeCarefullyReason: `High-degree node; change carefully because changes here ripple to ${row.degree} dependents.`,
      },
    }));
}

function computeBlastRadius(sourceFiles: string[], maxDepth: number, limit: number) {
  const importedBy = new Map<string, Set<string>>();
  for (const edge of graphDb.queryFileImportDependents()) {
    const importers = importedBy.get(edge.importedFilePath) ?? new Set<string>();
    importers.add(edge.importerFilePath);
    importedBy.set(edge.importedFilePath, importers);
  }

  const affectedByFile = new Map<string, number>();
  const normalizedSources = [...new Set(sourceFiles)];

  for (const sourceFile of normalizedSources) {
    const visited = new Set<string>([sourceFile]);
    const queue: Array<{ filePath: string; depth: number }> = [{ filePath: sourceFile, depth: 0 }];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;

      const importers = importedBy.get(current.filePath);
      if (!importers) continue;

      for (const importerFilePath of importers) {
        const nextDepth = current.depth + 1;
        if (nextDepth > maxDepth || visited.has(importerFilePath)) {
          continue;
        }
        visited.add(importerFilePath);
        queue.push({ filePath: importerFilePath, depth: nextDepth });

        if (normalizedSources.includes(importerFilePath)) {
          continue;
        }

        const previousDepth = affectedByFile.get(importerFilePath);
        if (previousDepth === undefined || nextDepth < previousDepth) {
          affectedByFile.set(importerFilePath, nextDepth);
        }
      }
    }
  }

  const affectedFiles = [...affectedByFile.entries()]
    .map(([filePath, depth]) => ({ filePath, depth }))
    .sort((left, right) => left.depth - right.depth || left.filePath.localeCompare(right.filePath))
    .slice(0, limit);
  const breadcrumbByFile = new Map(
    buildHotFileBreadcrumbs([
      ...normalizedSources,
      ...affectedFiles.map((entry) => entry.filePath),
    ]).map((entry) => [entry.filePath, entry.hotFileBreadcrumb]),
  );

  return {
    sourceFiles: normalizedSources,
    nodes: [
      ...normalizedSources.map((filePath) => ({
        filePath,
        depth: 0,
        isSeed: true,
        ...(breadcrumbByFile.get(filePath) ? { hotFileBreadcrumb: breadcrumbByFile.get(filePath) } : {}),
      })),
      ...affectedFiles.map((entry) => ({
        ...entry,
        ...(breadcrumbByFile.get(entry.filePath) ? { hotFileBreadcrumb: breadcrumbByFile.get(entry.filePath) } : {}),
      })),
    ],
    affectedFiles: affectedFiles.map((entry) => ({
      ...entry,
      ...(breadcrumbByFile.get(entry.filePath) ? { hotFileBreadcrumb: breadcrumbByFile.get(entry.filePath) } : {}),
    })),
    hotFileBreadcrumbs: [...breadcrumbByFile.entries()].map(([filePath, hotFileBreadcrumb]) => ({
      filePath,
      hotFileBreadcrumb,
    })),
  };
}

/** Handle code_graph_query tool call */
export async function handleCodeGraphQuery(args: QueryArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
  let readiness: ReadyResult = {
    freshness: 'empty' as const,
    action: 'none' as const,
    inlineIndexPerformed: false,
    reason: 'readiness check not run',
  };

  // Auto-trigger: ensure graph is fresh before querying
  try {
    readiness = await ensureCodeGraphReady(process.cwd(), {
      allowInlineIndex: true,
      allowInlineFullScan: false,
    });
  } catch {
    // Non-blocking: continue with potentially stale data
  }

  const { operation, subject, limit = 50 } = args;
  const { edgeType: requestedEdgeType, error: edgeTypeError } = resolveRequestedEdgeType(args);
  const maxDepth = args.maxDepth ?? 3;

  if (edgeTypeError) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ status: 'error', error: edgeTypeError }),
      }],
    };
  }

  if (operation === 'outline') {
    const nodes = graphDb.queryOutline(subject);
    const limited = nodes.slice(0, limit);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: buildGraphQueryPayload({
            operation: 'outline',
            filePath: subject,
            readiness,
            nodeCount: limited.length,
            nodes: limited.map(n => ({
              name: n.name,
              kind: n.kind,
              fqName: n.fqName,
              line: n.startLine,
              signature: n.signature,
              symbolId: n.symbolId,
            })),
          }, readiness, 'code_graph_query outline payload'),
        }, null, 2),
      }],
    };
  }

  if (operation === 'blast_radius') {
    const rawSubjects = args.unionMode === 'multi'
      ? [subject, ...(args.subjects ?? [])]
      : [subject];
    const sourceFiles = rawSubjects
      .map((candidate) => graphDb.resolveSubjectFilePath(candidate) ?? candidate)
      .filter((candidate): candidate is string => typeof candidate === 'string' && candidate.length > 0);

    if (sourceFiles.length === 0) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ status: 'error', error: `Could not resolve blast-radius sources: ${rawSubjects.join(', ')}` }),
        }],
      };
    }

    const blastRadius = computeBlastRadius(sourceFiles, maxDepth, limit);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: buildGraphQueryPayload({
            operation,
            sourceFiles: blastRadius.sourceFiles,
            nodes: blastRadius.nodes,
            multiFileUnion: args.unionMode === 'multi' && blastRadius.sourceFiles.length > 1,
            unionMode: args.unionMode ?? 'single',
            maxDepth: Math.max(0, maxDepth),
            readiness,
            affectedFiles: blastRadius.affectedFiles,
            hotFileBreadcrumbs: blastRadius.hotFileBreadcrumbs,
          }, readiness, 'code_graph_query blast_radius payload'),
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

  // If includeTransitive, use BFS traversal instead of 1-hop
  if (args.includeTransitive) {
    const direction = operation.endsWith('from') ? 'from' : 'to';
    const transitive = transitiveTraversal(symbolId, requestedEdgeType ?? 'CALLS', direction, maxDepth, limit);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: buildGraphQueryPayload({
            operation,
            symbolId,
            edgeType: requestedEdgeType,
            transitive: true,
            maxDepth,
            readiness,
            nodes: transitive,
          }, readiness, `code_graph_query ${operation} payload`),
        }, null, 2),
      }],
    };
  }

  let result;
  switch (operation) {
    case 'calls_from': {
      const edges = graphDb.queryEdgesFrom(symbolId, requestedEdgeType).slice(0, limit);
      result = {
        operation,
        symbolId,
        edgeType: requestedEdgeType,
        edges: edges.map((entry) => ({
          target: entry.targetNode?.fqName ?? entry.edge.targetId,
          file: entry.targetNode?.filePath,
          line: entry.targetNode?.startLine,
          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
          detectorProvenance: entry.edge.metadata?.detectorProvenance ?? null,
          evidenceClass: entry.edge.metadata?.evidenceClass ?? null,
          edgeEvidenceClass: classifyEdgeEvidenceClass(
            entry.edge.edgeType,
            entry.edge.metadata as Record<string, unknown> | undefined,
          ),
        })),
        hotFileBreadcrumbs: buildHotFileBreadcrumbs(
          edges
            .map((entry) => entry.targetNode?.filePath)
            .filter((value): value is string => typeof value === 'string'),
        ),
      };
      break;
    }
    case 'calls_to': {
      const edges = graphDb.queryEdgesTo(symbolId, requestedEdgeType).slice(0, limit);
      result = {
        operation,
        symbolId,
        edgeType: requestedEdgeType,
        edges: edges.map((entry) => ({
          source: entry.sourceNode?.fqName ?? entry.edge.sourceId,
          file: entry.sourceNode?.filePath,
          line: entry.sourceNode?.startLine,
          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
          detectorProvenance: entry.edge.metadata?.detectorProvenance ?? null,
          evidenceClass: entry.edge.metadata?.evidenceClass ?? null,
          edgeEvidenceClass: classifyEdgeEvidenceClass(
            entry.edge.edgeType,
            entry.edge.metadata as Record<string, unknown> | undefined,
          ),
        })),
        hotFileBreadcrumbs: buildHotFileBreadcrumbs(
          edges
            .map((entry) => entry.sourceNode?.filePath)
            .filter((value): value is string => typeof value === 'string'),
        ),
      };
      break;
    }
    case 'imports_from': {
      const edges = graphDb.queryEdgesFrom(symbolId, requestedEdgeType).slice(0, limit);
      result = {
        operation,
        symbolId,
        edgeType: requestedEdgeType,
        edges: edges.map((entry) => ({
          target: entry.targetNode?.fqName ?? entry.edge.targetId,
          file: entry.targetNode?.filePath,
          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
          detectorProvenance: entry.edge.metadata?.detectorProvenance ?? null,
          evidenceClass: entry.edge.metadata?.evidenceClass ?? null,
          edgeEvidenceClass: classifyEdgeEvidenceClass(
            entry.edge.edgeType,
            entry.edge.metadata as Record<string, unknown> | undefined,
          ),
        })),
        hotFileBreadcrumbs: buildHotFileBreadcrumbs(
          edges
            .map((entry) => entry.targetNode?.filePath)
            .filter((value): value is string => typeof value === 'string'),
        ),
      };
      break;
    }
    case 'imports_to': {
      const edges = graphDb.queryEdgesTo(symbolId, requestedEdgeType).slice(0, limit);
      result = {
        operation,
        symbolId,
        edgeType: requestedEdgeType,
        edges: edges.map((entry) => ({
          source: entry.sourceNode?.fqName ?? entry.edge.sourceId,
          file: entry.sourceNode?.filePath,
          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
          detectorProvenance: entry.edge.metadata?.detectorProvenance ?? null,
          evidenceClass: entry.edge.metadata?.evidenceClass ?? null,
          edgeEvidenceClass: classifyEdgeEvidenceClass(
            entry.edge.edgeType,
            entry.edge.metadata as Record<string, unknown> | undefined,
          ),
        })),
        hotFileBreadcrumbs: buildHotFileBreadcrumbs(
          edges
            .map((entry) => entry.sourceNode?.filePath)
            .filter((value): value is string => typeof value === 'string'),
        ),
      };
      break;
    }
    default:
      return { content: [{ type: 'text', text: JSON.stringify({ status: 'error', error: `Unknown operation: ${operation}` }) }] };
  }

  return {
    content: [{
      type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: buildGraphQueryPayload({
            ...result,
            readiness,
          }, readiness, `code_graph_query ${operation} payload`, result.edges[0]
            ? {
              edgeEvidenceClass: result.edges[0].edgeEvidenceClass,
              numericConfidence: result.edges[0].numericConfidence,
            }
            : null),
      }, null, 2),
    }],
  };
}
