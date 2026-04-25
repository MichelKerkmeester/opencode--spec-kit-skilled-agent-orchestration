import type { EdgeType } from './indexer-types.js';
import { DEFAULT_EDGE_WEIGHTS } from './indexer-types.js';

const EDGE_TYPES = Object.keys(DEFAULT_EDGE_WEIGHTS) as EdgeType[];
const DIVERGENCE_EPSILON = 1e-12;

export type EdgeDistribution = Record<EdgeType, number>;

function normalizeValue(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function normalizeWithSmoothing(distribution: EdgeDistribution): EdgeDistribution {
  const share = computeEdgeShare(distribution);
  const smoothedEntries = EDGE_TYPES.map((edgeType) => [
    edgeType,
    share[edgeType] + DIVERGENCE_EPSILON,
  ] as const);
  const total = smoothedEntries.reduce((sum, [, value]) => sum + value, 0);

  return Object.fromEntries(
    smoothedEntries.map(([edgeType, value]) => [edgeType, value / total]),
  ) as EdgeDistribution;
}

export function buildEdgeDistribution(
  distribution?: Partial<Record<EdgeType, number>> | Record<string, number> | null,
): EdgeDistribution {
  return Object.fromEntries(
    EDGE_TYPES.map((edgeType) => [edgeType, normalizeValue(distribution?.[edgeType] ?? 0)]),
  ) as EdgeDistribution;
}

export function computeEdgeShare(edges: EdgeDistribution): EdgeDistribution {
  const total = EDGE_TYPES.reduce((sum, edgeType) => sum + normalizeValue(edges[edgeType]), 0);

  if (total === 0) {
    return Object.fromEntries(EDGE_TYPES.map((edgeType) => [edgeType, 0])) as EdgeDistribution;
  }

  return Object.fromEntries(
    EDGE_TYPES.map((edgeType) => [edgeType, normalizeValue(edges[edgeType]) / total]),
  ) as EdgeDistribution;
}

export function computePSI(observed: EdgeDistribution, baseline: EdgeDistribution): number {
  const observedShare = normalizeWithSmoothing(observed);
  const baselineShare = normalizeWithSmoothing(baseline);

  return EDGE_TYPES.reduce((sum, edgeType) => {
    const observedValue = observedShare[edgeType];
    const baselineValue = baselineShare[edgeType];
    return sum + (observedValue - baselineValue) * Math.log(observedValue / baselineValue);
  }, 0);
}

export function computeJSD(observed: EdgeDistribution, baseline: EdgeDistribution): number {
  const observedShare = normalizeWithSmoothing(observed);
  const baselineShare = normalizeWithSmoothing(baseline);
  const midpoint = Object.fromEntries(
    EDGE_TYPES.map((edgeType) => [
      edgeType,
      (observedShare[edgeType] + baselineShare[edgeType]) / 2,
    ]),
  ) as EdgeDistribution;

  const kl = (left: EdgeDistribution, right: EdgeDistribution): number => EDGE_TYPES.reduce((sum, edgeType) => {
    const leftValue = left[edgeType];
    const rightValue = right[edgeType];
    return sum + leftValue * Math.log(leftValue / rightValue);
  }, 0);

  return 0.5 * kl(observedShare, midpoint) + 0.5 * kl(baselineShare, midpoint);
}
