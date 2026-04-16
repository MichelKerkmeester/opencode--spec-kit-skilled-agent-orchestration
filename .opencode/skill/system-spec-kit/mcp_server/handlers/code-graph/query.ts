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
const RESOLVE_SUBJECT_CANDIDATE_LIMIT = 10;
const SUPPORTED_RELATIONSHIP_OPERATIONS = [
  'calls_from',
  'calls_to',
  'imports_from',
  'imports_to',
] as const;
const SUPPORTED_RELATIONSHIP_OPERATION_SET = new Set<string>(SUPPORTED_RELATIONSHIP_OPERATIONS);

function isSupportedEdgeType(edgeType: string): edgeType is EdgeType {
  return SUPPORTED_EDGE_TYPE_SET.has(edgeType);
}

function isSupportedRelationshipOperation(
  operation: string,
): operation is (typeof SUPPORTED_RELATIONSHIP_OPERATIONS)[number] {
  return SUPPORTED_RELATIONSHIP_OPERATION_SET.has(operation);
}

function buildUnknownOperationResponse(operation: string) {
  return {
    content: [{
      type: 'text' as const,
      text: JSON.stringify({ status: 'error', error: `Unknown operation: ${operation}` }),
    }],
  };
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

interface AmbiguousSubjectWarning {
  code: 'ambiguous_subject';
  subject: string;
  matchField: 'fq_name' | 'name';
  count: number;
  candidates: string[];
  message: string;
}

interface ResolvedSubject {
  symbolId: string | null;
  warnings?: AmbiguousSubjectWarning[];
}

interface SubjectMatchResult {
  candidates: string[];
  count: number;
}

function querySubjectMatches(
  field: 'fq_name' | 'name',
  subject: string,
): SubjectMatchResult {
  const d = graphDb.getDb();
  const candidates = d.prepare(`
    SELECT symbol_id
    FROM code_nodes
    WHERE ${field} = ?
    ORDER BY file_path, start_line, symbol_id
    LIMIT ?
  `).all(subject, RESOLVE_SUBJECT_CANDIDATE_LIMIT) as Array<{ symbol_id: string }>;

  if (candidates.length === 0) {
    return { candidates: [], count: 0 };
  }

  const count = (d.prepare(`
    SELECT COUNT(*) as count
    FROM code_nodes
    WHERE ${field} = ?
  `).get(subject) as { count: number }).count;

  return {
    candidates: candidates.map((candidate) => candidate.symbol_id),
    count,
  };
}

function buildAmbiguousSubjectWarning(
  subject: string,
  matchField: 'fq_name' | 'name',
  matchResult: SubjectMatchResult,
): AmbiguousSubjectWarning {
  const truncated = matchResult.count > matchResult.candidates.length;
  const shownCount = matchResult.candidates.length;
  const countLabel = truncated
    ? `${matchResult.count} total; showing first ${shownCount}`
    : `${matchResult.count}`;

  return {
    code: 'ambiguous_subject',
    subject,
    matchField,
    count: matchResult.count,
    candidates: matchResult.candidates,
    message: `Multiple code graph nodes matched subject "${subject}" by ${matchField} (${countLabel}). Use a symbolId to disambiguate the query.`,
  };
}

/** Resolve a subject string to a symbolId */
function resolveSubject(subject: string): ResolvedSubject {
  const d = graphDb.getDb();

  // Try as symbolId first
  const byId = d.prepare('SELECT symbol_id FROM code_nodes WHERE symbol_id = ?').get(subject) as { symbol_id: string } | undefined;
  if (byId) return { symbolId: byId.symbol_id };

  // Try as fqName
  const byFq = querySubjectMatches('fq_name', subject);
  if (byFq.count > 0) {
    return {
      symbolId: byFq.candidates[0] ?? null,
      ...(byFq.count > 1
        ? { warnings: [buildAmbiguousSubjectWarning(subject, 'fq_name', byFq)] }
        : {}),
    };
  }

  // Try as name
  const byName = querySubjectMatches('name', subject);
  if (byName.count > 0) {
    return {
      symbolId: byName.candidates[0] ?? null,
      ...(byName.count > 1
        ? { warnings: [buildAmbiguousSubjectWarning(subject, 'name', byName)] }
        : {}),
    };
  }

  return { symbolId: null };
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

type OutboundEdgeEntry = ReturnType<typeof graphDb.queryEdgesFrom>[number];
type InboundEdgeEntry = ReturnType<typeof graphDb.queryEdgesTo>[number];

interface DanglingEdgeWarning {
  code: 'dangling_edge';
  operation: QueryArgs['operation'];
  missingEndpoint: 'source' | 'target';
  count: number;
  danglingSymbolIds: string[];
  message: string;
}

type QueryWarning = AmbiguousSubjectWarning | DanglingEdgeWarning;

function mergeWarnings(...warningSets: Array<QueryWarning[] | undefined>): QueryWarning[] | undefined {
  const warnings = warningSets.flatMap((warningSet) => warningSet ?? []);
  return warnings.length > 0 ? warnings : undefined;
}

function excludeDanglingEdges<TEntry>(
  entries: TEntry[],
  limit: number,
  operation: QueryArgs['operation'],
  missingEndpoint: DanglingEdgeWarning['missingEndpoint'],
  isResolved: (entry: TEntry) => boolean,
  getDanglingId: (entry: TEntry) => string,
): { resolvedEntries: TEntry[]; warnings?: DanglingEdgeWarning[] } {
  const resolvedEntries: TEntry[] = [];
  const danglingSymbolIds: string[] = [];

  for (const entry of entries) {
    if (!isResolved(entry)) {
      danglingSymbolIds.push(getDanglingId(entry));
      continue;
    }
    if (resolvedEntries.length < limit) {
      resolvedEntries.push(entry);
    }
  }

  if (danglingSymbolIds.length === 0) {
    return { resolvedEntries };
  }

  return {
    resolvedEntries,
    warnings: [{
      code: 'dangling_edge',
      operation,
      missingEndpoint,
      count: danglingSymbolIds.length,
      danglingSymbolIds: [...new Set(danglingSymbolIds)],
      message: `Excluded ${danglingSymbolIds.length} dangling ${operation} edge(s) because the ${missingEndpoint} node could not be resolved. Reindex the code graph to repair the missing node references.`,
    }],
  };
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

const EDGE_EVIDENCE_CLASS_WEAKNESS: Record<EdgeEvidenceClass, number> = {
  inferred_heuristic: 0,
  test_coverage: 1,
  type_reference: 2,
  import: 3,
  direct_call: 4,
};

function summarizeWeakestGraphEdgeEnrichment(
  edges: Array<{
    edgeEvidenceClass: EdgeEvidenceClass;
    numericConfidence: number;
  }>,
): {
  edgeEvidenceClass: EdgeEvidenceClass;
  numericConfidence: number;
} | null {
  let weakest: {
    edgeEvidenceClass: EdgeEvidenceClass;
    numericConfidence: number;
  } | null = null;

  for (const edge of edges) {
    if (weakest == null || edge.numericConfidence < weakest.numericConfidence) {
      weakest = edge;
      continue;
    }

    if (
      edge.numericConfidence === weakest.numericConfidence
      && EDGE_EVIDENCE_CLASS_WEAKNESS[edge.edgeEvidenceClass]
        < EDGE_EVIDENCE_CLASS_WEAKNESS[weakest.edgeEvidenceClass]
    ) {
      weakest = edge;
    }
  }

  return weakest;
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
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          message: `code_graph_not_ready: ${reason}`,
        }),
      }],
    };
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
    const resolvedSubject = graphDb.resolveSubjectFilePath(subject);
    if (typeof resolvedSubject !== 'string' || resolvedSubject.length === 0) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'error',
            error: `Could not resolve outline subject: ${subject}`,
          }),
        }],
      };
    }

    const nodes = graphDb.queryOutline(resolvedSubject);
    const limited = nodes.slice(0, limit);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: buildGraphQueryPayload({
            operation: 'outline',
            filePath: resolvedSubject,
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
    const sourceFiles: string[] = [];

    for (const candidate of rawSubjects) {
      const resolvedSubject = graphDb.resolveSubjectFilePath(candidate);
      if (typeof resolvedSubject !== 'string' || resolvedSubject.length === 0) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ status: 'error', error: `unresolved_subject: ${candidate}` }),
          }],
        };
      }
      sourceFiles.push(resolvedSubject);
    }

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

  if (!isSupportedRelationshipOperation(operation)) {
    return buildUnknownOperationResponse(operation);
  }

  const resolvedSubject = resolveSubject(subject);
  const symbolId = resolvedSubject.symbolId;
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
            ...(resolvedSubject.warnings ? { warnings: resolvedSubject.warnings } : {}),
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
      const { resolvedEntries, warnings } = excludeDanglingEdges(
        graphDb.queryEdgesFrom(symbolId, requestedEdgeType),
        limit,
        operation,
        'target',
        (entry: OutboundEdgeEntry) => entry.targetNode != null,
        (entry: OutboundEdgeEntry) => entry.edge.targetId,
      );
      result = {
        operation,
        symbolId,
        edgeType: requestedEdgeType,
        edges: resolvedEntries.map((entry) => ({
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
        ...(warnings ? { warnings } : {}),
        hotFileBreadcrumbs: buildHotFileBreadcrumbs(
          resolvedEntries
            .map((entry) => entry.targetNode?.filePath)
            .filter((value): value is string => typeof value === 'string'),
        ),
      };
      break;
    }
    case 'calls_to': {
      const { resolvedEntries, warnings } = excludeDanglingEdges(
        graphDb.queryEdgesTo(symbolId, requestedEdgeType),
        limit,
        operation,
        'source',
        (entry: InboundEdgeEntry) => entry.sourceNode != null,
        (entry: InboundEdgeEntry) => entry.edge.sourceId,
      );
      result = {
        operation,
        symbolId,
        edgeType: requestedEdgeType,
        edges: resolvedEntries.map((entry) => ({
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
        ...(warnings ? { warnings } : {}),
        hotFileBreadcrumbs: buildHotFileBreadcrumbs(
          resolvedEntries
            .map((entry) => entry.sourceNode?.filePath)
            .filter((value): value is string => typeof value === 'string'),
        ),
      };
      break;
    }
    case 'imports_from': {
      const { resolvedEntries, warnings } = excludeDanglingEdges(
        graphDb.queryEdgesFrom(symbolId, requestedEdgeType),
        limit,
        operation,
        'target',
        (entry: OutboundEdgeEntry) => entry.targetNode != null,
        (entry: OutboundEdgeEntry) => entry.edge.targetId,
      );
      result = {
        operation,
        symbolId,
        edgeType: requestedEdgeType,
        edges: resolvedEntries.map((entry) => ({
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
        ...(warnings ? { warnings } : {}),
        hotFileBreadcrumbs: buildHotFileBreadcrumbs(
          resolvedEntries
            .map((entry) => entry.targetNode?.filePath)
            .filter((value): value is string => typeof value === 'string'),
        ),
      };
      break;
    }
    case 'imports_to': {
      const { resolvedEntries, warnings } = excludeDanglingEdges(
        graphDb.queryEdgesTo(symbolId, requestedEdgeType),
        limit,
        operation,
        'source',
        (entry: InboundEdgeEntry) => entry.sourceNode != null,
        (entry: InboundEdgeEntry) => entry.edge.sourceId,
      );
      result = {
        operation,
        symbolId,
        edgeType: requestedEdgeType,
        edges: resolvedEntries.map((entry) => ({
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
        ...(warnings ? { warnings } : {}),
        hotFileBreadcrumbs: buildHotFileBreadcrumbs(
          resolvedEntries
            .map((entry) => entry.sourceNode?.filePath)
            .filter((value): value is string => typeof value === 'string'),
        ),
      };
      break;
    }
    default:
      return buildUnknownOperationResponse(operation);
  }

  const warnings = mergeWarnings(resolvedSubject.warnings, result.warnings);

  return {
    content: [{
      type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: buildGraphQueryPayload({
            ...result,
            ...(warnings ? { warnings } : {}),
            readiness,
          }, readiness, `code_graph_query ${operation} payload`, summarizeWeakestGraphEdgeEnrichment(result.edges)),
      }, null, 2),
    }],
  };
}
