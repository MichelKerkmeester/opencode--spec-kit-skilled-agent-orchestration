// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Scorer Lane Registry
// ───────────────────────────────────────────────────────────────

export const SCORER_LANE_REGISTRY = [
  { id: 'explicit_author', weight: 0.45, shadowWeight: 0.40, live: true },
  { id: 'lexical', weight: 0.30, shadowWeight: 0.25, live: true },
  { id: 'graph_causal', weight: 0.15, shadowWeight: 0.20, live: true },
  { id: 'derived_generated', weight: 0.15, shadowWeight: 0.10, live: true },
  { id: 'semantic_shadow', weight: 0.00, shadowWeight: 0.05, live: false },
] as const;

export type ScorerLaneId = (typeof SCORER_LANE_REGISTRY)[number]['id'];

export const SCORER_LANE_IDS = SCORER_LANE_REGISTRY.map((lane) => lane.id) as [
  ScorerLaneId,
  ...ScorerLaneId[],
];

export const LIVE_SCORER_LANE_IDS = SCORER_LANE_REGISTRY
  .filter((lane) => lane.live)
  .map((lane) => lane.id) as ScorerLaneId[];

export const DEFAULT_SCORER_LANE_WEIGHTS = Object.fromEntries(
  SCORER_LANE_REGISTRY.map((lane) => [lane.id, lane.weight]),
) as Record<ScorerLaneId, number>;

export const DEFAULT_SHADOW_SCORER_LANE_WEIGHTS = Object.fromEntries(
  SCORER_LANE_REGISTRY.map((lane) => [lane.id, lane.shadowWeight]),
) as Record<ScorerLaneId, number>;

export function isLiveScorerLane(lane: ScorerLaneId): boolean {
  return SCORER_LANE_REGISTRY.some((entry) => entry.id === lane && entry.live);
}
