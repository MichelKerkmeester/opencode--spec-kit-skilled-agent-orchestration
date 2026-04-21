---
title: "Iteration 027 — Latency budget per pipeline stage"
iteration: 27
band: C
timestamp: 2026-04-11T16:20:00Z
worker: codex-gpt-5
scope: q5_q6_latency_budget
status: complete
focus: "Set concrete stage budgets for Option C write/read/resume paths, identify dominant bottlenecks, and define dashboard regression alerts."
maps_to_questions: [Q5, Q6]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-027.md"]

---

# Iteration 027 — Q5/Q6 Latency Budget

## Goal

Turn the Option C architecture into an explicit latency budget. The target is not just "fast overall"; it is a per-stage budget that tells phase 018 implementation where the time can go and where regressions must alert.

## Grounding

This budget is anchored to iteration 001's target architecture, iteration 013's resume timings, iteration 017/019's dashboard thresholds, and the packet findings `save-journey.md`, `resume-journey.md`, and `testing-strategy.md`.

Conventions:

- `Budget` means the intended p95 allocation for the stage.
- `Expected` is the normal warmed-path number.
- `P99` is tolerated tail latency, not the target.
- Parallel branches are budgeted by the slowest branch, not the sum.

## Top-line budgets

| Path | Expected | p95 budget | p99 expectation | Notes |
|---|---:|---:|---:|---|
| Write (`/memory:save`) | 1100-1250ms | 1940ms | 2600-2900ms | Safe under the `<2s` target with modest headroom |
| Read (`memory_context` / `memory_search`) | 160-190ms | 285ms | 380-430ms | Meets the `<300ms` search target only if gather stays parallel |
| Resume (`/spec_kit:resume`) | 250-300ms | 445ms | 550-720ms | Meets `<500ms` on the fast path; misses push the tail up |
| Trigger-only fast path | 3-8ms | 10ms | 12-15ms | Separate SLO from full search |

## Write path budget

Target: `save_latency_p95 < 2s`

| Stage | Budget | Expected | P99 | Critical path | Parallelizable | Dominance / telemetry hook |
|---|---:|---:|---:|---|---|---|
| Command entry + session context collection | 80ms | 50ms | 120ms | Yes | No | Instrument in `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` around JSON assembly |
| Chunk extraction + `contentRouter` classification | 220ms | 120ms | 350ms | Yes | Yes, across chunks | Future `contentRouter` span; this is the first large CPU bucket |
| Routing plan build + confidence arbitration | 80ms | 40ms | 120ms | Yes | Partially | Emit route counts and confidence bands before mutation |
| Spec-folder mutex acquisition | 120ms | 40ms | 200ms | Yes | No | Instrument around `withSpecFolderLock` in `handlers/save/spec-folder-mutex.ts` |
| Read touched docs + locate anchors | 180ms | 90ms | 260ms | Yes | Limited, per touched doc | Future `anchorMergeOperation.read_targets` span |
| Merge, validate, and atomic writeback | 650ms | 420ms | 950ms | Yes | No | Dominant stage; future `anchorMergeOperation.merge_write` histogram |
| `_memory.continuity` refresh + fingerprint verification | 180ms | 110ms | 260ms | Yes | No | Add spans for continuity update and post-save re-read/verify |
| Index sync (`atomicIndexMemory`, FTS/vector/ledger) | 360ms | 220ms | 520ms | Yes | Possibly async later, but not for phase 018 | Instrument in `handlers/memory-save.ts` before/after index mutation + `save/response-builder.ts` completion |
| Response build + routing summary + telemetry flush | 70ms | 30ms | 90ms | Yes | Partially | Final span in `save/response-builder.ts` |

**Write bottleneck analysis**

- The dominant stage is `merge + validate + atomic writeback` at roughly one-third of the p95 budget.
- The second-largest stage is index sync. Together, writeback plus indexing consume ~52% of the p95 envelope.
- Mutex wait is not a steady-state bottleneck, but it is the first place tail latency appears under operator contention.
- If phase 018 wants more headroom later, the best leverage is batching per-doc mutations before writeback, not shaving 10ms off command parsing.

## Read path budget

Target: `search_latency_p95 < 300ms`

Option C keeps iteration 001's read architecture: intent/routing stays intact, the 4-stage pipeline stays intact, and only the indexed substrate changes (`spec_doc`, `continuity`, `archived_memory`).

| Stage | Budget | Expected | P99 | Critical path | Parallelizable | Dominance / telemetry hook |
|---|---:|---:|---:|---|---|---|
| Query normalize + intent/artifact routing | 30ms | 15ms | 45ms | Yes | No | Instrument in `handlers/memory-context.ts` before dispatch |
| Trigger precheck / fast-path probe | 10ms | 3ms | 15ms | No, unless trigger-only | Yes | Instrument in `handlers/memory-triggers.ts` and report as its own SLO |
| Vector candidate generation | 110ms | 55ms | 170ms | Yes, slowest gather branch | Yes | Add stage timer in `lib/search/pipeline/stage1-candidate-gen.ts` |
| Lexical gather (FTS5/BM25) | 45ms | 20ms | 65ms | No, unless it overtakes vector | Yes | Emit `lexical_gather_ms` from stage 1 gather |
| Graph / causal enrichment | 50ms | 25ms | 75ms | No, unless query is graph-heavy | Yes | Emit from stage 1 enrichment / graph walk diagnostics |
| Fusion + rerank | 55ms | 35ms | 80ms | Yes | No | Instrument in `stage2-fusion.ts` and `stage3-rerank.ts` |
| Filter / dedup / constitutional inject / session shaping | 30ms | 18ms | 45ms | Yes | No | Instrument in `stage4-filter.ts` |
| Anchor reassembly / doc materialization | 40ms | 25ms | 60ms | Yes | No | Add span after pipeline result assembly in `handlers/memory-search.ts` |
| Response envelope + telemetry flush | 20ms | 10ms | 30ms | Yes | Partially | Existing `retrieval-telemetry.ts` is the right sink |

**Read bottleneck analysis**

- The vector branch is the dominant gather branch. If it rises above ~110ms at p95, search will miss target even if every other stage is healthy.
- Fusion/rerank is the main serial post-gather cost. It is the right place to look if search feels slower without any single channel being obviously bad.
- Trigger-only queries should bypass most of the full search path. If the trigger fast path starts borrowing time from the full pipeline, that is a regression in routing discipline.

### Trigger-only fast path

This deserves its own budget because iteration 013/019 treat it as a separate experience:

| Stage | Budget | Expected | P99 | Hook |
|---|---:|---:|---:|---|
| Cache lookup + phrase match | 6ms | 2ms | 8ms | `lib/parsing/trigger-matcher.ts` |
| Scope filter + cognitive enrich | 3ms | 1ms | 5ms | `handlers/memory-triggers.ts` |
| Result formatting | 1ms | <1ms | 2ms | `handlers/memory-triggers.ts` |

Total: expected `3-4ms`, p95 `10ms`, p99 `12-15ms`.

## Resume path budget

Target: `resume_latency_p95 < 500ms`

This is the Option C fast path from iteration 013: packet pointer → handover/frontmatter read → continuity synthesis → optional ladder only on miss or explicit deep mode.

| Stage | Budget | Expected | P99 | Critical path | Parallelizable | Dominance / telemetry hook |
|---|---:|---:|---:|---|---|---|
| Command start + arg parse | 40ms | 20ms | 60ms | Yes | No | Add a top-level `resume.command_ms` span |
| Resume wrapper / bootstrap orchestration | 170ms | 140ms | 230ms | Yes | No | Instrument in `handlers/session-bootstrap.ts` and `handlers/session-resume.ts` |
| Packet pointer resolution | 15ms | 10ms | 25ms | Yes | No | Emit `resume.packet_pointer_ms` before ladder starts |
| Read `handover.md` | 35ms | 20ms | 55ms | Yes, as part of parallel doc read | Yes | Future `resume-ladder.ts` span |
| Read `_memory.continuity` from `implementation-summary.md` | 45ms | 25ms | 70ms | Yes, as part of parallel doc read | Yes | Future `resume-ladder.ts` span |
| Synthesize recovery package / choose freshest signal | 35ms | 20ms | 50ms | Yes | No | Emit `resume.synthesis_ms` |
| Conditional ladder to spec docs or archived search | 95ms | 20ms | 220ms | Only on miss / deep mode | Limited | Track as `resume.fallback_ms` and `resume.fast_path_source` |
| Render output + next actions | 45ms | 25ms | 65ms | Yes | No | Instrument before response return |
| Telemetry flush | 10ms | 5ms | 15ms | No | Yes | Existing session metrics sink is enough |

**Resume bottleneck analysis**

- The fixed orchestration tax (`session_bootstrap` / `session_resume`) is the single largest stage. If it stays above ~170ms at p95, resume loses most of its fast-path headroom.
- The happy-path doc reads are not the problem; the conditional ladder is. Tail latency comes from missing `handover.md`, missing `_memory.continuity`, or frequent archived fallback.
- The operational question is therefore not only "how fast is resume?" but also "what percentage of resumes stay on handover/continuity vs falling through?"

## Telemetry plan

Use stage-level histograms plus one roll-up per path:

- Write: add `write_path_ms`, `write.stage.collect_ms`, `write.stage.route_ms`, `write.stage.lock_wait_ms`, `write.stage.read_targets_ms`, `write.stage.merge_write_ms`, `write.stage.continuity_verify_ms`, `write.stage.index_sync_ms`.
- Read: add `read_path_ms`, `read.stage.intent_ms`, `read.stage.trigger_probe_ms`, `read.stage.vector_ms`, `read.stage.lexical_ms`, `read.stage.graph_ms`, `read.stage.fusion_ms`, `read.stage.filter_ms`, `read.stage.materialize_ms`.
- Resume: add `resume_path_ms`, `resume.stage.wrapper_ms`, `resume.stage.pointer_ms`, `resume.stage.handover_ms`, `resume.stage.continuity_ms`, `resume.stage.synthesis_ms`, `resume.stage.fallback_ms`, `resume.fast_path_source`, `resume.fast_path_miss`.

Preferred integration points:

- Reuse `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts` for read/resume histograms.
- Extend `handlers/memory-save.ts` plus `save/response-builder.ts` for write-path timing.
- Add future `resume-ladder.ts` stage spans rather than burying them in a single session-resume timer.
- Report `budget_burn = observed_p95 / stage_budget` per stage.

## Regression detection scheme

The dashboard should alert at two levels, matching iteration 017 and 019's soft-blocker vs hard-blocker split.

### Warning alert

Raise a warning when any of these is true:

- Path p95 exceeds target for 2 consecutive benchmark runs.
- Path p95 regresses by more than 20% versus the rolling 7-run median.
- Any stage consumes more than 120% of budget for 3 consecutive runs.
- Resume fast-path miss rate exceeds 15% over the rolling daily window.

### Critical alert

Raise a critical alert when any of these is true:

- `resume_latency_p95 > 1000ms`, `save_latency_p95 > 5000ms`, `trigger_match_latency_p95 > 50ms`, or `search_latency_p95 > 1000ms`.
- Any path exceeds `2x` its rolling 7-run baseline on 2 consecutive runs.
- Any stage consumes more than 150% of budget while also being the dominant stage.
- Fingerprint mismatches are non-zero while write latency rises.

### Release blocker

Treat phase gates as blocked when a critical alert is open, a warning persists for more than 24 hours, or resume/search misses target without an identified owner for the dominant stage.

## Findings

- **F27.1**: Option C has enough p95 headroom to hit all published goals, but only if resume stays doc-first and read-stage gather remains parallel.
- **F27.2**: Write latency is primarily a canonical-doc mutation problem, not a classifier problem. Optimize merge batching before optimizing routing heuristics.
- **F27.3**: Resume tail latency is mostly a fast-path coverage problem. Missing handovers and stale `_memory.continuity` will show up as latency regressions before they show up as UX complaints.
- **F27.4**: Stage-level budget burn is the right dashboard primitive. End-to-end p95 alone is too coarse to tell whether the regression came from lock wait, vector gather, rerank, or fallback ladder churn.
