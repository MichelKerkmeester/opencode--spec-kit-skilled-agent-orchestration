// ───────────────────────────────────────────────────────────────
// MODULE: Pressure Monitor
// ───────────────────────────────────────────────────────────────
// Feature catalog: Quality-aware 3-tier search fallback
export interface RuntimeContextStats {
  tokenCount?: number;
  tokenBudget?: number;
}

type PressureSource = 'caller' | 'estimator' | 'unavailable';
type PressureLevel = 'none' | 'focused' | 'quick';

interface PressureMonitorResult {
  level: PressureLevel;
  ratio: number | null;
  source: PressureSource;
  warning: string | null;
}

const FOCUSED_THRESHOLD = 0.6;
const QUICK_THRESHOLD = 0.8;
const INACTIVE_POLICY_WARNING = 'tokenUsage not provided and estimator unavailable; pressure policy inactive';

function clampToRatio(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function classifyPressure(ratio: number): PressureLevel {
  if (ratio >= QUICK_THRESHOLD) {
    return 'quick';
  }

  if (ratio >= FOCUSED_THRESHOLD) {
    return 'focused';
  }

  return 'none';
}

function deriveRatioFromRuntimeContext(runtimeContextStats?: RuntimeContextStats): number | null {
  if (!runtimeContextStats) {
    return null;
  }

  const { tokenCount, tokenBudget } = runtimeContextStats;
  if (
    typeof tokenCount !== 'number' ||
    !Number.isFinite(tokenCount) ||
    typeof tokenBudget !== 'number' ||
    !Number.isFinite(tokenBudget) ||
    tokenBudget <= 0
  ) {
    return null;
  }

  return clampToRatio(tokenCount / tokenBudget);
}

/**
 * Compute pressure level with a three-tier fallback contract:
 * 1) caller-provided tokenUsage
 * 2) server-side estimate from runtimeContextStats
 * 3) unavailable -> `none` + warning
 */
export function getPressureLevel(
  tokenUsage: number | undefined,
  runtimeContextStats?: RuntimeContextStats
): PressureMonitorResult {
  if (typeof tokenUsage === 'number' && Number.isFinite(tokenUsage)) {
    const ratio = clampToRatio(tokenUsage);
    return {
      level: classifyPressure(ratio),
      ratio,
      source: 'caller',
      warning: null,
    };
  }

  const estimatedRatio = deriveRatioFromRuntimeContext(runtimeContextStats);
  if (estimatedRatio !== null) {
    return {
      level: classifyPressure(estimatedRatio),
      ratio: estimatedRatio,
      source: 'estimator',
      warning: null,
    };
  }

  return {
    level: 'none',
    ratio: null,
    source: 'unavailable',
    warning: INACTIVE_POLICY_WARNING,
  };
}

export {
  FOCUSED_THRESHOLD,
  QUICK_THRESHOLD,
  INACTIVE_POLICY_WARNING,
};
