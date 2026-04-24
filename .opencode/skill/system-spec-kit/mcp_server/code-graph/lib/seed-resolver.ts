// ───────────────────────────────────────────────────────────────
// MODULE: Seed Resolver
// ───────────────────────────────────────────────────────────────
// Resolves CocoIndex search results (file:line) to code graph nodes.
// Resolution chain: exact symbol → near-exact symbol → enclosing symbol → file anchor.

import * as graphDb from './code-graph-db.js';
import type { SymbolKind } from './indexer-types.js';

/** A seed from CocoIndex or other providers */
export interface CodeGraphSeed {
  filePath: string;
  startLine?: number;
  endLine?: number;
  query?: string;
  source?: string;
}

/** Native CocoIndex search result as a seed */
export interface CocoIndexSeed {
  provider: 'cocoindex';
  file: string;
  range: { start: number; end: number };
  score: number;
  snippet?: string;
  source?: string;
}

/** Manual seed with symbol name (no file path required) */
export interface ManualSeed {
  provider: 'manual';
  symbolName: string;
  filePath?: string;
  kind?: SymbolKind;
  source?: string;
}

/** Pre-resolved graph node seed */
export interface GraphSeed {
  provider: 'graph';
  nodeId: string;
  symbolId: string;
  source?: string;
}

/** Union type for all seed kinds */
export type AnySeed = CodeGraphSeed | CocoIndexSeed | ManualSeed | GraphSeed;

/** A resolved reference into the code graph */
export interface ArtifactRef {
  filePath: string;
  startLine: number;
  endLine: number;
  symbolId: string | null;
  fqName: string | null;
  kind: string | null;
  confidence: number; // 0.0 - 1.0
  resolution: 'exact' | 'near_exact' | 'enclosing' | 'file_anchor';
  score: number | null;
  snippet: string | null;
  range: { start: number; end: number } | null;
  provider: 'graph' | 'manual' | 'cocoindex' | 'code_graph';
  source?: string;
}

// ── Type guards ──────────────────────────────────────────────

function hasProvider(seed: unknown, provider: string): boolean {
  if (typeof seed !== 'object' || seed === null) {
    return false;
  }
  return (seed as { provider?: unknown }).provider === provider;
}

function isCocoIndexSeed(seed: unknown): seed is CocoIndexSeed {
  return hasProvider(seed, 'cocoindex');
}

function isManualSeed(seed: unknown): seed is ManualSeed {
  return hasProvider(seed, 'manual');
}

function isGraphSeed(seed: unknown): seed is GraphSeed {
  return hasProvider(seed, 'graph');
}

function throwResolutionError(operation: string, seed: unknown, err: unknown): never {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[seed-resolver] ${operation} failed`, { seed, error: message });
  throw new Error(`[seed-resolver] ${operation} failed: ${message}`);
}

// ── Seed resolvers ───────────────────────────────────────────

/** Resolve a CocoIndex seed by converting to CodeGraphSeed and delegating */
export function resolveCocoIndexSeed(seed: CocoIndexSeed): ArtifactRef {
  const resolved = resolveSeed({
    filePath: seed.file,
    startLine: seed.range.start,
    endLine: seed.range.end,
    source: seed.source,
  });
  return {
    ...resolved,
    score: seed.score,
    snippet: seed.snippet ?? null,
    range: seed.range,
    provider: 'cocoindex',
    source: seed.source,
  };
}

/** Resolve a ManualSeed by looking up the symbol name in the DB */
export function resolveManualSeed(seed: ManualSeed): ArtifactRef {
  try {
    const d = graphDb.getDb();

    let query = 'SELECT * FROM code_nodes WHERE name = ?';
    const params: unknown[] = [seed.symbolName];

    if (seed.filePath) {
      query += ' AND file_path = ?';
      params.push(seed.filePath);
    }
    if (seed.kind) {
      query += ' AND kind = ?';
      params.push(seed.kind);
    }
    query += ' LIMIT 1';

    const row = d.prepare(query).get(...params) as Record<string, unknown> | undefined;

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
        provider: 'manual',
        source: seed.source,
      };
    }
  } catch (err: unknown) {
    throwResolutionError('resolveManualSeed', seed, err);
  }

  return {
    filePath: seed.filePath ?? '<unknown>',
    startLine: 1,
    endLine: 1,
    symbolId: null,
    fqName: null,
    kind: seed.kind ?? null,
    confidence: 0.1,
    resolution: 'file_anchor',
    score: null,
    snippet: null,
    range: null,
    provider: 'manual',
    source: seed.source,
  };
}

/** Resolve a GraphSeed by looking up the node by symbolId in the DB */
export function resolveGraphSeed(seed: GraphSeed): ArtifactRef {
  try {
    const d = graphDb.getDb();

    const row = d.prepare(
      'SELECT * FROM code_nodes WHERE symbol_id = ? LIMIT 1'
    ).get(seed.symbolId) as Record<string, unknown> | undefined;

    if (row) {
      return {
        filePath: row.file_path as string,
        startLine: row.start_line as number,
        endLine: row.end_line as number,
        symbolId: row.symbol_id as string,
        fqName: row.fq_name as string,
        kind: row.kind as string,
        confidence: 1.0,
        resolution: 'exact',
        score: null,
        snippet: null,
        range: null,
        provider: 'graph',
        source: seed.source,
      };
    }
  } catch (err: unknown) {
    throwResolutionError('resolveGraphSeed', seed, err);
  }

  return {
    filePath: '<unknown>',
    startLine: 1,
    endLine: 1,
    symbolId: seed.symbolId,
    fqName: null,
    kind: null,
    confidence: 0.1,
    resolution: 'file_anchor',
    score: null,
    snippet: null,
    range: null,
    provider: 'graph',
    source: seed.source,
  };
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
          score: null,
          snippet: null,
          range: seed.startLine
            ? { start: seed.startLine, end: seed.endLine ?? seed.startLine }
            : null,
          provider: 'code_graph',
          source: seed.source,
        };
      }

      const nearExact = d.prepare(`
        SELECT * FROM code_nodes
        WHERE file_path = ? AND ABS(start_line - ?) <= 5
        ORDER BY ABS(start_line - ?) ASC, kind != 'function', start_line ASC
        LIMIT 1
      `).get(seed.filePath, seed.startLine, seed.startLine) as Record<string, unknown> | undefined;

      if (nearExact) {
        const distance = Math.abs((nearExact.start_line as number) - seed.startLine);
        return {
          filePath: seed.filePath,
          startLine: nearExact.start_line as number,
          endLine: nearExact.end_line as number,
          symbolId: nearExact.symbol_id as string,
          fqName: nearExact.fq_name as string,
          kind: nearExact.kind as string,
          confidence: Math.max(0, 0.95 - (distance * 0.02)),
          resolution: 'near_exact',
          score: null,
          snippet: null,
          range: seed.startLine
            ? { start: seed.startLine, end: seed.endLine ?? seed.startLine }
            : null,
          provider: 'code_graph',
          source: seed.source,
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
          score: null,
          snippet: null,
          range: seed.startLine
            ? { start: seed.startLine, end: seed.endLine ?? seed.startLine }
            : null,
          provider: 'code_graph',
          source: seed.source,
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
      score: null,
      snippet: null,
      range: seed.startLine
        ? { start: seed.startLine, end: seed.endLine ?? seed.startLine }
        : null,
      provider: 'code_graph',
      source: seed.source,
    };
  } catch (err: unknown) {
    throwResolutionError('resolveSeed', seed, err);
  }
}

/** Resolve any seed variant to an ArtifactRef */
function resolveAnySeed(seed: AnySeed): ArtifactRef {
  if (isCocoIndexSeed(seed)) return resolveCocoIndexSeed(seed);
  if (isManualSeed(seed)) return resolveManualSeed(seed);
  if (isGraphSeed(seed)) return resolveGraphSeed(seed);
  return resolveSeed(seed as CodeGraphSeed);
}

/** Resolve multiple seeds, deduplicate overlapping refs */
export function resolveSeeds(seeds: AnySeed[]): ArtifactRef[] {
  const refsByKey = new Map<string, ArtifactRef>();

  const compareRefs = (left: ArtifactRef, right: ArtifactRef): number => (
    (right.score ?? Number.NEGATIVE_INFINITY) - (left.score ?? Number.NEGATIVE_INFINITY)
    || right.confidence - left.confidence
    || left.filePath.localeCompare(right.filePath)
    || left.startLine - right.startLine
  );

  for (const seed of seeds) {
    const ref = resolveAnySeed(seed);
    const key = ref.symbolId ?? `${ref.filePath}:${ref.startLine}`;
    const previous = refsByKey.get(key);
    if (!previous || compareRefs(previous, ref) > 0) {
      refsByKey.set(key, ref);
    }
  }

  return [...refsByKey.values()].sort(compareRefs);
}
