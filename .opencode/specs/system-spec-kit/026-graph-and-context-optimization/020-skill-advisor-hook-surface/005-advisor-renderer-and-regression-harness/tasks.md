---
title: "Tasks: Advisor Renderer + 200-Prompt Regression Harness"
description: "Task list for 020/005 — pure renderer + 5 test harnesses + 7 fixtures. Hard gate."
trigger_phrases:
  - "020 005 tasks"
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001 after 004 converges"
    blockers: ["004-advisor-brief-producer-cache-policy"]
    key_files: []

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

- [ ] T001 [P0] Verify 002 + 003 + 004 merged
- [ ] T002 [P0] Read research-extended §X1 §X5 §X6 §X9
- [ ] T003 [P0] Read 019/004 corpus layout at `research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Renderer + Fixtures

- [ ] T004 [P0] Create `mcp_server/lib/skill-advisor/render.ts` with `renderAdvisorBrief()`
- [ ] T005 [P0] Implement sanitization: canonical-fold → single-line → instruction-regex deny
- [ ] T006 [P0] Create `mcp_server/tests/advisor-fixtures/` directory
- [ ] T007 [P0] Author 7 canonical fixtures (live, stale, noPassing, failOpen, skipped, ambiguous, unicodeInstructional)
- [ ] T008 [P0] Write `advisor-renderer.vitest.ts` with 7 snapshot + sanitization scenarios
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
### Normalizer + Metrics + Observability

- [ ] T009 [P0] Create `mcp_server/lib/skill-advisor/normalize-adapter-output.ts`
- [ ] T010 [P0] Create `mcp_server/lib/skill-advisor/metrics.ts` with `speckit_advisor_hook_*` namespace
- [ ] T011 [P0] Define `advisor-hook-health` section schema + `session_health` integration point
- [ ] T012 [P0] Write `advisor-observability.vitest.ts` (metric names, labels, stderr JSONL schema)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
### 200-Prompt Parity Harness

- [ ] T013 [P0] Create `advisor-corpus-parity.vitest.ts`
- [ ] T014 [P0] Load 019/004 corpus JSONL (200 labeled prompts)
- [ ] T015 [P0] For each prompt: invoke direct-CLI + hook path; compare top-1
- [ ] T016 [P0] Report failures per prompt with delta (hook top-1 vs CLI top-1 + confidence delta)
- [ ] T017 [P0] Enforce 100% parity gate
<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:phase-5 -->
### Timing Harness

- [ ] T018 [P0] Create `advisor-timing.vitest.ts` with 4 lanes (cold / warm / cache hit / cache miss)
- [ ] T019 [P0] Run 50 invocations per lane; record p50/p95/p99
- [ ] T020 [P0] Enforce cache hit p95 ≤ 50 ms
- [ ] T021 [P0] Synthetic 30-turn replay (20 unique + 10 repeats); enforce cache hit rate ≥ 60%
<!-- /ANCHOR:phase-5 -->

<!-- ANCHOR:phase-6 -->
### Privacy Audit

- [ ] T022 [P0] Create `advisor-privacy.vitest.ts`
- [ ] T023 [P0] Assert raw prompt absent from: envelope sources, metrics labels, stderr JSONL, session_health, cache keys
- [ ] T024 [P0] Use sensitive fixture prompts (e.g., `"api_key=SECRET_ABC123"`)
<!-- /ANCHOR:phase-6 -->

<!-- ANCHOR:phase-7 -->
## Phase 3: Verification

- [ ] T025 [P0] All 5 advisor-*.vitest.ts suites green
- [ ] T026 [P0] 200/200 corpus parity
- [ ] T027 [P0] Cache hit p95 ≤ 50 ms
- [ ] T028 [P0] Cache hit rate ≥ 60%
- [ ] T029 [P0] `tsc --noEmit` clean
- [ ] T030 [P0] Mark all P0 checklist items `[x]`
- [ ] T031 [P0] Update implementation-summary.md with bench table + gate confirmation
- [ ] T032 [P0] Confirm 006/007/008 can proceed (hard gate lifted)
<!-- /ANCHOR:phase-7 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 tasks `[x]`
- Hard gate lifted: 006, 007, 008 unblocked
- Corpus + timing + privacy gates all passing
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Predecessor: `../004-advisor-brief-producer-cache-policy/`
- Corpus: `../../../research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl`
<!-- /ANCHOR:cross-refs -->
