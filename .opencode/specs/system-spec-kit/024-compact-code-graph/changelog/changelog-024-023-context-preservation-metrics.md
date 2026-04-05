# Changelog: 024/023-context-preservation-metrics

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 023-context-preservation-metrics — 2026-03-31

We claimed different runtimes had different levels of context preservation -- Claude Code at 100%, Codex at 55% -- but there was no actual measurement behind those numbers. When a user lost context mid-session, nobody detected it. When the code graph went stale, nobody noticed. This phase adds lightweight, in-memory metrics collection inside the MCP server that tracks session health events (starts, resumes, clears, tool calls, recovery attempts, graph scans) and computes a quality score for every session. The score uses four factors -- recency, recovery, graph freshness, and continuity -- to produce a simple traffic-light rating of "healthy", "degraded", or "critical". Because the scoring lives server-side, it works identically across all five runtimes without any client-side changes. Dashboard integration (Phase C) and drift detection alerts (Phase D) are deferred until enough baseline data has been collected to tune their thresholds.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/023-context-preservation-metrics/`

---

## What Changed

### New Features (3)

#### Session Metrics Collector

**Problem:** There was no way to track what was happening inside a session. How many tools were called, whether memory recovery was attempted, how often the code graph was queried -- all of this was invisible. If a session quietly degraded, nothing recorded it and nobody knew. The MCP server processed requests but kept no record of session lifecycle events, so any attempt at understanding session health was guesswork.

**Fix:** Added a `SessionMetrics` type and a `recordMetricEvent()` function that records timestamped events with metadata for every key lifecycle moment: session start, resume, clear, tool dispatch, recovery calls, and graph scans. Each event carries a timestamp and optional metadata so patterns can be analyzed later. All data is stored in-memory (no database writes), which keeps the system lightweight. Metrics reset when the process restarts, which is acceptable since quality scoring only needs data from the current session.

---

#### Four-Factor Quality Scoring

**Problem:** Session health was a binary guess -- either the session felt fine or it did not. There was no structured way to evaluate whether an AI agent's context was intact, partially degraded, or effectively lost. The numbers in the cross-runtime comparison table (100% for Claude Code, 55% for Codex) were estimates with no measurement methodology behind them.

**Fix:** Added `computeQualityScore()`, a function that evaluates four measurable factors and produces a clear verdict. The four factors are: (1) **Recency** -- how recently a tool was called, where recent activity signals a healthy session; (2) **Recovery** -- whether memory recovery (the process of restoring prior context) was attempted during this session; (3) **Graph freshness** -- the age of the code graph index, which maps relationships between files and functions; and (4) **Continuity** -- whether tool call patterns show suspicious gaps that suggest the session lost its thread. These four factors are combined with a weighted formula to produce one of three ratings: "healthy" (context is well-preserved), "degraded" (some drift detected), or "critical" (context is likely lost). This replaces gut feeling with an actual signal.

---

#### Session Health Integration

**Problem:** The existing `session_health` tool -- which AI agents call to check whether the system is working -- reported basic connection status but had no insight into context quality. It could say "yes, the server is running" but not "your session has been active for an hour with no memory recovery, so your context is probably stale." The tool was answering the wrong question.

**Fix:** The `session_health` tool now uses `computeQualityScore()` directly, so when an AI agent or user checks session health, they see a traffic-light indicator (healthy / degraded / critical) backed by real metrics instead of a static "connected" message. Because the scoring runs entirely server-side inside the MCP server, it works identically across all five supported runtimes (Claude Code, OpenCode, Codex CLI, Copilot CLI, Gemini CLI) without requiring any changes to the client applications.

---

### Architecture (1)

#### Context-Server Instrumentation

**Problem:** The metrics collector was built but had no data flowing into it. Without instrumentation -- the code that actually fires events at the right moments -- the collector would sit empty. The MCP server's main file (`context-server.ts`) handled tool dispatch, session startup, auto-priming (the process that pre-loads context at session start), and health checks, but none of these moments were being recorded.

**Fix:** Added four `recordMetricEvent` call sites in `context-server.ts` at lines 690-699, covering the four critical lifecycle moments: tool dispatch (every time an AI agent calls a tool), session start (when a new session begins), auto-priming (when context is pre-loaded without being asked), and health checks (when session status is queried). These four instrumentation points are the raw data source that feeds into the quality score computation. Adding them required minimal code -- just four function calls -- but they bridge the gap between the metrics infrastructure and actual session activity.

---

### Deferred (3)

#### Dashboard Integration (Phase C)

**Problem:** A "Context Preservation" section for the evaluation reporting dashboard was planned to visualize per-runtime session counts, quality distribution, average time to first recovery call, and common context loss patterns.

**Deferred because:** There is not yet enough baseline data from real sessions to know which metrics are worth visualizing and what normal ranges look like. Building a dashboard before understanding the data would likely result in charts that need to be redesigned.

---

#### Drift Detection Alerts (Phase D)

**Problem:** Rule-based alerts -- such as "session has been active for 45 minutes with no memory recovery, context may be stale" or "code graph is 6 hours old and 12 files have changed, auto-reindex recommended" -- were planned to proactively warn AI agents when context quality drops.

**Deferred because:** The alert thresholds (how long is too long? how stale is too stale?) cannot be calibrated without real usage patterns from Phases A and B. Setting arbitrary thresholds now would likely produce either too many false alarms or not enough real ones.

---

#### SQLite Persistence (F058)

**Problem:** The spec originally called for periodic persistence of metrics to SQLite (a lightweight database stored as a single file) so that session metrics would survive process restarts and could be analyzed across multiple sessions.

**Deferred because:** In-memory storage is sufficient for the primary use case, which is per-session quality scoring. Since each session gets its own score and the score is consumed during that session, losing metrics on restart has no practical impact. Persistence would add complexity (database writes, schema management, cleanup) for a feature that is not yet needed.

---

<details>
<summary><strong>Files Changed (3)</strong></summary>

| File | What Changed |
|------|-------------|
| `mcp_server/lib/session/context-metrics.ts` | New file (185 lines). Defines `SessionMetrics` and `MetricEvent` types, the `recordMetricEvent()` collector function, and `computeQualityScore()` with its 4-factor weighted scoring formula. |
| `mcp_server/handlers/session-health.ts` | Modified. Now uses `computeQualityScore()` for traffic-light status output instead of reporting static health information. |
| `mcp_server/context-server.ts` | Modified. Added 4 `recordMetricEvent` call sites at lines 690-699 covering tool dispatch, session start, auto-priming, and health checks. |

</details>

---

## Deep Review Fixes (2026-04-01)

### Code Fix
- **Graph freshness threshold aligned** -- `computeQualityScore()` changed from 1-hour to 24-hour threshold, matching `session-snapshot.ts`

### Doc Fixes
- Quality score documented as not driving session_health status (legacy heuristics still primary)
- Incomplete metrics documented (aggregate counters only, toolName dropped, in-memory)
- Response envelope documented as not implemented
- Dashboard integration documented as deferred (Phase C)
- Spec Folder metadata path corrected

## Upgrade

No migration required.
