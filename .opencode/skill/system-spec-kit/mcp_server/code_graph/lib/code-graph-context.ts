// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Context
// ───────────────────────────────────────────────────────────────
// LLM-oriented compact graph neighborhoods with CocoIndex seed support.
// Provides the code_graph_context MCP tool implementation.

import { performance } from 'node:perf_hooks';
import * as graphDb from './code-graph-db.js';
import { resolveSeeds, type AnySeed, type ArtifactRef } from './seed-resolver.js';
import { isSpeckitMetricsEnabled, speckitMetrics } from '../../skill_advisor/lib/metrics.js';

/** Map internal QueryMode → canonical spec_kit metric `mode` label value. */
function speckitQueryModeLabel(mode: QueryMode): 'outline' | 'blast_radius' | 'relationship' {
  if (mode === 'outline') return 'outline';
  if (mode === 'impact') return 'blast_radius';
  return 'relationship';
}

export type QueryMode = 'neighborhood' | 'outline' | 'impact';

export interface ContextArgs {
  input?: string;
  queryMode?: QueryMode;
  subject?: string;
  seeds?: AnySeed[];
  budgetTokens?: number;
  deadlineMs?: number;
  profile?: 'quick' | 'research' | 'debug';
  includeTrace?: boolean;
}

export interface ContextResult {
  queryMode: QueryMode;
  resolvedAnchors: ArtifactRef[];
  graphContext: GraphContextSection[];
  textBrief: string;
  combinedSummary: string;
  nextActions: string[];
  metadata: {
    totalNodes: number;
    totalEdges: number;
    budgetUsed: number;
    budgetLimit: number;
    deadlineMs: number | null;
    partialOutput: {
      isPartial: boolean;
      reasons: Array<'deadline' | 'budget'>;
      omittedSections: number;
      omittedAnchors: number;
      truncatedText: boolean;
    };
    freshness: { lastScanAt: string | null; staleness: 'fresh' | 'recent' | 'stale' | 'unknown' };
  };
}

interface GraphContextSection {
  anchor: string;
  nodes: { name: string; kind: string; file: string; line: number }[];
  edges: {
    from: string;
    to: string;
    type: string;
    confidence: number | null;
    detectorProvenance: string | null;
    evidenceClass: string | null;
    reason: string | null;
    step: string | null;
  }[];
  partial?: {
    reason: 'deadline';
    omittedNodes: number;
    omittedEdges: number;
  };
}

interface ExpansionResult {
  section: GraphContextSection;
  deadlineExceeded: boolean;
  omittedNodes: number;
  omittedEdges: number;
}

interface FormattedTextBrief {
  text: string;
  omittedSections: number;
  truncated: boolean;
}

function defaultDeadlineMsForProfile(profile: ContextArgs['profile']): number {
  switch (profile) {
    case 'quick':
      return 250;
    case 'debug':
      return 700;
    case 'research':
      return 900;
    default:
      return 400;
  }
}

/** Build context from resolved anchors using specified query mode */
export function buildContext(args: ContextArgs): ContextResult {
  const queryMode = args.queryMode ?? 'neighborhood';
  const budgetTokens = args.budgetTokens ?? 1200;
  const seeds = args.seeds ?? [];
  const deadlineMs = args.deadlineMs ?? defaultDeadlineMsForProfile(args.profile);
  const speckitQueryStart = isSpeckitMetricsEnabled() ? performance.now() : 0;
  const speckitModeLabel = speckitQueryModeLabel(queryMode);
  const resolvedAnchors = resolveSeeds(seeds);

  // If no seeds but subject given, create seed from subject
  if (resolvedAnchors.length === 0 && args.subject) {
    const subjectRef = resolveSubjectToRef(args.subject);
    if (subjectRef) resolvedAnchors.push(subjectRef);
  }

  // Empty seeds + no subject → outline mode fallback
  if (resolvedAnchors.length === 0) {
    if (isSpeckitMetricsEnabled()) {
      speckitMetrics.incrementCounter('spec_kit.graph.query_cache_misses_total', { mode: speckitModeLabel });
    }
    return buildEmptyFallback(queryMode, budgetTokens);
  }
  if (isSpeckitMetricsEnabled()) {
    speckitMetrics.incrementCounter('spec_kit.graph.query_cache_hits_total', { mode: speckitModeLabel });
  }

  const sections: GraphContextSection[] = [];
  let totalNodes = 0;
  let totalEdges = 0;
  let omittedAnchors = 0;
  let omittedSections = 0;
  const partialReasons = new Set<'deadline' | 'budget'>();

  // Profile-based limits
  const nodeLimit = args.profile === 'quick' ? 10 : args.profile === 'debug' ? 30 : 20;

  const contextStart = performance.now();

  for (const anchor of resolvedAnchors) {
    // Deadline check: stop processing further anchors if over budget
    if (performance.now() - contextStart > deadlineMs) {
      partialReasons.add('deadline');
      omittedAnchors += resolvedAnchors.length - sections.length;
      break;
    }

    if (!anchor.symbolId) {
      // File anchor — get outline
      const outlineNodes = graphDb.queryOutline(anchor.filePath).slice(0, nodeLimit);
      sections.push({
        anchor: `${anchor.filePath}:${anchor.startLine}`,
        nodes: outlineNodes.map(n => ({ name: n.fqName, kind: n.kind, file: n.filePath, line: n.startLine })),
        edges: [],
      });
      totalNodes += outlineNodes.length;
      continue;
    }

    const expansion = expandAnchor(
      anchor,
      queryMode,
      Math.max(0, deadlineMs - (performance.now() - contextStart)),
    );
    sections.push(expansion.section);
    totalNodes += expansion.section.nodes.length;
    totalEdges += expansion.section.edges.length;
    omittedSections += expansion.section.partial ? 1 : 0;
    if (expansion.deadlineExceeded) {
      partialReasons.add('deadline');
      omittedAnchors += resolvedAnchors.length - sections.length;
      break;
    }
  }

  const formattedTextBrief = formatTextBrief(sections, budgetTokens, resolvedAnchors);
  if (formattedTextBrief.omittedSections > 0 || formattedTextBrief.truncated) {
    partialReasons.add('budget');
  }
  const combinedSummary = buildCombinedSummary(resolvedAnchors, sections);
  const nextActions = suggestNextActions(resolvedAnchors, sections, queryMode);
  const freshness = computeFreshness();
  if (isSpeckitMetricsEnabled()) {
    const freshnessLabel = freshness.staleness === 'fresh' || freshness.staleness === 'recent' ? 'live' : freshness.staleness === 'stale' ? 'stale' : 'unavailable';
    speckitMetrics.recordHistogram('spec_kit.graph.query_latency_ms', performance.now() - speckitQueryStart, { mode: speckitModeLabel, freshness_state: freshnessLabel });
  }

  return {
    queryMode,
    resolvedAnchors,
    graphContext: sections,
    textBrief: formattedTextBrief.text,
    combinedSummary,
    nextActions,
    metadata: {
      totalNodes,
      totalEdges,
      budgetUsed: Math.ceil(formattedTextBrief.text.length / 4),
      budgetLimit: budgetTokens,
      deadlineMs,
      partialOutput: {
        isPartial: partialReasons.size > 0,
        reasons: [...partialReasons],
        omittedSections: omittedSections + formattedTextBrief.omittedSections,
        omittedAnchors,
        truncatedText: formattedTextBrief.truncated,
      },
      freshness,
    },
  };
}

/** Build fallback result when no seeds/subject resolve */
function buildEmptyFallback(queryMode: QueryMode, budgetTokens: number): ContextResult {
  return {
    queryMode,
    resolvedAnchors: [],
    graphContext: [],
    textBrief: 'No anchors resolved. Try `code_graph_scan` first, or provide a `subject` or `seeds[]`.',
    combinedSummary: 'Empty context — no seeds or subject resolved to graph nodes.',
    nextActions: ['Run `code_graph_scan` to index the workspace', 'Provide `subject` parameter with a symbol name'],
    metadata: {
      totalNodes: 0,
      totalEdges: 0,
      budgetUsed: 0,
      budgetLimit: budgetTokens,
      deadlineMs: null,
      partialOutput: {
        isPartial: false,
        reasons: [],
        omittedSections: 0,
        omittedAnchors: 0,
        truncatedText: false,
      },
      freshness: computeFreshness(),
    },
  };
}

/** Generate a one-line summary of the resolved context */
function buildCombinedSummary(anchors: ArtifactRef[], sections: GraphContextSection[]): string {
  if (anchors.length === 0) return 'No anchors resolved.';
  const totalNodes = sections.reduce((sum, s) => sum + s.nodes.length, 0);
  const totalEdges = sections.reduce((sum, s) => sum + s.edges.length, 0);
  const files = new Set(anchors.map(a => a.filePath));
  const topAnchor = anchors[0];
  const topName = topAnchor.fqName ?? topAnchor.filePath.split('/').pop() ?? 'unknown';
  return `${anchors.length} anchor(s) across ${files.size} file(s): ${topName} + ${totalNodes} symbols, ${totalEdges} relationships`;
}

/** Suggest relevant follow-up operations */
function suggestNextActions(anchors: ArtifactRef[], sections: GraphContextSection[], mode: QueryMode): string[] {
  const actions: string[] = [];
  if (mode === 'neighborhood' && sections.some(s => s.edges.length > 5)) {
    actions.push('Use `queryMode: "impact"` to see who calls these symbols');
  }
  if (mode === 'impact') {
    actions.push('Use `queryMode: "outline"` for file-level overview');
  }
  if (anchors.some(a => a.resolution === 'file_anchor')) {
    actions.push('Run `code_graph_scan` to improve resolution (file anchors found)');
  }
  if (sections.some(s => s.nodes.length >= 15)) {
    actions.push('Narrow with `seeds[]` for more specific context');
  }
  actions.push('Use `mcp__cocoindex_code__search` for semantic discovery of related code');
  return actions.slice(0, 4);
}

/** Compute freshness metadata from DB scan timestamps */
function computeFreshness(): { lastScanAt: string | null; staleness: 'fresh' | 'recent' | 'stale' | 'unknown' } {
  try {
    const d = graphDb.getDb();
    const row = d.prepare('SELECT MAX(indexed_at) as last FROM code_files').get() as { last: string | null } | undefined;
    const lastScanAt = row?.last ?? null;
    if (!lastScanAt) return { lastScanAt: null, staleness: 'unknown' };

    const ageMs = Date.now() - new Date(lastScanAt).getTime();
    const staleness = ageMs < 300_000 ? 'fresh' : ageMs < 3_600_000 ? 'recent' : 'stale';
    return { lastScanAt, staleness };
  } catch {
    return { lastScanAt: null, staleness: 'unknown' };
  }
}

// R-007-P2-3: Read-path allowlist for `reason` / `step` strings on
// edge metadata. The same sanitizer pattern as `code-graph-db` and
// `query.ts`: defense-in-depth single-line, length-capped, non-
// control-char check.
const CONTEXT_EDGE_REASON_MAX_LENGTH = 200;
const CONTEXT_EDGE_REASON_BLOCKED = /[\x00-\x1F\x7F]/;

function sanitizeContextEdgeString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (value.length === 0) return null;
  if (value.length > CONTEXT_EDGE_REASON_MAX_LENGTH) return null;
  if (CONTEXT_EDGE_REASON_BLOCKED.test(value)) return null;
  return value;
}

function formatContextEdge(edge: graphDb.CodeEdgeTargetResult['edge'] | graphDb.CodeEdgeSourceResult['edge']): {
  confidence: number | null;
  detectorProvenance: string | null;
  evidenceClass: string | null;
  reason: string | null;
  step: string | null;
} {
  const confidence = edge.metadata?.confidence ?? edge.weight;
  return {
    confidence: typeof confidence === 'number' && Number.isFinite(confidence) ? confidence : null,
    detectorProvenance: typeof edge.metadata?.detectorProvenance === 'string'
      ? edge.metadata.detectorProvenance
      : null,
    evidenceClass: typeof edge.metadata?.evidenceClass === 'string' ? edge.metadata.evidenceClass : null,
    reason: sanitizeContextEdgeString(edge.metadata?.reason),
    step: sanitizeContextEdgeString(edge.metadata?.step),
  };
}

/** Expand a single anchor into a context section */
function expandAnchor(anchor: ArtifactRef, mode: QueryMode, remainingMs?: number): ExpansionResult {
  const startTime = performance.now();
  const budgetMs = remainingMs ?? 400; // 400ms default latency budget
  const nodes: { name: string; kind: string; file: string; line: number }[] = [];
  const edges: {
    from: string;
    to: string;
    type: string;
    confidence: number | null;
    detectorProvenance: string | null;
    evidenceClass: string | null;
    reason: string | null;
    step: string | null;
  }[] = [];
  let deadlineExceeded = false;
  let omittedNodes = 0;
  let omittedEdges = 0;

  const budgetExpired = (): boolean => performance.now() - startTime > budgetMs;

  const finalize = (): ExpansionResult => ({
    section: {
      anchor: `${anchor.filePath}:${anchor.startLine} (${anchor.fqName ?? 'unknown'})`,
      nodes,
      edges,
      ...(deadlineExceeded
        ? {
          partial: {
            reason: 'deadline',
            omittedNodes,
            omittedEdges,
          },
        }
        : {}),
    },
    deadlineExceeded,
    omittedNodes,
    omittedEdges,
  });

  if (!anchor.symbolId) {
    return {
      section: { anchor: anchor.filePath, nodes, edges },
      deadlineExceeded: false,
      omittedNodes: 0,
      omittedEdges: 0,
    };
  }

  switch (mode) {
    case 'neighborhood': {
      // 1-hop: CALLS + IMPORTS + CONTAINS from anchor
      for (const edgeType of ['CALLS', 'IMPORTS', 'CONTAINS'] as const) {
        if (budgetExpired()) {
          deadlineExceeded = true;
          omittedEdges += 1;
          break;
        }
        const outgoing = graphDb.queryEdgesFrom(anchor.symbolId, edgeType);
        let processedOutgoing = 0;
        for (const { edge, targetNode } of outgoing) {
          if (budgetExpired()) {
            deadlineExceeded = true;
            omittedEdges += outgoing.length - processedOutgoing;
            break;
          }
          edges.push({
            from: anchor.fqName ?? anchor.symbolId,
            to: targetNode?.fqName ?? edge.targetId,
            type: edge.edgeType,
            ...formatContextEdge(edge),
          });
          if (targetNode) {
            nodes.push({ name: targetNode.fqName, kind: targetNode.kind, file: targetNode.filePath, line: targetNode.startLine });
          }
          processedOutgoing += 1;
        }
        if (deadlineExceeded) {
          break;
        }
        const incoming = graphDb.queryEdgesTo(anchor.symbolId, edgeType);
        let processedIncoming = 0;
        for (const { edge, sourceNode } of incoming) {
          if (budgetExpired()) {
            deadlineExceeded = true;
            omittedEdges += incoming.length - processedIncoming;
            break;
          }
          edges.push({
            from: sourceNode?.fqName ?? edge.sourceId,
            to: anchor.fqName ?? anchor.symbolId,
            type: edge.edgeType,
            ...formatContextEdge(edge),
          });
          if (sourceNode) {
            nodes.push({ name: sourceNode.fqName, kind: sourceNode.kind, file: sourceNode.filePath, line: sourceNode.startLine });
          }
          processedIncoming += 1;
        }
        if (deadlineExceeded) {
          break;
        }
      }
      break;
    }
    case 'outline': {
      const outlineNodes = graphDb.queryOutline(anchor.filePath);
      for (const n of outlineNodes) {
        if (budgetExpired()) {
          deadlineExceeded = true;
          omittedNodes += outlineNodes.length - nodes.length;
          break;
        }
        nodes.push({ name: n.fqName, kind: n.kind, file: n.filePath, line: n.startLine });
      }
      // CONTAINS + EXPORTS from file symbols
      if (!deadlineExceeded) {
        const fileExports = graphDb.queryEdgesFrom(anchor.symbolId, 'EXPORTS');
        let processedExports = 0;
        for (const { edge, targetNode } of fileExports) {
          if (budgetExpired()) {
            deadlineExceeded = true;
            omittedEdges += fileExports.length - processedExports;
            break;
          }
          edges.push({
            from: anchor.fqName ?? anchor.symbolId,
            to: targetNode?.fqName ?? edge.targetId,
            type: 'EXPORTS',
            ...formatContextEdge(edge),
          });
          processedExports += 1;
        }
      }
      break;
    }
    case 'impact': {
      // Reverse: who calls this? who imports this?
      // Latency guard: break early if queries exceed budget (400ms default)
      for (const edgeType of ['CALLS', 'IMPORTS'] as const) {
        const elapsed = performance.now() - startTime;
        if (elapsed > budgetMs) {
          console.warn(`[code-graph-context] impact query exceeded ${budgetMs}ms budget (${Math.round(elapsed)}ms elapsed), breaking early`);
          deadlineExceeded = true;
          omittedEdges += 1;
          break;
        }
        const incoming = graphDb.queryEdgesTo(anchor.symbolId, edgeType);
        let processedIncoming = 0;
        for (const { edge, sourceNode } of incoming) {
          if (budgetExpired()) {
            deadlineExceeded = true;
            omittedEdges += incoming.length - processedIncoming;
            break;
          }
          edges.push({
            from: sourceNode?.fqName ?? edge.sourceId,
            to: anchor.fqName ?? anchor.symbolId,
            type: edge.edgeType,
            ...formatContextEdge(edge),
          });
          if (sourceNode) {
            nodes.push({ name: sourceNode.fqName, kind: sourceNode.kind, file: sourceNode.filePath, line: sourceNode.startLine });
          }
          processedIncoming += 1;
        }
        if (deadlineExceeded) {
          break;
        }
      }
      break;
    }
  }

  return finalize();
}

/** Resolve a subject string to an ArtifactRef */
function resolveSubjectToRef(subject: string): ArtifactRef | null {
  try {
    const d = graphDb.getDb();
    // Try as symbolId, fqName, or name
    const row = d.prepare(`
      SELECT * FROM code_nodes
      WHERE symbol_id = ? OR fq_name = ? OR name = ?
      LIMIT 1
    `).get(subject, subject, subject) as Record<string, unknown> | undefined;

    if (row) {
      return {
        filePath: row.file_path as string,
        startLine: row.start_line as number,
        endLine: row.end_line as number,
        symbolId: row.symbol_id as string,
        fqName: row.fq_name as string,
        kind: row.kind as string,
        confidence: 0.9,
        resolution: 'exact',
        score: null,
        snippet: null,
        range: null,
        provider: 'code_graph',
      };
    }
  } catch { /* DB not available */ }
  return null;
}

/**
 * Format sections into compact text brief within token budget.
 * Never-drops guarantee: always includes top seed, root anchor, one boundary edge, one next action.
 */
function formatTextBrief(sections: GraphContextSection[], budgetTokens: number, _anchors?: ArtifactRef[]): FormattedTextBrief {
  const maxChars = budgetTokens * 4;
  const lines: string[] = [];
  let omittedSections = 0;

  // Priority rendering: first section is always fully rendered (never dropped)
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const isFirst = i === 0;
    const nodeLimit = isFirst ? 15 : Math.max(5, 15 - i * 3);
    const edgeLimit = isFirst ? 10 : Math.max(3, 10 - i * 2);

    lines.push(`### ${section.anchor}`);

    if (section.nodes.length > 0) {
      lines.push('Symbols:');
      for (const n of section.nodes.slice(0, nodeLimit)) {
        lines.push(`  ${n.kind} ${n.name} (${n.file}:${n.line})`);
      }
      if (section.nodes.length > nodeLimit) {
        lines.push(`  ... +${section.nodes.length - nodeLimit} more`);
      }
    }

    if (section.edges.length > 0) {
      lines.push('Relationships:');
      for (const e of section.edges.slice(0, edgeLimit)) {
        const metadata = [
          e.reason ? `reason=${e.reason}` : null,
          e.step ? `step=${e.step}` : null,
          typeof e.confidence === 'number' ? `confidence=${e.confidence}` : null,
        ].filter(Boolean).join(' ');
        lines.push(`  ${e.from} -[${e.type}${metadata ? ` ${metadata}` : ''}]-> ${e.to}`);
      }
      if (section.edges.length > edgeLimit) {
        lines.push(`  ... +${section.edges.length - edgeLimit} more`);
      }
    }

    lines.push('');

    // Budget check: stop adding sections if we're over budget (but first section always included)
    if (!isFirst && lines.join('\n').length > maxChars * 0.9) {
      omittedSections = sections.length - i - 1;
      lines.push(`[${omittedSections} more sections omitted — budget limit]`);
      break;
    }
  }

  let result = lines.join('\n');
  let truncated = false;
  if (result.length > maxChars) {
    truncated = true;
    result = result.slice(0, maxChars) + '\n[...truncated]';
  }
  return {
    text: result,
    omittedSections,
    truncated,
  };
}
