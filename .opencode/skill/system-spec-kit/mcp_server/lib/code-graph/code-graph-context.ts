// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Context
// ───────────────────────────────────────────────────────────────
// LLM-oriented compact graph neighborhoods with CocoIndex seed support.
// Provides the code_graph_context MCP tool implementation.

import * as graphDb from './code-graph-db.js';
import { resolveSeeds, type CodeGraphSeed, type ArtifactRef } from './seed-resolver.js';
import type { CodeNode, CodeEdge } from './indexer-types.js';

export type QueryMode = 'neighborhood' | 'outline' | 'impact';

export interface ContextArgs {
  input?: string;
  queryMode?: QueryMode;
  subject?: string;
  seeds?: CodeGraphSeed[];
  budgetTokens?: number;
}

export interface ContextResult {
  queryMode: QueryMode;
  resolvedAnchors: ArtifactRef[];
  graphContext: GraphContextSection[];
  textBrief: string;
  metadata: {
    totalNodes: number;
    totalEdges: number;
    budgetUsed: number;
    budgetLimit: number;
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

  const sections: GraphContextSection[] = [];
  let totalNodes = 0;
  let totalEdges = 0;

  for (const anchor of resolvedAnchors) {
    if (!anchor.symbolId) {
      // File anchor — get outline
      const outlineNodes = graphDb.queryOutline(anchor.filePath).slice(0, 20);
      sections.push({
        anchor: `${anchor.filePath}:${anchor.startLine}`,
        nodes: outlineNodes.map(n => ({ name: n.fqName, kind: n.kind, file: n.filePath, line: n.startLine })),
        edges: [],
      });
      totalNodes += outlineNodes.length;
      continue;
    }

    const section = expandAnchor(anchor, queryMode);
    sections.push(section);
    totalNodes += section.nodes.length;
    totalEdges += section.edges.length;
  }

  const textBrief = formatTextBrief(sections, budgetTokens);

  return {
    queryMode,
    resolvedAnchors,
    graphContext: sections,
    textBrief,
    metadata: {
      totalNodes,
      totalEdges,
      budgetUsed: Math.ceil(textBrief.length / 4),
      budgetLimit: budgetTokens,
    },
  };
}

/** Expand a single anchor into a context section */
function expandAnchor(anchor: ArtifactRef, mode: QueryMode): GraphContextSection {
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
      for (const edgeType of ['CALLS', 'IMPORTS'] as const) {
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

/** Format sections into compact text brief within token budget */
function formatTextBrief(sections: GraphContextSection[], budgetTokens: number): string {
  const lines: string[] = [];
  const maxChars = budgetTokens * 4;

  for (const section of sections) {
    lines.push(`### ${section.anchor}`);

    if (section.nodes.length > 0) {
      lines.push('Symbols:');
      for (const n of section.nodes.slice(0, 15)) {
        lines.push(`  ${n.kind} ${n.name} (${n.file}:${n.line})`);
      }
      if (section.nodes.length > 15) {
        lines.push(`  ... +${section.nodes.length - 15} more`);
      }
    }

    if (section.edges.length > 0) {
      lines.push('Relationships:');
      for (const e of section.edges.slice(0, 10)) {
        lines.push(`  ${e.from} -[${e.type}]-> ${e.to}`);
      }
      if (section.edges.length > 10) {
        lines.push(`  ... +${section.edges.length - 10} more`);
      }
    }

    lines.push('');
  }

  let result = lines.join('\n');
  if (result.length > maxChars) {
    result = result.slice(0, maxChars) + '\n[...truncated]';
  }
  return result;
}
