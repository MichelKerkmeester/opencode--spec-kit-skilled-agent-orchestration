// ───────────────────────────────────────────────────────────────
// MODULE: Cross-File Edge Resolver
// ───────────────────────────────────────────────────────────────
// Reconciles conservative per-file call edges after all scan results have
// been persisted, so import proxy targets can point at concrete definitions
// when the global graph has exactly one safe match.

import * as graphDb from './code-graph-db.js';
import type { SymbolKind } from './indexer-types.js';

const CALL_TARGET_KINDS = new Set<SymbolKind>(['function', 'method', 'class']);

// FIX-011-FOLLOWUP-2-REFINE: when ambiguous between production code and a test
// fixture with the same name, prefer the production candidate. Test fixtures
// frequently reuse production symbol names (e.g. `getDefaultConfig` defined
// inside a vitest spec to exercise the resolver against itself), and treating
// those as equally-weighted candidates makes the resolver conservatively skip
// edges that should have resolved cleanly to the production target.
const TEST_FILE_PATTERN = /\.(?:test|vitest|spec)(?:-d)?\.[a-z]+$/;

function isTestFile(filePath: string): boolean {
  return TEST_FILE_PATTERN.test(filePath);
}

export interface CrossFileCallResolutionStats {
  resolved: number;
  unresolved: number;
  ambiguousSkipped: number;
}

interface CodeNodeRow {
  symbol_id: string;
  file_path: string;
  kind: SymbolKind;
  name: string;
}

interface ImportTargetedCallEdgeRow {
  id: number;
  import_name: string;
  import_file_path: string;
}

function emptyStats(): CrossFileCallResolutionStats {
  return {
    resolved: 0,
    unresolved: 0,
    ambiguousSkipped: 0,
  };
}

function hasResolutionActivity(stats: CrossFileCallResolutionStats): boolean {
  return stats.resolved > 0 || stats.unresolved > 0 || stats.ambiguousSkipped > 0;
}

export function hasCrossFileCallResolutionActivity(stats: CrossFileCallResolutionStats): boolean {
  return hasResolutionActivity(stats);
}

export function resolveCrossFileCallEdges(): CrossFileCallResolutionStats {
  const d = graphDb.getDb();

  return d.transaction(() => {
    const stats = emptyStats();
    const nodes = d.prepare(`
      SELECT symbol_id, file_path, kind, name
      FROM code_nodes
    `).all() as CodeNodeRow[];

    const callableNodesByName = new Map<string, CodeNodeRow[]>();
    for (const node of nodes) {
      if (!CALL_TARGET_KINDS.has(node.kind)) {
        continue;
      }
      const bucket = callableNodesByName.get(node.name) ?? [];
      bucket.push(node);
      callableNodesByName.set(node.name, bucket);
    }

    const importTargetedCallEdges = d.prepare(`
      SELECT
        edge.id AS id,
        target.name AS import_name,
        target.file_path AS import_file_path
      FROM code_edges edge
      INNER JOIN code_nodes target ON target.symbol_id = edge.target_id
      WHERE edge.edge_type = 'CALLS'
        AND target.kind = 'import'
    `).all() as ImportTargetedCallEdgeRow[];

    const updateTarget = d.prepare(`
      UPDATE code_edges
      SET target_id = ?
      WHERE id = ?
    `);

    for (const edge of importTargetedCallEdges) {
      const allCandidates = (callableNodesByName.get(edge.import_name) ?? [])
        .filter((candidate) => candidate.file_path !== edge.import_file_path);

      // Prefer production candidates: if filtering out test files leaves
      // exactly one match, treat that as the resolved target. Falls back to
      // the full set when no production candidate exists (test-only symbols)
      // or when the filter doesn't narrow enough (multiple production matches).
      const productionCandidates = allCandidates.filter((c) => !isTestFile(c.file_path));
      const candidates = productionCandidates.length > 0 ? productionCandidates : allCandidates;

      if (candidates.length === 1) {
        updateTarget.run(candidates[0].symbol_id, edge.id);
        stats.resolved++;
        continue;
      }

      if (candidates.length > 1) {
        stats.ambiguousSkipped++;
      } else {
        stats.unresolved++;
      }
    }

    return stats;
  })();
}
