// Internal modules
import { getEvalDb, initEvalDb } from './eval-db.js';
// Feature catalog: Reporting dashboard (eval_reporting_dashboard)
// Configurable limit prevents silent data loss at scale (was hardcoded 1000)
const DASHBOARD_ROW_LIMIT = Math.max(1, parseInt(process.env.SPECKIT_DASHBOARD_LIMIT ?? '10000', 10) || 10000);
/* ───────────────────────────────────────────────────────────────
   2. INTERNAL HELPERS — DB QUERIES
──────────────────────────────────────────────────────────────── */
/**
 * Lazy DB accessor. Initializes eval DB if needed.
 * Safe to call repeatedly (initEvalDb is idempotent).
 */
// H18 FIX: Use existing eval DB singleton first to avoid silently switching
// away from a non-default/test eval DB when generating a dashboard.
function getDb() {
    try {
        return getEvalDb();
    }
    catch (_) { /* not yet initialized */ }
    return initEvalDb();
}
/**
 * Extract sprint label from a metadata JSON string.
 * Looks for "sprint" key in the JSON. Returns null if not found.
 */
function extractSprintFromMetadata(metadata) {
    if (!metadata)
        return null;
    try {
        const parsed = JSON.parse(metadata);
        if (parsed.sprint !== undefined && parsed.sprint !== null) {
            return String(parsed.sprint);
        }
        if (parsed.sprintLabel) {
            return String(parsed.sprintLabel);
        }
        return null;
    }
    catch (_error) {
        return null;
    }
}
/**
 * Determine if a metric is "higher is better" (true) or "lower is better" (false).
 * Used for trend direction interpretation.
 */
function isHigherBetter(metricName) {
    // Metrics where lower values indicate better performance.
    // Checked via prefix match on lowercase to handle variants
    // (e.g. inversion_rate, inversion-rate, latency_ms).
    const lowerName = metricName.toLowerCase();
    const lowerIsBetterPrefixes = ['inversion', 'latency'];
    return !lowerIsBetterPrefixes.some((prefix) => lowerName.startsWith(prefix));
}
/**
 * Query all metric snapshots, optionally filtered.
 */
function queryMetricSnapshots(db, config) {
    let sql = `SELECT id, eval_run_id, metric_name, metric_value, channel, query_count, metadata, created_at
             FROM eval_metric_snapshots
             WHERE 1=1`;
    const params = [];
    if (config.metricFilter && config.metricFilter.length > 0) {
        const placeholders = config.metricFilter.map(() => '?').join(', ');
        sql += ` AND metric_name IN (${placeholders})`;
        params.push(...config.metricFilter);
    }
    if (config.channelFilter && config.channelFilter.length > 0) {
        const placeholders = config.channelFilter.map(() => '?').join(', ');
        sql += ` AND (channel IN (${placeholders}) OR channel IS NULL)`;
        params.push(...config.channelFilter);
    }
    sql += ` ORDER BY created_at DESC`;
    const rows = db.prepare(sql).all(...params);
    if (!config.sprintFilter || config.sprintFilter.length === 0) {
        return rows.slice(0, DASHBOARD_ROW_LIMIT);
    }
    const filteredRows = rows.filter((snap) => {
        const sprintFromMeta = extractSprintFromMetadata(snap.metadata);
        const label = sprintFromMeta ?? `run-${snap.eval_run_id}`;
        return config.sprintFilter.some((filter) => label.toLowerCase().includes(filter.toLowerCase()));
    });
    // Apply the row safeguard after sprint filtering so matching older rows are not dropped prematurely.
    return filteredRows.slice(0, DASHBOARD_ROW_LIMIT);
}
/**
 * Query grouped channel results for specific eval_run_ids.
 * Aggregating in SQL keeps channel coverage complete for the included runs
 * without materializing every per-query row in memory.
 */
function queryChannelResults(db, evalRunIds, channelFilter) {
    if (evalRunIds.length === 0)
        return [];
    const runPlaceholders = evalRunIds.map(() => '?').join(', ');
    let sql = `SELECT
               eval_run_id,
               channel,
               SUM(hit_count) AS hit_count,
               AVG(latency_ms) AS latency_ms,
               COUNT(*) AS query_count
             FROM eval_channel_results
             WHERE eval_run_id IN (${runPlaceholders})`;
    const params = [...evalRunIds];
    if (channelFilter && channelFilter.length > 0) {
        const chPlaceholders = channelFilter.map(() => '?').join(', ');
        sql += ` AND channel IN (${chPlaceholders})`;
        params.push(...channelFilter);
    }
    sql += ` GROUP BY eval_run_id, channel`;
    return db.prepare(sql).all(...params);
}
/* ───────────────────────────────────────────────────────────────
   3. AGGREGATION LOGIC
──────────────────────────────────────────────────────────────── */
/**
 * Group snapshots by sprint label. Sprint label is derived from:
 * 1. metadata JSON "sprint" or "sprintLabel" field
 * 2. Fallback: "run-{eval_run_id}"
 */
function groupBySprint(snapshots, sprintFilter) {
    const groups = new Map();
    for (const snap of snapshots) {
        const sprintFromMeta = extractSprintFromMetadata(snap.metadata);
        const label = sprintFromMeta ?? `run-${snap.eval_run_id}`;
        if (sprintFilter && sprintFilter.length > 0) {
            if (!sprintFilter.some(f => label.toLowerCase().includes(f.toLowerCase()))) {
                continue;
            }
        }
        if (!groups.has(label)) {
            groups.set(label, []);
        }
        // Groups.set(label, []) above ensures the group exists before push
        groups.get(label).push(snap);
    }
    return groups;
}
function getSprintTimeBounds(snapshots) {
    const timestamps = snapshots.map((snapshot) => snapshot.created_at).filter(Boolean).sort();
    return {
        firstSeen: timestamps[0] ?? '',
        lastSeen: timestamps[timestamps.length - 1] ?? '',
    };
}
/**
 * Compute summary statistics for a set of values.
 */
function computeMetricSummary(values, latest) {
    if (values.length === 0) {
        return { mean: 0, min: 0, max: 0, latest: 0, count: 0 };
    }
    const sum = values.reduce((a, b) => a + b, 0);
    // Reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
    return {
        mean: Math.round((sum / values.length) * 10000) / 10000,
        min: Math.round(values.reduce((a, b) => Math.min(a, b), Infinity) * 10000) / 10000,
        max: Math.round(values.reduce((a, b) => Math.max(a, b), -Infinity) * 10000) / 10000,
        latest: Math.round(latest * 10000) / 10000,
        count: values.length,
    };
}
/**
 * Build a SprintReport from grouped snapshots and channel results.
 */
function buildSprintReport(sprintLabel, snapshots, channelRows) {
    // Collect distinct eval_run_ids
    const evalRunIds = [...new Set(snapshots.map(s => s.eval_run_id))];
    // Group snapshots by metric name
    const metricGroups = new Map();
    const metricLatest = new Map();
    const channelMetricGroups = new Map();
    const channelMetricLatest = new Map();
    for (const snap of snapshots) {
        if (!metricGroups.has(snap.metric_name)) {
            metricGroups.set(snap.metric_name, []);
        }
        // MetricGroups.set(...) above ensures this metric bucket exists before push
        metricGroups.get(snap.metric_name).push(snap.metric_value);
        const existing = metricLatest.get(snap.metric_name);
        if (!existing || snap.created_at > existing.time) {
            metricLatest.set(snap.metric_name, {
                value: snap.metric_value,
                time: snap.created_at,
            });
        }
        if (snap.channel) {
            if (!channelMetricGroups.has(snap.metric_name)) {
                channelMetricGroups.set(snap.metric_name, new Map());
            }
            if (!channelMetricLatest.has(snap.metric_name)) {
                channelMetricLatest.set(snap.metric_name, new Map());
            }
            const perMetricGroups = channelMetricGroups.get(snap.metric_name);
            const perMetricLatest = channelMetricLatest.get(snap.metric_name);
            if (!perMetricGroups.has(snap.channel)) {
                perMetricGroups.set(snap.channel, []);
            }
            perMetricGroups.get(snap.channel).push(snap.metric_value);
            const existingChannelMetric = perMetricLatest.get(snap.channel);
            if (!existingChannelMetric || snap.created_at > existingChannelMetric.time) {
                perMetricLatest.set(snap.channel, {
                    value: snap.metric_value,
                    time: snap.created_at,
                });
            }
        }
    }
    // Build metric summaries
    const metrics = {};
    for (const [name, values] of metricGroups) {
        const latest = metricLatest.get(name)?.value ?? 0;
        metrics[name] = computeMetricSummary(values, latest);
    }
    const channelMetrics = {};
    for (const [metricName, perChannelGroups] of channelMetricGroups) {
        const perChannelLatest = channelMetricLatest.get(metricName) ?? new Map();
        channelMetrics[metricName] = {};
        for (const [channelName, values] of perChannelGroups) {
            channelMetrics[metricName][channelName] = computeMetricSummary(values, perChannelLatest.get(channelName)?.value ?? 0);
        }
    }
    // Build channel performance
    const channels = {};
    const runChannelRows = channelRows.filter(r => evalRunIds.includes(r.eval_run_id));
    const channelGroups = new Map();
    for (const row of runChannelRows) {
        if (!channelGroups.has(row.channel)) {
            channelGroups.set(row.channel, []);
        }
        // ChannelGroups.set(...) above ensures this channel bucket exists before push
        channelGroups.get(row.channel).push(row);
    }
    for (const [ch, rows] of channelGroups) {
        const totalHits = rows.reduce((sum, r) => sum + (r.hit_count ?? 0), 0);
        const totalQueries = rows.reduce((sum, row) => sum + (row.query_count ?? 0), 0);
        const latencyTotals = rows.reduce((acc, row) => {
            if (row.latency_ms == null)
                return acc;
            return {
                weightedLatency: acc.weightedLatency + (row.latency_ms * row.query_count),
                latencySamples: acc.latencySamples + row.query_count,
            };
        }, { weightedLatency: 0, latencySamples: 0 });
        const avgLatency = latencyTotals.latencySamples > 0
            ? Math.round((latencyTotals.weightedLatency / latencyTotals.latencySamples) * 100) / 100
            : 0;
        channels[ch] = {
            hitCount: totalHits,
            avgLatencyMs: avgLatency,
            queryCount: totalQueries,
        };
    }
    // Timestamps
    const { firstSeen, lastSeen } = getSprintTimeBounds(snapshots);
    return {
        sprint: sprintLabel,
        evalRunCount: evalRunIds.length,
        evalRunIds,
        metrics,
        channelMetrics,
        channels,
        firstSeen,
        lastSeen,
    };
}
/**
 * Compute trend entries by comparing metrics across consecutive sprint reports.
 * Uses the latest value from each sprint for comparison.
 */
function computeTrends(sprints) {
    if (sprints.length < 2)
        return [];
    const trends = [];
    for (let i = 1; i < sprints.length; i++) {
        const prev = sprints[i - 1];
        const curr = sprints[i];
        // Find common metrics
        const allMetrics = new Set([
            ...Object.keys(prev.metrics),
            ...Object.keys(curr.metrics),
        ]);
        for (const metric of allMetrics) {
            const prevSummary = prev.metrics[metric];
            const currSummary = curr.metrics[metric];
            if (!prevSummary || !currSummary)
                continue;
            const previous = prevSummary.latest;
            const current = currSummary.latest;
            const delta = Math.round((current - previous) * 10000) / 10000;
            const percentChange = previous !== 0
                ? Math.round(((current - previous) / Math.abs(previous)) * 10000) / 100
                : current > 0 ? 100 : (current < 0 ? -100 : 0);
            const higherBetter = isHigherBetter(metric);
            let direction;
            if (Math.abs(delta) < 0.0001) {
                direction = 'unchanged';
            }
            else if (higherBetter) {
                direction = delta > 0 ? 'improved' : 'regressed';
            }
            else {
                direction = delta < 0 ? 'improved' : 'regressed';
            }
            trends.push({
                metric,
                previous,
                current,
                delta,
                percentChange,
                direction,
                previousLabel: prev.sprint,
                currentLabel: curr.sprint,
            });
        }
    }
    return trends;
}
/**
 * Generate a human-readable summary paragraph from the report data.
 */
function buildSummary(sprints, trends, totalEvalRuns) {
    const lines = [];
    lines.push(`Dashboard covers ${totalEvalRuns} eval run(s) across ${sprints.length} sprint group(s).`);
    if (sprints.length > 0) {
        const latest = sprints[sprints.length - 1];
        const metricNames = Object.keys(latest.metrics);
        if (metricNames.length > 0) {
            lines.push(`Latest sprint "${latest.sprint}" tracks ${metricNames.length} metric(s) across ${latest.evalRunCount} run(s).`);
        }
        const channelMetricCount = Object.values(latest.channelMetrics)
            .reduce((total, metricsForChannels) => total + Object.keys(metricsForChannels).length, 0);
        if (channelMetricCount > 0) {
            lines.push(`Per-channel metric breakdowns: ${channelMetricCount}.`);
        }
        const channelNames = Object.keys(latest.channels);
        if (channelNames.length > 0) {
            lines.push(`Active channels: ${channelNames.join(', ')}.`);
        }
    }
    if (trends.length > 0) {
        const improved = trends.filter(t => t.direction === 'improved');
        const regressed = trends.filter(t => t.direction === 'regressed');
        const unchanged = trends.filter(t => t.direction === 'unchanged');
        lines.push(`Trends: ${improved.length} improved, ${regressed.length} regressed, ${unchanged.length} unchanged.`);
        if (regressed.length > 0) {
            const worst = regressed.sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange))[0];
            lines.push(`Largest regression: ${worst.metric} worsened by ${Math.abs(worst.percentChange)}% (${worst.previous} -> ${worst.current}).`);
        }
        if (improved.length > 0) {
            const best = improved.sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange))[0];
            lines.push(`Largest improvement: ${best.metric} improved by ${Math.abs(best.percentChange)}% (${best.previous} -> ${best.current}).`);
        }
    }
    return lines.join(' ');
}
/* ───────────────────────────────────────────────────────────────
   4. PUBLIC API
──────────────────────────────────────────────────────────────── */
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
export async function generateDashboardReport(config = {}) {
    const db = getDb();
    // Query snapshots
    const snapshots = queryMetricSnapshots(db, config);
    // Group by sprint
    const sprintGroups = groupBySprint(snapshots, config.sprintFilter);
    const sprintEntries = [...sprintGroups.entries()].map(([label, groupSnapshots]) => ({
        label,
        groupSnapshots,
        ...getSprintTimeBounds(groupSnapshots),
    }));
    const rankedSprintEntries = [...sprintEntries].sort((left, right) => {
        if (left.lastSeen !== right.lastSeen) {
            return right.lastSeen.localeCompare(left.lastSeen);
        }
        return right.firstSeen.localeCompare(left.firstSeen);
    });
    const limitedSprintEntries = (config.limit && config.limit > 0
        ? rankedSprintEntries.slice(0, config.limit)
        : rankedSprintEntries).sort((left, right) => {
        if (left.lastSeen !== right.lastSeen) {
            return left.lastSeen.localeCompare(right.lastSeen);
        }
        return left.firstSeen.localeCompare(right.firstSeen);
    });
    const includedRunIds = [...new Set(limitedSprintEntries.flatMap(({ groupSnapshots }) => groupSnapshots.map((snapshot) => snapshot.eval_run_id)))];
    const totalEvalRuns = includedRunIds.length;
    const totalSnapshots = limitedSprintEntries.reduce((sum, { groupSnapshots }) => sum + groupSnapshots.length, 0);
    // Query channel results only for included runs so row limits cannot starve kept groups.
    const channelRows = queryChannelResults(db, includedRunIds, config.channelFilter);
    const limitedSprints = limitedSprintEntries.map(({ label, groupSnapshots }) => buildSprintReport(label, groupSnapshots, channelRows));
    // Compute trends
    const trends = computeTrends(limitedSprints);
    // Build summary
    const summary = buildSummary(limitedSprints, trends, totalEvalRuns);
    return {
        generatedAt: new Date().toISOString(),
        totalEvalRuns,
        totalSnapshots,
        sprints: limitedSprints,
        trends,
        summary,
    };
}
/**
 * Format a dashboard report as human-readable text.
 *
 * @param report - DashboardReport to format.
 * @returns Multi-line plain text report.
 */
export function formatReportText(report) {
    const lines = [];
    lines.push('='.repeat(60));
    lines.push('  EVAL REPORTING DASHBOARD');
    lines.push('='.repeat(60));
    lines.push(`Generated: ${report.generatedAt}`);
    lines.push(`Total eval runs: ${report.totalEvalRuns}`);
    lines.push(`Total metric snapshots: ${report.totalSnapshots}`);
    lines.push('');
    // Summary
    lines.push('SUMMARY');
    lines.push('-'.repeat(40));
    lines.push(report.summary);
    lines.push('');
    // Per-sprint details
    for (const sprint of report.sprints) {
        lines.push(`SPRINT: ${sprint.sprint}`);
        lines.push('-'.repeat(40));
        lines.push(`  Eval runs: ${sprint.evalRunCount}`);
        lines.push(`  Period: ${sprint.firstSeen} - ${sprint.lastSeen}`);
        // Metrics
        const metricNames = Object.keys(sprint.metrics).sort();
        if (metricNames.length > 0) {
            lines.push('  Metrics:');
            for (const name of metricNames) {
                const m = sprint.metrics[name];
                lines.push(`    ${name.padEnd(35)} latest=${m.latest.toFixed(4)}  mean=${m.mean.toFixed(4)}  range=[${m.min.toFixed(4)}, ${m.max.toFixed(4)}]  n=${m.count}`);
            }
        }
        const channelMetricNames = Object.keys(sprint.channelMetrics).sort();
        if (channelMetricNames.length > 0) {
            lines.push('  Metric Channels:');
            for (const metricName of channelMetricNames) {
                const channelsForMetric = sprint.channelMetrics[metricName];
                const metricChannelNames = Object.keys(channelsForMetric).sort();
                for (const channelName of metricChannelNames) {
                    const summary = channelsForMetric[channelName];
                    lines.push(`    ${`${metricName} [${channelName}]`.padEnd(35)} latest=${summary.latest.toFixed(4)}  mean=${summary.mean.toFixed(4)}  range=[${summary.min.toFixed(4)}, ${summary.max.toFixed(4)}]  n=${summary.count}`);
                }
            }
        }
        // Channels
        const channelNames = Object.keys(sprint.channels).sort();
        if (channelNames.length > 0) {
            lines.push('  Channels:');
            for (const ch of channelNames) {
                const c = sprint.channels[ch];
                lines.push(`    ${ch.padEnd(15)} hits=${c.hitCount}  avgLatency=${c.avgLatencyMs.toFixed(1)}ms  queries=${c.queryCount}`);
            }
        }
        lines.push('');
    }
    // Trends
    if (report.trends.length > 0) {
        lines.push('TRENDS');
        lines.push('-'.repeat(40));
        for (const t of report.trends) {
            const arrow = t.direction === 'improved' ? '+' : t.direction === 'regressed' ? '-' : '=';
            lines.push(`  [${arrow}] ${t.metric.padEnd(30)} ${t.previous.toFixed(4)} -> ${t.current.toFixed(4)}  (${t.percentChange >= 0 ? '+' : ''}${t.percentChange.toFixed(1)}%)  ${t.previousLabel} -> ${t.currentLabel}`);
        }
        lines.push('');
    }
    lines.push('='.repeat(60));
    return lines.join('\n');
}
/**
 * Format a dashboard report as indented JSON string.
 *
 * @param report - DashboardReport to format.
 * @returns Pretty-printed JSON string.
 */
export function formatReportJSON(report) {
    return JSON.stringify(report, null, 2);
}
//# sourceMappingURL=reporting-dashboard.js.map