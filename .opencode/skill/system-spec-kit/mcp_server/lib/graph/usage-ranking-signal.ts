// ───────────────────────────────────────────────────────────────
// MODULE: Usage Ranking Signal
// ───────────────────────────────────────────────────────────────
// Feature catalog: Usage-weighted ranking boost
// Computes a small log-scale score bonus from access_count so
// frequently used memories can receive a bounded ranking nudge.

import { isUsageRankingEnabled } from '../search/search-flags.js';

const MAX_USAGE_BOOST = 0.10;

export function computeUsageBoost(accessCount: number, maxAccess: number): number {
  if (!isUsageRankingEnabled()) {
    return 0;
  }

  if (
    !Number.isFinite(accessCount) || accessCount <= 0 ||
    !Number.isFinite(maxAccess) || maxAccess <= 0
  ) {
    return 0;
  }

  const safeAccessCount = Math.max(0, accessCount);
  const safeMaxAccess = Math.max(safeAccessCount, maxAccess);
  const normalized = Math.log1p(safeAccessCount) / Math.log1p(safeMaxAccess);

  if (!Number.isFinite(normalized) || normalized <= 0) {
    return 0;
  }

  return Math.min(MAX_USAGE_BOOST, normalized * MAX_USAGE_BOOST);
}
