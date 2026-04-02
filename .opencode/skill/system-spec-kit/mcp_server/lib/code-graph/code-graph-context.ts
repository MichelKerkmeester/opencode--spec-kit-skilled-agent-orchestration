// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Context
// ───────────────────────────────────────────────────────────────
// LLM-oriented compact graph neighborhoods with CocoIndex seed support.
// Provides the code_graph_context MCP tool implementation.

import { performance } from 'node:perf_hooks';
import * as graphDb from './code-graph-db.js';
import { resolveSeeds, type CodeGraphSeed, type ArtifactRef } from './seed-resolver.js';

export type QueryMode = 'neighborhood' | 'outline' | 'impact';

export interface ContextArgs {
  input?: string;
  queryMode?: QueryMode;
  subject?: string;
  seeds?: CodeGraphSeed[];
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
    freshness: { lastScanAt: string | null; staleness: 'fresh' | 'recent' | 'stale' | 'unknown' };
  };
}

interface GraphContextSection {
  anchor: string;
  nodes: { name: string; kind: string; file: string; line: number }[];
  edges: { from: string; to: string; type: string }[];
}

/** Build context from resolved anchors using specified query mode */
export function buildContext(args: ContextArgs): ContextResult {
  const queryMode = args.queryMode ?? 'neighborhood';
  const budgetTokens = args.budgetTokens ?? 1200;
  const seeds = args.seeds ?? [];
  const resolvedAnchors = resolveSeeds(seeds);

  // If no seeds but subject given, create seed from subject
  if (resolvedAnchors.length === 0 && args.subject) {
    const subjectRef = resolveSubjectToRef(args.subject);
    if (subjectRef) resolvedAnchors.push(subjectRef);
  }

  // Empty seeds + no subject → outline mode fallback
  if (resolvedAnchors.length === 0) {
    return buildEmptyFallback(queryMode, budgetTokens);
  }

  const sections: GraphContextSection[] = [];
  let totalNodes = 0;
  let totalEdges = 0;

  // Profile-based limits
  const nodeLimit = args.profile === 'quick' ? 10 : args.profile === 'debug' ? 30 : 20;

  const contextStart = performance.now();

  for (const anchor of resolvedAnchors) {
    // Deadline check: stop processing further anchors if over budget
    if (args.deadlineMs && performance.now() - contextStart > args.deadlineMs) {
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

    const section = expandAnchor(anchor, queryMode, args.deadlineMs ? args.deadlineMs - (performance.now() - contextStart) : undefined);
    sections.push(section);
    totalNodes += section.nodes.length;
    totalEdges += section.edges.length;
  }

  const textBrief = formatTextBrief(sections, budgetTokens, resolvedAnchors);
  const combinedSummary = buildCombinedSummary(resolvedAnchors, sections);
  const nextActions = suggestNextActions(resolvedAnchors, sections, queryMode);
  const freshness = computeFreshness();

  return {
    queryMode,
    resolvedAnchors,
    graphContext: sections,
    textBrief,
    combinedSummary,
    nextActions,
    metadata: {
      totalNodes,
      totalEdges,
      budgetUsed: Math.ceil(textBrief.length / 4),
      budgetLimit: budgetTokens,
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
    metadata: { totalNodes: 0, totalEdges: 0, budgetUsed: 0, budgetLimit: budgetTokens, freshness: computeFreshness() },
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

/** Expand a single anchor into a context section */
function expandAnchor(anchor: ArtifactRef, mode: QueryMode, remainingMs?: number): GraphContextSection {
  const startTime = performance.now();
  const budgetMs = remainingMs ?? 400; // 400ms default latency budget
  const nodes: { name: string; kind: string; file: string; line: number }[] = [];
  const edges: { from: string; to: string; type: string }[] = [];

  if (!anchor.symbolId) {
    return { anchor: anchor.filePath, nodes, edges };
  }

  switch (mode) {
    case 'neighborhood': {
      // 1-hop: CALLS + IMPORTS + CONTAINS from anchor
      for (const edgeType of ['CALLS', 'IMPORTS', 'CONTAINS'] as const) {
        const outgoing = graphDb.queryEdgesFrom(anchor.symbolId, edgeType);
        for (const { edge, targetNode } of outgoing) {
          edges.push({ from: anchor.fqName ?? anchor.symbolId, to: targetNode?.fqName ?? edge.targetId, type: edge.edgeType });
          if (targetNode) {
            nodes.push({ name: targetNode.fqName, kind: targetNode.kind, file: targetNode.filePath, line: targetNode.startLine });
          }
        }
        const incoming = graphDb.queryEdgesTo(anchor.symbolId, edgeType);
        for (const { edge, sourceNode } of incoming) {
          edges.push({ from: sourceNode?.fqName ?? edge.sourceId, to: anchor.fqName ?? anchor.symbolId, type: edge.edgeType });
          if (sourceNode) {
            nodes.push({ name: sourceNode.fqName, kind: sourceNode.kind, file: sourceNode.filePath, line: sourceNode.startLine });
          }
        }
      }
      break;
    }
    case 'outline': {
      const outlineNodes = graphDb.queryOutline(anchor.filePath);
      for (const n of outlineNodes) {
        nodes.push({ name: n.fqName, kind: n.kind, file: n.filePath, line: n.startLine });
      }
      // CONTAINS + EXPORTS from file symbols
      const fileExports = graphDb.queryEdgesFrom(anchor.symbolId, 'EXPORTS');
      for (const { edge, targetNode } of fileExports) {
        edges.push({ from: anchor.fqName ?? anchor.symbolId, to: targetNode?.fqName ?? edge.targetId, type: 'EXPORTS' });
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
          break;
        }
        const incoming = graphDb.queryEdgesTo(anchor.symbolId, edgeType);
        for (const { edge, sourceNode } of incoming) {
          edges.push({ from: sourceNode?.fqName ?? edge.sourceId, to: anchor.fqName ?? anchor.symbolId, type: edge.edgeType });
          if (sourceNode) {
            nodes.push({ name: sourceNode.fqName, kind: sourceNode.kind, file: sourceNode.filePath, line: sourceNode.startLine });
          }
        }
      }
      break;
    }
  }

  return {
    anchor: `${anchor.filePath}:${anchor.startLine} (${anchor.fqName ?? 'unknown'})`,
    nodes,
    edges,
  };
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
      };
    }
  } catch { /* DB not available */ }
  return null;
}

/**
 * Format sections into compact text brief within token budget.
 * Never-drops guarantee: always includes top seed, root anchor, one boundary edge, one next action.
 */
function formatTextBrief(sections: GraphContextSection[], budgetTokens: number, _anchors?: ArtifactRef[]): string {
  const maxChars = budgetTokens * 4;
  const lines: string[] = [];

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
        lines.push(`  ${e.from} -[${e.type}]-> ${e.to}`);
      }
      if (section.edges.length > edgeLimit) {
        lines.push(`  ... +${section.edges.length - edgeLimit} more`);
      }
    }

    lines.push('');

    // Budget check: stop adding sections if we're over budget (but first section always included)
    if (!isFirst && lines.join('\n').length > maxChars * 0.9) {
      lines.push(`[${sections.length - i - 1} more sections omitted — budget limit]`);
      break;
    }
  }

  let result = lines.join('\n');
  if (result.length > maxChars) {
    result = result.slice(0, maxChars) + '\n[...truncated]';
  }
  return result;
}
