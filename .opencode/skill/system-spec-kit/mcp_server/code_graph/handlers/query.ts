// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Query Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_query — queries structural relationships.

import * as graphDb from '../lib/code-graph-db.js';
import { ensureCodeGraphReady, type ReadyResult } from '../lib/ensure-ready.js';
import type { EdgeType } from '../lib/indexer-types.js';
import {
  attachGraphEdgeEnrichment,
  attachStructuralTrustFields,
  type EdgeEvidenceClass,
  type HotFileBreadcrumb,
} from '../../lib/context/shared-payload.js';
import {
  buildQueryTrustMetadata,
  buildReadinessBlock,
} from '../lib/readiness-contract.js';
// R-007-P2-6: emit a stable failure-counter metric so operators can
// distinguish DB / compute failures from legitimately empty blast radii.
import { isSpeckitMetricsEnabled, speckitMetrics } from '../../skill_advisor/lib/metrics.js';

export interface QueryArgs {
  operation: 'outline' | 'calls_from' | 'calls_to' | 'imports_from' | 'imports_to' | 'blast_radius';
  subject: string; // filePath, fqName, or symbolId
  subjects?: string[];
  edgeType?: string;
  limit?: number;
  includeTransitive?: boolean;
  maxDepth?: number;
  unionMode?: 'single' | 'multi';
  minConfidence?: number;
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
const AMBIGUOUS_SUBJECT_WARNING_CANDIDATE_LIMIT = 10;
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
  matchField: 'fq_name' | 'name' | 'symbol_id';
  count: number;
  candidates: SubjectCandidateMetadata[];
  selectedCandidate: SubjectCandidateMetadata;
  selectionReason: string;
  message: string;
}

interface ResolvedSubject {
  symbolId: string | null;
  selectedCandidate?: SubjectCandidateMetadata;
  warnings?: AmbiguousSubjectWarning[];
}

interface SubjectCandidateMetadata {
  symbolId: string;
  fqName: string | null;
  name: string | null;
  kind: string | null;
  filePath: string | null;
  startLine: number | null;
  operationEdgeCount?: number;
  selectedForOperation?: QueryArgs['operation'];
}

interface SubjectMatchResult {
  candidates: SubjectCandidateMetadata[];
  count: number;
}

type BlastRadiusRiskLevel = 'low' | 'medium' | 'high';

interface BlastRadiusDependency {
  importedFilePath: string;
  importerFilePath: string;
  confidence: number;
}

interface BlastRadiusAffectedFile {
  filePath: string;
  depth: number;
  hotFileBreadcrumb?: HotFileBreadcrumb;
}

interface BlastRadiusFailureFallback {
  reason: string;
  /**
   * R-007-P2-6: Stable machine-readable failure code so operators can
   * distinguish failure modes (DB error vs ambiguous subject vs unresolved
   * subject vs limit reached vs empty source) without parsing free-form
   * `reason` strings. Optional for backward compatibility with older
   * call sites.
   */
  code?: BlastRadiusFailureCode;
  partialResult?: {
    sourceFiles: string[];
    nodes: BlastRadiusAffectedFile[];
    affectedFiles: BlastRadiusAffectedFile[];
    depthGroups: Record<number, BlastRadiusAffectedFile[]>;
  };
}

/**
 * R-007-P2-6: Stable failure-fallback code values surfaced via
 * `BlastRadiusFailureFallback.code`. Adding new values is non-breaking; do
 * not rename existing literals once consumers depend on them.
 */
type BlastRadiusFailureCode =
  | 'limit_reached'
  | 'unresolved_subject'
  | 'ambiguous_subject'
  | 'empty_source'
  | 'compute_error';

function querySubjectMatches(
  field: 'fq_name' | 'name',
  subject: string,
): SubjectMatchResult {
  const d = graphDb.getDb();
  const candidates = d.prepare(`
    SELECT symbol_id, fq_name, name, kind, file_path, start_line
    FROM code_nodes
    WHERE ${field} = ?
    ORDER BY file_path, start_line, symbol_id
  `).all(subject) as Array<{
    symbol_id: string;
    fq_name: string | null;
    name: string | null;
    kind: string | null;
    file_path: string | null;
    start_line: number | null;
  }>;

  if (candidates.length === 0) {
    return { candidates: [], count: 0 };
  }

  return {
    candidates: candidates.map((candidate) => ({
      symbolId: candidate.symbol_id,
      fqName: candidate.fq_name,
      name: candidate.name,
      kind: candidate.kind,
      filePath: candidate.file_path,
      startLine: candidate.start_line,
    })),
    count: candidates.length,
  };
}

function relationshipEdgeCount(
  candidate: SubjectCandidateMetadata,
  operation: QueryArgs['operation'],
  edgeType: EdgeType | undefined,
): number {
  if (!candidate.symbolId) {
    return 0;
  }

  const resolvedEdgeType = edgeType ?? (
    operation.startsWith('calls')
      ? 'CALLS'
      : operation.startsWith('imports')
        ? 'IMPORTS'
        : undefined
  );

  if (!resolvedEdgeType) {
    return 0;
  }

  if (operation === 'calls_from' || operation === 'imports_from') {
    return graphDb.queryEdgesFrom(candidate.symbolId, resolvedEdgeType).length;
  }

  if (operation === 'calls_to' || operation === 'imports_to') {
    return graphDb.queryEdgesTo(candidate.symbolId, resolvedEdgeType).length;
  }

  return 0;
}

function callableKindRank(kind: string | null): number {
  switch (kind) {
    case 'function':
    case 'method':
      return 0;
    case 'class':
      return 1;
    case 'variable':
      return 2;
    default:
      return 3;
  }
}

function pickOperationAwareCandidate(
  candidates: SubjectCandidateMetadata[],
  operation: QueryArgs['operation'],
  edgeType: EdgeType | undefined,
): {
  selectedCandidate: SubjectCandidateMetadata;
  candidates: SubjectCandidateMetadata[];
  selectionReason: string;
} {
  const rankedCandidates = candidates
    .map((candidate) => ({
      ...candidate,
      operationEdgeCount: relationshipEdgeCount(candidate, operation, edgeType),
      selectedForOperation: operation,
    }))
    .sort((left, right) => (
      (right.operationEdgeCount ?? 0) - (left.operationEdgeCount ?? 0)
      || callableKindRank(left.kind) - callableKindRank(right.kind)
      || (left.filePath ?? '').localeCompare(right.filePath ?? '')
      || (left.startLine ?? Number.MAX_SAFE_INTEGER) - (right.startLine ?? Number.MAX_SAFE_INTEGER)
      || left.symbolId.localeCompare(right.symbolId)
    ));

  const selectedCandidate = rankedCandidates[0] ?? candidates[0];
  const highestEdgeCount = selectedCandidate?.operationEdgeCount ?? 0;
  const hasEdgeSignal = highestEdgeCount > 0;
  const selectionReason = hasEdgeSignal
    ? `${operation} edge count`
    : callableKindRank(selectedCandidate?.kind ?? null) === 0
      ? 'callable kind preference'
      : 'deterministic file ordering';

  return {
    selectedCandidate,
    candidates: rankedCandidates,
    selectionReason,
  };
}

function buildAmbiguousSubjectWarning(
  subject: string,
  matchField: 'fq_name' | 'name' | 'symbol_id',
  matchResult: SubjectMatchResult,
  selectedCandidate: SubjectCandidateMetadata,
  selectionReason: string,
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
    selectedCandidate,
    selectionReason,
    message: `Multiple code graph nodes matched subject "${subject}" by ${matchField} (${countLabel}). Selected ${selectedCandidate.symbolId} for ${selectedCandidate.selectedForOperation ?? 'query'} using ${selectionReason}. Use a symbolId to disambiguate the query.`,
  };
}

/** Resolve a subject string to a symbolId */
function resolveSubject(
  subject: string,
  operation: QueryArgs['operation'],
  edgeType: EdgeType | undefined,
): ResolvedSubject {
  const d = graphDb.getDb();

  // Try as symbolId first
  const byId = d.prepare(`
    SELECT symbol_id, fq_name, name, kind, file_path, start_line
    FROM code_nodes
    WHERE symbol_id = ?
  `).get(subject) as {
    symbol_id: string;
    fq_name: string | null;
    name: string | null;
    kind: string | null;
    file_path: string | null;
    start_line: number | null;
  } | undefined;
  if (byId) {
    return {
      symbolId: byId.symbol_id,
      selectedCandidate: {
        symbolId: byId.symbol_id,
        fqName: byId.fq_name,
        name: byId.name,
        kind: byId.kind,
        filePath: byId.file_path,
        startLine: byId.start_line,
        selectedForOperation: operation,
      },
    };
  }

  // Try as fqName
  const byFq = querySubjectMatches('fq_name', subject);
  if (byFq.count > 0) {
    const selection = pickOperationAwareCandidate(byFq.candidates, operation, edgeType);
    return {
      symbolId: selection.selectedCandidate.symbolId,
      selectedCandidate: selection.selectedCandidate,
      ...(byFq.count > 1
        ? { warnings: [buildAmbiguousSubjectWarning(subject, 'fq_name', {
          ...byFq,
          candidates: selection.candidates.slice(0, AMBIGUOUS_SUBJECT_WARNING_CANDIDATE_LIMIT),
        }, selection.selectedCandidate, selection.selectionReason)] }
        : {}),
    };
  }

  // Try as name
  const byName = querySubjectMatches('name', subject);
  if (byName.count > 0) {
    const selection = pickOperationAwareCandidate(byName.candidates, operation, edgeType);
    return {
      symbolId: selection.selectedCandidate.symbolId,
      selectedCandidate: selection.selectedCandidate,
      ...(byName.count > 1
        ? { warnings: [buildAmbiguousSubjectWarning(subject, 'name', {
          ...byName,
          candidates: selection.candidates.slice(0, AMBIGUOUS_SUBJECT_WARNING_CANDIDATE_LIMIT),
        }, selection.selectedCandidate, selection.selectionReason)] }
        : {}),
    };
  }

  return { symbolId: null };
}

// Phase 017 / T-CGC-01: readiness helpers extracted to
// lib/code-graph/readiness-contract.ts so the 6 sibling
// code-graph handlers (scan, status, context, ccc-status,
// ccc-reindex, ccc-feedback) can share one vocabulary — see
// T-W1-CGC-03 (Wave B) for the propagation task. See that module
// for M8 / T-CGQ-09 / T-CGQ-11 origin notes (R18-001, R20-003,
// R22-001, R23-001).

function buildGraphQueryPayload<T extends Record<string, unknown>>(
  payload: T,
  readiness: ReadyResult,
  label: string,
  graphEdgeEnrichment?: {
    edgeEvidenceClass: EdgeEvidenceClass;
    numericConfidence: number;
  } | null,
) {
  const { readiness: _incomingReadiness, ...rest } = payload as Record<string, unknown>;
  const { graphMetadata, structuralTrust } = buildQueryTrustMetadata(readiness);
  const base = graphMetadata
    ? { ...rest, graphMetadata, readiness: buildReadinessBlock(readiness) }
    : { ...rest, readiness: buildReadinessBlock(readiness) };
  const withTrust = attachStructuralTrustFields(
    base as T & { readiness: ReturnType<typeof buildReadinessBlock> },
    structuralTrust,
    { label },
  );

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

/**
 * BFS transitive traversal from a symbolId via the given edge type.
 *
 * M8 / T-CGQ-10 (R19-001): dangling nodes (where queryEdgesFrom/To returns
 * an edge whose endpoint has no node row) were previously surfaced as
 * successful traversal results with null fqName/filePath. They are now
 * flagged as corruption alongside the resolved results so callers can
 * trust the absence of `warnings` as "no dangling references".
 */
interface TransitiveTraversalResult {
  nodes: Array<{
    symbolId: string;
    fqName: string | null;
    filePath: string | null;
    line: number | null;
    depth: number;
  }>;
  warnings?: DanglingEdgeWarning[];
}

function transitiveTraversal(
  startId: string,
  edgeType: string,
  direction: 'from' | 'to',
  maxDepth: number,
  limit: number,
  operation: QueryArgs['operation'],
): TransitiveTraversalResult {
  const visited = new Set<string>();
  const resultSymbolIds = new Set<string>();
  const results: TransitiveTraversalResult['nodes'] = [];
  const danglingSymbolIds: string[] = [];
  let frontier = [{ id: startId, depth: 0 }];
  const missingEndpoint: DanglingEdgeWarning['missingEndpoint'] = direction === 'from' ? 'target' : 'source';

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
          if (targetNode == null) {
            danglingSymbolIds.push(edge.targetId);
            continue;
          }
          if (!visited.has(edge.targetId)) {
            if (!resultSymbolIds.has(edge.targetId)) {
              resultSymbolIds.add(edge.targetId);
              results.push({
                symbolId: edge.targetId,
                fqName: targetNode.fqName ?? null,
                filePath: targetNode.filePath ?? null,
                line: targetNode.startLine ?? null,
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
          if (sourceNode == null) {
            danglingSymbolIds.push(edge.sourceId);
            continue;
          }
          if (!visited.has(edge.sourceId)) {
            if (!resultSymbolIds.has(edge.sourceId)) {
              resultSymbolIds.add(edge.sourceId);
              results.push({
                symbolId: edge.sourceId,
                fqName: sourceNode.fqName ?? null,
                filePath: sourceNode.filePath ?? null,
                line: sourceNode.startLine ?? null,
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

  const truncated = results.slice(0, limit);
  if (danglingSymbolIds.length === 0) {
    return { nodes: truncated };
  }

  const uniqueDangling = [...new Set(danglingSymbolIds)];
  return {
    nodes: truncated,
    warnings: [{
      code: 'dangling_edge',
      operation,
      missingEndpoint,
      count: uniqueDangling.length,
      danglingSymbolIds: uniqueDangling,
      message: `Transitive ${operation} traversal encountered ${uniqueDangling.length} dangling ${missingEndpoint} node reference(s). Reindex the code graph to repair the missing node references.`,
    }],
  };
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

// R-007-P2-3: Read-path allowlist for `reason` / `step` strings on
// edge metadata. Defense-in-depth: `code-graph-db.rowToEdge` already
// sanitizes on parse, but if metadata arrives via another path
// (e.g. directly mutated objects, mocked test rows) we still
// guarantee single-line, length-capped, non-control-char output.
const EDGE_METADATA_REASON_MAX_LENGTH = 200;
const EDGE_METADATA_REASON_BLOCKED = /[\x00-\x1F\x7F]/;

function sanitizeEdgeMetadataReadString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (value.length === 0) return null;
  if (value.length > EDGE_METADATA_REASON_MAX_LENGTH) return null;
  if (EDGE_METADATA_REASON_BLOCKED.test(value)) return null;
  return value;
}

function edgeMetadataOutput(edge: OutboundEdgeEntry['edge'] | InboundEdgeEntry['edge']) {
  return {
    confidence: clampNumericConfidence(edge.metadata?.confidence ?? edge.weight),
    numericConfidence: clampNumericConfidence(edge.metadata?.confidence ?? edge.weight),
    detectorProvenance: edge.metadata?.detectorProvenance ?? null,
    evidenceClass: edge.metadata?.evidenceClass ?? null,
    reason: sanitizeEdgeMetadataReadString(edge.metadata?.reason),
    step: sanitizeEdgeMetadataReadString(edge.metadata?.step),
    edgeEvidenceClass: classifyEdgeEvidenceClass(
      edge.edgeType,
      edge.metadata as Record<string, unknown> | undefined,
    ),
  };
}

/* ───────────────────────────────────────────────────────────────
   R-007-P2-7: Shared relationship-edge mapper
   --------------------------------------------------------------
   Replaces near-duplicate switch branches for `calls_from`,
   `calls_to`, `imports_from`, and `imports_to`. Two inputs control
   the variant: (1) direction = outbound (target side) vs inbound
   (source side); (2) whether to surface the start line.
─────────────────────────────────────────────────────────────── */

interface RelationshipMappedEdge {
  source?: string;
  target?: string;
  file?: string;
  line?: number;
  confidence: number;
  numericConfidence: number;
  detectorProvenance: string | null;
  evidenceClass: string | null;
  reason: string | null;
  step: string | null;
  edgeEvidenceClass: EdgeEvidenceClass;
}

function mapOutboundRelationshipEdge(
  entry: OutboundEdgeEntry,
  options: { includeLine: boolean },
): RelationshipMappedEdge {
  return {
    target: entry.targetNode?.fqName ?? entry.edge.targetId,
    file: entry.targetNode?.filePath,
    ...(options.includeLine ? { line: entry.targetNode?.startLine } : {}),
    ...edgeMetadataOutput(entry.edge),
  };
}

function mapInboundRelationshipEdge(
  entry: InboundEdgeEntry,
  options: { includeLine: boolean },
): RelationshipMappedEdge {
  return {
    source: entry.sourceNode?.fqName ?? entry.edge.sourceId,
    file: entry.sourceNode?.filePath,
    ...(options.includeLine ? { line: entry.sourceNode?.startLine } : {}),
    ...edgeMetadataOutput(entry.edge),
  };
}

function extractOutboundFilePaths(entries: OutboundEdgeEntry[]): string[] {
  return entries
    .map((entry) => entry.targetNode?.filePath)
    .filter((value): value is string => typeof value === 'string');
}

function extractInboundFilePaths(entries: InboundEdgeEntry[]): string[] {
  return entries
    .map((entry) => entry.sourceNode?.filePath)
    .filter((value): value is string => typeof value === 'string');
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

function shouldBlockReadPath(readiness: ReadyResult): boolean {
  return readiness.action === 'full_scan' && readiness.inlineIndexPerformed !== true;
}

function buildBlockedReadPayload(
  readiness: ReadyResult,
  operation: QueryArgs['operation'],
  subject: string,
) {
  return {
    status: 'blocked',
    message: `code_graph_full_scan_required: ${readiness.reason}`,
    data: buildGraphQueryPayload({
      operation,
      subject,
      blocked: true,
      degraded: true,
      graphAnswersOmitted: true,
      requiredAction: 'code_graph_scan',
      blockReason: 'full_scan_required',
    }, readiness, `code_graph_query ${operation} blocked payload`),
  };
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

function parseEdgeMetadataConfidence(metadataJson: unknown, weight: unknown): number {
  if (typeof metadataJson === 'string' && metadataJson.length > 0) {
    try {
      const metadata = JSON.parse(metadataJson) as Record<string, unknown>;
      return clampNumericConfidence(metadata.confidence ?? weight);
    } catch {
      return clampNumericConfidence(weight);
    }
  }
  return clampNumericConfidence(weight);
}

function queryImportDependentsForBlastRadius(minConfidence: number): BlastRadiusDependency[] {
  if (minConfidence <= 0) {
    return graphDb.queryFileImportDependents().map((edge) => ({
      ...edge,
      confidence: 1,
    }));
  }

  const d = graphDb.getDb();
  const rows = d.prepare(`
    SELECT
      target.file_path AS imported_file_path,
      source.file_path AS importer_file_path,
      edge.weight AS weight,
      edge.metadata AS metadata
    FROM code_edges edge
    INNER JOIN code_nodes source ON source.symbol_id = edge.source_id
    INNER JOIN code_nodes target ON target.symbol_id = edge.target_id
    WHERE UPPER(edge.edge_type) = 'IMPORTS'
      AND source.file_path != target.file_path
  `).all() as Array<{
    imported_file_path: string;
    importer_file_path: string;
    weight: number | null;
    metadata: string | null;
  }>;

  return rows
    .map((row) => ({
      importedFilePath: row.imported_file_path,
      importerFilePath: row.importer_file_path,
      confidence: parseEdgeMetadataConfidence(row.metadata, row.weight ?? 1),
    }))
    .filter((edge) => edge.confidence >= minConfidence);
}

function buildDepthGroups(
  affectedFiles: BlastRadiusAffectedFile[],
  maxDepth: number,
): Record<number, BlastRadiusAffectedFile[]> {
  const depthGroups: Record<number, BlastRadiusAffectedFile[]> = {};
  for (let depth = 1; depth <= Math.max(0, maxDepth); depth++) {
    depthGroups[depth] = [];
  }
  for (const affectedFile of affectedFiles) {
    depthGroups[affectedFile.depth] ??= [];
    depthGroups[affectedFile.depth].push(affectedFile);
  }
  return depthGroups;
}

function classifyBlastRadiusRisk(
  depthGroups: Record<number, BlastRadiusAffectedFile[]>,
  ambiguityCandidates: SubjectCandidateMetadata[],
): BlastRadiusRiskLevel {
  const depthOneCount = depthGroups[1]?.length ?? 0;
  if (ambiguityCandidates.length > 0 || depthOneCount > 10) {
    return 'high';
  }
  if (depthOneCount >= 4) {
    return 'medium';
  }
  return 'low';
}

function buildPartialBlastRadiusResult(
  sourceFiles: string[],
  nodes: BlastRadiusAffectedFile[],
  affectedFiles: BlastRadiusAffectedFile[],
  depthGroups: Record<number, BlastRadiusAffectedFile[]>,
): NonNullable<BlastRadiusFailureFallback['partialResult']> {
  return {
    sourceFiles,
    nodes,
    affectedFiles,
    depthGroups,
  };
}

function computeBlastRadius(
  sourceFiles: string[],
  maxDepth: number,
  limit: number,
  minConfidence = 0,
  ambiguityCandidates: SubjectCandidateMetadata[] = [],
) {
  const importedBy = new Map<string, Set<string>>();
  const importEdges = queryImportDependentsForBlastRadius(minConfidence);
  for (const edge of importEdges) {
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

  // R-007-P2-4: Detect true overflow by comparing the full traversal size
  // against `limit` BEFORE slicing. Previously `affectedFiles.length >= limit`
  // false-positived whenever the reachable set happened to equal `limit`
  // exactly. We over-collect (`limit + 1` semantically — here the whole
  // BFS frontier is already in `affectedByFile`) and slice down only after
  // recording overflow.
  const totalAffectedBeforeSlice = affectedByFile.size;
  let affectedFiles = [...affectedByFile.entries()]
    .map(([filePath, depth]) => ({ filePath, depth }))
    .sort((left, right) => left.depth - right.depth || left.filePath.localeCompare(right.filePath))
    .slice(0, limit);
  const overflowed = totalAffectedBeforeSlice > limit;
  const breadcrumbByFile = new Map(
    buildHotFileBreadcrumbs([
      ...normalizedSources,
      ...affectedFiles.map((entry) => entry.filePath),
    ]).map((entry) => [entry.filePath, entry.hotFileBreadcrumb]),
  );
  affectedFiles = affectedFiles.map((entry) => ({
    ...entry,
    ...(breadcrumbByFile.get(entry.filePath) ? { hotFileBreadcrumb: breadcrumbByFile.get(entry.filePath) } : {}),
  }));

  const seedNodes = normalizedSources.map((filePath) => ({
    filePath,
    depth: 0,
    isSeed: true,
    ...(breadcrumbByFile.get(filePath) ? { hotFileBreadcrumb: breadcrumbByFile.get(filePath) } : {}),
  }));
  const depthGroups = buildDepthGroups(affectedFiles, maxDepth);

  return {
    sourceFiles: normalizedSources,
    nodes: [
      ...seedNodes,
      ...affectedFiles,
    ],
    affectedFiles,
    depthGroups,
    riskLevel: classifyBlastRadiusRisk(depthGroups, ambiguityCandidates),
    minConfidence,
    ambiguityCandidates,
    hotFileBreadcrumbs: [...breadcrumbByFile.entries()].map(([filePath, hotFileBreadcrumb]) => ({
      filePath,
      hotFileBreadcrumb,
    })),
    ...(overflowed
      ? {
        failureFallback: {
          reason: 'limit_reached',
          code: 'limit_reached',
          partialResult: buildPartialBlastRadiusResult(
            normalizedSources,
            [...seedNodes, ...affectedFiles],
            affectedFiles,
            depthGroups,
          ),
        } satisfies BlastRadiusFailureFallback,
      }
      : {}),
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
    // PR 4 / F71 step 6: emit S2-matching 'unavailable' trust-state on
    // readiness-crash so query consumers see the same canonical vocabulary
    // as code_graph_context. Previously this path dropped the readiness
    // block entirely and only returned a status:'error' string.
    const reason = error instanceof Error ? error.message : String(error);
    const crashReadiness: ReadyResult = {
      freshness: 'error' as const,
      action: 'none' as const,
      inlineIndexPerformed: false,
      reason: 'readiness_check_crashed',
    };
    const crashBlock = buildReadinessBlock(crashReadiness);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          message: `code_graph_not_ready: ${reason}`,
          data: {
            readiness: crashBlock,
            canonicalReadiness: crashBlock.canonicalReadiness,
            trustState: crashBlock.trustState,
          },
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

  if (shouldBlockReadPath(readiness)) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(buildBlockedReadPayload(readiness, operation, subject), null, 2),
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
    const ambiguityCandidates: SubjectCandidateMetadata[] = [];
    const minConfidence = clampNumericConfidence(args.minConfidence ?? 0);

    for (const candidate of rawSubjects) {
      const byFqName = querySubjectMatches('fq_name', candidate);
      if (byFqName.count > 1) {
        ambiguityCandidates.push(...byFqName.candidates.slice(0, AMBIGUOUS_SUBJECT_WARNING_CANDIDATE_LIMIT));
        continue;
      }
      if (byFqName.count === 0) {
        const byName = querySubjectMatches('name', candidate);
        if (byName.count > 1) {
          ambiguityCandidates.push(...byName.candidates.slice(0, AMBIGUOUS_SUBJECT_WARNING_CANDIDATE_LIMIT));
          continue;
        }
      }

      const resolvedSubject = graphDb.resolveSubjectFilePath(candidate);
      if (typeof resolvedSubject !== 'string' || resolvedSubject.length === 0) {
        // R-007-P2-5: Preserve any sibling seeds we have already resolved
        // ahead of this failed candidate. Returning `nodes: []` here would
        // discard work the caller can still use; instead surface the
        // already-resolved seeds so multi-subject blast-radius queries
        // degrade gracefully when one subject fails to resolve.
        const preservedDepthGroups = buildDepthGroups([], maxDepth);
        const preservedSeedNodes = sourceFiles.map((filePath) => ({
          filePath,
          depth: 0,
          isSeed: true,
        }));
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              status: 'ok',
              data: buildGraphQueryPayload({
                operation,
                sourceFiles,
                nodes: preservedSeedNodes,
                affectedFiles: [],
                depthGroups: preservedDepthGroups,
                riskLevel: classifyBlastRadiusRisk(preservedDepthGroups, []),
                minConfidence,
                ambiguityCandidates: [],
                failureFallback: {
                  reason: `unresolved_subject: ${candidate}`,
                  code: 'unresolved_subject',
                  partialResult: buildPartialBlastRadiusResult(
                    sourceFiles,
                    preservedSeedNodes,
                    [],
                    preservedDepthGroups,
                  ),
                } satisfies BlastRadiusFailureFallback,
              }, readiness, 'code_graph_query blast_radius fallback payload'),
            }, null, 2),
          }],
        };
      }
      sourceFiles.push(resolvedSubject);
    }

    if (ambiguityCandidates.length > 0) {
      const depthGroups = buildDepthGroups([], maxDepth);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'ok',
            data: buildGraphQueryPayload({
              operation,
              sourceFiles,
              nodes: [],
              affectedFiles: [],
              depthGroups,
              riskLevel: classifyBlastRadiusRisk(depthGroups, ambiguityCandidates),
              minConfidence,
              ambiguityCandidates,
              failureFallback: {
                reason: 'ambiguous_subject',
                code: 'ambiguous_subject',
                partialResult: buildPartialBlastRadiusResult(sourceFiles, [], [], depthGroups),
              } satisfies BlastRadiusFailureFallback,
            }, readiness, 'code_graph_query blast_radius ambiguity payload'),
          }, null, 2),
        }],
      };
    }

    if (sourceFiles.length === 0) {
      const depthGroups = buildDepthGroups([], maxDepth);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'ok',
            data: buildGraphQueryPayload({
              operation,
              sourceFiles,
              nodes: [],
              affectedFiles: [],
              depthGroups,
              riskLevel: classifyBlastRadiusRisk(depthGroups, []),
              minConfidence,
              ambiguityCandidates: [],
              failureFallback: {
                reason: `Could not resolve blast-radius sources: ${rawSubjects.join(', ')}`,
                code: 'empty_source',
                partialResult: buildPartialBlastRadiusResult(sourceFiles, [], [], depthGroups),
              } satisfies BlastRadiusFailureFallback,
            }, readiness, 'code_graph_query blast_radius empty-source payload'),
          }, null, 2),
        }],
      };
    }

    let blastRadius;
    try {
      blastRadius = computeBlastRadius(sourceFiles, maxDepth, limit, minConfidence, ambiguityCandidates);
    } catch (error) {
      const depthGroups = buildDepthGroups([], maxDepth);
      const reason = error instanceof Error ? error.message : String(error);
      // R-007-P2-6: Surface a stable `code` and emit a warning log + metric
      // so operators can distinguish a genuine compute / DB failure from a
      // legitimately empty blast radius (which has no failureFallback).
      console.warn(
        `[code-graph-query] blast_radius compute failure: ${reason} (sources=${sourceFiles.length})`,
      );
      try {
        if (isSpeckitMetricsEnabled()) {
          speckitMetrics.incrementCounter(
            'spec_kit.graph.blast_radius_failure_total',
            { code: 'compute_error' },
          );
        }
      } catch (_metricErr: unknown) {
        // Best-effort: never let metric emission failures mask the original
        // Compute error.
      }
      blastRadius = {
        sourceFiles,
        nodes: sourceFiles.map((filePath) => ({ filePath, depth: 0, isSeed: true })),
        affectedFiles: [],
        depthGroups,
        riskLevel: classifyBlastRadiusRisk(depthGroups, ambiguityCandidates),
        minConfidence,
        ambiguityCandidates,
        hotFileBreadcrumbs: [],
        failureFallback: {
          reason,
          code: 'compute_error',
          partialResult: buildPartialBlastRadiusResult(sourceFiles, [], [], depthGroups),
        } satisfies BlastRadiusFailureFallback,
      };
    }
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
            affectedFiles: blastRadius.affectedFiles,
            depthGroups: blastRadius.depthGroups,
            riskLevel: blastRadius.riskLevel,
            minConfidence: blastRadius.minConfidence,
            ambiguityCandidates: blastRadius.ambiguityCandidates,
            ...(blastRadius.failureFallback ? { failureFallback: blastRadius.failureFallback } : {}),
            hotFileBreadcrumbs: blastRadius.hotFileBreadcrumbs,
          }, readiness, 'code_graph_query blast_radius payload'),
        }, null, 2),
      }],
    };
  }

  if (!isSupportedRelationshipOperation(operation)) {
    return buildUnknownOperationResponse(operation);
  }

  const resolvedSubject = resolveSubject(subject, operation, requestedEdgeType);
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
    const transitive = transitiveTraversal(
      symbolId,
      requestedEdgeType ?? 'CALLS',
      direction,
      maxDepth,
      limit,
      operation,
    );
    const warnings = mergeWarnings(resolvedSubject.warnings, transitive.warnings);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: buildGraphQueryPayload({
            operation,
            symbolId,
            ...(resolvedSubject.selectedCandidate ? { selectedCandidate: resolvedSubject.selectedCandidate } : {}),
            edgeType: requestedEdgeType,
            transitive: true,
            maxDepth,
            ...(warnings ? { warnings } : {}),
            nodes: transitive.nodes,
          }, readiness, `code_graph_query ${operation} payload`),
        }, null, 2),
      }],
    };
  }

  let result;
  switch (operation) {
    // R-007-P2-7: 4 near-duplicate switch branches collapsed via the shared
    // `mapOutboundRelationshipEdge` / `mapInboundRelationshipEdge` helpers.
    // Variation surface: (1) direction (outbound / inbound), (2) whether the
    // start line is included (calls_*) or omitted (imports_*).
    case 'calls_from':
    case 'imports_from': {
      const includeLine = operation === 'calls_from';
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
        ...(resolvedSubject.selectedCandidate ? { selectedCandidate: resolvedSubject.selectedCandidate } : {}),
        edgeType: requestedEdgeType,
        edges: resolvedEntries.map((entry) => mapOutboundRelationshipEdge(entry, { includeLine })),
        ...(warnings ? { warnings } : {}),
        hotFileBreadcrumbs: buildHotFileBreadcrumbs(extractOutboundFilePaths(resolvedEntries)),
      };
      break;
    }
    case 'calls_to':
    case 'imports_to': {
      const includeLine = operation === 'calls_to';
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
        ...(resolvedSubject.selectedCandidate ? { selectedCandidate: resolvedSubject.selectedCandidate } : {}),
        edgeType: requestedEdgeType,
        edges: resolvedEntries.map((entry) => mapInboundRelationshipEdge(entry, { includeLine })),
        ...(warnings ? { warnings } : {}),
        hotFileBreadcrumbs: buildHotFileBreadcrumbs(extractInboundFilePaths(resolvedEntries)),
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
          }, readiness, `code_graph_query ${operation} payload`, summarizeWeakestGraphEdgeEnrichment(result.edges)),
      }, null, 2),
    }],
  };
}
