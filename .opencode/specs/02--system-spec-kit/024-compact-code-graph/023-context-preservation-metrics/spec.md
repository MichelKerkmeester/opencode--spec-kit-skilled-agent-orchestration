# Phase 023: Context Preservation Metrics & Observability

## What This Is

We have no way to measure how well context preservation works across different CLIs. This phase adds metrics collection, quality scoring, and a dashboard so we can see which runtimes are actually delivering good context and which aren't.

## Plain-English Summary

**Problem:** We claim Claude Code has 100% context parity and Codex has 55%. But how do we actually know? There's no measurement. When a user loses context mid-session, we don't detect it. When the code graph goes stale, nobody notices.

**Solution:** Add lightweight metrics collection inside the MCP server that tracks session health, context recovery quality, and tool usage patterns. Then expose a dashboard through the existing `eval_reporting_dashboard` tool.

## What to Build

### Phase A: Session Metrics Collector (build first)

Track events inside `session-manager.ts`:
- Session start/resume/clear timestamps
- Tool calls per session (count + names)
- Memory recovery calls and their success rate
- Code graph scan frequency and freshness at query time
- Spec folder transitions (how often context switches)

Store as lightweight in-memory counters + periodic SQLite persistence.

**Files to change:**
- New `lib/session/context-metrics.ts` — event collector
- `lib/session/session-manager.ts` — instrument existing session events
- `lib/response/envelope.ts` — attach metrics to responses

### Phase B: Quality Scoring (build second)

Compute a simple quality score per session:

| Score | Meaning | Criteria |
|-------|---------|----------|
| **healthy** | Context preserved | Recent recovery, fresh graph, active spec folder |
| **degraded** | Some drift | No recovery in >30min, graph stale, no spec folder |
| **critical** | Context likely lost | Long gap between calls, no recovery attempted, graph empty |

**Files to change:**
- New `lib/session/context-quality.ts` — scoring logic
- `handlers/session-health.ts` — expose score via tool

### Phase C: Dashboard (build third)

Add a "Context Preservation" section to the existing `eval_reporting_dashboard`:
- Per-runtime session counts and quality distribution
- Average time to first recovery call
- Code graph freshness at query time
- Most common context loss patterns

**Files to change:**
- `handlers/eval-reporting.ts` — add context metrics section
- `lib/eval/reporting-dashboard.ts` — query and format metrics

### Phase D: Drift Detection (build after baseline data)

Rule-based alerts when quality drops:
- "Session has been active for 45 minutes with no memory recovery — context may be stale"
- "Code graph is 6 hours old and 12 files have changed — auto-reindex recommended"

Only build after phases A-C have collected enough baseline data to tune thresholds.

**Files to change:**
- New `lib/session/context-drift.ts` — drift rules and alert generation

## Cross-Runtime Impact

| Runtime | Before | After |
|---------|--------|-------|
| Claude Code | Medium-High (hook estimates) | High (generic quality metrics) |
| OpenCode | Low | High (full metrics + quality score) |
| Codex CLI | Low | High |
| Copilot CLI | Low | High |
| Gemini CLI | Low | High |

## Estimated LOC: 650-1170 (phases A-C; D deferred)
## Risk: LOW — purely additive, read-only metrics collection
## Dependencies: Phase 018 (session health tool) recommended first

---

## Implementation Status (Post-Review Iterations 041-050)

| Item | Status | Evidence |
|------|--------|----------|
| Phase A: Session Metrics Collector | DONE | lib/session/context-metrics.ts (186 lines) — SessionMetrics, MetricEvent types, recordMetricEvent() |
| Phase A: Instrument context-server | DONE | context-server.ts:690-699 — 4 recordMetricEvent call sites |
| Phase B: Quality Scoring | DONE | computeQualityScore() with 4 factors: recency, recovery, graphFreshness, continuity |
| Phase B: Expose via session_health | DONE | handlers/session-health.ts uses computeQualityScore |
| Phase C: Dashboard integration | NOT IMPLEMENTED | No context metrics section in eval-reporting dashboard |
| Phase D: Drift Detection | NOT IMPLEMENTED | No rule-based alerts implemented |
| SQLite persistence | NOT IMPLEMENTED | F058 — spec promised periodic SQLite writes but implementation is in-memory only |

### Review Findings (iter 049)
- F064 (P2): computeRecency timing edge case with priming. ACCEPTABLE
- F065 (P2): Weight rationale undocumented. DEFERRED
- F066 (P2): 24-hour graphFreshness threshold may be too generous given auto-trigger. DEFERRED
