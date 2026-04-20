// ───────────────────────────────────────────────────────────────
// MODULE: Promotion Two-Cycle Requirement
// ───────────────────────────────────────────────────────────────

export const REQUIRED_POSITIVE_SHADOW_CYCLES = 2;

export interface ShadowCycleHistoryEntry {
  readonly cycleId: string;
  readonly passed: boolean;
  readonly evaluatedAt: string;
  readonly candidateAccuracy?: number;
  readonly deltaVsLive?: number;
}

export interface TwoCycleState {
  readonly history: readonly ShadowCycleHistoryEntry[];
  readonly consecutivePassingCycles: number;
  readonly eligibleForPromotion: boolean;
}

function consecutivePasses(history: readonly ShadowCycleHistoryEntry[]): number {
  let count = 0;
  for (let index = history.length - 1; index >= 0; index -= 1) {
    if (!history[index].passed) break;
    count += 1;
  }
  return count;
}

export function recordShadowCycle(
  history: readonly ShadowCycleHistoryEntry[],
  entry: ShadowCycleHistoryEntry,
): TwoCycleState {
  const nextHistory = [...history, entry];
  const consecutivePassingCycles = consecutivePasses(nextHistory);
  return {
    history: nextHistory,
    consecutivePassingCycles,
    eligibleForPromotion: consecutivePassingCycles >= REQUIRED_POSITIVE_SHADOW_CYCLES,
  };
}

export function evaluateTwoCycleRequirement(history: readonly ShadowCycleHistoryEntry[]): TwoCycleState {
  const consecutivePassingCycles = consecutivePasses(history);
  return {
    history: [...history],
    consecutivePassingCycles,
    eligibleForPromotion: consecutivePassingCycles >= REQUIRED_POSITIVE_SHADOW_CYCLES,
  };
}
