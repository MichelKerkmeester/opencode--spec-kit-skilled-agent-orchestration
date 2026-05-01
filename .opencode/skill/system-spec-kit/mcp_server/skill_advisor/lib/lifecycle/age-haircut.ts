// ───────────────────────────────────────────────────────────────
// MODULE: Derived Lane Age Haircut
// ───────────────────────────────────────────────────────────────

import { isAuthorLane, type DerivedTrustLane } from '../derived/trust-lanes.js';
// F-018-D3-02: derive lifecycle status from the canonical tuple instead of
// hand-writing the union; new values added to status-values.ts surface here
// as a compile error at the consumer site.
import type { SkillLifecycleStatus } from './status-values.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface AgeHaircutOptions {
  readonly generatedAt: string | Date;
  readonly now?: Date;
  readonly halfLifeDays?: number;
  readonly lifecycleStatus?: SkillLifecycleStatus;
}

export interface LaneScore {
  readonly trustLane: DerivedTrustLane;
  readonly score: number;
}

// ───────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function derivedAgeMultiplier(options: AgeHaircutOptions): number {
  const lifecycleStatus = options.lifecycleStatus ?? 'active';
  if (lifecycleStatus === 'archived' || lifecycleStatus === 'future') return 0;
  if (lifecycleStatus === 'deprecated') return 0.25;

  const halfLifeDays = Math.max(1, options.halfLifeDays ?? 90);
  const generatedAt = options.generatedAt instanceof Date ? options.generatedAt : new Date(options.generatedAt);
  const now = options.now ?? new Date();
  const ageDays = Math.max(0, (now.getTime() - generatedAt.getTime()) / 86_400_000);
  return Math.max(0.1, Math.pow(0.5, ageDays / halfLifeDays));
}

export function applyAgeHaircutToLane(laneScore: LaneScore, options: AgeHaircutOptions): LaneScore {
  if (isAuthorLane(laneScore.trustLane)) {
    return laneScore;
  }
  return {
    trustLane: laneScore.trustLane,
    score: Number((laneScore.score * derivedAgeMultiplier(options)).toFixed(6)),
  };
}

