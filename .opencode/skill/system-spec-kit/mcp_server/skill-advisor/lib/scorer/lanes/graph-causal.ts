// ───────────────────────────────────────────────────────────────
// MODULE: Graph Causal Lane
// ───────────────────────────────────────────────────────────────

import type { AdvisorProjection, LaneMatch } from '../types.js';

export interface GraphCausalOptions {
  readonly maxDepth?: number;
  readonly maxBreadth?: number;
}

const EDGE_MULTIPLIER: Readonly<Record<string, number>> = {
  enhances: 0.55,
  siblings: 0.35,
  depends_on: 0.35,
  prerequisite_for: 0.30,
  conflicts_with: -0.35,
};

export function scoreGraphCausalLane(
  seedMatches: readonly LaneMatch[],
  projection: AdvisorProjection,
  options: GraphCausalOptions = {},
): LaneMatch[] {
  const maxDepth = options.maxDepth ?? 2;
  const maxBreadth = options.maxBreadth ?? 4;
  const adjacency = new Map<string, typeof projection.edges>();
  for (const edge of projection.edges) {
    const current = adjacency.get(edge.sourceId) ?? [];
    adjacency.set(edge.sourceId, [...current, edge]);
  }

  const seedScores = new Map<string, number>();
  for (const match of seedMatches) {
    if (match.lane === 'semantic_shadow') continue;
    seedScores.set(match.skillId, Math.max(seedScores.get(match.skillId) ?? 0, match.score));
  }

  const scores = new Map<string, { score: number; evidence: string[] }>();
  for (const [seedId, seedScore] of seedScores) {
    const queue: Array<{ id: string; depth: number; strength: number; path: string }> = [{ id: seedId, depth: 0, strength: seedScore, path: seedId }];
    const seen = new Set([seedId]);
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.depth >= maxDepth) continue;
      const outgoing = [...(adjacency.get(current.id) ?? [])]
        .sort((left, right) => right.weight - left.weight)
        .slice(0, maxBreadth);
      for (const edge of outgoing) {
        if (seen.has(edge.targetId)) continue;
        seen.add(edge.targetId);
        const multiplier = EDGE_MULTIPLIER[edge.edgeType] ?? 0.2;
        const propagated = current.strength * edge.weight * Math.abs(multiplier) * (1 / (current.depth + 1));
        if (propagated < 0.05) continue;
        const signed = multiplier < 0 ? -propagated : propagated;
        const entry = scores.get(edge.targetId) ?? { score: 0, evidence: [] };
        entry.score += signed;
        entry.evidence.push(`edge:${current.id}->${edge.targetId}:${edge.edgeType}`);
        scores.set(edge.targetId, entry);
        queue.push({
          id: edge.targetId,
          depth: current.depth + 1,
          strength: propagated,
          path: `${current.path}/${edge.targetId}`,
        });
      }
    }
  }

  return [...scores.entries()]
    .filter(([, value]) => value.score > 0)
    .map(([skillId, value]) => ({
      skillId,
      lane: 'graph_causal' as const,
      score: Math.min(value.score, 1),
      evidence: value.evidence.slice(0, 6),
    }));
}
