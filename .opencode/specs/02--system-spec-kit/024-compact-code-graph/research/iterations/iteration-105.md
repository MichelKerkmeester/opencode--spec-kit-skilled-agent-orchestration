# Research Iteration 105: Metrics and Observability for Context Preservation Quality

## Focus
Investigate how to track context preservation quality across runtimes without hooks, using MCP-side session metrics, quality scoring, and drift detection.

## Findings

### Current State

Claude-only observability exists, but it is mostly hook-file state, not a shared cross-runtime metrics model.

Claude hooks currently persist:
- Estimated prompt/completion tokens and transcript offset in hook state (`hooks/claude/hook-state.ts`, `hooks/claude/session-stop.ts`).
- Compact/recovery artifacts via `pendingCompactPrime`, stop-save hints via `pendingStopSave`, and source routing for `startup|resume|compact|clear` (`hooks/claude/session-prime.ts`, `hooks/claude/compact-inject.ts`).
- `createdAt`/`updatedAt`, which support a derived session-duration proxy, plus `lastSpecFolder` and a short `sessionSummary` (`hooks/claude/hook-state.ts`, `hooks/claude/session-stop.ts`).

Generic MCP-side observability already exists, but it is fragmented:
- Persistent continuity state: `spec_folder`, `current_task`, `last_action`, `context_summary`, `pending_work`, status, timestamps (`lib/session/session-manager.ts`).
- Retrieval state: active goal, seen result IDs, open questions, preferred anchors, dedup counts, goal-boost counts (`lib/search/session-state.ts`).
- Working-memory state: attention scores, focus counts, event counters, `source_tool`, `source_call_id`, inferred mode, session stats (`lib/cognitive/working-memory.ts`).
- System-wide stats/health and eval dashboards exist, but they are about memory DB/eval quality, not context-preservation quality (`handlers/memory-crud-stats.ts`, `handlers/memory-crud-health.ts`, `lib/eval/reporting-dashboard.ts`, `lib/eval/eval-db.ts`).

Gap: there is no unified, runtime-agnostic session observability layer, no context quality score, and no explicit drift detector. Non-hook CLIs therefore have continuity mechanisms but weak measurement.

### Problem

There is no reliable way to measure context preservation quality across runtimes. Claude gets extra hook-derived signals, but Copilot/Codex/Gemini-style runtimes only expose what MCP can infer indirectly. That means non-hook CLIs may silently degrade context without any comparable dashboard, score, or alerting path.

## Proposals

### Proposal A: MCP-Side Session Metrics Collector

- Description: Add a generic collector in `session-manager` (or sibling module) that records per-session lifecycle and tool-level metrics independent of runtime hooks: tool call count, unique tools used, handler latency, response size, session duration, recovery/checkpoint frequency, spec-folder transitions, dedup counts, working-memory churn, and resume/compact-related events when available. Store raw events lightly and roll up session summaries.
- LOC estimate: 250-450
- Files to change:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts` or central handler wrapper
  - New module like `lib/session/context-metrics.ts`
- Dependencies:
  - Session IDs being consistently threaded through handlers
  - Existing session-state and working-memory modules
  - SQLite schema addition for metrics/events
- Risk: MEDIUM — cross-cutting instrumentation, but mostly additive and runtime-agnostic.

### Proposal B: Context Quality Scoring

- Description: Define a per-session and per-runtime score from observable signals:
  - continuity: recovered session preserved `specFolder/currentTask/contextSummary`
  - stability: low spec-folder churn, few null regressions after state was known
  - efficiency: low repeated resume/onboarding calls, low repeated-query rate
  - memory effectiveness: dedup working, seen-result reuse, working-memory focus stability
  - freshness: code-graph freshness, recent checkpoints, recovery success ratio
  Score bands could be `healthy / degraded / critical`.
- LOC estimate: 180-320
- Files to change:
  - New `lib/session/context-quality.ts`
  - `lib/session/session-manager.ts`
  - `handlers/eval-reporting.ts`
  - `lib/eval/reporting-dashboard.ts`
- Dependencies:
  - Proposal A event/session summaries
  - Existing session continuity fields and working-memory stats
- Risk: LOW-MEDIUM — scoring is additive, but weights must be calibrated to avoid misleading "single number" behavior.

### Proposal C: Drift Detection Engine

- Description: Add rule-based drift detection first, not ML. Detect:
  - repeated onboarding/resume calls within one session
  - repeated or duplicate open questions
  - loss of previously-known `specFolder`
  - sudden shift from scoped retrieval to broad generic retrieval
  - working-memory churn spikes or collapse in focused entries
  - anomalous tool-pattern shifts after compaction/recovery
  Emit drift events with reason codes and confidence.
- LOC estimate: 220-380
- Files to change:
  - New `lib/session/context-drift.ts`
  - `lib/search/session-state.ts`
  - `lib/cognitive/working-memory.ts`
  - `lib/session/session-manager.ts`
  - `handlers/eval-reporting.ts`
- Dependencies:
  - Proposal A collector
  - Proposal B feature set or shared derived metrics
- Risk: MEDIUM — false positives are likely until thresholds are tuned from real sessions.

### Proposal D: Cross-Runtime Dashboard

- Description: Extend `eval_reporting_dashboard` with a context-preservation view by runtime. Show:
  - sessions by runtime
  - average quality score
  - recovery success rate
  - drift incidence
  - repeated-resume rate
  - spec-folder continuity rate
  - working-memory stability
  - response-size and latency distributions
  Reuse existing dashboard patterns, but add context-specific tables/snapshots rather than forcing everything into retrieval-ablation semantics.
- LOC estimate: 220-420
- Files to change:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts`
  - Possibly new `lib/eval/context-reporting.ts`
- Dependencies:
  - Proposal A summaries
  - Preferably Proposal B scores and Proposal C alerts
- Risk: LOW-MEDIUM — dashboard work is straightforward, but schema design matters.

## Recommendation

Best approach: implement **A -> B -> D**, then add **C** after real data exists.

Proposal A is the foundation because it gives parity across runtimes without hooks. Proposal B converts raw signals into an actionable quality model. Proposal D makes the result visible. Proposal C should come after a few weeks of data so drift rules are based on observed session behavior, not guesses.

Privacy/overhead guidance:
- Store counts, timings, sizes, hashes, and state transitions; avoid storing prompt text/transcripts.
- Keep per-event writes batched or sampled.
- TTL raw session-event logs; retain only rolled-up summaries long-term.

## Cross-Runtime Impact

| Runtime | Current Observability | After Implementation | Parity Change |
|---------|---------------------|---------------------|---------------|
| Claude Code | Medium-High: hook token estimates, compact cache, summary, spec-folder hints | High: same hook signals plus generic MCP quality/drift/session metrics | Small uplift, better normalization |
| Copilot CLI | Low: only indirect MCP continuity state | High: full MCP-side session metrics, quality score, drift alerts | Major improvement |
| Codex CLI | Low: only indirect MCP continuity state | High: full MCP-side session metrics, quality score, drift alerts | Major improvement |
| Gemini CLI | Low: only indirect MCP continuity state | High: full MCP-side session metrics, quality score, drift alerts | Major improvement |
| Generic MCP client | Low | Medium-High depending on session ID availability | Strong improvement |

## Next Steps

1. Add a runtime-agnostic `context_session_metrics` / `context_session_events` schema and collector.
2. Instrument session save/recover, retrieval state, working-memory updates, and response envelopes.
3. Define an initial rule-based quality score with transparent component metrics.
4. Extend eval reporting with a context-preservation dashboard by runtime.
5. After collecting baseline data, tune drift rules and add alerts for degraded sessions.

## Metadata
- Model: GPT-5.4 via Copilot CLI
- Effort: high
