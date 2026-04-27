---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: Post-Stress Follow-Up Research deep-research loop"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "10-iteration /spec_kit:deep-research:auto loop with cli-codex (gpt-5.5 high fast) refining 4 v1.0.2 follow-ups + 1 light architectural touch."
trigger_phrases:
  - "post-stress follow-up plan"
  - "v1.0.2 follow-up research plan"
importance_tier: "important"
contextType: "implementation-plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research"
    last_updated_at: "2026-04-27T18:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md"
    next_safe_action: "T101 launch deep-research loop"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Post-Stress Follow-Up Research deep-research loop

<!-- ANCHOR:summary -->
## Summary

A single 10-iteration `/spec_kit:deep-research:auto` loop with cli-codex (gpt-5.5, high reasoning, fast service tier) refines actionable fix proposals for four v1.0.2 stress-test follow-ups (P0 cli-copilot Gate 3 bypass, P1 graph fast-fail testability, P2 file-watcher debounce, opportunity CocoIndex telemetry leverage) plus a light architectural touch on intelligence-system seams. Deliverable: `research/research.md` synthesis. Per-follow-up remediation packets are downstream user-authored work.

**Technical context**: stack is `/spec_kit:deep-research:auto` workflow + cli-codex executor; model gpt-5.5 with `reasoning_effort=high`, `service_tier=fast`; iteration cap 10 (hard); state root is `research/` subdirectory under this packet; source of evidence is `../010-stress-test-rerun-v1-0-2/findings.md` Recommendations §1-5 + per-cell scores; workflow YAML at `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; convergence math is rolling-avg + MAD-noise + question-entropy weighted stop-score (default threshold 0.60).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## Quality Gates

Per `checklist.md`:

- **P0** (hard-blocking): canonical command surface used; executor config records cli-codex/gpt-5.5/high/fast; loop stops with `converged` or `maxIterationsReached`; `research.md` covers all 4 follow-ups; no fabricated paths.
- **P1** (strong quality): light architectural touch surfaces ≥1 named seam; cross-reference table maps to 010 + 003-009; iteration deltas have required fields; topic prompt cites source-of-evidence paths; parent metadata updated; convergence stop-score logged.
- **P2** (recommended): resource-map.md emitted; ≥80% opening questions resolved; per-follow-up `newInfoRatio` balanced; iteration count 6-10; validator passes; HANDOVER §3 items 4-6 status updated.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## Architecture

```
                          /spec_kit:deep-research:auto
                                    │
           ┌────────────────────────┴───────────────────────┐
           │                                                 │
       INIT phase                                  ITERATION loop (×10 max)
   ┌───────────────┐                          ┌────────────────────────────┐
   │ deep-research-│                          │  render prompts/iter-NNN.md │
   │  config.json  │                          │            │                │
   │ (immutable)   │                          │            ▼                │
   │ findings-     │                          │  cli-codex exec             │
   │  registry.json│                          │  (gpt-5.5/high/fast)        │
   │ strategy.md   │                          │            │                │
   │  (initial)    │                          │            ▼                │
   └───────────────┘                          │  iterations/iter-NNN.md     │
                                              │  deltas/iter-NNN.jsonl      │
                                              │  state.jsonl (append)       │
                                              │            │                │
                                              │            ▼                │
                                              │  reducer: rebuild           │
                                              │   strategy.md sections      │
                                              │   findings-registry.json    │
                                              │   dashboard.md              │
                                              │            │                │
                                              │            ▼                │
                                              │  convergence check          │
                                              └────────────┬────────────────┘
                                                           │
                                                  ┌────────┴────────┐
                                                  │                 │
                                          (continue)         (STOP candidate)
                                                                    │
                                                                    ▼
                                                       ┌────────────────────┐
                                                       │ SYNTHESIZE phase   │
                                                       │  research.md       │
                                                       │  resource-map.md   │
                                                       │  HANDOVER updates  │
                                                       └────────────────────┘
```

The 4 follow-ups are threaded through a single state machine; convergence allocates iterations across sub-topics organically based on `newInfoRatio` per focus.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Scaffold (this turn, ~5 min)

- T001: Author `011-post-stress-followup-research/{spec.md, plan.md, tasks.md, checklist.md, description.json, graph-metadata.json, implementation-summary.md}`
- T002: Update parent `011-mcp-runtime-stress-remediation/{spec.md, description.json, graph-metadata.json, resource-map.md}`
- T003: Update parent `HANDOVER-deferred.md` §3 items 4-7 (point to this packet for research follow-up)
- T004: Run `validate.sh --strict` on new packet; expect 0 errors at scaffold time
- T005: Commit scaffold

### Phase 2 — Topic composition + invocation

- T101: Compose unified topic prompt (verbatim from §Testing below)
- T102: Invoke `/spec_kit:deep-research:auto` with the configured CLI flags
- T103: Confirm `deep-research-config.json` lands with `executor.kind="cli-codex"`, `model="gpt-5.5"`, `reasoningEffort="high"`, `serviceTier="fast"`

### Phase 3 — Iteration loop (autonomous, ~25-50 min wall-clock)

- T104-T113: 10 iterations dispatch via cli-codex, each writing `iteration-NNN.md` + `iter-NNN.jsonl` + state.jsonl events. Convergence detection runs after each iteration.

### Phase 4 — Synthesis + closure (autonomous + user review)

- T201: Workflow writes `research.md` at convergence
- T202: Workflow emits `resource-map.md`
- T203: User reviews `research.md`; per-follow-up next-packet authoring is downstream work
- T204: Update HANDOVER §3 items 4-7 status from "Refinement target → research" to "Research converged → packet authoring next"

### Phase 5 — Verification

- T301: Verify `research/research.md` covers all 4 follow-ups + ≥1 architectural seam
- T302: Sample-verify ≥10 cited file paths exist on disk
- T303: Verify parent metadata updates landed
- T304: Final commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The canonical topic prompt fed to the loop at T101:

> **Refine actionable fix proposals for four v1.0.2 stress-test follow-ups, plus a light architectural touch on the broader intelligence-system stack.**
>
> **Source of evidence**: read `.../011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md` Recommendations §1-5; per-cell scores at `010-stress-test-rerun-v1-0-2/runs/*/score.md`; preflight log at `runs/preflight.log`.
>
> **(P0) cli-copilot `/memory:save` Gate 3 bypass.** I1/cli-copilot scored 2/8 (was 1/8 in v1.0.1). It still auto-selects a spec folder from session-bootstrap context (e.g., `004-retroactive-phase-parent-migration`) and writes `last_save_at` + runs `memory_index_scan` without asking the operator. Codex and opencode honor planner-first. Investigate: where in `mcp_server/hooks/copilot/` or the `/memory:save` planner-first contract (`004-memory-save-rewrite/`) does the bypass originate? Recommend the minimal sufficient fix — tighter planner default, explicit Gate 3 prompt at CLI entry, model-side preamble, or copilot-specific intent classifier hook.
>
> **(P1) Code-graph fast-fail not testable.** Packet 005's `fallbackDecision.nextTool` field is shipped but v1.0.2 Q1 didn't exercise the weak-state path because graph was healthy post pre-flight. Investigate options for deterministic graph degradation in a future sweep: env-var toggle (`SPECKIT_GRAPH_FORCE_UNHEALTHY=true`?), mock daemon harness, controlled index-deletion + skip-rescan, or a "graph dry-run" mode in `code_graph_status`. Recommend the lowest-cost approach that exercises all four `fallbackDecision` matrix branches (fresh / stale-selective / empty / unavailable).
>
> **(P2) Code-graph file-watcher debounce.** Pre-flight detected 4-hour staleness. The chokidar watcher at `mcp_server/lib/ops/file-watcher.ts:49` has hardcoded `DEFAULT_DEBOUNCE_MS=2000`. Investigate watcher metrics + missed-event patterns: lower debounce vs add freshness self-check to `code_graph_status` vs both. Quantify trade-off: lower debounce reduces MTTR but risks reindex thrash on large refactors; self-check is reactive but cheaper steady-state. Recommend tuning + plumbing.
>
> **(opportunity) CocoIndex fork telemetry not yet leveraged downstream.** Fork ships 7 new fields (`dedupedAliases`, `uniqueResultCount`, `path_class`, `rankingSignals`, `source_realpath`, `content_hash`, `raw_score`). v1.0.2 confirmed wire-level liveness. Grep across `mcp_server/lib/search/{hybrid-search,intent-classifier,local-reranker,cross-encoder,bm25-index,confidence-scoring}.ts` shows no consumers. Investigate: which downstream sites should adopt which fields? Is `path_class` rerank now duplicated upstream (so consumer-side rerank is redundant — a deletion target rather than an integration)? Identify the highest-ROI next-leverage site and propose the integration shape.
>
> **Light architectural touch — intelligence-system seams**: with the 4-stack (Spec Kit Memory + Code Graph + CocoIndex fork + Skill Advisor) now stable and v1.0.2-validated, name 1-2 architectural seams that v1.0.2 didn't measure but that current evidence (cognitive decay calibration, L1 intent dispatch under vague queries, causal-edge balance) suggests would pay off in a focused refinement packet. Don't fully scope these — just surface the candidates with a one-line "why now" each.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## Dependencies

**Blocking (must be live before T101):**
- `cli-codex` available with gpt-5.5, high reasoning, fast service tier
- MCP daemon at fork v0.2.3+spec-kit-fork.0.2.0 reachable
- `010-stress-test-rerun-v1-0-2/findings.md` exists on disk (it does — committed in 3568eb1a5)
- `003-009` remediation packets exist on disk (they do — committed earlier)

**Read targets (per-iteration):**
- `010-stress-test-rerun-v1-0-2/findings.md` — Recommendations + Cross-Reference table
- `010-stress-test-rerun-v1-0-2/runs/{cell}/{cli}-N/score.md` — per-cell evidence
- `004-memory-save-rewrite/spec.md` — planner-first contract
- `005-code-graph-fast-fail/spec.md` — fallbackDecision matrix
- `mcp_server/hooks/copilot/session-prime.ts` — copilot session bootstrap
- `mcp_server/lib/ops/file-watcher.ts` — chokidar watcher
- `mcp_server/cocoindex_code/` fork (7 new fields)
- `mcp_server/lib/search/{hybrid-search,intent-classifier,local-reranker}.ts` — telemetry consumers
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If the loop produces unsatisfactory output:
1. The scaffolding is non-destructive — no production code is modified.
2. Discard the new packet by `git rm -r 011-post-stress-followup-research/` and reverting the parent-metadata edits.
3. Re-launch with refined topic prompt or different `--max-iterations` / `--convergence` parameters.

If the loop fails mid-iteration:
1. State is durable on disk (`state.jsonl` + `iterations/`).
2. Resume via `/spec_kit:deep-research:auto` re-invocation; the workflow detects existing state and continues from the next iteration.
3. Pause sentinel `.deep-research-pause` halts the loop without losing state.
<!-- /ANCHOR:rollback -->
