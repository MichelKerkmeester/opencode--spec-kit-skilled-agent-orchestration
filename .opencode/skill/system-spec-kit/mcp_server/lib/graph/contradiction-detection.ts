// ───────────────────────────────────────────────────────────────
// MODULE: Contradiction Detection
// ───────────────────────────────────────────────────────────────
// Feature catalog: Causal edge contradiction detection
// Detects when a new edge contradicts an existing one and
// auto-invalidates the old edge via temporal-edges.
// Feature-gated via SPECKIT_TEMPORAL_EDGES (shared gate).
import type Database from 'better-sqlite3';

import { isTemporalEdgesEnabled } from '../search/search-flags.js';
import { ensureTemporalColumns, invalidateEdge } from './temporal-edges.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface ContradictionResult {
  oldEdge: {
    sourceId: number;
    targetId: number;
    relation: string;
  };
  oldSourceId: number;
  oldTargetId: number;
  oldRelation: string;
  reason: string;
}

// ───────────────────────────────────────────────────────────────
// 2. CONFLICT RULES
// ───────────────────────────────────────────────────────────────

/**
 * Relation pairs that are mutually exclusive on the same source+target.
 * If a new edge has one relation and an existing edge has the other,
 * the existing edge is invalidated.
 */
const CONFLICTING_RELATIONS: ReadonlyArray<[string, string]> = [
  ['supports', 'contradicts'],
  ['caused', 'contradicts'],
  ['enabled', 'contradicts'],
];

/**
 * Check whether two relations conflict according to the conflict rules.
 */
function relationsConflict(existingRelation: string, newRelation: string): boolean {
  const existingLower = existingRelation.toLowerCase();
  const newLower = newRelation.toLowerCase();
  for (const [a, b] of CONFLICTING_RELATIONS) {
    if ((existingLower === a && newLower === b) || (existingLower === b && newLower === a)) {
      return true;
    }
  }
  return false;
}

// ───────────────────────────────────────────────────────────────
// 3. DETECTION + AUTO-INVALIDATION
// ───────────────────────────────────────────────────────────────

/**
 * Check if a new edge contradicts existing edges.
 * Contradiction rules:
 * 1. Same source+target with relation 'supersedes' → invalidate old edge
 * 2. Same source+target with conflicting relations (e.g., 'supports' vs 'contradicts')
 * Returns array of contradictions found and invalidated.
 */
export function detectContradictions(
  db: Database.Database,
  newSourceId: number,
  newTargetId: number,
  newRelation: string,
): ContradictionResult[] {
  if (!isTemporalEdgesEnabled()) {
    return [];
  }

  const results: ContradictionResult[] = [];

  try {
    ensureTemporalColumns(db);

    // Find existing valid edges between the same source and target
    const rows = (db.prepare(`
      SELECT source_id, target_id, relation
      FROM causal_edges
      WHERE source_id = ? AND target_id = ?
        AND (invalid_at IS NULL OR invalid_at = '')
    `) as Database.Statement).all(
      String(newSourceId),
      String(newTargetId),
    ) as Array<{ source_id: string; target_id: string; relation: string }>;

    for (const row of rows) {
      const oldRelation = row.relation;
      let reason: string | null = null;

      // Rule 1: 'supersedes' replaces any existing edge on the same pair
      if (newRelation.toLowerCase() === 'supersedes' && oldRelation.toLowerCase() !== 'supersedes') {
        reason = `Superseded by new '${newRelation}' edge`;
      }

      // Rule 2: Conflicting relation pairs
      if (!reason && relationsConflict(oldRelation, newRelation)) {
        reason = `Conflicting relations: existing '${oldRelation}' vs new '${newRelation}'`;
      }

      if (reason) {
        invalidateEdge(db, newSourceId, newTargetId, reason, oldRelation);
        results.push({
          oldEdge: {
            sourceId: Number.parseInt(row.source_id, 10),
            targetId: Number.parseInt(row.target_id, 10),
            relation: oldRelation,
          },
          oldSourceId: Number.parseInt(row.source_id, 10),
          oldTargetId: Number.parseInt(row.target_id, 10),
          oldRelation,
          reason,
        });
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[contradiction-detection] detectContradictions failed (fail-open): ${message}`);
  }

  return results;
}
