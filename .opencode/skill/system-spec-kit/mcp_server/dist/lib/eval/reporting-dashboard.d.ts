/** Configuration for dashboard report generation. */
export interface ReportConfig {
    /** Filter to specific sprint labels (matched against metadata). */
    sprintFilter?: string[];
    /** Filter to specific channels (e.g. 'vector', 'bm25', 'fts', 'graph', 'trigger'). */
    channelFilter?: string[];
    /** Filter to specific metric names. */
    metricFilter?: string[];
    /** Maximum number of sprint groups to include (most recent first). */
    limit?: number;
}
/** Summary statistics for a single metric. */
export interface MetricSummary {
    mean: number;
    min: number;
    max: number;
    latest: number;
    count: number;
}
/** Per-channel performance within a sprint. */
export interface ChannelPerformance {
    hitCount: number;
    avgLatencyMs: number;
    queryCount: number;
}
/** Report for a single sprint / eval-run group. */
export interface SprintReport {
    /** Sprint label (from metadata or eval_run_id). */
    sprint: string;
    /** Number of eval runs in this sprint group. */
    evalRunCount: number;
    /** Eval run IDs included in this sprint group. */
    evalRunIds: number[];
    /** Per-metric summary statistics. */
    metrics: Record<string, MetricSummary>;
    /** Per-metric, per-channel summary statistics derived from channel-tagged snapshots. */
    channelMetrics: Record<string, Record<string, MetricSummary>>;
    /** Per-channel performance data. */
    channels: Record<string, ChannelPerformance>;
    /** Earliest timestamp in this sprint group. */
    firstSeen: string;
    /** Latest timestamp in this sprint group. */
    lastSeen: string;
}
/** A single trend data point comparing consecutive runs. */
export interface TrendEntry {
    /** Metric name. */
    metric: string;
    /** Previous value. */
    previous: number;
    /** Current value. */
    current: number;
    /** Absolute delta (current - previous). */
    delta: number;
    /** Percentage change. */
    percentChange: number;
    /** Direction indicator. */
    direction: 'improved' | 'regressed' | 'unchanged';
    /** Sprint/run label for the current value. */
    currentLabel: string;
    /** Sprint/run label for the previous value. */
    previousLabel: string;
}
/** Complete dashboard report. */
export interface DashboardReport {
    /** ISO timestamp when report was generated. */
    generatedAt: string;
    /** Total eval runs included in this report after filters/limit. */
    totalEvalRuns: number;
    /** Total metric snapshots included in this report after filters/limit. */
    totalSnapshots: number;
    /** Per-sprint reports. */
    sprints: SprintReport[];
    /** Trend entries showing improvement/regression across runs. */
    trends: TrendEntry[];
    /** Human-readable summary paragraph. */
    summary: string;
}
/** Row shape from eval_metric_snapshots. */
interface SnapshotRow {
    id: number;
    eval_run_id: number;
    metric_name: string;
    metric_value: number;
    channel: string | null;
    query_count: number | null;
    metadata: string | null;
    created_at: string;
}
/** Aggregated per-run/per-channel row shape from eval_channel_results. */
interface ChannelResultRow {
    eval_run_id: number;
    channel: string;
    hit_count: number;
    latency_ms: number | null;
    query_count: number;
}
/**
 * Generate the full dashboard report.
 *
 * Queries the eval database for metric snapshots and channel results,
 * groups by sprint, computes summary statistics, trend analysis, and
 * produces a structured report.
 *
 * @param config - Optional filters and limits.
 * @returns DashboardReport with sprint details, trends, and summary.
 */
export declare function generateDashboardReport(config?: ReportConfig): Promise<DashboardReport>;
/**
 * Format a dashboard report as human-readable text.
 *
 * @param report - DashboardReport to format.
 * @returns Multi-line plain text report.
 */
export declare function formatReportText(report: DashboardReport): string;
/**
 * Format a dashboard report as indented JSON string.
 *
 * @param report - DashboardReport to format.
 * @returns Pretty-printed JSON string.
 */
export declare function formatReportJSON(report: DashboardReport): string;
export type { SnapshotRow, ChannelResultRow, };
//# sourceMappingURL=reporting-dashboard.d.ts.map