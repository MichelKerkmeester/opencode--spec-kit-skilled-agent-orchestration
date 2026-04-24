---
title: "...optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/tasks]"
description: "Task list for 020/005 — pure renderer + 5 test harnesses + 10 fixtures. Hard gate."
trigger_phrases:
  - "020 005 tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001 after 004 converges"
    blockers: ["004-advisor-brief-producer-cache-policy"]
    key_files: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: Advisor Renderer + 200-Prompt Regression Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> **Hard gate** — children 006, 007, 008 blocked until this converges.

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending | `[x]` complete | P0/P1/P2 severity
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Verify 002 + 003 + 004 merged
- [x] T002 [P0] Read research-extended §X1 §X5 §X6 §X9
- [x] T003 [P0] Read 019/004 corpus layout at `research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Renderer + Fixtures

- [x] T004 [P0] Create `mcp_server/lib/skill-advisor/render.ts` with `renderAdvisorBrief()`
- [x] T005 [P0] Implement sanitization: canonical-fold → single-line → instruction-regex deny
- [x] T006 [P0] Create `mcp_server/tests/advisor-fixtures/` directory
- [x] T007 [P0] Author 10 canonical fixtures (live, stale, noPassing, failOpen, skipped, ambiguous, unicodeInstructional, empty prompt, command-only, prompt-poisoning)
- [x] T008 [P0] Write `advisor-renderer.vitest.ts` with 10 fixture + sanitization scenarios
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
### Normalizer + Metrics + Observability

- [x] T009 [P0] Create `mcp_server/lib/skill-advisor/normalize-adapter-output.ts`
- [x] T010 [P0] Create `mcp_server/lib/skill-advisor/metrics.ts` with `speckit_advisor_hook_*` namespace
- [x] T011 [P0] Define `advisor-hook-health` section schema + `session_health` integration point
- [x] T012 [P0] Write `advisor-observability.vitest.ts` (metric names, labels, stderr JSONL schema)
<!-- /ANCHOR:phase-3 -->

### 200-Prompt Parity Harness

- [x] T013 [P0] Create `advisor-corpus-parity.vitest.ts`
- [x] T014 [P0] Load 019/004 corpus JSONL (200 labeled prompts)
- [x] T015 [P0] For each prompt: invoke direct-CLI + hook path; compare top-1
- [x] T016 [P0] Report failures per prompt with delta (hook top-1 vs CLI top-1 + confidence delta)
- [x] T017 [P0] Enforce 100% parity gate

### Timing Harness

- [x] T018 [P0] Create `advisor-timing.vitest.ts` with 4 lanes (cold / warm / cache hit / cache miss)
- [x] T019 [P0] Run 50 invocations per lane; record p50/p95/p99 across all 4 lanes
- [x] T020 [P0] Enforce cache-hit lane p95 ≤ 50 ms (cache-hit lane ONLY; cold/warm/miss lanes are recorded for diagnostics but NOT hard-gated on a wall-clock budget)
- [x] T021 [P0] Synthetic 30-turn replay with the **corrected trace**: 10 unique prompts + 20 repeats (fixed interleaved pattern yielding 20/30 = 66.7% hits nominal); enforce cache hit rate ≥ 60%. A single SQLite-busy fail-open among the 30 turns still keeps ≥ 19/30 = 63.3%, preserving the gate.

### Privacy Audit

- [x] T022 [P0] Create `advisor-privacy.vitest.ts`
- [x] T023 [P0] Assert raw prompt absent from: envelope sources, metrics labels, stderr JSONL, session_health, cache keys
- [x] T024 [P0] Use sensitive fixture prompts (e.g., `"api_key=SECRET_ABC123"`)

## Phase 3: Verification

- [x] T025 [P0] All 5 advisor-*.vitest.ts suites green
- [x] T026 [P0] 200/200 corpus parity (top-1 match)
- [x] T027 [P0] Cache-hit lane p95 ≤ 50 ms (cache-hit lane only; cold/warm/miss lanes are diagnostic)
- [x] T028 [P0] Cache hit rate ≥ 60% on corrected 30-turn replay (10 unique + 20 repeats → 20/30 = 66.7% nominal)
- [x] T029 [P0] `tsc --noEmit` clean
- [x] T030 [P0] Mark all P0 checklist items `[x]`
- [x] T031 [P0] Update implementation-summary.md with bench table + gate confirmation
- [x] T032 [P0] Confirm 006/007/008 can proceed (hard gate lifted)

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks `[x]`
- Hard gate lifted: 006, 007, 008 unblocked
- Corpus parity: 200/200 top-1 match
- Cache-hit lane p95 ≤ 50 ms (cache-hit lane only; cold/warm/miss lanes are diagnostic, not gated)
- Cache hit rate ≥ 60% on corrected 30-turn replay (10 unique + 20 repeats → 20/30 = 66.7% nominal)
- Privacy audit: raw prompt absent from all serialized surfaces
- Observability: `speckit_advisor_hook_*` metrics + `advisor-hook-health` section verified
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Predecessor: `../004-advisor-brief-producer-cache-policy/`
- Corpus: `../../../research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
<!-- /ANCHOR:cross-refs -->
