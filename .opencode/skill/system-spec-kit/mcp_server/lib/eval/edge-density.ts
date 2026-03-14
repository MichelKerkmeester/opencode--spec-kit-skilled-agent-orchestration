// ───────────────────────────────────────────────────────────────
// MODULE: Edge Density
// ───────────────────────────────────────────────────────────────
// Measures the edge density of the causal graph:
// Density = edge_count / total_memories
//
// This denominator makes sparse non-empty graphs measurable.
// Fallback for legacy/partial datasets: if total_memories is 0,
// Use unique participating nodes as denominator.
//
// Density classifications:
// >= 1.0  → "dense"    — graph is highly connected
// 0.5–1.0 → "moderate" — sufficient for graph signals
// < 0.5   → "sparse"   — R10 escalation recommended
//
// When density < 0.5 an R10 escalation recommendation is generated
// And included in the result.

import type Database from 'better-sqlite3';

// Feature catalog: Edge density measurement


/* --- 1. TYPES --- */

/** Density classification label. */
export type DensityClassification = 'dense' | 'moderate' | 'sparse';

/** Full result returned by measureEdgeDensity(). */
export interface EdgeDensityResult {
  /** Total number of rows in causal_edges. */
  edgeCount: number;
  /** Number of unique memory IDs participating in at least one edge. */
  nodeCount: number;
  /** Total memories in memory_index (used for coverage context). */
  totalMemories: number;
  /**
   * Edge density: edgeCount / totalMemories (primary denominator).
   * Falls back to edgeCount / nodeCount when totalMemories is 0.
   * Returns 0 when both denominators are 0 (empty graph).
   */
  density: number;
  /** Human-readable density band. */
  classification: DensityClassification;
  /** true when density < 0.5 — triggers R10 escalation. */
  r10Escalation: boolean;
  /** Present when r10Escalation is true. Contains timeline recommendation. */
  r10Recommendation?: string;
}

/* --- 2. CONSTANTS --- */

/** Lower boundary for "moderate" classification. */
const MODERATE_THRESHOLD = 0.5;
/** Lower boundary for "dense" classification. */
const DENSE_THRESHOLD = 1.0;

/* --- 3. CORE FUNCTION --- */

/**
 * Measure the edge density of the causal graph stored in `database`.
 *
 * Queries:
 *   - Total edge count from causal_edges.
 *   - Unique node count = UNION of source_id and target_id values.
 *   - Total memory count from memory_index (coverage context).
 *
 * @param database - An initialized better-sqlite3 Database instance.
 * @returns EdgeDensityResult with all metrics and optional R10 escalation.
 */
export function measureEdgeDensity(database: Database.Database): EdgeDensityResult {
  try {
    // Total edges
    const edgeRow = database
      .prepare('SELECT COUNT(*) AS cnt FROM causal_edges')
      .get() as { cnt: number };
    const edgeCount = edgeRow.cnt;

    // Unique nodes participating in at least one edge (union of source + target)
    const nodeRow = database
      .prepare(`
        SELECT COUNT(*) AS cnt FROM (
          SELECT source_id AS node_id FROM causal_edges
          UNION
          SELECT target_id AS node_id FROM causal_edges
        )
      `)
      .get() as { cnt: number };
    const nodeCount = nodeRow.cnt;

    // Total memories in memory_index (for coverage context)
    const memRow = database
      .prepare('SELECT COUNT(*) AS cnt FROM memory_index')
      .get() as { cnt: number };
    const totalMemories = memRow.cnt;

    // Density denominator uses total memories for meaningful sparse-graph semantics.
    // If memory_index is empty but edges exist, fall back to participating nodes.
    const denominator = totalMemories > 0 ? totalMemories : nodeCount;
    const density = denominator > 0 ? edgeCount / denominator : 0;

    // Classify
    const classification = classifyDensity(density);

    // R10 escalation
    const r10Escalation = density < MODERATE_THRESHOLD;
    const r10Recommendation = r10Escalation
      ? buildR10Recommendation(density, edgeCount, nodeCount, totalMemories)
      : undefined;

    return {
      edgeCount,
      nodeCount,
      totalMemories,
      density,
      classification,
      r10Escalation,
      r10Recommendation,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[edge-density] measureEdgeDensity failed: ${msg}`);
    return {
      density: 0,
      classification: 'sparse' as const,
      edgeCount: 0,
      nodeCount: 0,
      totalMemories: 0,
      r10Escalation: true,
      r10Recommendation: 'Database query failed — unable to measure edge density.',
    };
  }
}

/* --- 4. REPORT FORMATTER --- */

/**
 * Format an EdgeDensityResult into a human-readable multi-line report.
 *
 * @param result - The result returned by measureEdgeDensity().
 * @returns Multi-line report string suitable for logs or console output.
 */
export function formatDensityReport(result: EdgeDensityResult): string {
  const lines: string[] = [
    '=== Edge Density Report ===',
    `  Total edges        : ${result.edgeCount}`,
    `  Unique nodes       : ${result.nodeCount}`,
    `  Total memories     : ${result.totalMemories}`,
    `  Density (e/n)      : ${result.density.toFixed(4)}`,
    `  Classification     : ${result.classification.toUpperCase()}`,
    `  R10 escalation     : ${result.r10Escalation ? 'YES' : 'no'}`,
  ];

  if (result.r10Escalation && result.r10Recommendation) {
    lines.push('');
    lines.push('  R10 Recommendation:');
    for (const line of result.r10Recommendation.split('\n')) {
      lines.push(`    ${line}`);
    }
  }

  lines.push('===========================');
  return lines.join('\n');
}

/* --- 5. INTERNAL HELPERS --- */

/**
 * Classify a density value into a DensityClassification label.
 */
function classifyDensity(density: number): DensityClassification {
  if (density >= DENSE_THRESHOLD) return 'dense';
  if (density >= MODERATE_THRESHOLD) return 'moderate';
  return 'sparse';
}

/**
 * Build an R10 escalation recommendation when density < 0.5.
 *
 * Documents:
 *   - Current density
 *   - Sprint timeline recommendation for R10 (graph enrichment)
 *   - Impact on R4 (typed-degree) effectiveness
 */
function buildR10Recommendation(
  density: number,
  edgeCount: number,
  nodeCount: number,
  totalMemories: number,
): string {
  const targetDensity = MODERATE_THRESHOLD;
  const denominator = totalMemories > 0 ? totalMemories : nodeCount;
  const edgesNeeded =
    denominator > 0 ? Math.ceil(targetDensity * denominator) - edgeCount : 0;

  return [
    `Current density ${density.toFixed(4)} is below the 0.5 threshold for reliable graph signals.`,
    '',
    'R10 (Graph Enrichment) — Recommended Timeline:',
    '  Priority  : HIGH — must be scheduled before Sprint 3 graph-channel work.',
    '  Target    : Raise density to >= 0.5 (moderate) before enabling graph retrieval.',
    `  Gap       : ${edgesNeeded > 0 ? edgesNeeded + ' additional edges needed' : 'verify edge count — nodeCount is 0'}.`,
    '  Approach  : Add causal links for constitutional and critical tier memories',
    '              first, as they contribute most to retrieval quality.',
    '',
    'Impact on R4 (Typed-Degree) Effectiveness:',
    '  R4 typed-degree signals depend on well-connected nodes to surface',
    '  relevant memories via graph traversal. At density < 0.5 the graph',
    '  is too sparse for typed-degree to meaningfully differentiate nodes.',
    '  R4 scoring will revert to uniform (degree=0) for most nodes,',
    '  neutralising its contribution to hybrid search until R10 is complete.',
  ].join('\n');
}
