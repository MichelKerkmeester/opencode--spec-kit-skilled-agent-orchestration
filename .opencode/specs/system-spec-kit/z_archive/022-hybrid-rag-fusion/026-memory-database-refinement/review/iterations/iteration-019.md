# Iteration 019: Eval framework correctness

## Findings

### [P1] Dashboard metric summaries collapse distinct channels into one blended value
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts`

**Issue**
The dashboard groups metric snapshots only by `metric_name`, ignoring the `channel` column that is present on each snapshot row. For ablation output, that means values such as `ablation_recall@20_delta` for `vector`, `bm25`, `fts5`, `graph`, and `trigger` are averaged together into one synthetic metric summary. The reported `latest` value for that metric is then whichever channel happened to write the newest row, not the latest run-level value for a stable series.

**Evidence**
`SnapshotRow` includes `channel` at lines 128-137, and `queryMetricSnapshots()` selects that column from `eval_metric_snapshots` at lines 185-208. But `buildSprintReport()` keys `metricGroups` and `metricLatest` only by `snap.metric_name` at lines 322-347, so all rows sharing a metric name are merged regardless of channel. This directly conflicts with how ablation storage writes one snapshot per metric per channel in `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:728-765`.

**Fix**
Group dashboard metrics by `(metric_name, channel)` instead of `metric_name` alone, or encode the channel into the display key when `channel` is non-null. If the desired report shape is both per-metric and per-channel, keep the current high-level metric rollups separate from a channel-sliced section instead of silently blending them.

### [P1] Ablation runs never enforce the ground-truth alignment guard, so Recall@K can be computed against the wrong ID universe
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts`

**Issue**
The file defines a strict parent-memory alignment check for static ground truth, but `runAblation()` never calls it. If the active DB still contains chunk-backed or stale/missing memory IDs in `GROUND_TRUTH_RELEVANCES`, the ablation loop will still compute recall and significance on mismatched IDs, producing systematically incorrect results instead of failing fast.

**Evidence**
`assertGroundTruthAlignment()` is implemented at lines 295-333 specifically to reject chunk-backed and missing relevance IDs. `runAblation()` starts at line 524 and immediately evaluates queries at lines 541-586 without calling `getDb()` or `assertGroundTruthAlignment()`. The per-query recall computation at lines 556-558 and 583-585 therefore trusts `getGroundTruthForQuery()` output blindly even though the guard exists in the same module.

**Fix**
Call `assertGroundTruthAlignment(getDb(), ...)` once at the start of `runAblation()` before baseline evaluation begins, and surface the failure to the caller instead of silently producing metrics. That keeps Recall@K and downstream sign-test results tied to the same parent-memory universe the search output uses.

### [P2] Missing token-usage data is persisted as a measured zero, contaminating stored metrics
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts`

**Issue**
The ablation runner never records `tokenUsage` for baseline or ablated queries, but `buildAggregatedMetrics()` still manufactures a `token_usage` metric entry with `baseline=0`, `ablated=0`, and `delta=0`. `storeAblationResults()` then persists that synthetic zero as if token usage had actually been measured, so dashboards and later analyses cannot distinguish "no token data collected" from "exactly zero token change."

**Evidence**
`runAblation()` only stores `{ metrics, latencyMs }` into `baselineMetricsPerQuery` and `ablatedMetricsPerQuery` at lines 543-558 and 570-585; it never populates `tokenUsage`. `buildAggregatedMetrics()` filters token usage to positive finite numbers at lines 477-482, but `entry()` returns zeros for empty arrays at lines 463-470, and the returned `AblationMetrics` always includes `token_usage` at line 501. `storeAblationResults()` then unconditionally writes every metric entry in `result.metrics` at lines 748-765.

**Fix**
Treat token usage as optional: omit `token_usage` from `AblationMetrics` when no samples are available, or persist explicit null/metadata markers instead of numeric zeroes. The storage layer should only write token-usage rows when at least one real token sample exists for both baseline and ablated conditions.

### [P2] Sprint ordering and trend comparisons are based on first-seen time, not most recent activity
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts`

**Issue**
The dashboard sorts sprint groups by each group's earliest snapshot timestamp, then treats the last group as the "latest sprint" and computes trends across that order. A long-lived sprint that started earlier but received newer snapshots later will still sort before a newer-starting sprint, so the summary and trend comparisons can report the wrong sprint as current and compare runs in the wrong temporal sequence.

**Evidence**
`generateDashboardReport()` sorts `sprintEntries` by the minimum `created_at` in each group at lines 535-545. `buildSummary()` then assumes `sprints[sprints.length - 1]` is the latest sprint at lines 471-480, and `computeTrends()` compares adjacent sprint reports in that same order at lines 406-456. The code already calculates both `firstSeen` and `lastSeen` in `buildSprintReport()` at lines 386-399, but the ordering logic ignores `lastSeen`.

**Fix**
Order sprint groups by `lastSeen` when the report semantics are "most recent first" or "latest sprint", and use that same ordering for trend comparisons. If first-seen ordering is ever needed, expose it as a separate explicit mode instead of using it as the default chronology.

### [P2] `groundTruthQueryIds` silently drops unknown IDs, which changes the sample size without warning
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts`

**Issue**
When callers pass a subset of `groundTruthQueryIds`, the framework quietly filters to the IDs present in `GROUND_TRUTH_QUERIES` and discards the rest. A typo or partially stale query ID list therefore shrinks the evaluated sample without any warning, which can change mean recall and suppress significance testing while the caller still believes the full requested subset ran.

**Evidence**
`getQueriesToEvaluate()` builds a `Set` from `config.groundTruthQueryIds` and returns only matching queries at lines 362-367. `runAblation()` only warns when the filtered result is completely empty at lines 533-537; it never reports partially missing IDs, and `queryCount`/`evaluatedQueryCount` in the final report at lines 651-660 reflect only the surviving subset.

**Fix**
Validate `groundTruthQueryIds` up front and fail or warn when any requested IDs are missing from `GROUND_TRUTH_QUERIES`. The report metadata should also include both `requestedQueryIds` and `resolvedQueryIds` so callers can see exactly what sample was evaluated.

## Summary
I found five correctness issues in the reviewed eval surfaces: two P1 problems that can directly invalidate reported results, and three P2 issues that skew storage or dashboard interpretation. I did not find an off-by-one or wrong-denominator bug in the core `computeRecall()` helper itself; the bigger risks are the missing ground-truth alignment enforcement, channel-collapsing dashboard aggregation, and synthetic metric/storage behavior around optional data.
