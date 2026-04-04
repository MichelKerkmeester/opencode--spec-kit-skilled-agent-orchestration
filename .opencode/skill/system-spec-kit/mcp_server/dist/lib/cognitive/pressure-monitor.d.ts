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
declare const FOCUSED_THRESHOLD = 0.6;
declare const QUICK_THRESHOLD = 0.8;
declare const INACTIVE_POLICY_WARNING = "tokenUsage not provided and estimator unavailable; pressure policy inactive";
/**
 * Compute pressure level with a three-tier fallback contract:
 * 1) caller-provided tokenUsage
 * 2) server-side estimate from runtimeContextStats
 * 3) unavailable -> `none` + warning
 */
export declare function getPressureLevel(tokenUsage: number | undefined, runtimeContextStats?: RuntimeContextStats): PressureMonitorResult;
export { FOCUSED_THRESHOLD, QUICK_THRESHOLD, INACTIVE_POLICY_WARNING, };
//# sourceMappingURL=pressure-monitor.d.ts.map