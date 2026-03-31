// ───────────────────────────────────────────────────────────────
// MODULE: Seed Resolver
// ───────────────────────────────────────────────────────────────
// Resolves CocoIndex search results (file:line) to code graph nodes.
// Resolution chain: exact symbol → enclosing symbol → file anchor.

import * as graphDb from './code-graph-db.js';
import type { CodeNode } from './indexer-types.js';

/** A seed from CocoIndex or other providers */
export interface CodeGraphSeed {
  filePath: string;
  startLine?: number;
  endLine?: number;
  query?: string;
}

/** A resolved reference into the code graph */
export interface ArtifactRef {
  filePath: string;
  startLine: number;
  endLine: number;
  symbolId: string | null;
  fqName: string | null;
  kind: string | null;
  confidence: number; // 0.0 - 1.0
  resolution: 'exact' | 'enclosing' | 'file_anchor';
}

/** Resolve a single seed to an ArtifactRef */
export function resolveSeed(seed: CodeGraphSeed): ArtifactRef {
  try {
    const d = graphDb.getDb();

    // Try exact symbol match at line
    if (seed.startLine) {
      const exact = d.prepare(`
        SELECT * FROM code_nodes
        WHERE file_path = ? AND start_line = ?
        ORDER BY kind != 'function' -- prefer functions
        LIMIT 1
      `).get(seed.filePath, seed.startLine) as Record<string, unknown> | undefined;

      if (exact) {
        return {
          filePath: seed.filePath,
          startLine: exact.start_line as number,
          endLine: exact.end_line as number,
          symbolId: exact.symbol_id as string,
          fqName: exact.fq_name as string,
          kind: exact.kind as string,
          confidence: 1.0,
          resolution: 'exact',
        };
      }

      // Try enclosing symbol (symbol whose range contains the line)
      const enclosing = d.prepare(`
        SELECT * FROM code_nodes
        WHERE file_path = ? AND start_line <= ? AND end_line >= ?
        ORDER BY (end_line - start_line) ASC
        LIMIT 1
      `).get(seed.filePath, seed.startLine, seed.startLine) as Record<string, unknown> | undefined;

      if (enclosing) {
        return {
          filePath: seed.filePath,
          startLine: enclosing.start_line as number,
          endLine: enclosing.end_line as number,
          symbolId: enclosing.symbol_id as string,
          fqName: enclosing.fq_name as string,
          kind: enclosing.kind as string,
          confidence: 0.7,
          resolution: 'enclosing',
        };
      }
    }

    // Fallback: file anchor
    return {
      filePath: seed.filePath,
      startLine: seed.startLine ?? 1,
      endLine: seed.endLine ?? 1,
      symbolId: null,
      fqName: null,
      kind: null,
      confidence: 0.3,
      resolution: 'file_anchor',
    };
  } catch {
    // DB not available — return file anchor
    return {
      filePath: seed.filePath,
      startLine: seed.startLine ?? 1,
      endLine: seed.endLine ?? 1,
      symbolId: null,
      fqName: null,
      kind: null,
      confidence: 0.1,
      resolution: 'file_anchor',
    };
  }
}

/** Resolve multiple seeds, deduplicate overlapping refs */
export function resolveSeeds(seeds: CodeGraphSeed[]): ArtifactRef[] {
  const refs: ArtifactRef[] = [];
  const seen = new Set<string>();

  for (const seed of seeds) {
    const ref = resolveSeed(seed);
    const key = ref.symbolId ?? `${ref.filePath}:${ref.startLine}`;
    if (!seen.has(key)) {
      seen.add(key);
      refs.push(ref);
    }
  }

  // Sort by confidence descending
  refs.sort((a, b) => b.confidence - a.confidence);
  return refs;
}
