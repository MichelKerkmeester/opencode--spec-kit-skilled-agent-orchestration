const FOCUSED_THRESHOLD = 0.6;
const QUICK_THRESHOLD = 0.8;
const INACTIVE_POLICY_WARNING = 'tokenUsage not provided and estimator unavailable; pressure policy inactive';
function clampToRatio(value) {
    return Math.max(0, Math.min(1, value));
}
function classifyPressure(ratio) {
    if (ratio >= QUICK_THRESHOLD) {
        return 'quick';
    }
    if (ratio >= FOCUSED_THRESHOLD) {
        return 'focused';
    }
    return 'none';
}
function deriveRatioFromRuntimeContext(runtimeContextStats) {
    if (!runtimeContextStats) {
        return null;
    }
    const { tokenCount, tokenBudget } = runtimeContextStats;
    if (typeof tokenCount !== 'number' ||
        !Number.isFinite(tokenCount) ||
        typeof tokenBudget !== 'number' ||
        !Number.isFinite(tokenBudget) ||
        tokenBudget <= 0) {
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
export function getPressureLevel(tokenUsage, runtimeContextStats) {
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
export { FOCUSED_THRESHOLD, QUICK_THRESHOLD, INACTIVE_POLICY_WARNING, };
//# sourceMappingURL=pressure-monitor.js.map