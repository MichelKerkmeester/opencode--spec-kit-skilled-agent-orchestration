import Database from 'better-sqlite3';
interface MemoryStateBaselineSnapshot {
    capturedAt: string;
    evalRunId: number;
    specFolder: string | null;
    metrics: Record<string, number>;
    metadata: Record<string, unknown>;
    persistedRows?: number;
}
interface CaptureMemoryStateBaselineOptions {
    specFolder?: string | null;
    evalRunId?: number;
    persist?: boolean;
    metadata?: Record<string, unknown>;
    contextDbPath?: string;
}
/**
 * Persist a captured baseline snapshot into eval metric history.
 *
 * @param snapshot - Baseline snapshot to persist.
 * @param evalDb - Eval database that stores metric snapshots.
 * @returns Number of rows written to `eval_metric_snapshots`.
 */
declare function persistMemoryStateBaselineSnapshot(snapshot: MemoryStateBaselineSnapshot, evalDb: Database.Database): number;
/**
 * Capture baseline retrieval and isolation metrics for readiness.
 *
 * @param options - Snapshot configuration and optional persistence controls.
 * @returns Baseline snapshot for the current eval and context databases.
 */
declare function captureMemoryStateBaselineSnapshot(options?: CaptureMemoryStateBaselineOptions): MemoryStateBaselineSnapshot;
export { captureMemoryStateBaselineSnapshot, persistMemoryStateBaselineSnapshot, };
export type { CaptureMemoryStateBaselineOptions, MemoryStateBaselineSnapshot, };
//# sourceMappingURL=memory-state-baseline.d.ts.map