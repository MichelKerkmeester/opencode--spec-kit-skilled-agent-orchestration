export interface SessionMetrics {
    sessionId: string;
    startedAt: string;
    lastToolCallAt: string | null;
    toolCallCount: number;
    memoryRecoveryCalls: number;
    codeGraphQueries: number;
    specFolderTransitions: number;
    currentSpecFolder: string | null;
    primed: boolean;
}
export type QualityLevel = 'healthy' | 'degraded' | 'critical';
export interface QualityScore {
    level: QualityLevel;
    score: number;
    factors: {
        recency: number;
        recovery: number;
        graphFreshness: number;
        continuity: number;
    };
}
export type MetricEventKind = 'tool_call' | 'memory_recovery' | 'code_graph_query' | 'spec_folder_change' | 'bootstrap';
export type BootstrapSource = 'hook' | 'mcp_auto' | 'agent' | 'manual' | 'tool';
export type BootstrapCompleteness = 'full' | 'partial' | 'minimal';
export interface BootstrapRecord {
    source: BootstrapSource;
    durationMs: number;
    completeness: BootstrapCompleteness;
    timestamp: string;
}
export interface MetricEvent {
    kind: MetricEventKind;
    toolName?: string;
    specFolder?: string;
}
/** Record a metric event from tool dispatch or lifecycle hooks. */
export declare function recordMetricEvent(event: MetricEvent): void;
/** Phase 024 / Item 9: Record a bootstrap telemetry event. */
export declare function recordBootstrapEvent(source: BootstrapSource, durationMs: number, completeness: BootstrapCompleteness): void;
/** Get all bootstrap records for diagnostics. */
export declare function getBootstrapRecords(): readonly BootstrapRecord[];
/** Return a read-only snapshot of current session metrics. */
export declare function getSessionMetrics(): SessionMetrics;
/**
 * F047: Single source of truth for lastToolCallAt timestamp.
 * session-health.ts should use this instead of the memory-surface duplicate.
 */
export declare function getLastToolCallAt(): number | null;
/** Compute overall quality score and level. */
export declare function computeQualityScore(): QualityScore;
//# sourceMappingURL=context-metrics.d.ts.map